import seeders from '@/seeders';
import AppDataSource from '@/AppDataSource';
import { executeQuery } from './helpers/queryRunner';
import { executeGraphQL } from './helpers/graphql';
import {
  CountryCode,
  CreateChannelDocument,
  CreateProductCategoryDocument,
  CreateProductDocument,
  CreateProductTypeDocument,
  FindProductCategoryDocument,
  FindProductDocument,
  FindProductTypesDocument,
  GetAllShippingZonesDocument,
  GetAllWarehousesDocument,
  GetChannelDocument,
} from './gql/graphql';
import invariant from 'ts-invariant';

async function findOrCreateChannel(shippingZones: string[], warehouses: string[]) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  console.log('execute find or create channel...');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_CHANNEL_SLUG,
    },
  });

  if (channel?.id) {
    return channel.id;
  }

  // create new channel
  const { channelCreate } = await executeGraphQL(CreateChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        name: 'Ocelle',
        slug: process.env.SALEOR_CHANNEL_SLUG,
        currencyCode: 'HKD',
        defaultCountry: CountryCode.Hk,
        addWarehouses: warehouses,
        addShippingZones: shippingZones,
        orderSettings: {
          allowUnpaidOrders: false,
        },
        isActive: true,
      },
    },
  });

  if (!channelCreate || channelCreate.errors.length > 0) {
    channelCreate && console.error(channelCreate.errors);
    throw new Error('failed to create channel');
  }

  return channelCreate.channel?.id;
}

async function findOrCreateProductType() {
  console.log('execute find or create product type...');

  const { productTypes } = await executeGraphQL(FindProductTypesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      keyword: 'Ocelle',
    },
  });

  if (!productTypes || productTypes.edges.length === 0) {
    // create new product type for product
    const { productTypeCreate } = await executeGraphQL(CreateProductTypeDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        name: 'Ocelle',
      },
    });

    if (!productTypeCreate || productTypeCreate.errors.length > 0) {
      productTypeCreate && console.error(productTypeCreate.errors);
      throw new Error('failed to create product type');
    }

    return productTypeCreate.productType?.id;
  } else {
    return productTypes.edges[0].node.id;
  }
}

async function findOrCreateCategory() {
  console.log('execute find or create category...');

  const { category } = await executeGraphQL(FindProductCategoryDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: 'ocelle',
    },
  });

  if (!category) {
    // create new product type for product
    const { categoryCreate } = await executeGraphQL(CreateProductCategoryDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        name: 'Ocelle',
        slug: 'ocelle',
      },
    });

    if (!categoryCreate || categoryCreate.errors.length > 0) {
      categoryCreate && console.error(categoryCreate.errors);
      throw new Error('failed to create product category');
    }

    return categoryCreate.category?.id;
  } else {
    return category.id;
  }
}

async function findWarehouses() {
  console.log('execute find warehouses...');

  const { warehouses } = await executeGraphQL(GetAllWarehousesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
  });

  return warehouses && warehouses.edges.map((warehouse) => warehouse.node.id);
}

async function findShippingZones() {
  console.log('execute find shipping zones...');

  const { shippingZones } = await executeGraphQL(GetAllShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
  });

  return shippingZones && shippingZones.edges.map((shippingZone) => shippingZone.node.id);
}

async function setupProducts(
  channel: string,
  productType: string,
  category: string,
  warehouses: string[]
) {
  invariant(process.env.SALEOR_PRODUCT_SLUG, 'Missing SALEOR_PRODUCT_SLUG env variable');

  console.log('setup products...');

  const variants = [
    { name: 'Chicken', sku: 'ocelle-c-s' },
    { name: 'Beef', sku: 'ocelle-b-s' },
    { name: 'Lamb', sku: 'ocelle-l-s' },
    { name: 'Duck', sku: 'ocelle-d-s' },
    { name: 'Pork', sku: 'ocelle-p-s' },
  ];

  // create placeholder product if not exists
  const { product } = await executeGraphQL(FindProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_PRODUCT_SLUG,
    },
  });

  if (product) {
    return product.id;
  }

  // create a product if not exists
  const { productBulkCreate } = await executeGraphQL(CreateProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      name: 'Fresh Recipe',
      description: JSON.stringify({
        time: Date.now(),
        blocks: [
          {
            id: 'CMRIgvbpUG',
            data: {
              text: 'This product is used for <b>OCELLE</b> subscription purchase.',
            },
            type: 'paragraph',
          },
        ],
        version: '2.22.2',
      }),
      slug: process.env.SALEOR_PRODUCT_SLUG,
      productType,
      category,
      channelListings: [
        {
          channelId: channel,
          isAvailableForPurchase: true,
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
      ],
      variants: variants.map(({ name, sku }) => {
        return {
          name,
          sku,
          attributes: [],
          trackInventory: false,
          stocks: warehouses.map((warehouse) => {
            return {
              warehouse,
              quantity: Math.pow(2, 31) - 1,
            };
          }),
          channelListings: [
            {
              channelId: channel,
              price: 1,
            },
          ],
        };
      }),
    },
  });

  if (!productBulkCreate || productBulkCreate.errors.length > 0) {
    productBulkCreate && console.error(productBulkCreate.errors);
    throw new Error('failed to create product');
  }

  return productBulkCreate.results[0].product?.id;
}

async function setup() {
  await executeQuery(async (queryRunner) => {
    // reset seeders
    for (const seeder of seeders) {
      await seeder.clean(queryRunner);
    }

    // initial seeders
    for (const seeder of seeders) {
      await seeder.run(queryRunner);
    }
  });

  await AppDataSource.destroy();

  const productTypeId = await findOrCreateProductType();
  if (!productTypeId) {
    throw new Error('failed to create or find the product type');
  }

  const categoryId = await findOrCreateCategory();
  if (!categoryId) {
    throw new Error('failed to create or find the category');
  }

  const warehouses = await findWarehouses();
  if (!warehouses) {
    throw new Error('failed find the warehouses');
  }

  const shippingZones = await findShippingZones();
  if (!shippingZones) {
    throw new Error('failed find the shipping zones');
  }

  const channel = await findOrCreateChannel(shippingZones, warehouses);
  if (!channel) {
    throw new Error('failed to find the channel');
  }

  const product = await setupProducts(channel, productTypeId, categoryId, warehouses);
  if (!product) {
    throw new Error('failed to create the product');
  }
}

setup();
