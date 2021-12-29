
export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type ConditionalOrderType = 'stop' | 'trailing_stop' | 'take_profit';
export type ConditionalOrderTypeNoUnderscore = 'stop' | 'trailingStop' | 'takeProfit';

export interface TimeRange {
  start_time?: number;
  end_time?: number;
}

export interface TimeRangeLimit extends TimeRange {
  limit?: number;
}

export interface APIResponse<T> {
  success: boolean;
  result: T;
}

export interface ChangeSubNameReq {
  nickname: string;
  newNickname: string;
}

export interface TransferBetweenSubReq {
  coin: string;
  size: number;
  source: string;
  destination: string;
}

export interface OrderbookReq {
  marketName: string;
  depth?: number;
}

export interface TradesReq {
  market_name: string;
  limit?: number;
  start_time?: number;
  end_time?: number;
}

export interface HistoricalPricesReq {
  market_name: string;
  resolution: number;
  limit?: number;
  start_time?: number;
  end_time?: number;
}

export interface HistoricalIndexReq {
  marketName: string;
  resolution: number;
  limit?: number;
  start_time?: number;
  end_time?: number;
}

export interface DepositAddressReq {
  coin: string;
  method?: string;
}

export interface WithdrawalReq {
  coin: string;
  size: number;
  address: string;
  tag?: string;
  password?: string;
  code?: string;
}

export interface NewSavedAddressReq {
  coin: string;
  address: string;
  addressName: string;
  isPrimeTrust: boolean;
  tag?: string;
}

export interface OrderHistoryReq {
  market?: string;
  start_time?: number;
  end_time?: number;
  limit?: number;
}

export interface OpenTriggerOrdersReq {
  market?: string;
  type?: ConditionalOrderType;
}

export interface TriggerOrderHistoryReq {
  market?: string;
  start_time?: number;
  end_time?: number;
  side?: OrderSide;
  type?: ConditionalOrderType;
  orderType?: OrderType;
}

export interface NewOrderReq {
  market: string;
  side: OrderSide;
  price: number | null;
  type: OrderType;
  size: number;
  reduceOnly?: boolean;
  ioc?: boolean;
  postOnly?: boolean;
  clientId?: string;
}

export interface NewTriggerOrderReq {
  market: string;
  side: OrderSide;
  size: number;
  type: ConditionalOrderTypeNoUnderscore;
  reduceOnly?: boolean;
  retryUntilFilled?: boolean;

  // stop loss & take profit only
  triggerPrice?: number;
  orderPrice?: number;

  // tailing stop only
  trailValue?: number;
}

export interface ModifyOrderReq {
  orderId: string;
  price?: number;
  size?: number;
  clientId?: string;
}

export interface ModifyClientIdOrderReq {
  price?: number;
  size?: number;
  clientId?: string;
}

export interface ModifyTriggerOrderReq {
  size?: number;
  triggerPrice?: number;
  orderPrice?: number;
  trailValue?: number;
}

export interface CancelAllOrdersReq {
  market?: string;
  conditionalOrdersOnly?: boolean;
  limitOrdersOnly?: boolean;
}

export interface QuoteReq {
  fromCoin: string;
  toCoin: string;
  size: number;
}

export interface NewLendingOfferReq {
  coin: string;
  size: number;
  rate: number;
}

export interface FillsReq {
  market?: string;
  limit?: number;
  start_time?: number;
  end_time?: number;
  order?: 'asc';
  orderId?: number;
}

export interface FundingPaymentsReq {
  start_time?: number;
  end_time?: number;
  future?: string;
}

export interface NewQuoteReq {
  underlying: string;
  type: 'call' | 'put';
  strike: number;
  expiry: number;
  side: OrderSide;
  size: number;
  limitPrice?: number;
  hideLimitPrice: boolean;
  requestExpiry?: number;
  counterpartyId?: number;
}

export interface NftBidReq {
  nftId: number;
  price: number;
}

export interface NftAuctionReq {
  initialPrice: number;
  reservationPrice: number;
  duration: number
}

export interface NftAuctionEditReq {
  reservationPrice: number;
}

export interface CancelNftAuctionReq {
  nftId: number;
  reservationPrice: number;
}

export interface RedeemNftReq {
  nftId: number;
  address: string;
  notes: string;
}

export interface EditNftGallerySettingsReq {
  public: boolean;
}

export type FuturesCoinType = 'perpetual' | 'future' | 'prediction' | 'move';
export type FuturesCoinGroup = 'perpetual' | 'quarterly' | 'prediction';

export interface FuturesCoin {
  "name": string;
  "underlying": string;
  "description": string;
  "type": FuturesCoinType;
  "expiry": null | string;
  "perpetual": boolean;
  "expired": false;
  "enabled": true;
  "postOnly": false;
  "priceIncrement": number;
  "sizeIncrement": number;
  "last": number;
  "bid": number;
  "ask": number;
  "index": number;
  "mark": number;
  "imfFactor": number;
  "lowerBound": number;
  "upperBound": number;
  "underlyingDescription": string;
  "expiryDescription": string;
  "moveStart": null;
  "marginPrice": number;
  "positionLimitWeight": number;
  "group": FuturesCoinGroup;
  "change1h": number;
  "change24h": number;
  "changeBod": number;
  "volumeUsd24h": number;
  "volume": number;
  "openInterest": number;
  "openInterestUsd": number;
}

export interface FuturesPosition {
  "future": string;
  "size": number;
  "side": OrderSide;
  "netSize": number;
  "longOrderSize": number;
  "shortOrderSize": number;
  "cost": number;
  "entryPrice": null | number;
  "unrealizedPnl": number;
  "realizedPnl": number;
  "initialMarginRequirement": number;
  "maintenanceMarginRequirement": number;
  "openSize": number;
  "collateralUsed": number;
  "estimatedLiquidationPrice": null | number;
  "recentAverageOpenPrice": null | number;
  "recentPnl": null | number;
  "recentBreakEvenPrice": null | number;
  "cumulativeBuySize": null | number;
  "cumulativeSellSize": null | number;
}

export interface ActiveFuturesPosition extends FuturesPosition {
  estimatedLiquidationPrice: number;
  recentAverageOpenPrice: number;
  recentPnl: number;
  recentBreakEvenPrice: number;
  cumulativeBuySize: number;
  cumulativeSellSize: number;
}

export interface Balance {
  coin: string;
  total: number;
  free: number;
  availableWithoutBorrow: number;
  usdValue: number;
  spotBorrow: number;
}
