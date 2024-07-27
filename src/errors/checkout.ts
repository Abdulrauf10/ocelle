import SaleorError from './SaleorError';

export class CheckoutCreateError extends Error {}
export class CheckoutNotFoundError extends Error {}
export class CheckoutInitialTransactionError extends SaleorError {}
export class CheckoutAppendLineError extends Error {}
export class CheckoutUpdateLineError extends Error {}
export class CheckoutDeleteLineError extends Error {}
export class CheckoutSetCouponError extends Error {}
export class CheckoutNotLinkedEmailError extends Error {}
export class CheckoutCompleteError extends Error {}
export class CheckoutUpdateEmailError extends Error {}
export class CheckoutUpdateAddressError extends Error {}
export class CheckoutUpdateShippingMethodError extends Error {}
