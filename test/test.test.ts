import { RestClient } from "../src/rest-client";
import { successResponseList } from "./response.util";
import dotenv from "dotenv";

dotenv.config();

const subAccountName = "auth0|6220d756744c65007040ec97";


// readonly
describe('FTX.us private endpoints', () => {
  const API_KEY = process.env.API_KEY_US;
  const API_SECRET = process.env.API_SECRET_US;

  const api = new RestClient(API_KEY, API_SECRET, {
    domain: 'ftxus',
    subAccountName
  });

  it('should get subaccounts', async () => {
    const accounts = await api.getSubaccounts();
    expect(accounts.result.length).toBeGreaterThanOrEqual(1);
  });

  it('should get balances', async () => {
    const balances = await api.getBalances();
    expect(balances.result.length).toBeGreaterThanOrEqual(1);
  });

  it('should get otc history', async () => {
    const otcHistory = await api.getOtcHistory();
    expect(otcHistory.result.length).toBeGreaterThanOrEqual(1);
  });
});
