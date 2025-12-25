import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  // Check if Clerk is available
  let user, isLoaded, isSignedIn, getToken;
  try {
    const clerkUser = useUser();
    const clerkAuth = useAuth();
    user = clerkUser.user;
    isLoaded = clerkUser.isLoaded;
    isSignedIn = clerkUser.isSignedIn;
    getToken = clerkAuth.getToken;
  } catch (error) {
    // Clerk is not configured
    user = null;
    isLoaded = true;
    isSignedIn = false;
    getToken = null;
  }

  const [subscription, setSubscription] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load subscription from Clerk publicMetadata
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const sub = user.publicMetadata?.subscription;
      setSubscription(sub || { status: 'free', plan: 'free' });
    } else {
      setSubscription({ status: 'free', plan: 'free' });
    }
    setIsInitialized(true);
  }, [isLoaded, isSignedIn, user]);

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
    if (!isSignedIn || !getToken) {
      throw new Error('Authentication required');
    }

    if (!isPremium()) {
      throw new Error('Premium subscription required');
    }

    try {
      const token = await getToken();
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
  }, [isSignedIn, getToken, isPremium]);

  // Create Razorpay order
  const createOrder = useCallback(async () => {
    if (!isSignedIn || !getToken) {
      throw new Error('Please sign in to purchase');
    }

    try {
      const token = await getToken();
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [isSignedIn, getToken]);

  // Initiate Razorpay payment
  const initiatePayment = useCallback(async () => {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const orderData = await createOrder();

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
          // Payment successful
          // The webhook will update Clerk metadata
          // Refresh user to get updated metadata
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
    if (user) {
      // Force reload user data
      await user.reload();
      const sub = user.publicMetadata?.subscription;
      setSubscription(sub || { status: 'free', plan: 'free' });
    }
  }, [user]);

  const value = {
    subscription,
    isPremium,
    isInitialized,
    isSignedIn,
    fetchPremiumContent,
    initiatePayment,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
