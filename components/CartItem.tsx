import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const total = product.price * quantity;

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.info}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => onRemove(product.id)}
              style={styles.removeButton}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(product.id, quantity - 1)}
                style={styles.quantityButton}
              >
                <Minus size={16} color={Colors.text.primary} />
              </TouchableOpacity>
              
              <Text style={styles.quantity}>{quantity}</Text>
              
              <TouchableOpacity
                onPress={() => onUpdateQuantity(product.id, quantity + 1)}
                style={styles.quantityButton}
              >
                <Plus size={16} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.total}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: 12,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 4,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[600],
  },
});