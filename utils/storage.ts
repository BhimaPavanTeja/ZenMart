import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, User, AIAssistantMessage } from '@/types';

const KEYS = {
  CART: 'cart',
  USER: 'user',
  AI_MESSAGES: 'ai_messages',
  USER_PREFERENCES: 'user_preferences',
};

export const StorageUtils = {
  // Cart operations
  async getCart(): Promise<CartItem[]> {
    try {
      const cart = await AsyncStorage.getItem(KEYS.CART);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  async saveCart(cart: CartItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  async addToCart(item: CartItem): Promise<void> {
    try {
      const cart = await this.getCart();
      const existingIndex = cart.findIndex(
        (cartItem) => cartItem.product.id === item.product.id
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += item.quantity;
      } else {
        cart.push(item);
      }

      await this.saveCart(cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },

  async removeFromCart(productId: string): Promise<void> {
    try {
      const cart = await this.getCart();
      const updatedCart = cart.filter(item => item.product.id !== productId);
      await this.saveCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },

  async updateCartItemQuantity(productId: string, quantity: number): Promise<void> {
    try {
      const cart = await this.getCart();
      const itemIndex = cart.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
        }
        await this.saveCart(cart);
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  },

  // User operations
  async getUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  // AI Messages operations
  async getAIMessages(): Promise<AIAssistantMessage[]> {
    try {
      const messages = await AsyncStorage.getItem(KEYS.AI_MESSAGES);
      if (!messages) return [];
      
      const parsedMessages = JSON.parse(messages);
      // Convert timestamp strings back to Date objects
      return parsedMessages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }));
    } catch (error) {
      console.error('Error getting AI messages:', error);
      return [];
    }
  },

  async saveAIMessages(messages: AIAssistantMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AI_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving AI messages:', error);
    }
  },

  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CART);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },
};