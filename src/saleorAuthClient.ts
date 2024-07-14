import { createSaleorAuthClient } from '@saleor/auth-sdk';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import invariant from 'ts-invariant';

export const getServerAuthClient = () => {
  invariant(process.env.SALEOR_API_URL, 'Missing SALEOR_API_URL env variable');

  const nextServerCookiesStorage = getNextServerCookiesStorage();
  return createSaleorAuthClient({
    saleorApiUrl: process.env.SALEOR_API_URL,
    refreshTokenStorage: nextServerCookiesStorage,
    accessTokenStorage: nextServerCookiesStorage,
  });
};
