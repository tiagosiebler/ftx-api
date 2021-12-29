import { ActiveFuturesPosition, FuturesPosition, WsEvent, WsEventSubscribed, WsEventTrades } from "../";

export function isActivePosition(pos: FuturesPosition): pos is ActiveFuturesPosition {
  return pos.size !== 0;
}

export function isWsSubscribedEvent(msg: WsEvent): msg is WsEventSubscribed {
  return msg && msg.type === 'subscribed';
}

export function isWsTradesEvent(msg: WsEvent): msg is WsEventTrades {
  return msg && msg.channel === 'trades' && msg.type === 'update' && Array.isArray(msg.data);
}
