'use server';

import invariant from 'ts-invariant';

import { getCartCookie, setCartCookie } from '@/actions';
import { IndividualRecipePack } from '@/enums';
import {
  AddCheckoutLinesDocument,
  CheckoutFragment,
  CountryCode,
  CreateCheckoutDocument,
  FindProductDocument,
  GetCheckoutDocument,
  RemoveCheckoutLinesDocument,
  UpdateCheckoutLinesDocument,
  UpdateCheckoutShippingMethodDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { individualPackProducts, individualPackProductsValues } from '@/products';
import { findProducts } from '@/services/api';
import { CartReturn } from '@/types/dto';

export async function getProducts() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const products = await findProducts({
    channel: process.env.SALEOR_CHANNEL_SLUG,
    where: {
      slug: {
        oneOf: individualPackProductsValues.map((product) => product.slug),
      },
    },
  });

  return {
    [IndividualRecipePack.Bundle]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Bundle].slug
    )!,
    [IndividualRecipePack.Chicken]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Chicken].slug
    )!,
    [IndividualRecipePack.Beef]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Beef].slug
    )!,
    [IndividualRecipePack.Duck]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Duck].slug
    )!,
    [IndividualRecipePack.Lamb]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Lamb].slug
    )!,
    [IndividualRecipePack.Pork]: products.find(
      (product) => product.slug === individualPackProducts[IndividualRecipePack.Pork].slug
    )!,
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
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
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

  const checkout = checkoutLinesAdd.checkout!;

  if (checkout.shippingMethods.length === 0) {
    throw new Error('there have no available shipping method');
  }

  const shippingMethod =
    checkout.shippingMethods.find((method) => method.name === 'SF Express (Fixed)') ??
    checkout.shippingMethods[0];

  const { checkoutDeliveryMethodUpdate } = await executeGraphQL(
    UpdateCheckoutShippingMethodDocument,
    {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: checkout.id,
        shippingMethodId: shippingMethod.id,
      },
    }
  );

  if (!checkoutDeliveryMethodUpdate || checkoutDeliveryMethodUpdate.errors.length > 0) {
    checkoutDeliveryMethodUpdate && console.error(checkoutDeliveryMethodUpdate.errors);
    throw new Error('failed to update shipping method');
  }

  return {
    lines: checkoutDeliveryMethodUpdate.checkout!.lines,
    subtotalPrice: checkoutDeliveryMethodUpdate.checkout!.subtotalPrice.gross,
    shippingPrice: checkoutDeliveryMethodUpdate.checkout!.shippingPrice.gross,
    totalPrice: checkoutDeliveryMethodUpdate.checkout!.totalPrice.gross,
  };
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartReturn> {
  const cart = await getCartOrCheckout(false);

  const { checkoutLinesUpdate } = await executeGraphQL(UpdateCheckoutLinesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
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
    subtotalPrice: checkoutLinesUpdate.checkout!.subtotalPrice.gross,
    shippingPrice: checkoutLinesUpdate.checkout!.shippingPrice.gross,
    totalPrice: checkoutLinesUpdate.checkout!.totalPrice.gross,
  };
}

export async function deleteCartLine(lineId: string): Promise<CartReturn> {
  const cart = await getCartOrCheckout(false);

  const { checkoutLinesDelete } = await executeGraphQL(RemoveCheckoutLinesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
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
    subtotalPrice: checkoutLinesDelete.checkout!.subtotalPrice.gross,
    shippingPrice: checkoutLinesDelete.checkout!.shippingPrice.gross,
    totalPrice: checkoutLinesDelete.checkout!.totalPrice.gross,
  };
}
