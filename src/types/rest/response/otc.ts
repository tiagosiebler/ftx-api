export interface OtcHistoryItem {
  baseCurrency: string;
  fee: number;
  from: string;
  id: number;
  price: number;
  proceeds: number;
  quoteCurrency: string;
  size: number;
  time: string;
  to: string;
}

export type OtcHistory = Array<OtcHistoryItem>;