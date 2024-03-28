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
  CreateShippingMethodDocument,
  CreateShippingZoneDocument,
  CreateWarehouseDocument,
  DeleteChannelDocument,
  DeleteProductCategoryDocument,
  DeleteProductTypeDocument,
  DeleteShippingZoneDocument,
  DeleteWarehouseDocument,
  FindProductCategoryDocument,
  FindProductDocument,
  FindProductTypesDocument,
  FindShippingZonesDocument,
  FindWarehousesDocument,
  GetChannelDocument,
  ProductFragment,
  ProductTypeFragment,
  ShippingMethodTypeEnum,
  ShippingZoneFragment,
  UpdateChannelDocument,
  UpdateShippingMethodChannelListingDocument,
  UpdateShopSettingsDocument,
  WarehouseFragment,
} from './gql/graphql';
import invariant from 'ts-invariant';
import {
  recipeBundleVariant,
  recipeIndividualVariantsMap,
  recipeSubscriptionVariantsMap,
} from './helpers/dog';

enum SFExpressShippingMethod {
  Free = 'SF Express (Free)',
  Fixed = 'SF Express (Fixed)',
}

async function prugeDefaultChannel() {
  console.log('execute pruge the default channel...');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: 'default-channel',
    },
  });

  if (channel) {
    const { channelDelete } = await executeGraphQL(DeleteChannelDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: channel.id },
    });

    if (!channelDelete || channelDelete.errors.length > 0) {
      channelDelete && console.error(channelDelete.errors);
      throw new Error('failed to delete the default channel');
    }
  }
}

async function prugeDefaultProductType() {
  console.log('execute pruge the default product type...');

  const { productTypes } = await executeGraphQL(FindProductTypesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      keyword: 'Default Type',
    },
  });

  if (productTypes && productTypes.edges.length > 0) {
    const { productTypeDelete } = await executeGraphQL(DeleteProductTypeDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: productTypes.edges[0].node.id },
    });

    if (!productTypeDelete || productTypeDelete.errors.length > 0) {
      productTypeDelete && console.error(productTypeDelete.errors);
      throw new Error('failed to delete the default product type');
    }
  }
}

async function prugeDefaultCategory() {
  console.log('execute pruge the default category...');

  const { category } = await executeGraphQL(FindProductCategoryDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: 'default-category',
    },
  });

  if (category) {
    const { categoryDelete } = await executeGraphQL(DeleteProductCategoryDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: category.id },
    });

    if (!categoryDelete || categoryDelete.errors.length > 0) {
      categoryDelete && console.error(categoryDelete.errors);
      throw new Error('failed to delete the default category');
    }
  }
}

async function prugeDefaultWarehouse() {
  console.log('execute pruge the default warehouse...');

  const { warehouses } = await executeGraphQL(FindWarehousesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: 'Default Warehouse',
      },
    },
  });

  if (warehouses && warehouses.edges.length > 0) {
    const { deleteWarehouse } = await executeGraphQL(DeleteWarehouseDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: warehouses.edges[0].node.id },
    });

    if (!deleteWarehouse || deleteWarehouse.errors.length > 0) {
      deleteWarehouse && console.error(deleteWarehouse.errors);
      throw new Error('failed to delete the default warehouse');
    }
  }
}

async function prugeDefaultShippingZone() {
  console.log('execute pruge the default shipping zone...');

  const { shippingZones } = await executeGraphQL(FindShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: 'Default',
      },
    },
  });

  if (shippingZones && shippingZones.edges.length > 0) {
    const { shippingZoneDelete } = await executeGraphQL(DeleteShippingZoneDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: shippingZones.edges[0].node.id },
    });

    if (!shippingZoneDelete || shippingZoneDelete.errors.length > 0) {
      shippingZoneDelete && console.error(shippingZoneDelete.errors);
      throw new Error('failed to delete the default shipping zone');
    }
  }
}

