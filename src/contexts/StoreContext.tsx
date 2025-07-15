import React, { createContext, useContext, useState } from 'react';
import { Store, StoreSettings } from '../types';

interface StoreContextType {
  store: Store;
  updateStore: (updates: Partial<Store>) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

const defaultStore: Store = {
  id: '1',
  name: 'ModernPOS Store',
  address: {
    street: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA'
  },
  phone: '(555) 123-4567',
  email: 'store@modernpos.com',
  taxRate: 0.08,
  currency: 'USD',
  timezone: 'America/Los_Angeles',
  settings: {
    autoBackup: true,
    receiptFooter: 'Thank you for your business!',
    loyaltyProgram: true,
    taxInclusive: false,
    roundingMethod: 'none',
    defaultPaymentMethod: 'card'
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store>(defaultStore);

  const updateStore = (updates: Partial<Store>) => {
    setStore(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (settings: Partial<StoreSettings>) => {
    setStore(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  return (
    <StoreContext.Provider value={{
      store,
      updateStore,
      updateSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};