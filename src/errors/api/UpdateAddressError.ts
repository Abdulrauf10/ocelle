import APIError from './APIError';

import {
  CreateAddressMutation,
  SetDefaultAddressMutation,
  UpdateDraftOrderMutation,
} from '@/gql/graphql';

type T =
  | CreateAddressMutation['addressCreate']
  | SetDefaultAddressMutation['billingAddressSetDefault']
  | SetDefaultAddressMutation['shippingAddressSetDefault']
  | UpdateDraftOrderMutation['draftOrderUpdate'];

export default class UpdateAddressError extends APIError<T> {
  constructor(mutation: T) {
    super('failed to update the address', mutation);
  }
}
