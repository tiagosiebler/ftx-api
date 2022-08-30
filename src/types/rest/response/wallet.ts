export interface Coin {
  canDeposit: boolean;
  canWithdraw: boolean;
  /** @description true if addresses for this coin have a tag */
  hasTag: string;
  /** @example "UDST" */
  id: string;
  /** @example "USD Tether" */
  name: string;
  bep2Asset: string | null
  canConvert: boolean
  collateral: boolean
  collateralWeight: number;
  creditTo: string | null
  erc20Contract: string;
  fiat: boolean;
  isToken: boolean;
  /** @example 	["omni", "erc20", "trx", "sol"] */
  methods: string[];
  splMint: string;
  trc20Contract: string;
  usdFungible: boolean;
}

export type Coins = Array<Coin>

export interface Balance {
  coin: string;
  total: number;
  free: number;
  availableWithoutBorrow: number;
  usdValue: number;
  spotBorrow: number;
}

export type Balances = Array<Balance>

export type BalancesAllAccounts = Record<string, Balances>;

export interface DepositAddress {
  address: string;
  tag: string | null;
}

export type WithdrawalAddress = DepositAddress;

export type DepositHistoryStatus = "confirmed" | "unconfirmed" | "cancelled";

export interface DepositHistoryItem {
  coin: string;
  confirmations: number;
  confirmedTime: string;
  fee: number;
  id: number;
  sentTime: string;
  size: string;
  status: DepositHistoryStatus;
  time: string;
  txid: string;
  notes?: string;
}

export type DepositHistory = Array<DepositHistoryItem>;

export type WithdrawalHistoryStatus = "requested" | "processing" | "sent" | "complete" | "cancelled"

export interface WithdrawalHistoryItem {
  /** @example "TUSD" */
  coin: string;
  /** @description deposit address the withdrawal was sent to */
  address: string;
  tag: string | null;
  /** @description not included in size */
  fee: number;
  id: number;
  size: number;
  status: WithdrawalHistoryStatus
  time: string;
  /** @example "erc20" */
  method: string;
  txid?: string;
  notes?: string;
}

export type WithdrawalHistory = Array<WithdrawalHistoryItem>;

export interface WithdrawalFee {
  coin: string;
  size: number;
  address: string;
  tag: null | string;
}

export type WithdrawalMethod = "erc20" | "trx" | "sol" | "omni" | "bep2" | "bsc" | "ftm" | "avax" | "matic";
export interface WithdrawalRequest {
  coin: string;
  size: number;
  address: string;
  tag: string | null;
  /** @description blockchain to use for request */
  method: WithdrawalMethod | string;
  /** @description withdrawal password if it is required for your account */
  password: string | null;
  /** @description 2fa code if it is required for your account */
  code: string | null;
}

export interface Airdrop {
  coin: string;
  id: number;
  size: number;
  status: "confirmed" | "pending"
  time: string;
}

export interface SavedAddress {
  address: string;
  coin: string;
  fiat: boolean;
  id: number;
  isPrimetrust: boolean;
  lastUsedAt: string;
  tag: string | null
  whitelisted: boolean;
}

export interface FiatDepositInstructions {
  instructions: {
    "Wire Transfer": {
      "Where to Send Money (Beneficiary Account)": Array<{
        name: string;
        value: string;
      }>;
      "Receiving Bank"?: Array<{
        name: string;
        value: string;
      }>;
      transferInfo: {
        listAsBank: boolean;
        partner?: any;
        collapse?: any;
        requiresTaxId: boolean;
        requiresProof: boolean;
        disabled: boolean;
        longNote: string;
        titleNote?: string | null;
        memoOverride?: null | string;
      };
    };
  };
  memo: string;
  shortMemo?: string | null;
}

export interface FiatDeposit {
  id: number;
  coin: string;
  size: number;
  status: string;
  time: string;
  confirmedTime?: null | string;
  uploadedFile?: any;
  uploadedFileName?: null | string;
  cancelReason?: string;
  fiat: boolean;
  ach: boolean;
  type: string;
}