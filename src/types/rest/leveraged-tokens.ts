export interface LeveragedToken {
  name: string;
  description: string;
  underlying: string;
  leverage: number;
  outstanding: number;
  pricePerShare: number;
  positionPerShare: number;
  positionsPerShare: Record<string, number>;
  basket: Record<string, number>;
  targetComponents: string[];
  underlyingMark: number;
  totalNav: number;
  totalCollateral: number;
  contractAddress: string;
  currentLeverage: number;
  change1h: number;
  change24h: number;
  changeBod: number;
}

export interface LeveragedTokenbalance {
  token: string;
  balance: number;
}


export interface LeveragedTokenCreationRequest {
  id: number;
  token: string;
  requestedSize: number;
  pending: boolean;
  createdSize: number;
  price: number;
  cost: number;
  fee: number;
  requestedAt: string;
  fulfilledAt: string;
}

export type LeveragedTokenRedemptionRequest = LeveragedTokenCreationRequest;

export interface LeveragedTokenCreation {
  id: number;
  token: string;
  requestedSize: number;
  cost: number;
  pending: boolean;
  requestedAt: string;
}

export interface LeveragedTokenRedemption {
  id: number;
  token: string;
  size: number;
  projectedProceeds: number;
  pending: boolean;
  requestedAt: string;
}