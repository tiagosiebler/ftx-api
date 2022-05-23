export interface Position {
  cost: number;
  cumulativeBuySize: number;
  cumulativeSellSize: number;
  entryPrice: number;
  estimatedLiquidationPrice: number;
  future: string;
  initialMarginRequirement: number;
  longOrderSize: number;
  maintenanceMarginRequirement: number;
  netSize: number;
  openSize: number;
  realizedPnl: number;
  recentAverageOpenPrice: number;
  recentBreakEvenPrice: number;
  recentPnl: number;
  shortOrderSize: number;
  side: string;
  size: number;
  unrealizedPnl: number;
  collateralUsed: number;
}

export type Positions = Array<Position>
export interface AccountSummary {
  accountIdentifier: number;
  username: string;
  collateral: number;
  freeCollateral: number;
  totalAccountValue: number;
  totalPositionSize: number;
  initialMarginRequirement: number;
  maintenanceMarginRequirement: number;
  marginFraction: number;
  openMarginFraction: number;
  liquidating: boolean;
  backstopProvider: boolean;
  positions: Positions;
  takerFee: number;
  makerFee: number;
  leverage: number;
  futuresLeverage: number;
  positionLimit: number;
  positionLimitUsed: number;
  useFttCollateral: boolean;
  chargeInterestOnNegativeUsd: boolean;
  spotMarginEnabled: boolean;
  spotLendingEnabled: boolean;
}

export interface HistoricalBalance {
  /** @description name of subaccount */
  account: string
  /**
   * @example "BTC-PERP"
   * @desciprtion	name of product (future, option, token, or currency)
   */
  ticker: string;
  /** 
   * @example -1.2 
   * @description size of balance or position at endTime
   */
  size: number
  /** @description mark price of future at endTime (null for options and balances entries) */
  price: number;
}

export type HistoricalBalances = Array<HistoricalBalance>