import { AxiosRequestConfig } from 'axios';
import {
  GenericAPIResponse,
  getRestBaseUrl,
  RestClientOptions,
} from './util/requestUtils';
import RequestWrapper from './util/requestWrapper';
import {
  AccountSummary,
  ActiveFuturesPosition,
  ApiKeyInfo,
  Balances,
  CancelAllOrdersReq,
  CancelNftAuctionReq,
  ChangeSubNameReq,
  DepositAddressReq,
  EditNftGallerySettingsReq,
  FillsReq,
  FundingPaymentsReq,
  FundingRates,
  FutureCoin,
  Futures,
  FutureStats,
  HistoricalIndex,
  HistoricalIndexReq,
  HistoricalPrices,
  HistoricalPricesReq,
  Market,
  Markets,
  ModifyClientIdOrderReq,
  ModifyOrderReq,
  ModifyTriggerOrderReq,
  NewLendingOfferReq,
  NewOrderReq,
  NewQuoteReq,
  NewSavedAddressReq,
  NewTriggerOrderReq,
  NftAuctionEditReq,
  NftAuctionReq,
  NftBidReq,
  OpenTriggerOrdersReq,
  Orderbook,
  OrderbookReq,
  OrderHistoryReq,
  QuoteReq,
  RedeemNftReq,
  StakeBalances,
  StakeRequest,
  StakeRewards,
  Stakes,
  Subaccount,
  SubaccountBalance,
  SubaccountTransfer,
  TimeRange,
  TimeRangeLimit,
  Trades,
  TradesReq,
  TransferBetweenSubReq,
  TriggerOrderHistoryReq,
  UnstakeRequests,
  WithdrawalReq,
  AllNftTrades,
  NftAccountInfo,
  NftBalances,
  NftCollections,
  NftDeposits,
  NftFills,
  NftGallery,
  NftGallerySettings,
  NftInfo,
  NftList,
  NftRedemption,
  NftTrades,
  NftWithdrawals,
  Coins,
  BalancesAllAccounts,
  DepositAddress,
  DepositHistory,
  WithdrawalHistory,
  WithdrawalRequest,
  Airdrop,
  SavedAddress,
  OpenOrders,
  OrderHistory,
  OpenTriggerOrders,
  ConditionalOrderTriggers,
  TriggerOrderHistory,
  Order,
  TriggerOrder,
  QuoteStatus,
  BorrowRate,
  LendingRate,
  BorrowedAmount,
  MarketInfo,
  BorrowHistory,
  LendingOffer,
  LendingInfo,
  LendingHistory,
  Fills,
  AcceptedOptionsQuote,
  CancelledQuote,
  CancelledQuoteRequest,
  MyQuoteRequest,
  Options24hVolume,
  OptionsAccountInfo,
  OptionsFill,
  OptionsHistoricalVolumes,
  OptionsOpenInterest,
  OptionsPosition,
  OptionsTrade,
  QuoteForMyQuoteRequest,
  QuoteRequest,
  FundingPayment,
  LeveragedToken,
  LeveragedTokenBalance,
  LeveragedTokenCreationRequest,
  LeveragedTokenCreation,
  LeveragedTokenRedemptionRequest,
  LeveragedTokenRedemption,
  WithdrawalFeeReq,
  WithdrawalFee,
  OtcHistory
} from './types/rest';

export class RestClient {
  protected requestWrapper: RequestWrapper;

  /**
   * @public Creates an instance of the inverse REST API client.
   *
   * @param {string} key - your API key
   * @param {string} secret - your API secret
   * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
   * @param {AxiosRequestConfig} [requestOptions={}] HTTP networking options for axios
   */
  constructor(
    key?: string | undefined,
    secret?: string | undefined,
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {}
  ) {
    this.requestWrapper = new RequestWrapper(
      key,
      secret,
      getRestBaseUrl(restClientOptions),
      restClientOptions,
      requestOptions
    );
    return this;
  }

  /** expose low level api methods */
  api() {
    return {
      get: this.requestWrapper.get,
      post: this.requestWrapper.post,
      delete: this.requestWrapper.delete,
    }
  }

  /**
   * Misc possible undocumented endpoints - these may not always work
   **/



  getRebateHistory(): GenericAPIResponse<unknown> {
    return this.requestWrapper.get('referral_rebate_history');
  }

  getAnnouncements(language: string = 'en'): GenericAPIResponse<unknown> {
    return this.requestWrapper.get(
      'notifications/get_announcements?language=' + language
    );
  }

