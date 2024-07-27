import SaleorError from './SaleorError';

export class CheckoutCreateError extends SaleorError {}
export class CheckoutNotFoundError extends Error {}
export class CheckoutInitialTransactionError extends SaleorError {}
export class CheckoutAppendLineError extends SaleorError {}
export class CheckoutUpdateLineError extends SaleorError {}
export class CheckoutDeleteLineError extends SaleorError {}
export class CheckoutSetCouponError extends SaleorError {}
export class CheckoutNotLinkedEmailError extends Error {}
export class CheckoutCompleteError extends SaleorError {}
export class CheckoutUpdateEmailError extends SaleorError {}
export class CheckoutUpdateAddressError extends SaleorError {}
export class CheckoutUpdateShippingMethodError extends SaleorError {}
