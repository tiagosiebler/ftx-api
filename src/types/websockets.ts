import { OrderSide } from "./rest";

export type WsChannel = 'orderbook' | 'orderbookGrouped' | 'markets' | 'trades' | 'ticker' | 'fills' | 'orders' | string;
export interface WsTopic {
  channel: WsChannel;
  grouping?: number;
  market?: string;
};

export type WsEvent = WsEventSubscribed | WsEventTrades | WsFill;
export type WsEventType = 'subscribed' | 'update';

export interface WsEventSubscribed {
  type: 'subscribed';
  channel: WsChannel;
  market?: string;
}

export interface WsTrade {
  id: number;
  price: number;
  size: number;
  side: OrderSide;
  liquidation: boolean;
  time: string;
}

export interface WsEventTrades {
  type: 'update';
  channel: 'trades';
  market: string;
  data: WsTrade[];
}

export interface WsFill {
  type: 'update';
  channel: 'fills';
  data: {
    id: number;
    market: string;
    future: string;
    // spot markets only
    baseCurrency: null | string;
    // spot markets only
    quoteCurrency: null | string;
    type: 'order' | string;
    side: OrderSide;
    price: number;
    size: number;
    orderId: number;
    time: string;
    tradeId: number;
    feeRate: number;
    fee: number;
    feeCurrency: string;
    liquidity: 'taker' | 'maker'
  }
}
