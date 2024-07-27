import Stripe from 'stripe';
import invariant from 'ts-invariant';

import {
  CheckoutAppendLineError,
  CheckoutCompleteError,
  CheckoutCreateError,
  CheckoutDeleteLineError,
  CheckoutInitialTransactionError,
  CheckoutNotFoundError,
  CheckoutNotLinkedEmailError,
  CheckoutSetCouponError,
  CheckoutUpdateAddressError,
  CheckoutUpdateEmailError,
  CheckoutUpdateLineError,
  CheckoutUpdateShippingMethodError,
} from '@/errors/checkout';
import {
  AddCheckoutLinesDocument,
  AddPromoCodeDocument,
  CheckoutAuthorizeStatusEnum,
  CheckoutChargeStatusEnum,
  CheckoutFragment,
  CompleteCheckoutDocument,
  CountryCode,
  CreateCheckoutDocument,
  FindProductDocument,
  GetCheckoutDocument,
  InitializeTransactionDocument,
  RemoveCheckoutLinesDocument,
  UpdateCheckoutAddressDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutLinesDocument,
  UpdateCheckoutShippingMethodDocument,
} from '@/gql/graphql';
import { awaitable } from '@/helpers/async';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';

class CheckoutService {
  async getById(id: string) {
    const { checkout } = await executeGraphQL(GetCheckoutDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id },
    });

    if (!checkout) {
      throw new CheckoutNotFoundError();
    }

    return checkout;
  }
  async create() {
    invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

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
      throw new CheckoutCreateError();
    }

    return checkoutCreate.checkout!;
  }
  async initialTransaction(
    id: string,
    data: Omit<Stripe.PaymentIntentCreateParams, 'amount' | 'currency'>
  ) {
    const checkout = await this.getById(id);

    const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
      variables: {
        checkoutOrOrderId: checkout.id,
        paymentGateway: {
          id: getStripeAppId(),
          data,
        },
      },
    });

    if (!transactionInitialize || transactionInitialize.errors.length > 0) {
      throw new CheckoutInitialTransactionError(transactionInitialize?.errors);
    }

    return transactionInitialize.data as {
      paymentIntent: { client_secret: string };
      publishableKey: string;
    };
  }
  async appendLine(id: string, productSlug: string, quantity: number) {
    const { product } = await executeGraphQL(FindProductDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        slug: productSlug,
      },
    });

    if (!product?.variants) {
      throw new CheckoutAppendLineError();
    }

    const { checkoutLinesAdd } = await executeGraphQL(AddCheckoutLinesDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: id,
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
      throw new CheckoutAppendLineError();
    }

    return checkoutLinesAdd.checkout!;
  }
  async updateLine(id: string, lineId: string, quantity: number) {
    const { checkoutLinesUpdate } = await executeGraphQL(UpdateCheckoutLinesDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: id,
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
      throw new CheckoutUpdateLineError();
    }

    return checkoutLinesUpdate.checkout!;
  }
  async deleteLine(id: string, lineId: string) {
    const { checkoutLinesDelete } = await executeGraphQL(RemoveCheckoutLinesDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: id,
        linesIds: [lineId],
      },
    });

    if (!checkoutLinesDelete || checkoutLinesDelete.errors.length > 0) {
      checkoutLinesDelete && console.error(checkoutLinesDelete?.errors);
      throw new CheckoutDeleteLineError();
    }

    return checkoutLinesDelete.checkout!;
  }
  async assignShippingMethod(id: string, name: string) {
    const checkout = await this.getById(id);

    const shippingMethod =
      checkout.shippingMethods.find((method) => method.name === name) ??
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
      throw new CheckoutUpdateShippingMethodError();
    }

    return checkoutDeliveryMethodUpdate.checkout!;
  }
  async setCoupon(id: string, code: string) {
    const { checkoutAddPromoCode } = await executeGraphQL(AddPromoCodeDocument, {
      variables: {
        promoCode: code,
        checkoutId: id,
      },
    });

    if (!checkoutAddPromoCode || checkoutAddPromoCode.errors.length > 0) {
      checkoutAddPromoCode && console.error(checkoutAddPromoCode.errors);
      throw new CheckoutSetCouponError();
    }

    return checkoutAddPromoCode;
  }
  async updateEmail(id: string, email: string) {
    const { checkoutEmailUpdate } = await executeGraphQL(UpdateCheckoutEmailDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: id,
        email: email,
      },
    });

    if (!checkoutEmailUpdate || checkoutEmailUpdate.errors.length > 0) {
      checkoutEmailUpdate && console.error(checkoutEmailUpdate?.errors);
      throw new CheckoutUpdateEmailError();
    }
  }
  async updateAddress(
    id: string,
    deliveryAddress: {
      firstName: string;
      lastName: string;
      streetAddress1: string;
      streetAddress2: string;
      district: string;
      region: string;
      country: CountryCode;
    },
    billingAddress: {
      firstName: string;
      lastName: string;
      streetAddress1: string;
      streetAddress2: string;
      district: string;
      region: string;
      country: CountryCode;
      postalCode?: string;
    }
  ) {
    const _shippingAddress = {
      firstName: deliveryAddress.firstName,
      lastName: deliveryAddress.lastName,
      streetAddress1: deliveryAddress.streetAddress1,
      streetAddress2: deliveryAddress.streetAddress2,
      city: deliveryAddress.district,
      countryArea: deliveryAddress.region,
      country: CountryCode.Hk,
    };
    const _billingAddress = {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      streetAddress1: billingAddress.streetAddress1,
      streetAddress2: billingAddress.streetAddress2,
      city:
        billingAddress.country === CountryCode.Hk ? billingAddress.district : billingAddress.region,
      countryArea:
        billingAddress.country === CountryCode.Hk ? billingAddress.region : billingAddress.district,
      country: billingAddress.country,
      postalCode: billingAddress.postalCode,
    };

    const { checkoutShippingAddressUpdate, checkoutBillingAddressUpdate } = await executeGraphQL(
      UpdateCheckoutAddressDocument,
      {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          checkoutId: id,
          shippingAddress: _shippingAddress,
          billingAddress: _billingAddress,
        },
      }
    );

    if (
      !checkoutShippingAddressUpdate ||
      !checkoutBillingAddressUpdate ||
      checkoutShippingAddressUpdate.errors.length > 0 ||
      checkoutBillingAddressUpdate.errors.length > 0
    ) {
      checkoutShippingAddressUpdate && console.error(checkoutShippingAddressUpdate.errors);
      checkoutBillingAddressUpdate && console.error(checkoutBillingAddressUpdate.errors);
      throw new CheckoutUpdateAddressError();
    }
  }
  assertCheckoutCompletable(checkout: CheckoutFragment) {
    if (!checkout.email) {
      throw new CheckoutNotLinkedEmailError();
    }
  }
  async completeCheckout(id: string) {
    const checkout = await this.getById(id);
    this.assertCheckoutCompletable(checkout);

    // we need to wait for the payment hook to be called before completing the checkout
    await awaitable(
      () => this.getById(id),
      ({ authorizeStatus, chargeStatus }) =>
        authorizeStatus !== CheckoutAuthorizeStatusEnum.None &&
        chargeStatus !== CheckoutChargeStatusEnum.None
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { checkoutComplete } = await executeGraphQL(CompleteCheckoutDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: checkout.id,
      },
    });

    if (!checkoutComplete || checkoutComplete.errors.length > 0) {
      checkoutComplete && console.error(checkoutComplete.errors);
      throw new CheckoutCompleteError();
    }

    return checkoutComplete.order!;
  }
}

const checkoutService = new CheckoutService();

export default checkoutService;