  requestDust(toCoin: string): GenericAPIResponse<unknown> {
    return this.requestWrapper.post(`dust/quotes`, { toCoin });
  }

  getDustStatus(quoteId: string): GenericAPIResponse<unknown> {
    return this.requestWrapper.get(`dust/quotes/${quoteId}`);
  }

  acceptDust(quoteId: string): GenericAPIResponse<unknown> {
    return this.requestWrapper.post(`dust/quotes/${quoteId}/accept`);
  }

  /**
   *
   * Subaccount Endpoints
   * https://docs.ftx.com/#subaccounts
   *
   **/

  getSubaccounts(): GenericAPIResponse<Subaccount[]> {
    return this.requestWrapper.get('subaccounts');
  }

  createSubaccount(nickname: string): GenericAPIResponse<Subaccount> {
    return this.requestWrapper.post('subaccounts', { nickname });
  }

  changeSubaccountName(params: ChangeSubNameReq): GenericAPIResponse<null> {
    return this.requestWrapper.post('subaccounts/update_name', params);
  }

  deleteSubaccount(nickname: string): GenericAPIResponse<null> {
    return this.requestWrapper.delete('subaccounts', { nickname });
  }

  getSubaccountBalances(nickname: string): GenericAPIResponse<SubaccountBalance[]> {
    return this.requestWrapper.get(`subaccounts/${nickname}/balances`);
  }

  transferBetweenSubaccounts(params: TransferBetweenSubReq): GenericAPIResponse<SubaccountTransfer> {
    return this.requestWrapper.post('subaccounts/transfer', params);
  }

  /**
   *
   * Market Endpoints
   * https://docs.ftx.com/#markets
   *
   **/

  getMarkets(): GenericAPIResponse<Markets> {
    return this.requestWrapper.get('markets');
  }

  getMarket(marketName: string): GenericAPIResponse<Market> {
    return this.requestWrapper.get(`markets/${marketName}`);
  }

  getOrderbook(params: OrderbookReq): GenericAPIResponse<Orderbook> {
    const suffix = params.depth ? `?depth=${params.depth}` : '';
    return this.requestWrapper.get(
      `markets/${params.marketName}/orderbook${suffix}`
    );
  }

  getTrades(params: TradesReq): GenericAPIResponse<Trades> {
    return this.requestWrapper.get(
      `markets/${params.market_name}/trades`,
      params
    );
  }

  getHistoricalPrices(params: HistoricalPricesReq): GenericAPIResponse<HistoricalPrices> {
    return this.requestWrapper.get(
      `markets/${params.market_name}/candles`,
      params
    );
  }

  /**
   *
   * Futures Endpoints
   * https://docs.ftx.com/#futures
   *
   **/

  listAllFutures(): GenericAPIResponse<Futures> {
    return this.requestWrapper.get<Futures>('futures');
  }

  getFuture(futureName: string): GenericAPIResponse<FutureCoin> {
    return this.requestWrapper.get(`futures/${futureName}`);
  }

  getFutureStats(futureName: string): GenericAPIResponse<FutureStats> {
    return this.requestWrapper.get(`futures/${futureName}/stats`);
  }

  getFundingRates(): GenericAPIResponse<FundingRates> {
    return this.requestWrapper.get('funding_rates');
  }

  getIndexWeights(futuresIndexName: string): GenericAPIResponse<Record<string, number>> {
    return this.requestWrapper.get(`indexes/${futuresIndexName}/weights`);
  }

  getExpiredFutures(): GenericAPIResponse<Futures> {
    return this.requestWrapper.get('expired_futures');
  }

  getHistoricalIndex(params: HistoricalIndexReq): GenericAPIResponse<HistoricalIndex> {
    return this.requestWrapper.get(
      `indexes/${params.marketName}/candles`,
      params
    );
  }

  /**
   *
   * Account Endpoints
   * https://docs.ftx.com/#account
   *
   **/

  getAccount(): GenericAPIResponse<AccountSummary> {
    return this.requestWrapper.get('account');
  }

  getPositions(
    showAveragePrice?: boolean
  ): GenericAPIResponse<ActiveFuturesPosition[]> {
    const suffix =
      showAveragePrice !== undefined ? `?showAvgPrice=${showAveragePrice}` : '';
    return this.requestWrapper.get(`positions${suffix}`);
  }

  setAccountLeverage(leverage: number): GenericAPIResponse<unknown> {
    return this.requestWrapper.post('account/leverage', { leverage });
  }

