'use server';

import { getLoginedMe } from '@/actions';
import { Order } from '@/entities';
import { FindOrdersDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import invariant from 'ts-invariant';

export default async function getOrders() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const me = await getLoginedMe();

  const dbOrders = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(Order, {
      where: {
        user: {
          id: me.id,
        },
      },
      relations: {
        boxs: {
          shipment: true,
        },
      },
    });
  });

  const { orders } = await executeGraphQL(FindOrdersDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      channel: process.env.SALEOR_CHANNEL_SLUG,
      filter: {
        ids: dbOrders.map((order) => order.id),
      },
    },
  });

  const saleorOrders = orders?.edges.map((edge) => edge.node) ?? [];

  return dbOrders.map((o) => ({
    shipment: o.boxs[0].shipment,
    order: saleorOrders.find((x) => x.id === o.id)!,
  }));
}
