import { OrderSide } from "./orders";

export interface Fill {
  fee: number;
  feeCurrency: string;
  feeRate: number;
  future: string;
  id: string;
  liquidity: "maker" | "taker";
  market: string;
  baseCurrency?: string | null;
  quoteCurrency: string | null;
  orderId: number;
  tradeId: number | null;
  price: number;
  side: OrderSide;
  size: number;
  time: string
  type: "orders" | string; // other types undocumented
}

export type Fills = Fill[];

export interface FundingPayment {
  future: string;
  id: number;
  payment: number;
  time: string;
}