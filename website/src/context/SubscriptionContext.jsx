import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded, getAccessToken, supabase } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load subscription from Supabase profiles table
  useEffect(() => {
    if (!isLoaded) return;

    const loadSubscription = async () => {
      if (isSignedIn && user && supabase) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan, subscription_expires_at')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading subscription:', error);
          }

          if (profile) {
            setSubscription({
              status: profile.subscription_status || 'free',
              plan: profile.subscription_plan || 'free',
              expiresAt: profile.subscription_expires_at,
            });
          } else {
            setSubscription({ status: 'free', plan: 'free' });
          }
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
  const isPremium = useCallback(() => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;

    // Check expiry for non-lifetime plans
    if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
      return false;
    }

    return true;
  }, [subscription]);

  // Fetch premium content from API
  const fetchPremiumContent = useCallback(async (articleId) => {
    if (!isSignedIn) {
      throw new Error('Authentication required');
    }

    if (!isPremium()) {
      throw new Error('Premium subscription required');
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
      return data.content;
    } catch (error) {
      console.error('Error fetching premium content:', error);
      throw error;
    }
  }, [isSignedIn, getAccessToken, isPremium]);

  // Validate coupon code
  const validateCoupon = useCallback(async (code) => {
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
  const createOrder = useCallback(async (couponCode = null) => {
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
  const initiatePayment = useCallback(async (couponCode = null) => {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const orderData = await createOrder(couponCode);

    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Frontend Resources',
        description: 'Lifetime Premium Access',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
        },
        theme: {
          color: '#8b5cf6',
        },
        handler: function (response) {
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
      razorpay.on('payment.failed', function (response) {
        reject(new Error(response.error.description || 'Payment failed'));
      });
      razorpay.open();
    });
  }, [createOrder]);

  // Refresh subscription status (after payment)
  const refreshSubscription = useCallback(async () => {
    if (user && supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan, subscription_expires_at')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSubscription({
          status: profile.subscription_status || 'free',
          plan: profile.subscription_plan || 'free',
          expiresAt: profile.subscription_expires_at,
        });
      }
    }
  }, [user, supabase]);

  const value = {
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
