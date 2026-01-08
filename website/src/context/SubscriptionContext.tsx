import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
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
  supabase: SupabaseClient | null;
}

// Types for subscription data
interface SubscriptionData {
  status: string;
  plan: string;
  expiresAt?: string | null;
}

// Cache data structure
interface SubscriptionCacheData {
  data: SubscriptionData;
  userId: string;
  timestamp: number;
}

// Coupon validation response
interface CouponValidationResponse {
  valid: boolean;
  error?: string;
  discount?: number;
  discountType?: string;
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

// Context value type
interface SubscriptionContextValue {
  subscription: SubscriptionData | null;
  isPremium: () => boolean;
  isInitialized: boolean;
  isSignedIn: boolean;
  fetchPremiumContent: (articleId: string) => Promise<string>;
  validateCoupon: (code: string) => Promise<CouponValidationResponse>;
  initiatePayment: (couponCode?: string | null) => Promise<PaymentResult>;
  refreshSubscription: () => Promise<void>;
}

// Props for provider component
interface SubscriptionProviderProps {
  children: ReactNode;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

// Session storage key for subscription caching
const SUBSCRIPTION_CACHE_KEY = 'cf_subscription_cache';
const SUBSCRIPTION_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper to get cached subscription from sessionStorage
const getCachedSubscription = (userId: string): SubscriptionData | null => {
  try {
    const cached = sessionStorage.getItem(SUBSCRIPTION_CACHE_KEY);
    if (!cached) return null;

    const { data, userId: cachedUserId, timestamp }: SubscriptionCacheData = JSON.parse(cached);

    // Validate cache: same user and not expired
    if (cachedUserId === userId && Date.now() - timestamp < SUBSCRIPTION_CACHE_TTL) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
};

// Helper to set subscription cache
const setCachedSubscription = (userId: string, data: SubscriptionData): void => {
  try {
    sessionStorage.setItem(SUBSCRIPTION_CACHE_KEY, JSON.stringify({
      data,
      userId,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore storage errors
  }
};

export const useSubscription = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user, isSignedIn, isLoaded, getAccessToken, supabase } = useAuth() as AuthContextValue;
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Premium content cache (in-memory for session)
  const premiumContentCache = useRef<Map<string, string>>(new Map());

  // Load subscription from Supabase profiles table (with caching)
  useEffect(() => {
    if (!isLoaded) return;

    const loadSubscription = async () => {
      if (isSignedIn && user && supabase) {
        // Check cache first
        const cachedSub = getCachedSubscription(user.id);
        if (cachedSub) {
          setSubscription(cachedSub);
          setIsInitialized(true);
          return;
        }

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan, subscription_expires_at')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading subscription:', error);
          }

          const subData: SubscriptionData = profile
            ? {
                status: profile.subscription_status || 'free',
                plan: profile.subscription_plan || 'free',
                expiresAt: profile.subscription_expires_at,
              }
            : { status: 'free', plan: 'free' };

          setSubscription(subData);
          // Cache the subscription
          setCachedSubscription(user.id, subData);
        } catch (error) {
          console.error('Error loading subscription:', error);
          setSubscription({ status: 'free', plan: 'free' });
        }
      } else {
        setSubscription({ status: 'free', plan: 'free' });
      }
      setIsInitialized(true);
    };

    loadSubscription();
  }, [isLoaded, isSignedIn, user, supabase]);

  // Check if user has premium access
  const isPremium = useCallback((): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;

    // Check expiry for non-lifetime plans
    if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
      return false;
    }

    return true;
  }, [subscription]);

  // Fetch premium content from API (with client-side caching)
  const fetchPremiumContent = useCallback(async (articleId: string): Promise<string> => {
    if (!isSignedIn) {
      throw new Error('Authentication required');
    }

    if (!isPremium()) {
      throw new Error('Premium subscription required');
    }

    // Check in-memory cache first
    if (premiumContentCache.current.has(articleId)) {
      return premiumContentCache.current.get(articleId)!;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(`/api/premium-content?articleId=${encodeURIComponent(articleId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch content');
      }

      const data = await response.json();

      // Cache the content in memory
      premiumContentCache.current.set(articleId, data.content);

      return data.content;
    } catch (error) {
      console.error('Error fetching premium content:', error);
      throw error;
    }
  }, [isSignedIn, getAccessToken, isPremium]);

  // Validate coupon code
  const validateCoupon = useCallback(async (code: string): Promise<CouponValidationResponse> => {
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, error: 'Failed to validate coupon' };
    }
  }, []);

  // Create Razorpay order
  const createOrder = useCallback(async (couponCode: string | null = null): Promise<OrderResponse> => {
    if (!isSignedIn) {
      throw new Error('Please sign in to purchase');
    }

    try {
      const token = await getAccessToken();
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [isSignedIn, getAccessToken]);

  // Initiate Razorpay payment
  const initiatePayment = useCallback(async (couponCode: string | null = null): Promise<PaymentResult> => {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const orderData = await createOrder(couponCode);

    return new Promise((resolve, reject) => {
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CrackFrontend',
        description: 'Lifetime Premium Access',
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
  }, [createOrder]);

  // Refresh subscription status (after payment) - also updates cache
  const refreshSubscription = useCallback(async (): Promise<void> => {
    if (user && supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan, subscription_expires_at')
        .eq('id', user.id)
        .single();

      if (profile) {
        const subData: SubscriptionData = {
          status: profile.subscription_status || 'free',
          plan: profile.subscription_plan || 'free',
          expiresAt: profile.subscription_expires_at,
        };
        setSubscription(subData);
        // Update the cache with fresh data
        setCachedSubscription(user.id, subData);
      }
    }
  }, [user, supabase]);

  const value: SubscriptionContextValue = {
    subscription,
    isPremium,
    isInitialized,
    isSignedIn,
    fetchPremiumContent,
    validateCoupon,
    initiatePayment,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