  /**
   *
   * Wallet Endpoints
   * https://docs.ftx.com/#wallet
   *
   **/

  getCoins(): GenericAPIResponse<Coins> {
    return this.requestWrapper.get('wallet/coins');
  }

  getBalances(): GenericAPIResponse<Balances> {
    return this.requestWrapper.get('wallet/balances');
  }

  getBalancesAllAccounts(): GenericAPIResponse<BalancesAllAccounts> {
    return this.requestWrapper.get('wallet/all_balances');
  }

  getDepositAddress(params: DepositAddressReq): GenericAPIResponse<DepositAddress> {
    const suffix = params.method ? `?method=${params.method}` : '';
    return this.requestWrapper.get(
      `wallet/deposit_address/${params.coin}${suffix}`
    );
  }


  getDepositHistory(params?: TimeRangeLimit): GenericAPIResponse<DepositHistory> {
    return this.requestWrapper.get('wallet/deposits', params);
  }

  getWithdrawalFee(params?: WithdrawalFeeReq): GenericAPIResponse<WithdrawalFee> {
    return this.requestWrapper.get('wallet/withdrawal_fee', params);
  }

  getWithdrawalHistory(params?: TimeRangeLimit): GenericAPIResponse<WithdrawalHistory> {
    return this.requestWrapper.get('wallet/withdrawals', params);
  }

  requestWithdrawal(params: WithdrawalReq): GenericAPIResponse<WithdrawalRequest> {
    return this.requestWrapper.post('wallet/withdrawals', params);
  }

  getAirdrops(params?: TimeRangeLimit): GenericAPIResponse<Airdrop[]> {
    return this.requestWrapper.get('wallet/airdrops', params);
  }

  getSavedAddresses(coin?: string): GenericAPIResponse<SavedAddress[]> {
    return this.requestWrapper.get('wallet/saved_addresses', { coin });
  }

  createSavedAddress(params: NewSavedAddressReq): GenericAPIResponse<SavedAddress> {
    return this.requestWrapper.post('wallet/saved_addresses', params);
  }

  deleteSavedAddress(savedAddressId: number): GenericAPIResponse<"Address deleted"> {
    return this.requestWrapper.delete(
      `wallet/saved_addresses/${savedAddressId}`
    );
  }

  /**
   *
   * Order Endpoints
   * https://docs.ftx.com/#orders
   *
   **/

  getOpenOrders(market?: string): GenericAPIResponse<OpenOrders> {
    const suffix = market ? `?market=${market}` : '';
    return this.requestWrapper.get(`orders${suffix}`);
  }

  getOrderHistory(params?: OrderHistoryReq): GenericAPIResponse<OrderHistory> {
    return this.requestWrapper.get(`orders/history`, params);
  }

  getOpenTriggerOrders(params?: OpenTriggerOrdersReq): GenericAPIResponse<OpenTriggerOrders> {
    return this.requestWrapper.get(`conditional_orders`, params);
  }

  getTriggerOrderTriggers(conditionalOrderId: string): GenericAPIResponse<ConditionalOrderTriggers> {
    return this.requestWrapper.get(
      `conditional_orders/${conditionalOrderId}/triggers`
    );
  }

  getTriggerOrderHistory(params?: TriggerOrderHistoryReq): GenericAPIResponse<TriggerOrderHistory> {
    return this.requestWrapper.get(`conditional_orders/history`, params);
  }

  placeOrder(params: NewOrderReq): GenericAPIResponse<Order> {
    return this.requestWrapper.post('orders', params);
  }

  placeTriggerOrder(params: NewTriggerOrderReq): GenericAPIResponse<TriggerOrder> {
    return this.requestWrapper.post('conditional_orders', params);
  }

  modifyOrder(params: ModifyOrderReq): GenericAPIResponse<Order> {
    return this.requestWrapper.post(`orders/${params.orderId}/modify`, {
      size: params.size,
      price: params.price,
      clientId: params.clientId,
    });
  }

  modifyOrderByClientId(
    clientOrderId: string,
    params: ModifyClientIdOrderReq
  ): GenericAPIResponse<Order> {
    return this.requestWrapper.post(
      `orders/by_client_id/${clientOrderId}/modify`,
      params
    );
  }

  modifyTriggerOrder(
    orderId: string,
    params: ModifyTriggerOrderReq
  ): GenericAPIResponse<TriggerOrder> {
    return this.requestWrapper.post(
      `conditional_orders/${orderId}/modify`,
      params
    );
  }