async function findOrCreateChannel(warehouse: WarehouseFragment): Promise<ChannelFragment> {
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
    const { channelUpdate } = await executeGraphQL(UpdateChannelDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: channel.id,
        input: {
          name: 'Ocelle',
          defaultCountry: CountryCode.Hk,
          addWarehouses: [warehouse.id],
          orderSettings: {
            allowUnpaidOrders: false,
          },
          isActive: true,
        },
      },
    });

    if (!channelUpdate || channelUpdate.errors.length > 0) {
      channelUpdate && console.error(channelUpdate.errors);
      throw new Error('failed to update channel');
    }

    return channelUpdate.channel!;
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
        addWarehouses: [warehouse.id],
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

  // create new product category
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

async function findOrCreateWarehouse(): Promise<WarehouseFragment> {
  console.log('execute find or create the warehouse...');

  const { warehouses } = await executeGraphQL(FindWarehousesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: 'Ocelle Warehouse',
      },
    },
  });

  if (warehouses && warehouses.edges.length > 0) {
    return warehouses.edges[0].node;
  }

  // create new warehouse
  const { createWarehouse } = await executeGraphQL(CreateWarehouseDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        name: 'Ocelle Warehouse',
        address: {
          streetAddress1: 'Fake address of OCELLE warehouse',
          city: 'Lai Chi Kok',
          postalCode: '000000',
          countryArea: 'Kowloon',
          country: CountryCode.Hk,
        },
      },
    },
  });

  if (!createWarehouse || createWarehouse.errors.length > 0) {
    createWarehouse && console.error(createWarehouse.errors);
    throw new Error('failed to create warehouse');
  }

  return createWarehouse.warehouse!;
}

async function createShippingMethod(
  shippingZone: ShippingZoneFragment,
  channel: ChannelFragment,
  name: string,
  price: number
) {
  const { shippingPriceCreate } = await executeGraphQL(CreateShippingMethodDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        name,
        type: ShippingMethodTypeEnum.Price,
        shippingZone: shippingZone.id,
      },
    },
  });

  if (!shippingPriceCreate || shippingPriceCreate.errors.length > 0) {
    shippingPriceCreate && console.error(shippingPriceCreate.errors);
    throw new Error('failed to create shipping method');
  }

  const { shippingMethodChannelListingUpdate } = await executeGraphQL(
    UpdateShippingMethodChannelListingDocument,
    {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: shippingPriceCreate.shippingMethod!.id,
        input: {
          addChannels: [
            {
              channelId: channel.id,
              price,
            },
          ],
        },
      },
    }
  );
  if (!shippingMethodChannelListingUpdate || shippingMethodChannelListingUpdate.errors.length > 0) {
    shippingMethodChannelListingUpdate && console.error(shippingMethodChannelListingUpdate.errors);
    throw new Error('failed to add channel to shipping zone');
  }
}

async function findOrCreateShippingZone(
  channel: ChannelFragment,
  warehouse: WarehouseFragment
): Promise<ShippingZoneFragment> {
  console.log('execute find or create shipping zone...');

  const { shippingZones } = await executeGraphQL(FindShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: 'Ocelle Shipping Zone',
      },
    },
  });

  if (shippingZones && shippingZones.edges.length > 0) {
    return shippingZones.edges[0].node;
  }

  // create new shipping zone
  const { shippingZoneCreate } = await executeGraphQL(CreateShippingZoneDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        name: 'Ocelle Shipping Zone',
        default: true,
        countries: [CountryCode.Hk],
        addChannels: [channel.id],
        addWarehouses: [warehouse.id],
      },
    },
  });

  if (!shippingZoneCreate || shippingZoneCreate.errors.length > 0) {
    shippingZoneCreate && console.error(shippingZoneCreate.errors);
    throw new Error('failed to create shipping zone');
  }

  const shippingZone = shippingZoneCreate.shippingZone!;

  // create shipping methods for the zone
  await createShippingMethod(shippingZone, channel, SFExpressShippingMethod.Free, 0);
  await createShippingMethod(shippingZone, channel, SFExpressShippingMethod.Fixed, 60);

  return shippingZone;
}

