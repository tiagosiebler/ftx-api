import { EventEmitter } from 'events';
import { RestClient } from './rest-client';
import { DefaultLogger } from './logger';
import { WSClientConfigurableOptions, getWsUrl, WebsocketClientOptions, parseRawWsMessage } from './util/requestUtils';

import WebSocket from 'isomorphic-ws';
import WsStore from './util/WsStore';
import { getWsAuthMessage, isWsPong } from './util/wsMessages';
import { signMessage, signWsAuthenticate } from './util/node-support';
import type { WsChannel, WsEvent, WsTopic } from './types/websockets';

const loggerCategory = { category: 'ftx-ws' };

const READY_STATE_INITIAL = 0;
const READY_STATE_CONNECTING = 1;
const READY_STATE_CONNECTED = 2;
const READY_STATE_CLOSING = 3;
const READY_STATE_RECONNECTING = 4;

export enum WsConnectionState {
  READY_STATE_INITIAL,
  READY_STATE_CONNECTING,
  READY_STATE_CONNECTED,
  READY_STATE_CLOSING,
  READY_STATE_RECONNECTING
};

export const wsKeyGeneral = 'ftx';

export declare interface WebsocketClient {
  on(event: 'open' | 'reconnected', listener: ({ wsKey: string, event: any }) => void): this;
  on(event: 'response' | 'error', listener: (response: any) => void): this;
  on(event: 'update', listener: (response: WsEvent | any) => void): this;
  on(event: 'reconnect' | 'close', listener: () => void): this;
};

export class WebsocketClient extends EventEmitter {
  private logger: typeof DefaultLogger;
  private restClient: RestClient;
  private options: WebsocketClientOptions;
  public wsStore: WsStore;

  constructor(options: WSClientConfigurableOptions, logger?: typeof DefaultLogger) {
    super();

    this.logger = logger || DefaultLogger;
    this.wsStore = new WsStore(this.logger);

    this.options = {
      pongTimeout: 7500,
      pingInterval: 10000,
      reconnectTimeout: 500,
      ...options
    };

    if (options.domain != this.options.restOptions?.domain) {
      this.options.restOptions = {
        ...this.options.restOptions,
        domain: options.domain
      };
    }

    this.restClient = new RestClient(undefined, undefined, this.options.restOptions, this.options.requestOptions);
  }

  public isLivenet(): boolean {
    return true;
  }

