import APIError from './APIError';

import { UpdateCheckoutAddressMutation } from '@/gql/graphql';

type T =
  | UpdateCheckoutAddressMutation['checkoutShippingAddressUpdate']
  | UpdateCheckoutAddressMutation['checkoutBillingAddressUpdate'];

export default class UpdateAddressError extends APIError<T> {
  constructor(mutation: T) {
    super('failed to update the address', mutation);
  }
}
