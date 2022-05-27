import { AxiosRequestConfig } from 'axios';

export type FtxDomain = 'ftxcom' | 'ftxus';

export interface RestClientOptions {
  // override the max size of the request window (in ms)
  recv_window?: number;

  // how often to sync time drift with exchange servers
  sync_interval_ms?: number | string;

  // Default: false. Disable above sync mechanism if true.
  disable_time_sync?: boolean;

  // Default: false. If true, we'll throw errors if any params are undefined
  strict_param_validation?: boolean;

  // Optionally override API protocol + domain
  // e.g 'https://ftx.us/api'
  baseUrl?: string;

  // Default: true. whether to try and post-process request exceptions.
  parse_exceptions?: boolean;

  // Subaccount nickname URI-encoded
  subAccountName?: string;

  // Default: 'ftxcom'. Choose between ftxcom or ftxus.
  domain?: FtxDomain;
}

export interface WSClientConfigurableOptions {
  // Required for authenticated channels
  key?: string;
  secret?: string;

  // Subaccount nickname URI-encoded
  subAccountName?: string;

  pongTimeout?: number;
  pingInterval?: number;
  reconnectTimeout?: number;
  restOptions?: RestClientOptions;
  requestOptions?: AxiosRequestConfig;
  reconnect?: boolean;

  // Optionally override websocket API protocol + domain
  // E.g: 'wss://ftx.com/ws/'
  wsUrl?: string;

  // Default: 'ftxcom'. Choose between ftxcom or ftxus.
  domain?: FtxDomain;
};

export interface WebsocketClientOptions extends WSClientConfigurableOptions {
  pongTimeout: number;
  pingInterval: number;
  reconnectTimeout: number;
  reconnectOnClose: boolean,
};

export type GenericAPIResponse = Promise<any>;

export function serializeParams(params: object = {}, strict_validation = false): string {
  return Object.keys(params)
    .sort()
    .map(key => {
      const value = params[key];
      if (strict_validation === true && typeof value === 'undefined') {
        throw new Error('Failed to sign API request due to undefined parameter');
      }
      return `${key}=${value}`;
    })
    .join('&');
};

export function serializeParamPayload(isGetRequest: boolean, params?: string | object, strictParamValidation?: boolean): string | undefined {
  if (!params) {
    return '';
  }
  if (!isGetRequest) {
    return JSON.stringify(params);
  }
  if (typeof params === 'string') {
    return '?' + params;
  }
  return '?' + serializeParams(params, strictParamValidation);
};

export type apiNetwork = 'ftxcom' | 'ftxus';
export const programId = 'ftxnodeapi';
export const programId2 = 'ftxnodeapi2';
export const programKey = 'externalReferralProgram';

export function isFtxUS(clientOptions: RestClientOptions | WebsocketClientOptions) {
  return clientOptions.domain === 'ftxus';
}

export function getRestBaseUrl(restClientOptions: RestClientOptions) {
  if (restClientOptions.baseUrl) {
    return restClientOptions.baseUrl;
  }

  if (isFtxUS(restClientOptions)) {
    return 'https://ftx.us/api';
  }

  return 'https://ftx.com/api';
};

export function getWsUrl(options: WebsocketClientOptions): string {
  if (options.wsUrl) {
    return options.wsUrl;
  }

  if (isFtxUS(options)) {
    return 'wss://ftx.us/ws/';
  }

  return 'wss://ftx.com/ws/';
};

export function isPublicEndpoint(endpoint: string): boolean {
  if (endpoint.startsWith('https')) {
    return true;
  }
  if (endpoint.startsWith('v2/public')) {
    return true;
  }
  if (endpoint.startsWith('public/linear')) {
    return true;
  }
  return false;
};

export function parseRawWsMessage(event: MessageEvent) {
  if (typeof event === 'string') {
    const parsedEvent = JSON.parse(event);

    if (parsedEvent.data) {
      if (typeof parsedEvent.data === 'string') {
        return parseRawWsMessage(parsedEvent.data);
      }
      return parsedEvent.data;
    }
  }
  if (event?.data) {
    return JSON.parse(event.data);
  }
  return event;
}
