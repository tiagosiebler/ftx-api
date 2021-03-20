import { RestClient } from "../src/rest-client";

/*

  Demonstrations on basic REST API calls

*/

(async () => {
  // Optional, but required for private endpoints
  const key = 'apiKeyHere';
  const secret = 'apiSecretHere';

  const client = new RestClient(key, secret);

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