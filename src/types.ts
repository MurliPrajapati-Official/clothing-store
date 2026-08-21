/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subCategory?: string;
  schoolId?: string; // Backwards compatibility for any leftover references
  images: string[];
  sizes: string[];
  colors?: { name: string; hex: string; image?: string }[];
  color_images?: Record<string, string[]>;
  colorImages?: Record<string, string[]>;
  gender: 'men' | 'women' | 'unisex' | 'boys' | 'girls';
  grade?: string;
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewsCount: number;
  specifications?: Record<string, string>;
  materials?: string;
  fit?: string;
  care?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface School {
  id: string;
  name: string;
  slug: string;
  logo: string;
  location: string;
  description: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  user_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
  verifiedPurchase?: boolean;
}

export interface OrderItem {
  id?: string;
  productId: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  price_at_time?: number;
  size: string;
  color?: string | null;
  products?: {
    name: string;
    images: string[];
    price: number;
  };
}

export interface Order {
  id: string;
  user_id: string | null;
  user_email?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
  order_items?: OrderItem[];
  tracking_number?: string;
  estimated_delivery?: string;
  payment_method?: string;
  cancellation_reason?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  organization?: string;
  created_at: string;
  avatar_url?: string;
}
