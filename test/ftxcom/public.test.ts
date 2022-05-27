import { RestClient } from '../../src/rest-client';
import { successResponseList } from '../response.util';

describe('FTX.com public endpoints', () => {
  const api = new RestClient(undefined, undefined, { disable_time_sync: true });

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
      expect(await api[method]()).toMatchObject(successResponseList());
    });
  });

  it('should throw for unauthenticated private calls', async () => {
    await expect(api.getSubaccounts()).rejects.toMatchObject({
      body: {
        error: 'Not logged in',
      },
    });
  });

  it('getFundingRates()', async () => {
    expect(await api.getFundingRates()).toMatchObject(successResponseList());
    expect(await api.getFundingRates({ future: 'DOGE-PERP' })).toMatchObject(
      successResponseList()
    );
  });
});
