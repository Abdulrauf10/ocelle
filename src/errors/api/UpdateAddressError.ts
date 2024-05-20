import APIError from './APIError';

import { UpdateDraftOrderMutation } from '@/gql/graphql';

type T = UpdateDraftOrderMutation['draftOrderUpdate'];

export default class UpdateAddressError extends APIError<T> {
  constructor(mutation: T) {
    super('failed to update the address', mutation);
  }
}
