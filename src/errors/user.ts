import SaleorError from './SaleorError';

export class UserMeError extends Error {}
export class UserNotFoundError extends Error {}
export class UserCreateError extends SaleorError {}
export class UserCreateAddressError extends SaleorError {}
export class UserAssignAddressError extends SaleorError {}
export class UserUpdateAddressError extends SaleorError {}
export class UserSelfUpdateAddressError extends SaleorError {}
