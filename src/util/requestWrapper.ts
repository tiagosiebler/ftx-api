import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { signMessage, serializeParams, RestClientOptions, GenericAPIResponse, FtxDomain, serializeParamPayload, programId, programKey } from './requestUtils';

type ApiHeaders = 'key' | 'ts' | 'sign' | 'subaccount';

const getHeader = (headerId: ApiHeaders, domain: FtxDomain = 'ftxcom'): string => {
  if (domain === 'ftxcom') {
    switch (headerId) {
      case 'key':
        return 'FTX-KEY';
      case 'ts':
        return 'FTX-TS';
      case 'sign':
        return 'FTX-SIGN';
      case 'subaccount':
        return 'FTX-SUBACCOUNT';
    }
  }

  if (domain === 'ftxus') {
    switch (headerId) {
      case 'key':
        return 'FTXUS-KEY';
      case 'ts':
        return 'FTXUS-TS';
      case 'sign':
        return 'FTXUS-SIGN';
      case 'subaccount':
        return 'FTXUS-SUBACCOUNT';
    }
  }

  console.warn('No matching header name: ', { headerId, domain  });
  return 'null';
}

export default class RequestUtil {
  private timeOffset: number | null;
  private syncTimePromise: null | Promise<any>;
  private options: RestClientOptions;
  private baseUrl: string;
  private globalRequestOptions: AxiosRequestConfig;
  private key: string | undefined;
  private secret: string | undefined;

  constructor(
    key: string | undefined,
    secret: string | undefined,
    baseUrl: string,
    options: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
  ) {
    this.timeOffset = null;
    this.syncTimePromise = null;
    this.options = {
      recv_window: 5000,
      // how often to sync time drift with exchange servers
      sync_interval_ms: 3600000,
      // if true, we'll throw errors if any params are undefined
      strict_param_validation: false,
      ...options,
    };

    this.globalRequestOptions = {
      // in ms == 5 minutes by default
      timeout: 1000 * 60 * 5,
      headers: { },
      // custom request options based on axios specs - see: https://github.com/axios/axios#request-config
      ...requestOptions,
    };

    if (typeof key === 'string') {
      this.globalRequestOptions.headers[getHeader('key', options.domain)] = key;
    }

    if (typeof this.options.subAccountName === 'string') {
      this.globalRequestOptions.headers[getHeader('subaccount', options.domain)] = this.options.subAccountName;
    }

    this.baseUrl = baseUrl;

    if (key && !secret) {
      throw new Error('API Key & Secret are both required for private endpoints')
    }

    if (this.options.disable_time_sync !== true) {
      this.syncTime();
      setInterval(this.syncTime.bind(this), +this.options.sync_interval_ms!);
    }

    this.key = key;
    this.secret = secret;
  }

  get(endpoint: string, params?: any): GenericAPIResponse {
    return this._call('GET', endpoint, params);
  }

  post(endpoint: string, params?: any): GenericAPIResponse {
    return this._call('POST', endpoint, { ...params, [programKey]: programId });
  }

  delete(endpoint: string, params?: any): GenericAPIResponse {
    return this._call('DELETE', endpoint, params);
  }

  /**
   * @private Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
   */
  async _call(method: Method, endpoint: string, params?: string | object): GenericAPIResponse {
    const options = {
      ...this.globalRequestOptions,
      method: method,
      json: true
    };

    options.url = endpoint.startsWith('https') ? endpoint : [this.baseUrl, endpoint].join('/');

    const isGetRequest = method === 'GET';
    const serialisedParams = serializeParamPayload(isGetRequest, params, this.options.strict_param_validation);

    // Add request sign
    if (this.key && this.secret) {
      if (this.timeOffset === null && !this.options.disable_time_sync) {
        await this.syncTime();
      }

      const { timestamp, sign } = this.getRequestSignature(method, endpoint, this.secret, serialisedParams);
      options.headers[getHeader('ts', this.options.domain)] = String(timestamp);
      options.headers[getHeader('sign', this.options.domain)] = sign;
    }

    if (isGetRequest) {
      options.url += serialisedParams;
    } else {
      options.data = params;
    }

    return axios(options).then(response => {
      if (response.status == 200) {
        return response.data;
      }

      throw response;
    }).catch(e => this.parseException(e));
  }

  /**
   * @private generic handler to parse request exceptions
   */
  parseException(e: any): unknown {
    if (this.options.parse_exceptions === false) {
      throw e;
    }

    // Something happened in setting up the request that triggered an Error
    if (!e.response) {
      if (!e.request) {
        throw e.message;
      }

      // request made but no response received
      throw e;
    }

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const response: AxiosResponse = e.response;
    throw {
      code: response.status,
      message: response.statusText,
      body: response.data,
      headers: response.headers,
      requestOptions: this.options
    };
  }

  private getRequestSignature(
    method: Method,
    endpoint: string,
    secret: string | undefined,
    serialisedParams: string= ''
  ): { timestamp: number; sign: string; } {
    const timestamp = Date.now() + (this.timeOffset || 0);
    if (!secret) {
      return {
        timestamp,
        sign: ''
      };
    }

    const signature_payload = `${timestamp}${method}/api/${endpoint}${serialisedParams}`;

    return {
      timestamp,
      sign: signMessage(signature_payload, secret)
    };
  }

  /**
   * @private sign request and set recv window
   */
  signRequest(data: any): any {
    const params = {
      ...data,
      api_key: this.key,
      timestamp: Date.now() + (this.timeOffset || 0)
    };

    // Optional, set to 5000 by default. Increase if timestamp/recv_window errors are seen.
    if (this.options.recv_window && !params.recv_window) {
      params.recv_window = this.options.recv_window;
    }

    if (this.key && this.secret) {
      const serializedParams = serializeParams(params, this.options.strict_param_validation);
      params.sign = signMessage(serializedParams, this.secret);
    }

    return params;
  }

  /**
   * @private trigger time sync and store promise
   */
  syncTime(): GenericAPIResponse {
    if (this.options.disable_time_sync === true) {
      return Promise.resolve(false);
    }

    if (this.syncTimePromise !== null) {
      return this.syncTimePromise;
    }

    this.syncTimePromise = this.getTimeOffset().then(offset => {
      this.timeOffset = offset;
      this.syncTimePromise = null;
    });

    return this.syncTimePromise;
  }

  /**
   * @deprecated move this somewhere else, because endpoints shouldn't be hardcoded here
   */
  async getTimeOffset(): Promise<number> {
    const start = Date.now();
    try {
      const response = await this.get('https://otc.ftx.com/api/time');
      const result = new Date(response.result).getTime();
      const end = Date.now();

      return Math.ceil(result - end + ((end - start) / 2));
    } catch (e) {
      return 0;
    }
  }
};
