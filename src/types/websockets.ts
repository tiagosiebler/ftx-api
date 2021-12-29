

export type WsChannel = 'orderbook' | 'orderbookGrouped' | 'markets' | 'trades' | 'ticker' | 'fills' | 'orders' | string;
export interface WsTopic {
  channel: WsChannel;
  grouping?: number;
  market?: string;
};

export type WsEvent = WsEventSubscribed | WsEventTrades;

export interface WsEventSubscribed {
  type: 'subscribed';
  channel: WsChannel;
  market?: string;
}

export interface WsTrade {
  id: number;
  price: number;
  size: number;
  side: 'sell' | 'buy';
  liquidation: boolean;
  time: string;
}

export interface WsEventTrades {
  channel: 'trades';
  market: string;
  type: 'update';
  data: WsTrade[];
}