  /**
   * Add topic/topics to WS subscription list
   */
  public subscribe(wsTopics: WsTopic[] | WsTopic | WsChannel[] | WsChannel) {
    const mixedTopics = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
    const topics = mixedTopics.map(topic => {
      return typeof topic === 'string' ? { channel: topic } : topic;
    });

    topics.forEach(topic => this.wsStore.addTopic(
      this.getWsKeyForTopic(topic),
      topic
    ));

    // attempt to send subscription topic per websocket
    this.wsStore.getKeys().forEach(wsKey => {
      // if connected, send subscription request
      if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
        return this.requestSubscribeTopics(wsKey, topics);
      }

      // start connection process if it hasn't yet begun. Topics are automatically subscribed to on-connect
      if (
        !this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING) &&
        !this.wsStore.isConnectionState(wsKey, READY_STATE_RECONNECTING)
      ) {
        return this.connect(wsKey);
      }
    });
  }

  /**
   * Remove topic/topics from WS subscription list
   */
  public unsubscribe(wsTopics: WsTopic[] | WsTopic | WsChannel[] | WsChannel) {
    const mixedTopics = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
    const topics = mixedTopics.map(topic => {
      return typeof topic === 'string' ? { channel: topic } : topic;
    });

    topics.forEach(topic => this.wsStore.deleteTopic(
      this.getWsKeyForTopic(topic),
      topic
    ));

    this.wsStore.getKeys().forEach(wsKey => {
      // unsubscribe request only necessary if active connection exists
      if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
        this.requestUnsubscribeTopics(wsKey, topics)
      }
    });
  }

  public close(wsKey: string) {
    this.logger.info('Closing connection', { ...loggerCategory, wsKey });
    this.setWsState(wsKey, READY_STATE_CLOSING);
    this.clearPingTimer(wsKey);
    this.clearPongTimer(wsKey);

    this.getWs(wsKey)?.close();
  }

  /**
   * Request connection of all dependent websockets, instead of waiting for automatic connection by library
   */
  public connectAll(): Promise<WebSocket | undefined>[] | undefined {
    return [this.connect(wsKeyGeneral)];
  }

  private async connect(wsKey: string): Promise<WebSocket | undefined> {
    try {
      if (this.wsStore.isWsOpen(wsKey)) {
        this.logger.error('Refused to connect to ws with existing active connection', { ...loggerCategory, wsKey })
        return this.wsStore.getWs(wsKey);
      }

      if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING)) {
        this.logger.error('Refused to connect to ws, connection attempt already active', { ...loggerCategory, wsKey })
        return;
      }

      if (
        !this.wsStore.getConnectionState(wsKey) ||
        this.wsStore.isConnectionState(wsKey, READY_STATE_INITIAL)
      ) {
        this.setWsState(wsKey, READY_STATE_CONNECTING);
      }

      const url = getWsUrl(this.options);
      const ws = this.connectToWsUrl(url, wsKey);

      return this.wsStore.setWs(wsKey, ws);
    } catch (err) {
      this.parseWsError('Connection failed', err, wsKey);
      this.reconnectWithDelay(wsKey, this.options.reconnectTimeout!);
      this.emit('error', { error: err, wsKey, type: 'CONNECTION_FAILED' });
    }
  }

  private async requestTryAuthenticate(wsKey: string) {
    const { key, secret, subAccountName } = this.options;
    if (!key || !secret) {
      this.logger.debug(`Connection "${wsKey}" will remain unauthenticated due to missing key/secret`);
      return;
    }

    const timestamp = new Date().getTime();
    const authMsg = getWsAuthMessage(
      key,
      await signWsAuthenticate(timestamp, secret),
      timestamp,
      subAccountName,
    );
    this.tryWsSend(wsKey, JSON.stringify(authMsg));
  }

  private parseWsError(context: string, error, wsKey: string) {
    const logContext = { ...loggerCategory, wsKey, error };
    if (!error.message) {
      this.logger.error(`${context} due to unexpected error: `, logContext);
      return;
    }

    switch (error.message) {
      case 'Unexpected server response: 401':
        this.logger.error(`${context} due to 401 authorization failure.`, logContext);
        break;

      default:
        this.logger.error(`${context} due to unexpected response error: ${error?.msg || error?.message || error}`, logContext);
        break;
    }
  }

  /**
   * Return params required to make authorized request
   */
  private async getAuthParams(wsKey: string): Promise<string> {
    const { key, secret } = this.options;

    if (key && secret) {
      this.logger.debug('Getting auth\'d request params', { ...loggerCategory, wsKey });

      const timeOffset = await this.restClient.getTimeOffset();

      const params: any = {
        api_key: this.options.key,
        expires: (Date.now() + timeOffset + 5000)
      };

      params.signature = signMessage('GET/realtime' + params.expires, secret);
      return params;

    } else if (!key || !secret) {
      this.logger.warning('Connot authenticate websocket, either api or private keys missing.', { ...loggerCategory, wsKey });
    } else {
      this.logger.debug('Starting public only websocket client.', { ...loggerCategory, wsKey });
    }

    return '';
  }

  private reconnectWithDelay(wsKey: string, connectionDelayMs: number) {
    this.clearPingTimer(wsKey);
    this.clearPongTimer(wsKey);

    if (this.wsStore.getConnectionState(wsKey) !== READY_STATE_CONNECTING) {
      this.setWsState(wsKey, READY_STATE_RECONNECTING);
    }

    setTimeout(() => {
      this.logger.info('Reconnecting to websocket', { ...loggerCategory, wsKey });
      this.connect(wsKey);
    }, connectionDelayMs);
  }

  private ping(wsKey: string) {
    this.clearPongTimer(wsKey);

    this.logger.silly('Sending ping', { ...loggerCategory, wsKey });
    this.tryWsSend(wsKey, JSON.stringify({ op: 'ping' }));

    this.wsStore.get(wsKey, true)!.activePongTimer = setTimeout(() => {
      this.logger.info('Pong timeout - clearing timers & closing socket to reconnect', { ...loggerCategory, wsKey });
      this.clearPingTimer(wsKey);
      this.clearPongTimer(wsKey);
      this.getWs(wsKey)?.close();
    }, this.options.pongTimeout);
  }

  // Send a ping at intervals
  private clearPingTimer(wsKey: string) {
    const wsState = this.wsStore.get(wsKey);
    if (wsState?.activePingTimer) {
      clearInterval(wsState.activePingTimer);
      wsState.activePingTimer = undefined;
    }
  }

  // Expect a pong within a time limit
  private clearPongTimer(wsKey: string) {
    const wsState = this.wsStore.get(wsKey);
    if (wsState?.activePongTimer) {
      clearTimeout(wsState.activePongTimer);
      wsState.activePongTimer = undefined;
    }
  }

  /**
   * Send WS message to subscribe to topics.
   */
  private requestSubscribeTopics(wsKey: string, topics: WsTopic[]) {
    topics.forEach(topic => {
      const wsMessage = JSON.stringify({
        op: 'subscribe',
        ...topic
      });
      this.tryWsSend(wsKey, wsMessage);
    });
  }

  /**
   * Send WS message to unsubscribe from topics.
   */
  private requestUnsubscribeTopics(wsKey: string, topics: WsTopic[]) {
    topics.forEach(topic => {
      const wsMessage = JSON.stringify({
        op: 'unsubscribe',
        ...topic
      });
      this.tryWsSend(wsKey, wsMessage);
    });
  }

  private tryWsSend(wsKey: string, wsMessage: string) {
    try {
      this.logger.silly(`Sending upstream ws message: `, { ...loggerCategory, wsMessage, wsKey });
      if (!wsKey) {
        throw new Error('Cannot send message due to no known websocket for this wsKey');
      }
      this.getWs(wsKey)?.send(wsMessage);
    } catch (e) {
      this.logger.error(`Failed to send WS message`, { ...loggerCategory, wsMessage, wsKey, exception: e });
    }
  }

  private connectToWsUrl(url: string, wsKey: string): WebSocket {
    this.logger.silly(`Opening WS connection to URL: ${url}`, { ...loggerCategory, wsKey })

    const ws = new WebSocket(url);
    ws.onopen = event => this.onWsOpen(event, wsKey);
    ws.onmessage = event => this.onWsMessage(event, wsKey);
    ws.onerror = event => this.onWsError(event, wsKey);
    ws.onclose = event => this.onWsClose(event, wsKey);

    return ws;
  }

  private async onWsOpen(event, wsKey: string) {
    if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING)) {
      this.logger.info('Websocket connected', { ...loggerCategory, wsKey, livenet: this.isLivenet() });
      this.emit('open', { wsKey, event });
    } else if (this.wsStore.isConnectionState(wsKey, READY_STATE_RECONNECTING)) {
      this.logger.info('Websocket reconnected', { ...loggerCategory, wsKey });
      this.emit('reconnected', { wsKey, event });
    }

    this.setWsState(wsKey, READY_STATE_CONNECTED);

    await this.requestTryAuthenticate(wsKey);
    this.requestSubscribeTopics(wsKey, [...this.wsStore.getTopics(wsKey)]);

    this.wsStore.get(wsKey, true)!.activePingTimer = setInterval(
      () => this.ping(wsKey),
      this.options.pingInterval
    );
  }

  private onWsMessage(event: MessageEvent, wsKey: string) {
    try {
      this.clearPongTimer(wsKey);

      const msg = parseRawWsMessage(event);
      if (msg.channel) {
        this.emit('update', msg);
      } else {
        this.logger.debug('Websocket event: ', event.data || event);
        this.onWsMessageResponse(msg, wsKey);
      }
    } catch (e) {
      this.logger.error('Exception parsing ws message: ', { ...loggerCategory, rawEvent: event, wsKey, error: e });
      this.emit('error', { wsKey, error: e, rawEvent: event });
    }
  }

  private onWsError(err, wsKey: string) {
    this.parseWsError('Websocket error', err, wsKey);
    if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
      this.emit('error', err);
    }
  }

  private onWsClose(event, wsKey: string) {
    this.logger.info('Websocket connection closed', { ...loggerCategory, wsKey});

    if (this.wsStore.getConnectionState(wsKey) !== READY_STATE_CLOSING) {
      this.reconnectWithDelay(wsKey, this.options.reconnectTimeout!);
      this.emit('reconnect');
    } else {
      this.setWsState(wsKey, READY_STATE_INITIAL);
      this.emit('close');
    }
  }

  private onWsMessageResponse(response: any, wsKey: string) {
    if (isWsPong(response)) {
      this.logger.silly('Received pong', { ...loggerCategory, wsKey });
      this.clearPongTimer(wsKey);
    } else {
      this.emit('response', response);
    }
  }

  private getWs(wsKey: string) {
    return this.wsStore.getWs(wsKey);
  }

  private setWsState(wsKey: string, state: WsConnectionState) {
    this.wsStore.setConnectionState(wsKey, state);
  }

  private getWsKeyForTopic(topic: any) {
    return wsKeyGeneral;
  }
};
