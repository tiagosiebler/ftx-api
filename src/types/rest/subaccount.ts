export interface Subaccount {
  nickname: string;
  deletable: boolean;
  editable: boolean;
}

export interface SubaccountBalance {
  coin: string;
  free: number;
  total: number;
  spotBorrow: number;
  availableWithoutBorrow: number;
}

export interface SubaccountTransfer {
  id: number;
  coin: string;
  size: number;
  time: string;
  notes: string;
  /** @description always "complete" */
  status: "complete";
}