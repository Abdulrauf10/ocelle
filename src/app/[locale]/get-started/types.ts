export interface Address {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
}

export interface HandleMutateDraftOrderAction {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: {
    code: string;
    value: string;
  };
  whatsapp?: {
    code: string;
    value: string;
  };
  receiveNews?: boolean;
  isSameBillingAddress?: boolean;
  deliveryDate: Date;
  tnc: boolean;
  deliveryAddress: Address;
  billingAddress?: Address;
}
