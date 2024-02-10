import { createSaleorAuthClient } from '@saleor/auth-sdk';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import invariant from 'ts-invariant';

invariant(process.env.SALEOR_API_URL, 'Missing SALEOR_API_URL env variable');

const nextServerCookiesStorage = getNextServerCookiesStorage();
const saleorAuthClient = createSaleorAuthClient({
  saleorApiUrl: process.env.SALEOR_API_URL!,
  refreshTokenStorage: nextServerCookiesStorage,
  accessTokenStorage: nextServerCookiesStorage,
});

export default saleorAuthClient;