  getOrderStatus(orderId: string): GenericAPIResponse<Order> {
    return this.requestWrapper.get(`orders/${orderId}`);
  }

  getOrderStatusByClientId(clientOrderId: string): GenericAPIResponse<Order> {
    return this.requestWrapper.get(`orders/by_client_id/${clientOrderId}`);
  }

  cancelOrder(orderId: string): GenericAPIResponse<"Order queued for cancellation"> {
    return this.requestWrapper.delete(`orders/${orderId}`);
  }

  cancelOrderByClientId(clientOrderId: string): GenericAPIResponse<"Order queued for cancellation"> {
    return this.requestWrapper.delete(`orders/by_client_id/${clientOrderId}`);
  }

  cancelOpenTriggerOrder(conditionalOrderId: string): GenericAPIResponse<"Order cancelled"> {
    return this.requestWrapper.delete(
      `conditional_orders/${conditionalOrderId}`
    );
  }

  cancelAllOrders(params?: CancelAllOrdersReq): GenericAPIResponse<"Orders queued for cancelation"> {
    return this.requestWrapper.delete('orders', params);
  }

  /**
   *
   * Convert Endpoints
   * https://docs.ftx.com/#convert
   *
   **/

  requestQuote(params: QuoteReq): GenericAPIResponse<{ quoteId: number; }> {
    return this.requestWrapper.post(`otc/quotes`, params);
  }

  getQuoteStatus(quoteId: string, market?: string): GenericAPIResponse<QuoteStatus> {
    const suffix = market ? `?market=${market}` : '';
    return this.requestWrapper.get(`otc/quotes/${quoteId}${suffix}`);
  }

  acceptQuote(quoteId: string): GenericAPIResponse<null> {
    return this.requestWrapper.post(`otc/quotes/${quoteId}/accept`);
  }

  /** @warning @description undocumented FTX API endpoint */
  otcHistory(params?: Partial<TimeRange>): GenericAPIResponse<OtcHistory> {
    return this.requestWrapper.get(`otc/history`, params);
  }

  /**
   *
   * Spot Margin Endpoints
   * https://docs.ftx.com/#spot-margin
   *
   **/

  getBorrowRates(): GenericAPIResponse<BorrowRate[]> {
    return this.requestWrapper.get(`spot_margin/borrow_rates`);
  }

  getLendingRates(): GenericAPIResponse<LendingRate[]> {
    return this.requestWrapper.get(`spot_margin/lending_rates`);
  }

  getDailyBorrowedAmounts(): GenericAPIResponse<BorrowedAmount[]> {
    return this.requestWrapper.get(`spot_margin/borrow_summary`);
  }

  getMarketInfo(market?: string): GenericAPIResponse<MarketInfo> {
    const suffix = market ? `?market=${market}` : '';
    return this.requestWrapper.get(`spot_margin/market_info${suffix}`);
  }

  getBorrowHistory(params?: Partial<TimeRange>): GenericAPIResponse<BorrowHistory> {
    return this.requestWrapper.get(`spot_margin/borrow_history`, params);
  }

  getLendingHistory(): GenericAPIResponse<LendingHistory> {
    return this.requestWrapper.get(`spot_margin/lending_history`);
  }

  getLendingOffers(): GenericAPIResponse<LendingOffer[]> {
    return this.requestWrapper.get(`spot_margin/offers`);
  }

  getLendingInfo(): GenericAPIResponse<LendingInfo> {
    return this.requestWrapper.get(`spot_margin/lending_info`);
  }

  submitLendingOffer(params: NewLendingOfferReq): GenericAPIResponse<null> {
    return this.requestWrapper.post(`spot_margin/offers`, params);
  }

  /**
   *
   * Misc Endpoints (fills, & funding)
   * https://docs.ftx.com/#fills
   *
   **/

  getFills(params: FillsReq): GenericAPIResponse<Fills> {
    return this.requestWrapper.get(`fills`, params);
  }

  getFundingPayments(params?: FundingPaymentsReq): GenericAPIResponse<FundingPayment> {
    return this.requestWrapper.get(`funding_payments`, params);
  }

  /**
   *
   * Leveraged Tokens Endpoints
   * https://docs.ftx.com/#leveraged-tokens
   *
   **/

  listLeveragedTokens(): GenericAPIResponse<LeveragedToken[]> {
    return this.requestWrapper.get(`lt/tokens`);
  }

  getLeveragedTokenInfo(tokenName: string): GenericAPIResponse<LeveragedToken[]> {
    return this.requestWrapper.get(`lt/${tokenName}`);
  }

