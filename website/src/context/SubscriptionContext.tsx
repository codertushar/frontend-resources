'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// User type from AuthContext
interface AuthUser {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}

// Type for AuthContext return value (since AuthContext is still JS)
interface AuthContextValue {
  user: AuthUser | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  getAccessToken: () => Promise<string | null>;
}

// Order creation response
interface OrderResponse {
  keyId: string;
  amount: number;
  currency: string;
  orderId: string;
  user: {
    name: string;
    email: string;
  };
}

// Payment result
interface PaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  signature: string;
}

// Razorpay types
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    description: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  on: (event: string, handler: (response: RazorpayError) => void) => void;
  open: () => void;
}

// Extend Window to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let razorpayScriptPromise: Promise<void> | null = null;

// Load the Razorpay checkout SDK on demand, so it is only fetched when a user
// actually initiates a donation instead of on every page load.
const loadRazorpayScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null; // allow retry on next attempt
      reject(new Error('Failed to load Razorpay SDK'));
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

// Context value type - donation-only model
interface SubscriptionContextValue {
  isSignedIn: boolean;
  initiateDonation: (amount: number) => Promise<PaymentResult>;
}

// Props for provider component
interface SubscriptionProviderProps {
  children: ReactNode;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const useSubscription = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { isSignedIn, getAccessToken } = useAuth() as AuthContextValue;

  // Create Razorpay order for donation
  const createDonationOrder = useCallback(async (amount: number): Promise<OrderResponse> => {
    if (!isSignedIn) {
      throw new Error('Please sign in to donate');
    }

    try {
      const token = await getAccessToken();
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to create donation order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating donation order:', error);
      throw error;
    }
  }, [isSignedIn, getAccessToken]);

  // Initiate Razorpay payment for donation
  const initiateDonation = useCallback(async (amount: number): Promise<PaymentResult> => {
    // Load the Razorpay SDK on demand so it doesn't ship on every page
    await loadRazorpayScript();
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const orderData = await createDonationOrder(amount);

    return new Promise((resolve, reject) => {
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CrackFrontend',
        description: 'Voluntary Donation - Support Our Work',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
        },
        theme: {
          color: '#8b5cf6',
        },
        handler: function (response: RazorpayResponse) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: RazorpayError) {
        reject(new Error(response.error.description || 'Payment failed'));
      });
      razorpay.open();
    });
  }, [createDonationOrder]);

  const value: SubscriptionContextValue = {
    isSignedIn,
    initiateDonation,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
