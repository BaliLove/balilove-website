"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'AUD' | 'EUR' | 'GBP' | 'IDR';

interface PricingInputs {
  adults: number;
  children: number;
  nights?: number;
  selectedDate?: string;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  pricingInputs: PricingInputs;
  updatePricingInputs: (inputs: Partial<PricingInputs>) => void;
  convertPrice: (idrAmount: number) => number;
  formatPrice: (amount: number, showCurrency?: boolean) => string;
}

// Exchange rates (will be made dynamic later)
const EXCHANGE_RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 0.0000625,  // 1 IDR = 0.0000625 USD
  AUD: 0.0000928,  // 1 IDR = 0.0000928 AUD  
  EUR: 0.0000578,  // 1 IDR = 0.0000578 EUR
  GBP: 0.0000493,  // 1 IDR = 0.0000493 GBP
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  IDR: 'Rp',
  USD: '$',
  AUD: 'A$', 
  EUR: '€',
  GBP: '£',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [pricingInputs, setPricingInputs] = useState<PricingInputs>({
    adults: 50,
    children: 0,
    nights: 3,
  });

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('bali-love-currency') as Currency;
      const savedInputs = localStorage.getItem('bali-love-pricing-inputs');
      
      if (savedCurrency && ['USD', 'AUD', 'EUR', 'GBP', 'IDR'].includes(savedCurrency)) {
        setSelectedCurrency(savedCurrency);
      }
      
      if (savedInputs) {
        try {
          const parsedInputs = JSON.parse(savedInputs);
          setPricingInputs(prev => ({ ...prev, ...parsedInputs }));
        } catch (e) {
          console.warn('Failed to parse saved pricing inputs');
        }
      }
    }
  }, []);

  // Save to localStorage when changed
  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bali-love-currency', currency);
    }
  };

  const updatePricingInputs = (inputs: Partial<PricingInputs>) => {
    const newInputs = { ...pricingInputs, ...inputs };
    setPricingInputs(newInputs);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('bali-love-pricing-inputs', JSON.stringify(newInputs));
    }
  };

  const convertPrice = (idrAmount: number): number => {
    return idrAmount * EXCHANGE_RATES[selectedCurrency];
  };

  const formatPrice = (amount: number, showCurrency = true): string => {
    const converted = convertPrice(amount);
    const symbol = showCurrency ? CURRENCY_SYMBOLS[selectedCurrency] : '';
    
    if (selectedCurrency === 'IDR') {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    } else {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setCurrency,
        pricingInputs,
        updatePricingInputs,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}