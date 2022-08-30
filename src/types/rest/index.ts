import { ConditionalOrderType, ConditionalOrderTypeNoUnderscore, OrderSide, OrderType } from "./response/orders";

export * from "./response";

export interface TimeRange {
  start_time?: number;
  end_time?: number;
}

export interface TimeRangeLimit extends TimeRange {
  limit?: number;
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

export interface CreateFiatDepositReq {
  size: number;
  currency: string;
  notes?: string;
}

export interface WithdrawalReq {
  coin: string;
  size: number;
  address: string;
  tag?: string;
  password?: string;
  code?: string;
}

export interface WithdrawalFeeReq {
  coin: string;
  size: number;
  address: string;
  tag?: string | null;
  method?: string | null;
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
  duration: number;
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

