export type FuturesCoinType = 'perpetual' | 'future' | 'prediction' | 'move';
export type FuturesCoinGroup = 'perpetual' | 'quarterly' | 'prediction';

export interface FuturesPosition {
  future: string;
  size: number;
  side: FuturesCoinType;
  netSize: number;
  longOrderSize: number;
  shortOrderSize: number;
  cost: number;
  entryPrice: null | number;
  unrealizedPnl: number;
  realizedPnl: number;
  initialMarginRequirement: number;
  maintenanceMarginRequirement: number;
  openSize: number;
  collateralUsed: number;
  estimatedLiquidationPrice: null | number;
  recentAverageOpenPrice: null | number;
  recentPnl: null | number;
  recentBreakEvenPrice: null | number;
  cumulativeBuySize: null | number;
  cumulativeSellSize: null | number;
}

export interface ActiveFuturesPosition extends FuturesPosition {
  estimatedLiquidationPrice: number;
  recentAverageOpenPrice: number;
  recentPnl: number;
  recentBreakEvenPrice: number;
  cumulativeBuySize: number;
  cumulativeSellSize: number;
}

export interface FutureCoin {
  /** @description ask on the orderbook */
  ask: number;
  /** @description bid on the orderbook */
  bid: number;
  /** @description price change in the last hour */
  change1h: number;
  /** @description price change in the last 24 hours */
  change24h: number;
  /** @description change since midnight UTC (beginning of day) */
  changeBod: number;
  /** @description: USD volume in the last 24 hours */
  volumeUsd24h: number;
  /** @description quantity traded in the last 24 hours */
  volume: number; 24390.24
  /** @example "Bitcoin March 2019 Futures" */
  description: string;
  enabled: boolean;
  expired: boolean;
  /** @example "2019-03-29T03:00:00+00:00	" */
  expiry: string;
  /** @description average of the Market Prices for the constituent markets in the index */
  index: number;
  imfFactor: number;
  /** @description last price the future traded at */
  last: number;
  /** @description the lowest price the future can trade at */
  lowerBound: number;
  /** @description 	mark price of the future */
  mark: number;
  /** @example "BTC" */
  name: string;
  /** @description open interest(in number of contracts) */
  openInterest: number;
  openInterestUsd: number;
  /** @description 	whether or not this is a perpetual contract */
  perpetual: boolean;
  positionLimitWeight: number;
  postOnly: boolean;
  priceIncrement: number;
  sizeIncrement: number;
  /** @example "BTC" */
  underlying: string;
  /** @description the highest price the future can trade at */
  upperBound: number;
  type: FuturesCoinType
}

export type Futures = Array<FutureCoin>;

export interface FutureStats {
  volume: number;
  nextFundingRate: number;
  nextFundingTime: string;
  expirationPrice: number;
  predictedExpirationPrice: number;
  strikePrice: number;
  openInterest: number;
}

export interface FundingRate {
  /** @example "BTC-PERP" */
  future: string;
  rate: number;
  time: string;
}

export type FundingRates = Array<FundingRate>;

export interface HistoricalIndexItem {
  close: number;
  high: number;
  low: number;
  open: number;
  startTime: string;
  volume: null | number;
}

export type HistoricalIndex = Array<HistoricalIndexItem>;

