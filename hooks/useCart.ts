import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { StorageUtils } from '@/utils/storage';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await StorageUtils.getCart();
      setCart(savedCart);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const newItem: CartItem = { product, quantity };
    await StorageUtils.addToCart(newItem);
    await loadCart();
  };

  const removeFromCart = async (productId: string) => {
    await StorageUtils.removeFromCart(productId);
    await loadCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await StorageUtils.updateCartItemQuantity(productId, quantity);
    await loadCart();
  };

  const clearCart = async () => {
    await StorageUtils.clearCart();
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
}