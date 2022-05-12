export interface QuoteStatus  {
  baseCoin: string;
  cost: number;
  expired: boolean;
  expiry: number;
  filled: boolean;
  fromCoin: string;
  id: number;
  price: number;
  proceeds: number;
  quoteCoin: string;
  side: string;
  toCoin: string;
}