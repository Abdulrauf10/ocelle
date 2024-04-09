'use server';

import { getCartCookie, setCartCookie } from '@/actions';
import { IndividualRecipePack, Recipe } from '@/enums';
import {
  AddCheckoutLinesDocument,
  CheckoutFragment,
  CountryCode,
  CreateCheckoutDocument,
  FindProductDocument,
  FindProductsDocument,
  GetChannelDocument,
  GetCheckoutDocument,
  RemoveCheckoutLinesDocument,
  UpdateCheckoutLinesDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { individualPackProducts, individualPackProductsValues } from '@/products';
import { CartReturn } from '@/types/dto';
import invariant from 'ts-invariant';

export async function getProducts() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      channel: process.env.SALEOR_CHANNEL_SLUG,
      where: {
        slug: {
          oneOf: individualPackProductsValues.map((product) => product.slug),
        },
      },
    },
  });

  if (!products) {
    throw new Error('cannot find products');
  }

  return {
    [IndividualRecipePack.Bundle]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Bundle].slug
    )!.node,
    [IndividualRecipePack.Chicken]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Chicken].slug
    )!.node,
    [IndividualRecipePack.Beef]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Beef].slug
    )!.node,
    [IndividualRecipePack.Duck]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Duck].slug
    )!.node,
    [IndividualRecipePack.Lamb]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Lamb].slug
    )!.node,
    [IndividualRecipePack.Pork]: products.edges.find(
      (edge) => edge.node.slug === individualPackProducts[IndividualRecipePack.Pork].slug
    )!.node,
  };
}

export async function getCartOrCheckout(
  create: boolean = true
): Promise<CheckoutFragment | undefined> {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const cartOrCheckoutId = await getCartCookie();

  if (cartOrCheckoutId) {
    const { checkout } = await executeGraphQL(GetCheckoutDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: cartOrCheckoutId },
    });
    if (checkout) {
      return checkout;
    }
  }

  if (!create) {
    return undefined;
  }

  // create cart or checkout if not exists
  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { slug: process.env.SALEOR_CHANNEL_SLUG },
  });

  if (!channel) {
    throw new Error('channel not found');
  }

  const { checkoutCreate } = await executeGraphQL(CreateCheckoutDocument, {
    variables: {
      input: {
        channel: process.env.SALEOR_CHANNEL_SLUG,
        lines: [],
        shippingAddress: {
          streetAddress1: 'Fake street address 1, must be entry in checkout',
          city: 'Tsuen Wan',
          countryArea: 'New Territories',
          country: CountryCode.Hk,
        },
        billingAddress: {
          streetAddress1: 'Fake street address 1, must be entry in checkout',
          city: 'Tsuen Wan',
          countryArea: 'New Territories',
          country: CountryCode.Hk,
        },
      },
    },
  });

  if (!checkoutCreate || checkoutCreate.errors.length > 0) {
    checkoutCreate && console.error(checkoutCreate?.errors);
    throw new Error('create checkout failed');
  }

  const checkout = checkoutCreate.checkout!;

  setCartCookie(checkout.id);

  return checkout;
}

export async function addToCart(pack: IndividualRecipePack, quantity: number): Promise<CartReturn> {
  const cart = await getCartOrCheckout(true);

  const { product } = await executeGraphQL(FindProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: individualPackProducts[pack].slug,
    },
  });

  if (!product?.variants) {
    throw new Error('cannot find the product to process the checkout action');
  }

  const { checkoutLinesAdd } = await executeGraphQL(AddCheckoutLinesDocument, {
    variables: {
      checkoutId: cart!.id,
      lines: [
        {
          variantId: product.variants[0].id,
          quantity,
        },
      ],
    },
  });

  if (!checkoutLinesAdd || checkoutLinesAdd.errors.length > 0) {
    checkoutLinesAdd && console.error(checkoutLinesAdd?.errors);
    throw new Error('unable add item to cart');
  }

  return {
    lines: checkoutLinesAdd.checkout!.lines,
    totalPrice: checkoutLinesAdd.checkout!.totalPrice.gross,
  };
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartReturn> {
  const cart = await getCartOrCheckout(false);

  const { checkoutLinesUpdate } = await executeGraphQL(UpdateCheckoutLinesDocument, {
    variables: {
      checkoutId: cart!.id,
      lines: [
        {
          lineId,
          quantity,
        },
      ],
    },
  });

  if (!checkoutLinesUpdate || checkoutLinesUpdate.errors.length > 0) {
    checkoutLinesUpdate && console.error(checkoutLinesUpdate?.errors);
    throw new Error('unable update item from cart');
  }

  return {
    lines: checkoutLinesUpdate.checkout!.lines,
    totalPrice: checkoutLinesUpdate.checkout!.totalPrice.gross,
  };
}

export async function deleteCartLine(lineId: string): Promise<CartReturn> {
  const cart = await getCartOrCheckout(false);

  const { checkoutLinesDelete } = await executeGraphQL(RemoveCheckoutLinesDocument, {
    variables: {
      checkoutId: cart!.id,
      linesIds: [lineId],
    },
  });

  if (!checkoutLinesDelete || checkoutLinesDelete.errors.length > 0) {
    checkoutLinesDelete && console.error(checkoutLinesDelete?.errors);
    throw new Error('unable delete item from cart');
  }

  return {
    lines: checkoutLinesDelete.checkout!.lines,
    totalPrice: checkoutLinesDelete.checkout!.totalPrice.gross,
  };
}
