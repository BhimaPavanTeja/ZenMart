export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    categories: string[];
    priceRange: [number, number];
    brands: string[];
  };
  shoppingHistory: {
    productId: string;
    purchaseDate: string;
    rating?: number;
  }[];
  aiInsights: {
    recommendedCategories: string[];
    shoppingPatterns: string[];
    goals: string[];
  };
}

export interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    products?: Product[];
    actions?: string[];
  };
}

export interface ARScanResult {
  productId?: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}