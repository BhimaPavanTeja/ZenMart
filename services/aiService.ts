import { User, Product, AIAssistantMessage } from '@/types';
import { StorageUtils } from '@/utils/storage';

export class AIService {
  private static instance: AIService;
  private userBehavior: {
    views: Map<string, number>;
    searches: string[];
    purchases: string[];
    timeSpent: Map<string, number>;
  } = {
    views: new Map(),
    searches: [],
    purchases: [],
    timeSpent: new Map(),
  };

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Track user behavior
  trackProductView(productId: string, timeSpent: number = 0): void {
    const currentViews = this.userBehavior.views.get(productId) || 0;
    this.userBehavior.views.set(productId, currentViews + 1);
    
    if (timeSpent > 0) {
      const currentTime = this.userBehavior.timeSpent.get(productId) || 0;
      this.userBehavior.timeSpent.set(productId, currentTime + timeSpent);
    }
  }

  trackSearch(query: string): void {
    this.userBehavior.searches.push(query.toLowerCase());
    // Keep only last 50 searches
    if (this.userBehavior.searches.length > 50) {
      this.userBehavior.searches = this.userBehavior.searches.slice(-50);
    }
  }

  trackPurchase(productId: string): void {
    this.userBehavior.purchases.push(productId);
  }

  // Generate recommendations based on user behavior
  getPersonalizedRecommendations(products: Product[], limit: number = 5): Product[] {
    const recommendations: Array<{ product: Product; score: number }> = [];

    products.forEach(product => {
      let score = 0;

      // Factor in view count
      const views = this.userBehavior.views.get(product.id) || 0;
      score += views * 2;

      // Factor in time spent
      const timeSpent = this.userBehavior.timeSpent.get(product.id) || 0;
      score += timeSpent / 1000; // Convert ms to seconds

      // Factor in search relevance
      const searchRelevance = this.userBehavior.searches.some(search =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.tags.some(tag => tag.toLowerCase().includes(search))
      );
      if (searchRelevance) score += 5;

      // Factor in rating and reviews
      score += product.rating * 2;
      score += Math.log(product.reviews + 1);

      recommendations.push({ product, score });
    });

    // Sort by score and return top products
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  }

  // AI Assistant chat functionality
  async processMessage(message: string, products: Product[]): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Handle electronics under price requests
    if (lowerMessage.includes('electronics') && (lowerMessage.includes('under') || lowerMessage.includes('<')) && lowerMessage.includes('$')) {
      const priceMatch = message.match(/\$(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        const electronics = products.filter(p => 
          p.category.toLowerCase() === 'electronics' && p.price <= maxPrice
        );
        
        if (electronics.length > 0) {
          const productList = electronics.map(p => 
            `• ${p.name} - $${p.price.toFixed(2)} (${p.brand})`
          ).join('\n');
          return `Here are electronics under $${maxPrice}:\n\n${productList}\n\nTap any product name to view details!`;
        } else {
          return `Sorry, I couldn't find any electronics under $${maxPrice}. Try increasing your budget or check our other categories.`;
        }
      }
    }

    // Simple intent detection
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      const recommendations = this.getPersonalizedRecommendations(products, 3);
      if (recommendations.length > 0) {
        const productNames = recommendations.map(p => p.name).join(', ');
        return `Based on your preferences, I recommend: ${productNames}. Would you like to see details for any of these?`;
      }
      return "I'd be happy to recommend products! Could you tell me what category you're interested in?";
    }

    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      this.trackSearch(message);
      return "I'll help you search for products. What are you looking for?";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('budget')) {
      return "I can help you find products within your budget. What's your price range?";
    }

    if (lowerMessage.includes('compare')) {
      return "I can help you compare products. Which items would you like to compare?";
    }

    if (lowerMessage.includes('cart') || lowerMessage.includes('checkout')) {
      const cart = await StorageUtils.getCart();
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      return `You have ${itemCount} items in your cart. Would you like to proceed to checkout or continue shopping?`;
    }

    // Default response
    return "I'm here to help you find the perfect products! You can ask me for recommendations, search for specific items, compare products, or get help with your cart.";
  }

  // Analyze user shopping patterns
  analyzeShoppingPatterns(): {
    favoriteCategories: string[];
    averageSpendingRange: string;
    shoppingFrequency: string;
    preferredBrands: string[];
  } {
    // This would normally use more sophisticated analysis
    return {
      favoriteCategories: ['Electronics', 'Clothing'],
      averageSpendingRange: '$50-$200',
      shoppingFrequency: 'Weekly',
      preferredBrands: ['TechPro', 'EcoWear'],
    };
  }

  // Learn user goals and preferences
  updateUserGoals(goals: string[]): void {
    // This would normally update the AI model with user goals
    console.log('Updated user goals:', goals);
  }
}