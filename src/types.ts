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
  schoolId: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  color_images?: Record<string, string[]>;
  colorImages?: Record<string, string[]>;
  gender: 'boys' | 'girls' | 'unisex';
  grade: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  specifications?: Record<string, string>;
  isFeatured?: boolean;
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
