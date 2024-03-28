import seeders from '@/seeders';
import AppDataSource from '@/AppDataSource';
import { executeQuery } from './helpers/queryRunner';
import { executeGraphQL } from './helpers/graphql';
import {
  CategoryFragment,
  ChannelFragment,
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
  ProductFragment,
  ProductTypeFragment,
  ShippingZoneFragment,
  UpdateShippingMethodChannelListingDocument,
  UpdateShippingZoneDocument,
  WarehouseFragment,
} from './gql/graphql';
import invariant from 'ts-invariant';

async function findOrCreateChannel(
  shippingZones: ShippingZoneFragment[],
  warehouses: WarehouseFragment[]
): Promise<ChannelFragment> {
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

  if (channel) {
    return channel;
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
        addWarehouses: warehouses.map((warehouse) => warehouse.id),
        addShippingZones: shippingZones.map((zone) => zone.id),
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

  return channelCreate.channel!;
}

async function findOrCreateProductType(): Promise<ProductTypeFragment> {
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

    return productTypeCreate.productType!;
  } else {
    return productTypes.edges[0].node;
  }
}

async function findOrCreateCategory(): Promise<CategoryFragment> {
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

  if (category) {
    return category;
  }

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

  return categoryCreate.category!;
}

async function findWarehouses(): Promise<WarehouseFragment[]> {
  console.log('execute find warehouses...');

  const { warehouses } = await executeGraphQL(GetAllWarehousesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
  });

  if (!warehouses) {
    throw new Error('failed to find warehouses');
  }

  return warehouses.edges.map((warehouse) => warehouse.node);
}

async function findShippingZones(): Promise<ShippingZoneFragment[] | null | undefined> {
  console.log('execute find shipping zones...');

  const { shippingZones } = await executeGraphQL(GetAllShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
  });

  return shippingZones && shippingZones.edges.map((shippingZone) => shippingZone.node!);
}

async function setupShippingZones(shippingZones: ShippingZoneFragment[]) {
  console.log('setup shipping zones...');

  for (const shippingZone of shippingZones) {
    const { shippingZoneUpdate } = await executeGraphQL(UpdateShippingZoneDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: shippingZone.id,
        input: {
          countries: ['HK'],
        },
      },
    });
    if (!shippingZoneUpdate || shippingZoneUpdate.errors.length > 0) {
      shippingZoneUpdate && console.error(shippingZoneUpdate.errors);
      throw new Error('failed to update shipping zone');
    }
  }
}

async function setupShippingMethods(
  shippingZones: ShippingZoneFragment[],
  channel: ChannelFragment
) {
  console.log('execute setup shipping methods...');

  for (const shippingZone of shippingZones) {
    for (const { id, channelListings } of shippingZone.shippingMethods ?? []) {
      if (channelListings?.find((listing) => listing.channel.id === channel.id)) {
        continue;
      }
      const { shippingMethodChannelListingUpdate } = await executeGraphQL(
        UpdateShippingMethodChannelListingDocument,
        {
          withAuth: false,
          headers: {
            Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
          },
          variables: {
            id,
            input: {
              addChannels: [
                {
                  channelId: channel.id,
                  price: 0,
                },
              ],
            },
          },
        }
      );
      if (
        !shippingMethodChannelListingUpdate ||
        shippingMethodChannelListingUpdate.errors.length > 0
      ) {
        shippingMethodChannelListingUpdate &&
          console.error(shippingMethodChannelListingUpdate.errors);
        throw new Error('failed to add channel to shipping zone');
      }
    }
  }
}

async function setupSubscriptionProducts(
  channel: ChannelFragment,
  productType: ProductTypeFragment,
  category: CategoryFragment,
  warehouses: WarehouseFragment[]
): Promise<ProductFragment> {
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
    return product;
  }

  // create a product if not exists
  const { productBulkCreate } = await executeGraphQL(CreateProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      name: 'Recipe Subscription',
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
      productType: productType.id,
      category: category.id,
      channelListings: [
        {
          channelId: channel.id,
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
              warehouse: warehouse.id,
              quantity: Math.pow(2, 31) - 1,
            };
          }),
          channelListings: [
            {
              channelId: channel.id,
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

  return productBulkCreate.results[0].product!;
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

  const productType = await findOrCreateProductType();

  const category = await findOrCreateCategory();

  const warehouses = await findWarehouses();
  if (warehouses.length === 0) {
    throw new Error('saleor contains 0 of warehouse');
  }

  const shippingZones = await findShippingZones();
  if (!shippingZones) {
    throw new Error('failed find the shipping zones');
  }

  await setupShippingZones(shippingZones);

  const channel = await findOrCreateChannel(shippingZones, warehouses);

  await setupShippingMethods(shippingZones, channel);

  const product = await setupSubscriptionProducts(channel, productType, category, warehouses);
  if (!product) {
    throw new Error('failed to create the subscription products');
  }
}

setup();
