import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Star, ShoppingCart } from 'lucide-react-native';
import { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { addToCart } = useCart();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.accent[500]} fill={Colors.accent[500]} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={handleAddToCart} style={styles.cartButton}>
              <ShoppingCart size={20} color={Colors.primary[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  brand: {
    fontSize: 12,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: Colors.text.muted,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  cartButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
  },
});