export interface BorrowRate {
  coin: string;
  estimate: string;
  previous: string;
}

export type LendingRate = BorrowRate;

export interface BorrowedAmount {
  coin: string;
  size: number;
}

interface MarketInfoItem {
  coin: string;
  borrowed: number;
  free: number;
  estimatedRate: number;
  previousRate: number;
}

export type MarketInfo = Array<MarketInfoItem>;

interface BorrowHistoryItem {
  coin: string;
  const: number;
  rate: number;
  size: number;
  time: string;
}

export type BorrowHistory = Array<BorrowHistoryItem>;
export type LendingHistory = BorrowHistory;

export interface LendingOffer {
  coin: string;
  lendable: number;
  locked: number;
  minRate: number;
  offered: number;
}

export interface LendingInfo {
  coin: string;
  size: number;
  rate: number;
}