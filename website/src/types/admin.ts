// Admin panel types

export interface Coupon {
  id: string;
  code: string;
  discount_amount: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface NewCoupon {
  code: string;
  discountAmount: string;
  description: string;
}

export interface Settings {
  base_price: string;
  [key: string]: string;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface Stats {
  totalArticles: number;
  freeArticles: number;
  activeCoupons: number;
  totalCoupons: number;
}

export type AdminTab = 'coupons' | 'settings' | 'notifications' | 'stats';
