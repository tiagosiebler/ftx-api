export type OrderStatus = "new" | "open" | "closed";

export interface Order {
  createdAt: string;
  filledSize: number;
  future: string;
  id: number;
  market: string;
  price: number;
  avgFillPrice: number;
  remainingSize: number;
  status: OrderStatus;
  side: string;
  size: number;
  type: string;
  reduceOnly: boolean;
  ioc: boolean;
  postOnly: boolean;
  clientId?: string | null;
}

export type OpenOrders = Array<Order>
export type OrderHistory = Array<Order>

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';

export type ConditionalOrderType = 'stop' | 'trailing_stop' | 'take_profit';
export type ConditionalOrderTypeNoUnderscore =
  | 'stop'
  | 'trailingStop'
  | 'takeProfit';

export type TriggerOrderStatus = "open" | "cancelled" | "triggered";

export interface TriggerOrder {
  createdAt: string;
  /** @deprecated */
  error: string | null;
  future: string;
  id: number;
  market: string;
  /** @deprecated */
  orderId: number;
  orderPrice: number | null;
  reduceOnly: boolean;
  side: OrderSide;
  size: number;
  /** @description always "open" */
  trailStart: number | null;
  trailValue: number | null;
  triggerPrice: number;
  triggeredAt: string | null;
  type: ConditionalOrderType;
  orderType: OrderType;
  filledSize: number;
  avgFillPrice: number | null;
  retryUntilFilled: boolean;
  status: TriggerOrderStatus;
}

export interface OpenTriggerOrder extends TriggerOrder {
  /** @description always "open" */
  status: "open"
}

export type OpenTriggerOrders = Array<OpenTriggerOrder>;

export interface ConditionalOrderTrigger {
  time: string;
  orderSize: number | null;
  filledSize: number | null;
  orderId: number | null;
  error: string | null;
}

export type ConditionalOrderTriggers = Array<ConditionalOrderTrigger>;

export interface TriggerOrderHistoryItem extends Order {
  /** @deprecated */
  error?: any;
  /** @deprecated */
  orderId: number;
  orderPrice: number | null;
  trailStart: number | null;
  trailValue: number | null;
  triggerPrice: number;
  triggeredAt: string;
  orderType: OrderType;
  /** @deprecated */
  orderStatus: OrderStatus;
  retryUntilFilled: boolean;
}

export type TriggerOrderHistory = Array<TriggerOrderHistoryItem>;