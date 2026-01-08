// Subscription and payment types

export interface SubscriptionData {
  is_premium: boolean;
  subscription_type?: string;
  subscription_start?: string;
  subscription_end?: string;
}

export interface SubscriptionCacheData {
  isPremium: boolean;
  timestamp: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  discount_amount?: number;
  description?: string;
  error?: string;
}

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: RazorpayError) => void) => void;
}

export interface SubscriptionContextValue {
  isPremium: () => boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isSignedIn: boolean;
  checkSubscription: () => Promise<boolean>;
  fetchPremiumContent: (articleId: string) => Promise<string>;
  isSuperAdmin: boolean;
}

// Applied coupon for pricing page
export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  description?: string;
}
