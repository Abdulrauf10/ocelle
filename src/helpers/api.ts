import {
  CountryCode,
  FindProductsDocument,
  FindProductsQueryVariables,
  FindUserDocument,
  GetChannelDocument,
  RegisterAccountDocument,
  UpdateCheckoutAddressDocument,
} from '@/gql/graphql';
import { executeGraphQL } from './graphql';
import invariant from 'ts-invariant';
import CreateUserError from '@/errors/api/CreateUserError';
import UpdateAddressError from '@/errors/api/UpdateAddressError';

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

export async function upsertUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  channel: string,
  redirectUrl: string
) {
  const { user } = await executeGraphQL(FindUserDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { email },
  });
  if (user) {
    return user;
  }
  const { accountRegister } = await executeGraphQL(RegisterAccountDocument, {
    variables: {
      input: {
        firstName,
        lastName,
        password,
        email,
        redirectUrl,
        channel,
      },
    },
  });
  if (!accountRegister || accountRegister.errors.length > 0) {
    throw new CreateUserError(accountRegister);
  }
  return accountRegister.user!;
}

export async function updateAddress(
  checkoutId: string,
  deliveryAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
  },
  billingAddress?: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
  }
) {
  const shippingAddress = {
    firstName: deliveryAddress.firstName,
    lastName: deliveryAddress.lastName,
    streetAddress1: deliveryAddress.streetAddress1,
    streetAddress2: deliveryAddress.streetAddress2,
    city: deliveryAddress.district,
    countryArea: deliveryAddress.region,
    country: CountryCode.Hk,
  };

  const { checkoutShippingAddressUpdate, checkoutBillingAddressUpdate } = await executeGraphQL(
    UpdateCheckoutAddressDocument,
    {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId,
        shippingAddress,
        billingAddress: billingAddress
          ? {
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              streetAddress1: billingAddress.streetAddress1,
              streetAddress2: billingAddress.streetAddress2,
              city: billingAddress.district,
              countryArea: billingAddress.region,
              country: CountryCode.Hk,
            }
          : shippingAddress,
      },
    }
  );

  if (!checkoutShippingAddressUpdate || checkoutShippingAddressUpdate.errors.length > 0) {
    throw new UpdateAddressError(checkoutBillingAddressUpdate);
  }

  if (!checkoutBillingAddressUpdate || checkoutBillingAddressUpdate.errors.length > 0) {
    throw new UpdateAddressError(checkoutBillingAddressUpdate);
  }
}