async function setupShop() {
  console.log('setup shop...');

  const { shopSettingsUpdate } = await executeGraphQL(UpdateShopSettingsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        limitQuantityPerCheckout: null,
      },
    },
  });
  if (!shopSettingsUpdate || shopSettingsUpdate.errors.length > 0) {
    shopSettingsUpdate && console.error(shopSettingsUpdate.errors);
    throw new Error('failed to update shop');
  }
}

async function setupSubscriptionProducts(
  channel: ChannelFragment,
  productType: ProductTypeFragment,
  category: CategoryFragment,
  warehouse: WarehouseFragment
): Promise<ProductFragment> {
  invariant(
    process.env.SALEOR_SUBSCRIPTION_PRODUCT_SLUG,
    'Missing SALEOR_SUBSCRIPTION_PRODUCT_SLUG env variable'
  );

  console.log('setup subscription products...');

  // create placeholder product if not exists
  const { product } = await executeGraphQL(FindProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_SUBSCRIPTION_PRODUCT_SLUG,
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
      slug: process.env.SALEOR_SUBSCRIPTION_PRODUCT_SLUG,
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
      variants: Object.values(recipeSubscriptionVariantsMap).map(({ name, sku }) => {
        return {
          name,
          sku,
          attributes: [],
          trackInventory: false,
          stocks: [
            {
              warehouse: warehouse.id,
              quantity: Math.pow(2, 31) - 1,
            },
          ],
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
    throw new Error('failed to create subscription product');
  }

  return productBulkCreate.results[0].product!;
}

async function setupIndividualProducts(
  channel: ChannelFragment,
  productType: ProductTypeFragment,
  category: CategoryFragment,
  warehouse: WarehouseFragment
): Promise<ProductFragment> {
  invariant(
    process.env.SALEOR_INDIVIDUAL_PRODUCT_SLUG,
    'Missing SALEOR_INDIVIDUAL_PRODUCT_SLUG env variable'
  );

  console.log('setup individual products...');

  // create placeholder product if not exists
  const { product } = await executeGraphQL(FindProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_INDIVIDUAL_PRODUCT_SLUG,
    },
  });

  if (product) {
    return product;
  }

  const variants = Object.values(recipeIndividualVariantsMap);

  variants.push(recipeBundleVariant);

  // create a product if not exists
  const { productBulkCreate } = await executeGraphQL(CreateProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      name: 'Recipe Individual',
      description: JSON.stringify({
        time: Date.now(),
        blocks: [
          {
            id: 'CMRIgvbpUG',
            data: {
              text: 'This product is used for <b>OCELLE</b> individual purchase.',
            },
            type: 'paragraph',
          },
        ],
        version: '2.22.2',
      }),
      slug: process.env.SALEOR_INDIVIDUAL_PRODUCT_SLUG,
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
      variants: variants.map(({ name, sku, price }) => {
        return {
          name,
          sku,
          attributes: [],
          trackInventory: false,
          stocks: [
            {
              warehouse: warehouse.id,
              quantity: Math.pow(2, 31) - 1,
            },
          ],
          channelListings: [
            {
              channelId: channel.id,
              price,
            },
          ],
        };
      }),
    },
  });

  if (!productBulkCreate || productBulkCreate.errors.length > 0) {
    productBulkCreate && console.error(productBulkCreate.errors);
    throw new Error('failed to create individual product');
  }

  return productBulkCreate.results[0].product!;
}

async function setup() {
  try {
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
  } catch (e) {
    console.error(e);
  } finally {
    await AppDataSource.destroy();
  }

  await setupShop();

  const productType = await findOrCreateProductType();
  const category = await findOrCreateCategory();
  const warehouse = await findOrCreateWarehouse();
  const channel = await findOrCreateChannel(warehouse);
  const shippingZone = await findOrCreateShippingZone(channel, warehouse);

  await setupIndividualProducts(channel, productType, category, warehouse);
  await setupSubscriptionProducts(channel, productType, category, warehouse);

  await prugeDefaultChannel();
  await prugeDefaultProductType();
  await prugeDefaultCategory();
  await prugeDefaultWarehouse();
  await prugeDefaultShippingZone();
}

setup();
