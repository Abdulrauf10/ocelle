import {
  FindProductsDocument,
  FindProductsQueryVariables,
  GetChannelDocument,
} from '@/gql/graphql';
import { executeGraphQL } from './graphql';
import invariant from 'ts-invariant';

export async function getThrowableChannel() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_CHANNEL_SLUG,
    },
  });

  if (!channel) {
    throw new Error('channel not found');
  }

  return channel;
}

export async function findProducts(variables?: FindProductsQueryVariables) {
  const { products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: variables ?? {},
  });
  return products?.edges.map((edge) => edge.node) || [];
}
