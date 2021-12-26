
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
