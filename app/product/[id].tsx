import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Heart, Share, Eye, ShoppingCart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Product } from '@/types';
import { sampleProducts } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/hooks/useCart';
import { useAI } from '@/hooks/useAI';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { trackProductView } = useAI(sampleProducts);

  useEffect(() => {
    const foundProduct = sampleProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      trackProductView(foundProduct.id);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, quantity);
      Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
    }
  };

  const handleViewInAR = () => {
    if (product) {
      router.push(`/ar/view?productId=${product.id}`);
    }
  };

  const handleShare = () => {
    Alert.alert('Share Product', 'Sharing functionality would be implemented here.');
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Share size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsFavorite(!isFavorite)} 
              style={styles.headerButton}
            >
              <Heart 
                size={24} 
                color={isFavorite ? Colors.error : Colors.text.primary}
                fill={isFavorite ? Colors.error : 'none'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Product Images */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Product Info */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.productInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.accent[500]} fill={Colors.accent[500]} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>
          
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          
          <Text style={styles.description}>{product.description}</Text>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* AR Features */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Card style={styles.arCard}>
            <View style={styles.arHeader}>
              <Eye size={24} color={Colors.secondary[600]} />
              <Text style={styles.arTitle}>Augmented Reality</Text>
            </View>
            <Text style={styles.arDescription}>
              See how this product looks in your space with AR technology
            </Text>
            <Button
              title="View in AR"
              onPress={handleViewInAR}
              variant="secondary"
              style={styles.arButton}
            />
          </Card>
        </Animated.View>

        {/* Quantity Selector */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View entering={FadeInRight.delay(600)} style={styles.bottomActions}>
        <Button
          title={`Add to Cart • $${(product.price * quantity).toFixed(2)}`}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  productImage: {
    width,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[300],
  },
  activeIndicator: {
    backgroundColor: Colors.primary[500],
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  brand: {
    fontSize: 14,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 6,
  },
  reviews: {
    fontSize: 16,
    color: Colors.text.muted,
    marginLeft: 6,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary[600],
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: Colors.primary[700],
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  arCard: {
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
    borderWidth: 1,
  },
  arHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  arTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  arDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  arButton: {
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});