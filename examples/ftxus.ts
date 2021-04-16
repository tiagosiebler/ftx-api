import { RestClient } from "../src/rest-client";
import { RestClientOptions, WSClientConfigurableOptions } from "../src/util/requestUtils";
import { WebsocketClient } from "../src/websocket-client";

/*

  FTX.us uses a different API domain for both REST and Websockets. Headers are also slightly different.

  Set the domain in all client options to 'ftxus' to connect to ftx.us. Examples for REST and Websockets are below.

  Note: some API calls may be unavailable due to limitations in the FTX.us APIs.

*/

(async () => {
  // Optional, but required for private endpoints
  const key = 'apiKeyHere';
  const secret = 'apiSecretHere';

  const restClientOptions: RestClientOptions = {
    domain: 'ftxus'
  };

  const wsClientOptions: WSClientConfigurableOptions = {
    key: 'apikeyhere',
    secret: 'apisecrethere',
    // subAccountName: 'sub1',
    domain: 'ftxus',
    restOptions: restClientOptions
  };

  // Prepare websocket connection
  const ws = new WebsocketClient(wsClientOptions);
  ws.on('response', msg => console.log('response: ', msg));
  ws.on('update', msg => console.log('update: ', msg));
  ws.on('error', msg => console.log('err: ', msg));

  // Prepare rest client and trigger API calls as desired
  const client = new RestClient(key, secret, restClientOptions);

  // Try some public API calls
  try {
    console.log('getBalances: ', await client.getBalances());
    console.log('getSubaccountBalances: ', await client.getSubaccountBalances('sub1'));
    console.log('getMarkets: ', await client.getMarket('ABNB-0326'));
  } catch (e) {
    console.error('public get method failed: ', e);
  }

  // Try some authenticated API calls
  const market = 'BTC/USD';
  try {
    console.log('buysome: ', await client.placeOrder({
      market,
      side: 'buy',
      type: 'market',
      size: 0.001,
      price: null
    }));
  } catch (e) {
    console.error('buy failed: ', e);
  }

  try {
    console.log('sellsome: ', await client.placeOrder({
      market,
      side: 'sell',
      type: 'market',
      size: 0.001,
      price: null
    }));
  } catch (e) {
    console.error('sell failed: ', e);
  }

  // Nothing left - close the process
  process.exit();
})();