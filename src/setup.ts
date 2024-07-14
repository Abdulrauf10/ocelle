import invariant from 'ts-invariant';

import {
  DEFAULT_CATEGORY_SLUG,
  DEFAULT_WAREHOUSE,
  DEFUALT_SHIPPING_ZONE,
  SHIPPING_METHOD_SF_EXPRESS_FIXED,
  SHIPPING_METHOD_SF_EXPRESS_FREE,
} from './consts';
import {
  CategoryFragment,
  ChannelFragment,
  CountryCode,
  CreateChannelDocument,
  CreateProductCategoryDocument,
  CreateProductTypeDocument,
  CreateProductsDocument,
  CreateShippingMethodDocument,
  CreateShippingZoneDocument,
  CreateWarehouseDocument,
  DeleteChannelDocument,
  DeleteProductCategoryDocument,
  DeleteProductTypeDocument,
  DeleteShippingZoneDocument,
  DeleteWarehouseDocument,
  ExcludeShippingPriceProductsDocument,
  FindProductCategoryDocument,
  FindProductTypesDocument,
  FindShippingZonesDocument,
  FindWarehousesDocument,
  GetChannelDocument,
  GetShippingZoneDocument,
  ProductFragment,
  ProductTypeFragment,
  ShippingMethodTypeEnum,
  ShippingMethodTypeFragment,
  ShippingZoneFragment,
  UpdateChannelDocument,
  UpdateShippingMethodChannelListingDocument,
  UpdateShopSettingsDocument,
  WarehouseFragment,
  WeightUnitsEnum,
} from './gql/graphql';
import { executeGraphQL } from './helpers/graphql';
import { nativeCeil } from './helpers/number';
import { executeQuery } from './helpers/queryRunner';
import { individualPackProductsValues, subscriptionProductsValues } from './products';
import productService from './services/product';

import AppDataSource from '@/AppDataSource';
import seeders from '@/seeders';

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

async function findOrCreateProductType(name: string): Promise<ProductTypeFragment> {
  console.log('execute find or create product type...');

  const { productTypes } = await executeGraphQL(FindProductTypesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      keyword: name,
    },
  });

  if (!productTypes || productTypes.edges.length === 0) {
    // create new product type for product
    const { productTypeCreate } = await executeGraphQL(CreateProductTypeDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { name },
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
      slug: DEFAULT_CATEGORY_SLUG,
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
      slug: DEFAULT_CATEGORY_SLUG,
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
        search: DEFAULT_WAREHOUSE,
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
        name: DEFAULT_WAREHOUSE,
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

async function findOrCreateShippingMethod(
  shippingZone: ShippingZoneFragment,
  channel: ChannelFragment,
  name: string,
  price: number
): Promise<ShippingMethodTypeFragment> {
  const { shippingZone: _shippingZone } = await executeGraphQL(GetShippingZoneDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      id: shippingZone.id,
      channel: channel.id,
    },
  });

  if (!_shippingZone) {
    throw new Error('cannot find shipping zone');
  }

  const shippingMethod = _shippingZone.shippingMethods!.find(
    (shippingMethod) => shippingMethod.name === name
  );

  if (shippingMethod) {
    return shippingMethod;
  }

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

  return shippingPriceCreate.shippingMethod!;
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
        search: DEFUALT_SHIPPING_ZONE,
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
        name: DEFUALT_SHIPPING_ZONE,
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

  return shippingZoneCreate.shippingZone!;
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
        defaultWeightUnit: WeightUnitsEnum.Kg,
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
): Promise<ProductFragment[]> {
  console.log('setup subscription products...');

  // create placeholder product if not exists
  const products = await productService.find({
    where: {
      slug: {
        oneOf: subscriptionProductsValues.map((product) => product.slug),
      },
    },
  });

  if (products.length === subscriptionProductsValues.length) {
    return products;
  }

  const existingProductSlugs = products.map((product) => product.slug);

  const productsToBeCreate = subscriptionProductsValues.filter(
    (product) => existingProductSlugs.indexOf(product.slug) === -1
  );

  // create a product if not exists
  const { productBulkCreate } = await executeGraphQL(CreateProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      products: productsToBeCreate.map((recipe) => {
        return {
          name: recipe.name,
          slug: recipe.slug,
          description: JSON.stringify({
            time: Date.now(),
            blocks: [
              {
                id: 'CMRIgvbpUG',
                data: {
                  text: 'This is a placeholder product. Do not <b>EDIT</b> or <b>DELETE</b> the product.',
                },
                type: 'paragraph',
              },
            ],
            version: '2.22.2',
          }),
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
          variants: Object.entries(recipe.variants).map(([name, variant]) => {
            return {
              name,
              sku: variant.sku,
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
                  price: nativeCeil(variant.pricePerUnit, 2),
                },
              ],
            };
          }),
        };
      }),
    },
  });

  if (!productBulkCreate || productBulkCreate.errors.length > 0) {
    productBulkCreate && console.error(productBulkCreate.errors);
    throw new Error('failed to create subscription product');
  }

  return [...products, ...productBulkCreate.results.map((result) => result.product!)];
}

