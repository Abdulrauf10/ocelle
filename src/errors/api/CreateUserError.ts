import { RegisterAccountMutation } from '@/gql/graphql';
import APIError from './APIError';

export default class CreateUserError extends APIError<RegisterAccountMutation['accountRegister']> {
  constructor(mutation: RegisterAccountMutation['accountRegister']) {
    super('failed to create user', mutation);
  }
}
