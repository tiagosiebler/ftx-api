import { WebsocketClient } from "../src/websocket-client";

/*

  Demonstrations on connecting to private & public websocket channels

*/
try {
  const params = {
    key: 'apikeyhere',
    secret: 'apisecrethere',
    // subAccountName: 'sub1',
  }

  // Prepare a ws connection (connection init is automatic once ws client is instanced)
  const ws = new WebsocketClient(params);

  // append event listeners
  ws.on('response', msg => console.log('response: ', msg));
  ws.on('update', msg => console.log('update: ', msg));
  ws.on('error', msg => console.log('err: ', msg));

  // Subscribe to public & private topics. Any of the following are valid:

  /*
    Option 1: specify channel using name (no params)
  */
  ws.subscribe('fills');

  /*
    Option 2: specify list of channel names (no params)
  */
  ws.subscribe(['fills', 'orders']);

  /*
    Option 3: specify channel with extra parameters
  */
  ws.subscribe({
    channel: 'trades',
    market: 'BTC-PERP'
  });

  /*
    Option 4: specify channel with extra parameters
  */
  ws.subscribe([
    {
      channel: 'trades',
      market: 'BTC-PERP'
    },
    {
      channel: 'orderbookGrouped',
      market: 'BTC-PERP',
      grouping: 500
    }
  ]);
} catch (e) {
  console.error('err: ', e.body);
}