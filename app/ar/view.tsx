import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, RotateCcw, Move3d as Move3D, ZoomIn, ZoomOut } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Product } from '@/types';
import { sampleProducts } from '@/data/products';
import { ARService } from '@/services/arService';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const { width, height } = Dimensions.get('window');

export default function ARViewScreen() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [scale, setScale] = useState(1);
  const arService = ARService.getInstance();
  
  // Animation values
  const productScale = useSharedValue(1);
  const productRotation = useSharedValue(0);

  useEffect(() => {
    if (productId) {
      const foundProduct = sampleProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        initializeAR();
      }
    }
  }, [productId]);

  const initializeAR = async () => {
    try {
      const supported = await arService.initializeARSession();
      if (supported) {
        setIsARActive(true);
      } else {
        Alert.alert(
          'AR Not Supported',
          'Your device does not support AR features.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      Alert.alert('AR Error', 'Failed to initialize AR session.');
    }
  };

  const handleScaleUp = () => {
    const newScale = Math.min(scale * 1.2, 3);
    setScale(newScale);
    productScale.value = withSpring(newScale);
  };

  const handleScaleDown = () => {
    const newScale = Math.max(scale * 0.8, 0.5);
    setScale(newScale);
    productScale.value = withSpring(newScale);
  };

  const handleRotate = () => {
    productRotation.value = withSpring(productRotation.value + 90);
  };

  const handleReset = () => {
    setScale(1);
    productScale.value = withSpring(1);
    productRotation.value = withSpring(0);
  };

  const animatedProductStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: productScale.value },
        { rotateY: `${productRotation.value}deg` },
      ],
    };
  });

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading AR view...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.arContainer}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AR View</Text>
            <Text style={styles.headerSubtitle}>{product.name}</Text>
          </View>
          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <RotateCcw size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* AR Viewport */}
        <View style={styles.arViewport}>
          {/* Simulated AR product placement */}
          <Animated.View style={[styles.arProduct, animatedProductStyle]}>
            <View style={styles.productPlaceholder}>
              <Text style={styles.productLabel}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
          </Animated.View>

          {/* AR Grid */}
          <View style={styles.arGrid}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          {/* Center Reference */}
          <View style={styles.centerReference}>
            <View style={styles.centerDot} />
            <Text style={styles.centerText}>Product Center</Text>
          </View>
        </View>

        {/* Controls */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.controls}>
          {/* Product Info Card */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>AR Product Placement</Text>
            <Text style={styles.infoDescription}>
              Use the controls below to adjust size, rotation, and position of the product in your space.
            </Text>
            <View style={styles.infoStats}>
              <Text style={styles.infoStat}>Scale: {scale.toFixed(1)}x</Text>
              <Text style={styles.infoStat}>Quality: High</Text>
            </View>
          </Card>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity onPress={handleScaleDown} style={styles.controlButton}>
              <ZoomOut size={24} color={Colors.primary[600]} />
              <Text style={styles.controlButtonText}>Smaller</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRotate} style={styles.controlButton}>
              <RotateCcw size={24} color={Colors.primary[600]} />
              <Text style={styles.controlButtonText}>Rotate</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleScaleUp} style={styles.controlButton}>
              <ZoomIn size={24} color={Colors.primary[600]} />
              <Text style={styles.controlButtonText}>Larger</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="View Product Details"
              onPress={() => router.push(`/product/${product.id}`)}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Add to Cart"
              onPress={() => {
                // In a real app, this would add to cart
                Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
              }}
              style={styles.actionButton}
            />
          </View>
        </Animated.View>

        {/* AR Instructions */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.instructions}>
          <Move3D size={20} color="#fff" />
          <Text style={styles.instructionsText}>
            Move your device to place the product in your space
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
  },
  arContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  arViewport: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  arProduct: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
    zIndex: 10,
  },
  productPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[400],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  productLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  arGrid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    opacity: 0.3,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  centerReference: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent[500],
    marginBottom: 4,
  },
  centerText: {
    fontSize: 12,
    color: Colors.accent[500],
    fontWeight: '600',
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoStat: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  instructionsText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});