async function setupIndividualProducts(
  channel: ChannelFragment,
  productType: ProductTypeFragment,
  category: CategoryFragment,
  warehouse: WarehouseFragment
): Promise<ProductFragment[]> {
  console.log('setup individual products...');

  const products = await productService.find({
    where: {
      slug: {
        oneOf: individualPackProductsValues.map((product) => product.slug),
      },
    },
  });

  if (products.length === individualPackProductsValues.length) {
    return products;
  }

  const existingProductSlugs = products.map((product) => product.slug);

  const productsToBeCreate = individualPackProductsValues.filter(
    (product) => existingProductSlugs.indexOf(product.slug) === -1
  );

  // create a product if not exists
  const { productBulkCreate } = await executeGraphQL(CreateProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      products: productsToBeCreate.map((product) => {
        return {
          name: product.name,
          slug: product.slug,
          description: JSON.stringify({
            time: Date.now(),
            blocks: product.description.map((description) => {
              return {
                id: 'CMRIgvbpUG',
                data: {
                  text: description,
                },
                type: 'paragraph',
              };
            }),
            version: '2.22.2',
          }),
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
          variants: [
            {
              name: 'Default',
              sku: product.variant.sku,
              attributes: [],
              trackInventory: false,
              weight: product.variant.weightKGs,
              stocks: [
                {
                  warehouse: warehouse.id,
                  quantity: Math.pow(2, 31) - 1,
                },
              ],
              channelListings: [
                {
                  channelId: channel.id,
                  price: product.variant.price,
                },
              ],
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

  return [...products, ...productBulkCreate.results.map((result) => result.product!)];
}

async function setupExcludeShippingMethodProducts(
  shippingMethodId: string,
  products: ProductFragment[]
) {
  console.log('setup exclude shipping method products...');

  const { shippingPriceExcludeProducts } = await executeGraphQL(
    ExcludeShippingPriceProductsDocument,
    {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: shippingMethodId,
        input: {
          products: products.map((product) => product.id),
        },
      },
    }
  );

  if (!shippingPriceExcludeProducts || shippingPriceExcludeProducts.errors.length > 0) {
    shippingPriceExcludeProducts && console.error(shippingPriceExcludeProducts.errors);
    throw new Error('failed to exclude products from shipping method');
  }
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

  const individualProductType = await findOrCreateProductType('Pack');
  const subscriptionProductType = await findOrCreateProductType('Subscription');
  const category = await findOrCreateCategory();
  const warehouse = await findOrCreateWarehouse();
  const channel = await findOrCreateChannel(warehouse);
  const shippingZone = await findOrCreateShippingZone(channel, warehouse);
  const freeShippingMethod = await findOrCreateShippingMethod(
    shippingZone,
    channel,
    SHIPPING_METHOD_SF_EXPRESS_FREE,
    0
  );
  const fixedShippingMethod = await findOrCreateShippingMethod(
    shippingZone,
    channel,
    SHIPPING_METHOD_SF_EXPRESS_FIXED,
    60
  );

  const individualProducts = await setupIndividualProducts(
    channel,
    individualProductType,
    category,
    warehouse
  );
  const subscriptionProducts = await setupSubscriptionProducts(
    channel,
    subscriptionProductType,
    category,
    warehouse
  );

  await setupExcludeShippingMethodProducts(freeShippingMethod.id, individualProducts);
  await setupExcludeShippingMethodProducts(fixedShippingMethod.id, subscriptionProducts);

  await prugeDefaultChannel();
  await prugeDefaultProductType();
  await prugeDefaultCategory();
  await prugeDefaultWarehouse();
  await prugeDefaultShippingZone();
}

setup();
