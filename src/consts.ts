import { Recipe } from './enums';

export const DEFAULT_CATEGORY_SLUG = 'ocelle';
export const DEFAULT_WAREHOUSE = 'Ocelle Warehouse';
export const DEFUALT_SHIPPING_ZONE = 'Ocelle Shipping Zone';
export const SHIPPING_METHOD_SF_EXPRESS_FREE = 'SF Express (Free)';
export const SHIPPING_METHOD_SF_EXPRESS_FIXED = 'SF Express (Fixed)';
export const SHIPPING_METHOD_SF_EXPRESS_MIN_FREE = 'SF Express (Min Free)';

export const DOG_SELECT_COOKIE = 'CURRENT_DOG';
export const CART_COOKIE = 'cart';
export const ORDER_COOKIE = 'order';

export const LOGIN_PATH = '/auth/login';

export const EMAIL_REGEXP =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$/gi;

export const PHONE_REGEXP = /^[0-9]+$/;

export const PASSWORD_REGEXP = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const MAX_FILE_SIZE_MB = 5;
