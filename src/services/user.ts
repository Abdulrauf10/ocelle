'use server';

import { headers } from 'next/headers';
import { FindOneOptions } from 'typeorm';

import { User } from '@/entities';
import {
  CountryCode,
  CreateAddressDocument,
  FindUserDocument,
  GetCurrentUserDocument,
  GetCurrentUserFullSizeDocument,
  RegisterAccountDocument,
  SetDefaultAddressDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';

export class UserMeError extends Error {}
export class UserNotFoundError extends Error {}
export class UserCreateError extends Error {}
export class UserAssignAddressError extends Error {}
export class UserUpdateAddressError extends Error {}

async function findOrCreateSaleorUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
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
  const headersList = headers();
  const origin = headersList.get('origin');
  const { accountRegister } = await executeGraphQL(RegisterAccountDocument, {
    variables: {
      input: {
        firstName,
        lastName,
        password,
        email,
        redirectUrl: `${origin}/auth/verify-email`,
        channel: process.env.SALEOR_CHANNEL_SLUG,
      },
    },
  });
  if (!accountRegister || accountRegister.errors.length > 0) {
    throw new UserCreateError();
  }
  return accountRegister.user!;
}

class UserService {
  meRelations: FindOneOptions<User>['relations'] = {
    orders: true,
    dogs: {
      plan: true,
      breeds: { breed: true },
    },
  };
  async me() {
    const { me } = await executeGraphQL(GetCurrentUserDocument, {
      cache: 'no-cache',
    });

    if (!me) {
      throw new UserMeError('saleor me not found');
    }

    const user = await executeQuery((queryRunner) =>
      queryRunner.manager.findOne(User, {
        where: { id: me.id },
        relations: this.meRelations,
      })
    );

    if (!user) {
      throw new UserMeError('database me not found');
    }

    return Object.freeze({ ...user, ...me });
  }
  async meFullsize() {
    const { me } = await executeGraphQL(GetCurrentUserFullSizeDocument, {
      cache: 'no-cache',
    });

    if (!me) {
      throw new UserMeError('saleor me not found');
    }

    const user = await executeQuery((queryRunner) =>
      queryRunner.manager.findOne(User, {
        where: { id: me.id },
        relations: this.meRelations,
      })
    );

    if (!user) {
      throw new UserMeError('database me not found');
    }

    return Object.freeze({ ...user, ...me });
  }
  async getById(id: string) {
    const { user } = await executeGraphQL(FindUserDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id },
    });

    if (!user) {
      throw new UserNotFoundError('not found in saleor');
    }

    const model = await executeQuery((queryRunner) =>
      queryRunner.manager.findOne(User, { where: { id } })
    );

    if (!model) {
      throw new UserNotFoundError('not found in database');
    }

    return { ...user, ...model };
  }
  async find(email: string) {
    const { user } = await executeGraphQL(FindUserDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { email },
    });

    if (!user) {
      throw new UserNotFoundError('not found in saleor');
    }

    const model = await executeQuery((queryRunner) =>
      queryRunner.manager.findOne(User, { where: { id: user.id } })
    );

    if (!model) {
      throw new UserNotFoundError('not found in database');
    }

    return { ...user, ...model };
  }
  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isDeliveryUsAsBillingAddress: boolean,
    phone: { code: string; value: string },
    whatsapp?: { code: string; value: string }
  ) {
    const saleorUser = await findOrCreateSaleorUser(firstName, lastName, email, password);

    const user = await executeQuery(async (queryRunner) => {
      const user = queryRunner.manager.create(User, {
        id: saleorUser.id,
        phone,
        whatsapp,
        isDeliveryUsAsBillingAddress,
      });
      await queryRunner.manager.save(user);
      return user;
    });

    return { ...saleorUser, ...user };
  }
  async findOrCreate(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isDeliveryUsAsBillingAddress: boolean,
    phone: { code: string; value: string },
    whatsapp?: { code: string; value: string }
  ) {
    try {
      const user = await this.find(email);
      await executeQuery(async (queryRunner) =>
        queryRunner.manager.update(User, user.id, { isDeliveryUsAsBillingAddress })
      );
      user.isDeliveryUsAsBillingAddress = isDeliveryUsAsBillingAddress;
      return user;
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return await this.create(
          firstName,
          lastName,
          email,
          password,
          isDeliveryUsAsBillingAddress,
          phone,
          whatsapp
        );
      } else {
        throw e;
      }
    }
  }
  async assignDefaultAddress(id: string, deliveryAddressId: string, billingAddressId: string) {
    const { shippingAddressSetDefault, billingAddressSetDefault } = await executeGraphQL(
      SetDefaultAddressDocument,
      {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          id,
          shippingAddressId: deliveryAddressId,
          billingAddressId: billingAddressId,
        },
      }
    );

    if (!shippingAddressSetDefault || shippingAddressSetDefault.errors.length > 0) {
      throw new UserAssignAddressError();
    }

    if (!billingAddressSetDefault || billingAddressSetDefault.errors.length > 0) {
      throw new UserAssignAddressError();
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
    const { addressCreate: shippingAddressCreate } = await executeGraphQL(CreateAddressDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id,
        firstName: deliveryAddress.firstName,
        lastName: deliveryAddress.lastName,
        streetAddress1: deliveryAddress.streetAddress1,
        streetAddress2: deliveryAddress.streetAddress2,
        city: deliveryAddress.district,
        countryArea: deliveryAddress.region,
        country: CountryCode.Hk,
      },
    });

    if (!shippingAddressCreate || shippingAddressCreate.errors.length > 0) {
      throw new UserUpdateAddressError();
    }

    if (!billingAddress) {
      return this.assignDefaultAddress(
        id,
        shippingAddressCreate.address!.id,
        shippingAddressCreate.address!.id
      );
    }

    const { addressCreate: billingAddressCreate } = await executeGraphQL(CreateAddressDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id,
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        streetAddress1: billingAddress.streetAddress1,
        streetAddress2: billingAddress.streetAddress2,
        city: billingAddress.district,
        countryArea: billingAddress.region,
        country: CountryCode.Hk,
      },
    });

    if (!billingAddressCreate || billingAddressCreate.errors.length > 0) {
      throw new UserUpdateAddressError();
    }

    return this.assignDefaultAddress(
      id,
      shippingAddressCreate.address!.id,
      billingAddressCreate.address!.id
    );
  }
  async attachStripe(id: string) {
    const user = await this.find(id);
    if (!user.stripe) {
      const { default: stripeClient } = await import('@/clients/stripe');
      const cus = await stripeClient.createCustomer({ email: user.email });
      await executeQuery(async (queryRunner) => {
        await queryRunner.manager.update(User, id, { stripe: cus.id });
      });
    }
  }
  async attachStripePaymentMethod(id: string, paymentMethodId: string) {
    await executeQuery(async (queryRunner) => {
      await queryRunner.manager.update(User, id, { stripePaymentMethod: paymentMethodId });
    });
  }
}

const userService = new UserService();

export default userService;
