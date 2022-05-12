import { OrderSide } from "./orders";

export type OptionType = "call" | "put";
export type OptionStatus = "open" | "cancelled" | "filled" | string;

export interface Option {
  /** @example "BTC" */
  underlying: string;
  type: OptionType;
  strike: number;
  /** @example "2020-01-08T22:35:54.626023+00:00" */
  expiry: string;
}

export interface QuoteRequest {
  id: number;
  option: Option;
  side: OrderSide;
  /** @example "2020-01-08T22:35:54.626023+00:00" */
  time: string;
  status: OptionStatus;
  /** @example "2020-01-08T22:35:54.626023+00:00" */
  requestExpiry: string;
  limitPrice: number;
}

export interface MyQuoteRequest extends QuoteRequest {
  quotes: Quote[];
  hideLimitPrice: boolean;
  size: number;
  counterpartyId?: number | null;
}

export interface CancelledQuoteRequest extends MyQuoteRequest {
  status: "cancelled"
}

export interface Quote {
  id: number;
  status: OptionStatus;
  collateral: number;
  price: number;
  /** @example "2020-01-08T22:35:54.626023+00:00" */
  quoteExpiry: string | null;
  /** @example "2020-01-08T22:35:54.626023+00:00" */
  time: string;
}

export interface QuoteForMyQuoteRequest extends Quote {
  requestId: number;
  quoterSide: OrderSide;
  requestSide: OrderSide;
  size: number;
  option: Option;
  requestLimitPrice: number;
}

export interface CancelledQuote extends QuoteForMyQuoteRequest {
  state: "cancelled";
}

export interface AcceptedAptionsQuote extends QuoteForMyQuoteRequest {
  state: "filled";
}

export interface OptionsAccountInfo {
  usdBalance: number;
  liquidationPrice: number;
  liquidated: boolean;
  /**
   * 	@description	you will be liquidated if your account collateral + options usdBalance drops below this number
   */
  maintenanceMarginRequirement: number;
  initialMarginRequirement: number;
}

export interface OptionsPosition {
  netSize: number;
  entryPrice: number;
  size: number;
  option: Option;
  side: OrderSide;
  pessimisticValuation?: number | null;
  pessimisticIndexPrice?: number | null;
  pessimisticVol?: number | null;
}

export interface OptionsTrade {
  id: number;
  size: number;
  option: Option;
  prize: number;
  time: string;
}

export interface OptionsFill extends OptionsTrade {
  liquidity: "maker" | "taker";
  fee: number;
  feeRate: number;
  side: OrderSide;
}

interface Options24hVolumeItem {
  contracts: number;
  underlying_total: number;
}

export type Options24hVolume = Array<Options24hVolumeItem>;

interface OptionsHistoricalVolumeItem {
  numContracts: number;
  startTime: string;
  endTime: string;
}

export type OptionsHistoricalVolumes = Array<OptionsHistoricalVolumeItem>

interface OptionsOpenInterestItem {
  numContracts: number;
  time: string;
}

export type OptionsOpenInterest = Array<OptionsOpenInterestItem>
