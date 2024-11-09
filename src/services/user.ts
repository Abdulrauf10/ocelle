import { headers } from 'next/headers';
import randomstring from 'randomstring';
import { FindOneOptions } from 'typeorm';

import orderService from './order';

import stripeClient from '@/clients/stripe';
import { Order, User } from '@/entities';
import {
  UserAssignAddressError,
  UserCreateAddressError,
  UserCreateError,
  UserMeError,
  UserNotFoundError,
  UserUpdateError,
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
  UpdateUserDocument,
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
    console.error(firstName, lastName, email, password);
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
  async orders() {
    const me = await this.me();

    const orders = await executeQuery(async (queryRunner) =>
      queryRunner.manager.find(Order, {
        where: {
          user: { id: me.id },
        },
        relations: {
          boxs: {
            shipment: true,
          },
        },
      })
    );

    // find all subscription orders
    const saleorOrders = await orderService.find({
      filter: {
        ids: orders.map((order) => order.id),
      },
    });

    if (saleorOrders.length !== orders.length) {
      throw new Error('order length not match');
    }

    return orders.map((order) => {
      const _order = saleorOrders.find((x) => x.id === order.id)!;
      return {
        order: _order,
        shipment: order.boxs[0].shipment,
      };
    });
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
      let referralCode = randomstring.generate({
        length: 6,
        charset: 'alphanumeric',
      });
      while (true) {
        if (!(await queryRunner.manager.findOne(User, { where: { referralCode } }))) {
          break;
        }
        referralCode = randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
        });
      }
      const user = queryRunner.manager.create(User, {
        id: saleorUser.id,
        phone,
        whatsapp,
        isDeliveryUsAsBillingAddress,
        referralCode,
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
  async update(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: { code: string; value: string },
    whatsapp?: { code: string; value: string }
  ) {
    const { customerUpdate } = await executeGraphQL(UpdateUserDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id, firstName, lastName, email },
    });

    if (!customerUpdate || customerUpdate.errors.length > 0) {
      throw new UserUpdateError(customerUpdate?.errors);
    }

    await executeQuery(async (queryRunner) => {
      await queryRunner.manager.update(User, id, { phone, whatsapp });
    });
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
      return cus.id;
    }
    return user.stripe;
  }
  async attachStripePaymentMethod(id: string, paymentMethodId: string) {
    await executeQuery(async (queryRunner) => {
      await queryRunner.manager.update(User, id, { stripePaymentMethod: paymentMethodId });
    });
  }
  async coupons() {
    //
  }
}

const userService = new UserService();

export default userService;