  getLeveragedTokenBalances(): GenericAPIResponse<LeveragedTokenBalance[]> {
    return this.requestWrapper.get(`lt/balances`);
  }

  listLeveragedTokenCreationRequests(): GenericAPIResponse<LeveragedTokenCreationRequest[]> {
    return this.requestWrapper.get(`lt/creations`);
  }

  requestLeveragedTokenCreation(
    tokenName: string,
    size: number
  ): GenericAPIResponse<LeveragedTokenCreation> {
    return this.requestWrapper.post(`lt/${tokenName}`, { size });
  }

  listLeveragedTokenRedemptionRequests(): GenericAPIResponse<LeveragedTokenRedemptionRequest[]> {
    return this.requestWrapper.get(`lt/redemptions`);
  }

  requestLeveragedTokenRedemption(
    tokenName: string,
    size: number
  ): GenericAPIResponse<LeveragedTokenRedemption> {
    return this.requestWrapper.post(`lt/${tokenName}/redeem`, { size });
  }

  /**
   *
   * Options Endpoints
   * https://docs.ftx.com/#options
   *
   **/

  listQuoteRequests(): GenericAPIResponse<QuoteRequest[]> {
    return this.requestWrapper.get(`options/requests`);
  }

  getMyQuoteRequests(): GenericAPIResponse<MyQuoteRequest[]> {
    return this.requestWrapper.get(`options/my_requests`);
  }

  createQuoteRequest(params: NewQuoteReq): GenericAPIResponse<MyQuoteRequest> {
    return this.requestWrapper.post(`options/requests`, params);
  }

  cancelQuoteRequest(quoteRequestId: string): GenericAPIResponse<CancelledQuoteRequest> {
    return this.requestWrapper.delete(`options/requests/${quoteRequestId}`);
  }

  getQuotesForQuoteRequest(quoteRequestId: string): GenericAPIResponse<QuoteForMyQuoteRequest[]> {
    return this.requestWrapper.get(`options/requests/${quoteRequestId}/quotes`);
  }

  createQuote(quoteRequestId: string, price: number): GenericAPIResponse<QuoteForMyQuoteRequest> {
    return this.requestWrapper.post(`options/requests/${quoteRequestId}`, {
      price,
    });
  }

  getMyQuotes(): GenericAPIResponse<QuoteForMyQuoteRequest[]> {
    return this.requestWrapper.get(`options/my_quotes`);
  }

  cancelQuote(quoteId: string): GenericAPIResponse<CancelledQuote> {
    return this.requestWrapper.delete(`options/quotes/${quoteId}`);
  }

  acceptOptionsQuote(quoteId: string): GenericAPIResponse<AcceptedOptionsQuote> {
    return this.requestWrapper.post(`options/quotes/${quoteId}/accept`);
  }

  getOptionsAccountInfo(): GenericAPIResponse<OptionsAccountInfo> {
    return this.requestWrapper.get(`options/account_info`);
  }

  getOptionsPositions(): GenericAPIResponse<OptionsPosition[]> {
    return this.requestWrapper.get(`options/positions`);
  }

  getPublicOptionsTrades(params?: TimeRangeLimit): GenericAPIResponse<OptionsTrade[]> {
    return this.requestWrapper.get(`options/trades`, params);
  }

  getOptionsFills(params?: TimeRangeLimit): GenericAPIResponse<OptionsFill[]> {
    return this.requestWrapper.get(`options/fills`, params);
  }

  get24hOptionVolume(): GenericAPIResponse<Options24hVolume> {
    return this.requestWrapper.get(`options/24h_options_volume`);
  }

  getOptionsHistoricalVolumes(params?: TimeRangeLimit): GenericAPIResponse<OptionsHistoricalVolumes> {
    return this.requestWrapper.get(`options/historical_volumes/BTC`, params);
  }

  getOptionsOpenInterest(): GenericAPIResponse<{ "openInterest": number; }> {
    return this.requestWrapper.get(`options/open_interest/BTC`);
  }

  getOptionsHistoricalOpenInterest(
    params?: TimeRangeLimit
  ): GenericAPIResponse<OptionsOpenInterest> {
    return this.requestWrapper.get(
      `options/historical_open_interest/BTC`,
      params
    );
  }

  /**
   *
   * SRM Staking Endpoints
   * https://docs.ftx.com/#srm-staking
   *
   **/

  getStakes(): GenericAPIResponse<Stakes> {
    return this.requestWrapper.get(`staking/stakes`);
  }

