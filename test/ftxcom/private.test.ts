import { RestClient } from "../../src/rest-client";
import { successResponseList } from "../response.util";

describe('FTX.com private endpoints', () => {
  const API_KEY = process.env.API_KEY_COM;
  const API_SECRET = process.env.API_SECRET_COM;
  const SUB_ACCOUNT_NAME = process.env.API_COM_SUBACCOUNT;

  const api = new RestClient(API_KEY, API_SECRET, {
    subAccountName: SUB_ACCOUNT_NAME,
  });

  it.skip('should get subaccounts', async () => {
    expect(await api.getSubaccounts()).toMatchObject({
      "result": [
        {
          "nickname": "comacc1",
        }
      ],
      "success": true
    });
  });

  it('should get balances', async () => {
    expect(await api.getBalances()).toMatchObject(successResponseList());
  });

  it('should place orders', async () => {
    const market = 'BTC/USD';
    const type = 'market';

    const buyAmount = 0.0001;

    try {
      const result = await api.placeOrder({
        market,
        type,
        side: 'buy',
        size: buyAmount,
        price: null
      });
      expect(result).toMatchObject({
        "result": {
          "filledSize": expect.any(Number),
          "id": expect.any(Number),
          "market": market,
          "postOnly": false,
          "price": null,
          "reduceOnly": false,
          "remainingSize": expect.any(Number),
          "side": "buy",
          "size": buyAmount,
          "status": expect.any(String),
          "type": type
        },
        "success": true
      });
    } catch (e) {
      console.error('buy exception: ', e);
      expect(e).toBeUndefined();
    }

    // sleep to allow order ifll
    await new Promise(resolve => setTimeout(resolve, 500));

    const balances = await api.getBalances();
    const balanceBtc = balances.result.find(bal => bal.coin === 'BTC');

    try {
      const result = await api.placeOrder({
        market,
        type,
        side: 'sell',
        size: Number(balanceBtc!.free),
        price: null
      });
      expect(result).toMatchObject({
        "result": {
          "filledSize": expect.any(Number),
          "id": expect.any(Number),
          "market": market,
          "postOnly": false,
          "price": null,
          "reduceOnly": false,
          "remainingSize": expect.any(Number),
          "side": "sell",
          "size": expect.any(Number),
          "status": expect.any(String),
          "type": type
        },
        "success": true
      });
    } catch (e) {
      console.error('sell exception: ', e);
      expect(e).toBeUndefined();
    }

  });
});
