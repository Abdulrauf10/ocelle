import { CountryCode } from '@/gql/graphql';

export interface UpdateCheckoutDataAction {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp?: { code: string; value: string };
  receiveNews?: boolean;
  isSameBillingAddress?: boolean;
  deliveryDate: Date;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
    country: CountryCode;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    streetAddress2: string;
    district: string;
    region: string;
    country: CountryCode;
    postalCode?: string;
  };
}
