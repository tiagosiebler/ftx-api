export function getWsAuthMessage(key: string, signature: string, timestamp: number, subAccountName?: string) {
  const msg: any = {
    op: 'login',
    args: {
      key: key,
      sign: signature,
      time: timestamp
    }
  }

  if (subAccountName) {
    msg.args.subaccount = subAccountName;
  }
  return msg;
};

export function getWsPingMessage() {
  return { op: 'ping' }
};

export function isWsPong(message: any): boolean {
  return message?.type === 'pong';
};