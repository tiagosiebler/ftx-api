import { createHmac } from 'crypto';

export async function signMessage(message: string, secret: string): Promise<string> {
  return createHmac('sha256', secret)
    .update(message)
    .digest('hex');
};

export async function signWsAuthenticate(timestamp: number, secret: string): Promise<string> {
  return signMessage(timestamp + 'websocket_login', secret);
};
