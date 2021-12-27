import { WsEventTrades } from "../";

export function isWsTradesEvent(msg: WsEventTrades): msg is WsEventTrades {
  return msg && msg.channel === 'trades' && msg.type === 'update' && Array.isArray(msg.data);
}
