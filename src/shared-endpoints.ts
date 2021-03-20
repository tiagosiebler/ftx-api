import { GenericAPIResponse } from './util/requestUtils';
import RequestWrapper from './util/requestWrapper';

export default abstract class SharedEndpoints {
  protected requestWrapper: RequestWrapper;

  /**
   *
   * Market Data Endpoints
   *
   */

  getOrderBook(params: {
    symbol: string;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/orderBook/L2', params);
  }

  /**
   * Get latest information for symbol
   */
  getTickers(params?: {
    symbol?: string;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/tickers', params);
  }

  getSymbols(): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/symbols');
  }

  /**
   * Get liquidated orders
   */
  getLiquidations(params: {
    symbol: string;
    from?: number;
    limit?: number;
    start_time?: number;
    end_time?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/liq-records', params);
  }

  /**
   *
   * Market Data : Advanced
   *
   */

  getOpenInterest(params: {
    symbol: string;
    period: string;
    limit?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/open-interest', params);
  }

  getLatestBigDeal(params: {
    symbol: string;
    limit?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/big-deal', params);
  }

  getLongShortRatio(params: {
    symbol: string;
    period: string;
    limit?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/public/account-ratio', params);
  }

  /**
   *
   * Account Data Endpoints
   *
   */

  getApiKeyInfo(): GenericAPIResponse {
    return this.requestWrapper.get('v2/private/account/api-key');
  }

  /**
   *
   * Wallet Data Endpoints
   *
   */

  getWalletBalance(params: {
    coin?: string;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/private/wallet/balance', params)
  }

  getWalletFundRecords(params?: {
    start_date?: string;
    end_date?: string;
    currency?: string;
    coin?: string;
    wallet_fund_type?: string;
    page?: number;
    limit?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/private/wallet/fund/records', params);
  }

  getWithdrawRecords(params: {
    start_date?: string;
    end_date?: string;
    coin?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/private/wallet/withdraw/list', params);
  }

  getAssetExchangeRecords(params?: {
    limit?: number;
    from?: number;
    direction?: string;
  }): GenericAPIResponse {
    return this.requestWrapper.get('v2/private/exchange-order/list', params);
  }

  /**
   *
   * API Data Endpoints
   *
   */

}
