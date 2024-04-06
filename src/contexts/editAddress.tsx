'use client';

import React from 'react';

interface EditAddressContextProps {
  isDeliveryUsAsBillingAddress: boolean;
  setIsDeliveryUsAsBillingAddress(value: boolean): void;
}

const EditAddressContext = React.createContext<EditAddressContextProps | undefined>(undefined);

export function EditAddressProvider({
  initialIsDeliveryUsAsBillingAddress,
  children,
}: React.PropsWithChildren<{ initialIsDeliveryUsAsBillingAddress: boolean }>) {
  const [isDeliveryUsAsBillingAddress, setIsDeliveryUsAsBillingAddress] = React.useState<boolean>(
    initialIsDeliveryUsAsBillingAddress
  );

  const values = React.useMemo(() => {
    return {
      isDeliveryUsAsBillingAddress,
      setIsDeliveryUsAsBillingAddress,
    };
  }, [isDeliveryUsAsBillingAddress, setIsDeliveryUsAsBillingAddress]);

  return <EditAddressContext.Provider value={values}>{children}</EditAddressContext.Provider>;
}

export function useEditAddress() {
  const context = React.useContext(EditAddressContext);
  if (context === undefined) {
    throw new Error('useEditAddress must be used within a EditAddressContext');
  }
  return context;
}
