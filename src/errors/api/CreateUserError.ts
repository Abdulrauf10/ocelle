import APIError from './APIError';

import { RegisterAccountMutation } from '@/gql/graphql';

export default class CreateUserError extends APIError<RegisterAccountMutation['accountRegister']> {
  constructor(mutation: RegisterAccountMutation['accountRegister']) {
    super('failed to create user', mutation);
  }
}
