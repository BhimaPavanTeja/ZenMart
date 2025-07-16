import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, CreditCard } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/hooks/useCart';

export default function CartScreen() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    Alert.alert(
      'Checkout',
      `Total: $${finalTotal.toFixed(2)}\n\nProceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            // In a real app, this would navigate to payment screen
            Alert.alert('Success', 'Order placed successfully!', [
              { text: 'OK', onPress: () => clearCart() }
            ]);
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <CartItem
        item={item}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color={Colors.text.muted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some amazing products to get started
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Cart Items */}
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
              </View>
              
              {totalPrice < 100 && (
                <Text style={styles.shippingNote}>
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                </Text>
              )}
            </Card>
          </Animated.View>

          {/* Checkout Button */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.checkoutContainer}>
            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  itemCount: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartList: {
    paddingBottom: 20,
  },
  summaryCard: {
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  shippingNote: {
    fontSize: 14,
    color: Colors.secondary[600],
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  checkoutContainer: {
    paddingBottom: 20,
  },
  checkoutButton: {
    marginTop: 8,
  },
});