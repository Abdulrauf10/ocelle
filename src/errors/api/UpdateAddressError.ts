import { UpdateCheckoutAddressMutation } from '@/gql/graphql';
import APIError from './APIError';

type T =
  | UpdateCheckoutAddressMutation['checkoutShippingAddressUpdate']
  | UpdateCheckoutAddressMutation['checkoutBillingAddressUpdate'];

export default class UpdateAddressError extends APIError<T> {
  constructor(mutation: T) {
    super('failed to update the address', mutation);
  }
}