  getUnstakeRequests(): GenericAPIResponse<UnstakeRequests> {
    return this.requestWrapper.get(`staking/unstake_requests`);
  }

  getStakeBalances(): GenericAPIResponse<StakeBalances> {
    return this.requestWrapper.get(`staking/balances`);
  }

  createUnstakeRequest(coin: string, size: number): GenericAPIResponse<UnstakeRequests> {
    return this.requestWrapper.post(`staking/unstake_requests`, { coin, size });
  }

  cancelUnstakeRequest(unstakeRequestId: string): GenericAPIResponse<[status: "Cancelled"]> {
    return this.requestWrapper.delete(
      `staking/unstake_requests/${unstakeRequestId}`
    );
  }

  getStakingRewards(): GenericAPIResponse<StakeRewards> {
    return this.requestWrapper.get(`staking/staking_rewards`);
  }

  createStakeRequest(coin: string, size: number): GenericAPIResponse<StakeRequest> {
    return this.requestWrapper.post(`staking/stakes`, { coin, size });
  }

  getServerTime(): GenericAPIResponse<string> {
    return this.requestWrapper.get('https://otc.ftx.com/api/time');
  }

  getApiKeyInfo(): GenericAPIResponse<ApiKeyInfo> {
    return this.requestWrapper.get('api_key_status');
  }

  /**
   *
   * NFT Endpoints
   * https://docs.ftx.com/#nfts
   *
   **/
  listNfts(): GenericAPIResponse<NftList> {
    return this.requestWrapper.get('nft');
  }

  getNftInfo(nftId: number): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.get(`nft/${nftId}`);
  }

  getNftTrades(nftId: number, params?: TimeRange): GenericAPIResponse<NftTrades> {
    return this.requestWrapper.get(`nft/${nftId}/trades`, params);
  }

  getAllNftTrades(params?: TimeRangeLimit): GenericAPIResponse<AllNftTrades> {
    return this.requestWrapper.get('nft/all_trades', params);
  }

  getNftAccountInfo(nftId: number): GenericAPIResponse<NftAccountInfo> {
    return this.requestWrapper.get(`/nft/${nftId}/account_info`);
  }

  getNftCollections(): GenericAPIResponse<NftCollections> {
    return this.requestWrapper.get('nft/collections');
  }

  getNftBalances(): GenericAPIResponse<NftBalances> {
    return this.requestWrapper.get('nft/balances');
  }

  makeNftOffer(params: NftBidReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/offer', params);
  }

  buyNft(params: NftBidReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/buy', params);
  }

  createNftAuction(params: NftAuctionReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/auction', params);
  }

  editNftAuction(params: NftAuctionEditReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/edit_auction', params);
  }

  cancelNftAuction(params: CancelNftAuctionReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/cancel_auction', params);
  }

  placeNftBid(params: NftBidReq): GenericAPIResponse<NftInfo> {
    return this.requestWrapper.post('nft/bids', params);
  }

  getNftDeposits(params: Required<TimeRange>): GenericAPIResponse<NftDeposits> {
    return this.requestWrapper.get('nft/deposits', params);
  }

  getNftWithdrawls(params: Required<TimeRange>): GenericAPIResponse<NftWithdrawals> {
    return this.requestWrapper.get('nft/withdrawals', params);
  }

  getNftFills(params: Required<TimeRange>): GenericAPIResponse<NftFills> {
    return this.requestWrapper.get('nft/fills', params);
  }

  redeemNft(params: RedeemNftReq): GenericAPIResponse<NftRedemption> {
    return this.requestWrapper.post('nft/redeem', params);
  }

  getNftGallery(gallery_id: number): GenericAPIResponse<NftGallery> {
    return this.requestWrapper.get(`nft/gallery/${gallery_id}`);
  }

  getNftGallerySettings(): GenericAPIResponse<NftGallerySettings> {
    return this.requestWrapper.get('nft/gallery_settings');
  }

  editNftGallerySettings(
    params: EditNftGallerySettingsReq
  ): GenericAPIResponse<unknown> {
    return this.requestWrapper.post('nft/gallery_settings', params);
  }

  /**
   * @deprecated move this somewhere else, because endpoints shouldn't be hardcoded here
   */
  async getTimeOffset(): Promise<number> {
    const start = Date.now();
    try {
      const response = await this.getServerTime();
      const result = new Date(response.result).getTime();
      const end = Date.now();

      return Math.ceil(result - end + (end - start) / 2);
    } catch (e) {
      return 0;
    }
  }
}
