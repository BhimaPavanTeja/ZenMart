import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Zap, RotateCcw, Info } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { ARService } from '@/services/arService';
import { sampleProducts } from '@/data/products';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const { width, height } = Dimensions.get('window');

export default function ARScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const arService = ARService.getInstance();
  const scanAnimation = useSharedValue(0);

  useEffect(() => {
    // Start scanning animation
    scanAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedScanStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.5 + scanAnimation.value * 0.5,
      transform: [{ scale: 0.8 + scanAnimation.value * 0.2 }],
    };
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan products and provide AR features.
          </Text>
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  const handleScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanResult(null);

    try {
      // Simulate capturing image data
      const imageData = 'simulated_image_data';
      const result = await arService.recognizeProduct(imageData);
      
      if (result) {
        const product = sampleProducts.find(p => p.id === result.productId);
        if (product) {
          setScanResult({
            ...result,
            product,
          });
        } else {
          Alert.alert('Product Not Found', 'This product is not in our database.');
        }
      } else {
        Alert.alert('No Product Detected', 'Please try pointing the camera at a product.');
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewProduct = () => {
    if (scanResult?.product) {
      router.push(`/product/${scanResult.product.id}`);
    }
  };

  const handleViewInAR = () => {
    if (scanResult?.product) {
      router.push(`/ar/view?productId=${scanResult.product.id}`);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AR Product Scanner</Text>
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.headerButton}>
            <RotateCcw size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Scanning Overlay */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View style={[styles.scanLine, animatedScanStyle]} />
            
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.scanInstructions}>
            {isScanning ? 'Scanning product...' : 'Point camera at a product to scan'}
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Scan Result Card */}
          {scanResult && (
            <Animated.View entering={FadeInDown.delay(200)}>
              <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Product Found!</Text>
                  <Text style={styles.confidenceText}>
                    {Math.round(scanResult.confidence * 100)}% confidence
                  </Text>
                </View>
                
                <Text style={styles.productName}>{scanResult.product.name}</Text>
                <Text style={styles.productBrand}>{scanResult.product.brand}</Text>
                <Text style={styles.productPrice}>${scanResult.product.price.toFixed(2)}</Text>
                
                <View style={styles.resultActions}>
                  <Button
                    title="View Product"
                    onPress={handleViewProduct}
                    variant="outline"
                    size="sm"
                    style={styles.resultButton}
                  />
                  <Button
                    title="View in AR"
                    onPress={handleViewInAR}
                    size="sm"
                    style={styles.resultButton}
                  />
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Scan Button */}
          <TouchableOpacity
            onPress={handleScan}
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            disabled={isScanning}
          >
            <Zap size={32} color={isScanning ? Colors.text.muted : '#fff'} />
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Info size={16} color="#fff" />
            <Text style={styles.infoText}>
              AR scanning helps you identify products and get detailed information
            </Text>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.primary[500],
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  resultCard: {
    width: width - 40,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  confidenceText: {
    fontSize: 14,
    color: Colors.secondary[600],
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary[600],
    marginBottom: 16,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: width - 40,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
});