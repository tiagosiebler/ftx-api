export interface NftInfo {
  id: number;
  name: string;
  description: string;
  issuer: string;
  collection: string;
  series: string;
  solMintAddress: string;
  ethContractAddress: string;
  imageUrl: string;
  videoUrl?: string;
  attributes?: string | null;
  redeemable: boolean;
  redeemed: boolean;
  offerPrice: number;
  auction: Array<{
    bestBid: number;
    minNextBid: number;
    endTime: string;
    bids: number
  }>
}

export type NftList = Array<NftInfo>;
export type NftBalances = NftList;
export interface NftTrade {
  id: number;
  price: number;
  time: string;
}

export type NftTrades = Array<NftTrade>

export interface AllNftTrade extends NftTrade {
  nft: NftList;
}

export type AllNftTrades = Array<AllNftTrade>

export interface NftCollection {
  issuer: string;
  collection: string;
}

export type NftCollections = Array<NftCollection>;

export interface NftAccountInfo {
  bid: number;
  buyFee: number;
  isBestBid: boolean;
  owned: boolean;
}

export interface NftFill {
  id: number;
  nft: NftList;
  side: "buy";
  price: number;
  fee: number;
  time: string;
}

export type NftFills = Array<NftFill>;

export type NftDepositStatus = "unconfirmed" | "confirmed" | "cancelled";
export interface NftDeposit {
  id: number;
  nft: NftList;
  status: NftDepositStatus;
  /** @description created at
   * @example "2021-06-10T09:15:43.136561+00:00"
   */
  time: string;
  sentTime: string;
  confirmedTime: string;
  confirmations: number;
}

export type NftDeposits = Array<NftDeposit>;

export type NftWithdrawalMethod = "erc20" | "sol";
export type NftWithdrawalStatus = "requested" | "processing" | "sent" | "completed" | "cancelled";

export interface NftWithdrawal {
  id: number;
  nft: NftList;
  address: string;
  method: NftWithdrawalMethod;
  /** @example "0x8078356ae4b06a036d64747546c274af19581f1c78c510b60505798a7ffcaf1" */
  txid: string;
  fee: number;
  status: NftWithdrawalStatus;
  /** @description created at
   * @example "2021-06-10T09:15:43.136561+00:00"
  */
  time: string;
  notes: string | null;
}

export type NftWithdrawals = Array<NftWithdrawal>

export interface NftGallery {
  name: string;
  nfts: NftList;
}

export interface NftGallerySettings {
  id: number;
  public: boolean;
}

export interface NftRedemption {
  id: number;
  nft: NftList;
  time: string;
  notes: null;
  address: string;
  status: "confirmed";
}