export interface Stake {
  coin: string;
  createdAt: string;
  id: number;
  size: number;
}

export type Stakes = Array<Stake>;

export type StakeRequestStatus = "pending" | "cancelled" | "processed";

export type StakeRequest = Stake;
export type StakeRequests = Array<StakeRequest>;

export interface UnstakeRequest extends Stake {
  status: StakeRequestStatus;
  /** @example "2020-08-19T20:49:07.225716+00:00" */
  unlockAt: string;
}

export type UnstakeRequests = Array<UnstakeRequest>;

export interface StakeReward extends Omit<Stake, "createdAt"> {
  /** @example "2020-08-19T20:49:07.225716+00:00" */
  time: string;
  status: "complete";
}

export type StakeRewards = Array<StakeReward>

export interface StakeBalance {
  coin: string;
  lifetimeRewards: number;
  scheduledToUnstake: number;
  staked: number;
}

export type StakeBalances = Array<StakeBalance>;