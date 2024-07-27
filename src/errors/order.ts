import SaleorError from './SaleorError';

export class OrderCreateError extends SaleorError {}
export class OrderVariantNotFoundError extends Error {}
export class OrderNotFoundError extends Error {}
export class OrderInitialTransactionError extends SaleorError {}
export class OrderCompleteError extends SaleorError {}
export class OrderUpdateError extends SaleorError {}
export class OrderAddDiscountError extends SaleorError {}
export class OrderDeleteError extends SaleorError {}
