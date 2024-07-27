import { headers } from 'next/headers';
import { FindOneOptions } from 'typeorm';

import stripeClient from '@/clients/stripe';
import { User } from '@/entities';
import {
  UserAssignAddressError,
  UserCreateAddressError,
  UserCreateError,
  UserMeError,
  UserNotFoundError,
} from '@/errors/user';
import {
  CountryCode,
  CreateAddressDocument,
  FindUserDocument,
  GetCurrentUserDocument,
  GetCurrentUserFullSizeDocument,
  RegisterAccountDocument,
  SetDefaultAddressDocument,
  UpdateAddressDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';

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
    throw new UserCreateError(accountRegister?.errors);
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
  async isFirstOrderCreated(id: string) {
    const model = await executeQuery((queryRunner) =>
      queryRunner.manager.findOne(User, { where: { id }, relations: ['orders'] })
    );
    if (!model) {
      return false;
    }
    return model.orders.length > 0;
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
      throw new UserAssignAddressError(shippingAddressSetDefault?.errors);
    }

    if (!billingAddressSetDefault || billingAddressSetDefault.errors.length > 0) {
      throw new UserAssignAddressError(billingAddressSetDefault?.errors);
    }
  }
  async createAddress(
    id: string,
    address: {
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
    const { addressCreate } = await executeGraphQL(CreateAddressDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id,
        input: {
          firstName: address.firstName,
          lastName: address.lastName,
          streetAddress1: address.streetAddress1,
          streetAddress2: address.streetAddress2,
          city: address.country === CountryCode.Hk ? address.district : address.region,
          countryArea: address.country === CountryCode.Hk ? address.region : address.district,
          country: address.country,
          postalCode: address.postalCode,
          skipValidation: true,
        },
      },
    });

    if (!addressCreate || addressCreate.errors.length > 0) {
      throw new UserCreateAddressError(addressCreate?.errors);
    }

    return addressCreate.address!;
  }
  async updateAddress(
    id: string,
    address: {
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
    const { addressUpdate } = await executeGraphQL(UpdateAddressDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id,
        input: {
          firstName: address.firstName,
          lastName: address.lastName,
          streetAddress1: address.streetAddress1,
          streetAddress2: address.streetAddress2,
          city: address.country === CountryCode.Hk ? address.district : address.region,
          countryArea: address.country === CountryCode.Hk ? address.region : address.district,
          country: address.country,
          postalCode: address.postalCode,
          skipValidation: true,
        },
      },
    });

    if (!addressUpdate || addressUpdate.errors.length > 0) {
      throw new UserCreateAddressError(addressUpdate?.errors);
    }

    return addressUpdate.address!;
  }
  async updateAndSetDefaultAddress(
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
    billingAddress?: {
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
    const _shippingAddress = await this.createAddress(id, deliveryAddress);

    if (!billingAddress) {
      return this.assignDefaultAddress(id, _shippingAddress.id, _shippingAddress.id);
    }
    const _billingAddress = await this.createAddress(id, billingAddress);

    return this.assignDefaultAddress(id, _shippingAddress.id, _billingAddress.id);
  }
  async updateSelfDeliveryAddress(
    deliveryAddress: {
      firstName: string;
      lastName: string;
      streetAddress1: string;
      streetAddress2: string;
      district: string;
      region: string;
      country: CountryCode;
    },
    useAsBillingAddress: boolean
  ) {
    const { id, defaultShippingAddress, defaultBillingAddress } = await this.meFullsize();

    await this.updateAddress(defaultShippingAddress!.id, deliveryAddress);

    if (useAsBillingAddress && defaultBillingAddress?.id !== defaultShippingAddress?.id) {
      await this.assignDefaultAddress(id, defaultShippingAddress!.id, defaultShippingAddress!.id);
    } else if (defaultBillingAddress?.id === defaultShippingAddress?.id) {
      const _billingAddress = await this.createAddress(id, deliveryAddress);
      await this.assignDefaultAddress(id, defaultShippingAddress!.id, _billingAddress.id);
    }

    await executeQuery(async (queryRunner) => {
      await queryRunner.manager.update(
        User,
        { id },
        { isDeliveryUsAsBillingAddress: useAsBillingAddress }
      );
    });
  }
  async updateSelfBillingAddress(billingAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
    country: CountryCode;
    postalCode?: string;
  }) {
    const { defaultBillingAddress } = await this.meFullsize();

    await this.updateAddress(defaultBillingAddress!.id, billingAddress);
  }
  async attachStripe(id: string) {
    const user = await this.getById(id);
    if (!user.stripe) {
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
