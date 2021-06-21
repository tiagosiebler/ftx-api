# ftx-api
[![Tests](https://circleci.com/gh/tiagosiebler/ftx-api.svg?style=shield)](https://circleci.com/gh/tiagosiebler/ftx-api)
[![npm version](https://img.shields.io/npm/v/ftx-api)][1] [![npm size](https://img.shields.io/bundlephobia/min/ftx-api/latest)][1] [![npm downloads](https://img.shields.io/npm/dt/ftx-api)][1]
[![last commit](https://img.shields.io/github/last-commit/tiagosiebler/ftx-api)][1]
[![CodeFactor](https://www.codefactor.io/repository/github/tiagosiebler/ftx-api/badge)](https://www.codefactor.io/repository/github/tiagosiebler/ftx-api)


[1]: https://www.npmjs.com/package/ftx-api

Node.js connector for the FTX APIs and WebSockets, with TypeScript & browser support.

## Installation
`npm install --save ftx-api`

## Issues & Discussion
- Issues? Check the [issues tab](https://github.com/tiagosiebler/ftx-api/issues).
- Discuss & collaborate with other node devs? Join our [Node.js Algo Traders](https://t.me/nodetraders) engineering community on telegram.

## Documentation
Most methods accept JS objects, except for methods with only one parameter. These can be populated using parameters specified by FTX's API documentation.
- [FTX REST API Documentation](https://docs.ftx.com/#rest-api).
- [FTX Websocket API Documentation](https://docs.ftx.com/#websocket-api).

## Structure
This project uses typescript. Resources are stored in 3 key structures:
- [src](./src) - the whole connector written in typescript
- [lib](./lib) - the javascript version of the project (compiled from typescript). This should not be edited directly, as it will be overwritten with each release.
- [dist](./dist) - the packed bundle of the project for use in browser environments.
- [examples](./examples) - demonstrations on various workflows using this library

---

# Usage
Create API credentials at FTX
- [FTX.com](https://ftx.com/#a=ftxapigithub)

## REST API Clients

Import and instance the `RestClient` to access all REST API methods.
- All methods return promises.
- Supports subaccounts.

### Example
<details><summary>To use the REST APIs, import the `RestClient`. Click here to expand and see full sample:</summary>

```javascript
const { RestClient } = require('ftx-api');

const restClientOptions = {
  // override the max size of the request window (in ms)
  recv_window?: number;

  // how often to sync time drift with FTX servers
  sync_interval_ms?: number | string;

  // Default: false. Disable above sync mechanism if true.
  disable_time_sync?: boolean;

  // Default: false. If true, we'll throw errors if any params are undefined
  strict_param_validation?: boolean;

  // Optionally override API protocol + domain
  // e.g 'https://ftx.us/api'
  baseUrl?: string;

  // Default: true. whether to try and post-process request exceptions.
  parse_exceptions?: boolean;

  // Subaccount nickname URI-encoded
  subAccountName?: string;
};

const API_KEY = 'xxx';
const PRIVATE_KEY = 'yyy';

const client = new RestClient(
  API_KEY,
  PRIVATE_KEY,

  // restClientOptions,
  // requestLibraryOptions
);

client.getMarkets()
  .then(result => {
    console.log("getMarkets result: ", result);
  })
  .catch(err => {
    console.error("getMarkets error: ", err);
  });

client.setAccountLeverage(5)
  .then(result => {
    console.log("setAccountLeverage result: ", result);
  })
  .catch(err => {
    console.error("setAccountLeverage error: ", err);
  });
```

</details>

See [rest-client.ts](./src/rest-client.ts) for further information.

## WebSockets
- Automatically connect to FTX websockets
- Automatically authenticate, if key & secret are provided.
- Automatically checks connection integrity. If connection stale (no response to pings), automatically reconnects, re-authenticates and resubscribes to previous topics.
- Supports subaccounts.

<details><summary>WebSocket channels can be subscribed to via the `WebsocketClient`. Click here to expand and see full sample:</summary>

```javascript
const { WebsocketClient } = require('ftx-api');

const API_KEY = 'xxx';
const PRIVATE_KEY = 'yyy';

const wsConfig = {
  key: API_KEY,
  secret: PRIVATE_KEY,

  /*
    The following parameters are optional:
  */

  // Subaccount nickname
  // subAccountName: 'sub1',

  // how long to wait (in ms) before deciding the connection should be terminated & reconnected
  // pongTimeout: 1000,

  // how often to check (in ms) that WS connection is still alive
  // pingInterval: 10000,

  // how long to wait before attempting to reconnect (in ms) after connection is closed
  // reconnectTimeout: 500,

  // config options sent to RestClient (used for time sync). See RestClient docs.
  // restOptions: { },

  // config for axios used for HTTP requests. E.g for proxy support
  // requestOptions: { }

  // override which URL to use for websocket connections
  // wsUrl: 'wss://example.ftx.com/ws'
};

const ws = new WebsocketClient(wsConfig);

// subscribe to multiple topics at once
ws.subscribe(['fills', 'orders']);

// and/or subscribe to individual topics on demand
ws.subscribe('fills');

// and/or subscribe to complex topics on demand, one at a time
ws.subscribe({
  channel: 'trades',
  market: 'BTC-PERP'
});

// or as a list of complex topics
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

// Listen to events coming from websockets. This is the primary data source
ws.on('update', data => {
  console.log('update', data);
});

// Optional: Listen to websocket connection open event (automatic after subscribing to one or more topics)
ws.on('open', ({ event }) => {
  console.log('connection opened');
});

// Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
ws.on('response', response => {
  console.log('response', response);
});

// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
ws.on('close', () => {
  console.log('connection closed');
});

// Optional: Listen to raw error events.
// Note: responses to invalid topics are currently only sent in the "response" event.
ws.on('error', err => {
  console.error('ERR', err);
});
```

</details>

See [websocket-client.ts](./src/websocket-client.ts) for further information.

## Examples

More demonstrations can be found in the [examples](./examples/) folder.

---

## Customise Logging
Pass a custom logger which supports the log methods `silly`, `debug`, `notice`, `info`, `warning` and `error`, or override methods from the default logger as desired.

<details><summary>Click here to expand and see full sample:</summary>

```javascript
const { WebsocketClient, DefaultLogger } = require('ftx-api');

// Disable all logging on the silly level
DefaultLogger.silly = () => {};

const ws = new WebsocketClient(
  { key: 'xxx', secret: 'yyy' },
  DefaultLogger
);
```

</details>

## Browser Usage
Build a bundle using webpack:
- `npm install`
- `npm build`
- `npm pack`

The bundle can be found in `dist/`. Altough usage should be largely consistent, smaller differences will exist. Documentation is still TODO.

---

## FTX.US
This client also supports the US FTX exchange. Simply set the "domain" to "ftxus" in both the RestClient and the WebsocketClient. See [examples/ftxus.ts](./examples/ftxus.ts) for a demonstration.

## Contributions & Thanks
### Donations
#### tiagosiebler
If you found this project interesting or useful, create accounts with my referral links:
- [FTX](https://ftx.com/#a=ftxapigithub)
- [Bybit](https://www.bybit.com/en-US/register?affiliate_id=9410&language=en-US&group_id=0&group_type=1)
- [Binance](https://www.binance.com/en/register?ref=20983262)

Or buy me a coffee using any of these:
- BTC: `1C6GWZL1XW3jrjpPTS863XtZiXL1aTK7Jk`
- ETH (ERC20): `0xd773d8e6a50758e1ada699bb6c4f98bb4abf82da`

### Contributions & Pull Requests
Contributions are encouraged, I will review any incoming pull requests. See the issues tab for todo items.
