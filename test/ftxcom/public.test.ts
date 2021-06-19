import { RestClient } from "../../src/rest-client";

describe('FTX.com public endpoints', () => {
  const api = new RestClient();

  const successfulRespondData = {
    "result": expect.any(Array),
    "success": true
  };

  const publicMethods = [
    'getMarkets',
    'listAllFutures',
    'getFundingRates',
    'getExpiredFutures',
    'getLendingRates',
    'getDailyBorrowedAmounts',
    'listLeveragedTokens',
    'listQuoteRequests',
  ];

  publicMethods.forEach((method: string) => {
    it(`public method ${method}() returns data`, async () => {
      expect(await api[method]()).toMatchObject(successfulRespondData);
    });
  });

  it('should throw for unauthenticated private calls', async () => {
    await expect(api.getSubaccounts()).rejects.toMatchObject({
      body: {
        error: 'Not logged in',
      },
    });
  });
});