export interface ApiKeyInfo {
  enabled: boolean;
  readOnly: boolean;
  withdrawalEnabled: boolean;
  internalTransfersEnabled: boolean;
  subaccountNickname: null | string;
  requireWhitelistedIp: boolean;
}