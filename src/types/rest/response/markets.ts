import { OrderSide } from ".";

export interface Market {
  /** 
  * @example "BTC-PERP"
  * @description	e.g. "BTC/USD" for spot, "BTC-PERP" for futures 
  */
  name: string;
  /** 
  * @example "BTC"
  * @description spot markets only 
  */
  baseCurrency: string;
  /** 
  * @example "BTC"
  * @description spot markets only */
  quoteCurrency: string;
  quoteVolume24h: number;
  /** @description change in the past hour */
  change1h: number;
  /** @description change in the past 24 hours */
  change24h: number;
  /** @description change since start of day (00:00 UTC) */
  changeBod: number;
  highLeverageFeeExempt: boolean;
  /** @description Minimum maker order size (if >10 orders per hour fall below this size) */
  minProvideSize: number;
  type: "future" | "spot";
  /** @example "BTC" */
  underlying: string;
  enabled: boolean;
  /** @description best ask */
  ask: number;
  /** @description best bid */
  bid: number;
  /** @description last traded price */
  last: number;
  /** @description if the market is in post-only mode (all orders get modified to be post-only,
   * in addition to other settings they may have) */
  postOnly: boolean;
  /** @description current price */
  price: number
  priceIncrement: number;
  sizeIncrement: number;
  /** @desciption if the market has nonstandard restrictions on which jurisdictions can trade it */
  restricted: boolean;
  /** @description USD volume in past 24 hours */
  volumeUsd24h: number;
  /** @description threshold above which an order is considered large (for VIP rate limits) */
  largeOrderThreshold: number;
  /** @description if the market has an ETF as its baseCurrency */
  isEtfMarket: boolean;
}

export type Markets = Array<Market>;

export interface Orderbook {
  asks: [price: number, size: number];
  bids: [price: number, size: number];
}

export interface Trade {
  id: number;
  liquidation: false;
  price: number;
  side: OrderSide;
  size: number;
  time: string;
}

export type Trades = Array<Trade>;

export interface HistoricalPrice {
  close: number;
  high: number;
  low: number;
  open: number;
  startTime: string;
  volume: number;
}

export type HistoricalPrices = Array<HistoricalPrice>;

