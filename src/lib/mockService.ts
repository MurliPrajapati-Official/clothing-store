import { Product, Review, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS } from './mockData';

const PRODUCTS_STORAGE_KEY = 'clothing_store_mock_products';
const REVIEWS_STORAGE_KEY = 'clothing_store_mock_reviews';
const ORDERS_STORAGE_KEY = 'clothing_store_mock_orders';

// Helper to initialize and retrieve from localStorage
const getStoredData = <T>(key: string, defaultVal: T): T => {
  try {
    if (typeof window === 'undefined') return defaultVal;
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
};

const setStoredData = <T>(key: string, data: T) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
};

// --- Product Service ---
export const mockProductService = {
  getProducts: async (): Promise<Product[]> => {
    return getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const found = products.find((p) => p.slug === slug);
    return found || null;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const found = products.find((p) => p.id === id);
    return found || null;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    return products.filter((p) => p.isFeatured || p.rating >= 4.8).slice(0, 8);
  },

  getNewArrivals: async (): Promise<Product[]> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    return products.filter((p) => p.isNewArrival).slice(0, 8);
  },

  getRelatedProducts: async (productId: string, category?: string): Promise<Product[]> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const target = products.find((p) => p.id === productId);
    const cat = category || target?.category;
    
    return products
      .filter((p) => p.id !== productId && (!cat || p.category === cat || p.gender === target?.gender))
      .slice(0, 4);
  },

  getCategories: async (): Promise<string[]> => {
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }
};

// --- Review Service ---
export const mockReviewService = {
  getReviews: async (productId: string, page = 1, limit = 5): Promise<{
    reviews: Review[];
    total: number;
    hasMore: boolean;
    averageRating: number;
  }> => {
    const allReviews = getStoredData<Record<string, Review[]>>(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
    const productReviews = allReviews[productId] || [];

    const start = (page - 1) * limit;
    const paginated = productReviews.slice(start, start + limit);
    const total = productReviews.length;
    const hasMore = start + limit < total;

    const averageRating = total > 0 
      ? Number((productReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1))
      : 5.0;

    return {
      reviews: paginated,
      total,
      hasMore,
      averageRating
    };
  },

  addReview: async (reviewData: {
    productId: string;
    userName: string;
    userId: string | null;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const allReviews = getStoredData<Record<string, Review[]>>(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
    const list = allReviews[reviewData.productId] || [];

    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      product_id: reviewData.productId,
      user_name: reviewData.userName,
      user_id: reviewData.userId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      created_at: new Date().toISOString(),
      verifiedPurchase: true
    };

    const updatedList = [newReview, ...list];
    allReviews[reviewData.productId] = updatedList;
    setStoredData(REVIEWS_STORAGE_KEY, allReviews);

    // Update product stats
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === reviewData.productId);
    if (idx > -1) {
      const avg = Number((updatedList.reduce((acc, r) => acc + r.rating, 0) / updatedList.length).toFixed(1));
      products[idx].rating = avg;
      products[idx].reviewsCount = updatedList.length;
      setStoredData(PRODUCTS_STORAGE_KEY, products);
    }

    return newReview;
  },

  deleteReview: async (productId: string, reviewId: string): Promise<boolean> => {
    const allReviews = getStoredData<Record<string, Review[]>>(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
    if (!allReviews[productId]) return false;

    allReviews[productId] = allReviews[productId].filter((r) => r.id !== reviewId);
    setStoredData(REVIEWS_STORAGE_KEY, allReviews);

    // Update product stats
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === productId);
    if (idx > -1) {
      const list = allReviews[productId];
      const avg = list.length > 0
        ? Number((list.reduce((acc, r) => acc + r.rating, 0) / list.length).toFixed(1))
        : 5.0;
      products[idx].rating = avg;
      products[idx].reviewsCount = list.length;
      setStoredData(PRODUCTS_STORAGE_KEY, products);
    }

    return true;
  }
};

// --- Order Service ---
export const mockOrderService = {
  getOrders: async (userId?: string, email?: string): Promise<Order[]> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    if (userId || email) {
      return orders.filter(o => 
        (userId && o.user_id === userId) || 
        (email && o.user_email?.toLowerCase() === email.toLowerCase()) ||
        o.user_id === 'usr-demo-1' // Show sample demo orders
      );
    }
    return orders;
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    return orders.find((o) => o.id === orderId) || null;
  },

  createOrder: async (orderData: {
    user_id?: string | null;
    user_email?: string;
    total_amount: number;
    shipping_address: string;
    payment_method?: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      size: string;
      color?: string | null;
    }>;
  }): Promise<{ orderId: string; order: Order }> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const products = getStoredData<Product[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomSuffix}`;

    const enrichedItems = orderData.items.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        id: 'oi-' + Math.random().toString(36).substring(2, 7),
        productId: item.productId,
        name: prod?.name || 'Clothing Item',
        image: prod?.images?.[0] || '',
        quantity: item.quantity,
        price: item.price,
        price_at_time: item.price,
        size: item.size,
        color: item.color,
        products: prod ? {
          name: prod.name,
          images: prod.images,
          price: prod.price
        } : undefined
      };
    });

    const newOrder: Order = {
      id: orderId,
      user_id: orderData.user_id || 'usr-demo-1',
      user_email: orderData.user_email || 'demo@clothingstore.com',
      total_amount: Math.round(orderData.total_amount),
      status: 'processing',
      shipping_address: orderData.shipping_address,
      payment_method: orderData.payment_method || 'Online Card / UPI',
      tracking_number: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      estimated_delivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      items: enrichedItems,
      order_items: enrichedItems
    };

    const updatedOrders = [newOrder, ...orders];
    setStoredData(ORDERS_STORAGE_KEY, updatedOrders);

    return { orderId, order: newOrder };
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<boolean> => {
    const orders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;

    orders[idx].status = 'cancelled';
    if (reason) orders[idx].cancellation_reason = reason;
    setStoredData(ORDERS_STORAGE_KEY, orders);
    return true;
  }
};
