import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MessageCircle, Camera, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { ProductCard } from '@/components/ProductCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { sampleProducts } from '@/data/products';
import { useAI } from '@/hooks/useAI';
import { useCart } from '@/hooks/useCart';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState(sampleProducts.slice(0, 3));
  const { getRecommendations } = useAI(sampleProducts);
  const { getTotalItems } = useCart();

  useEffect(() => {
    // Load personalized recommendations
    const recommendations = getRecommendations(3);
    if (recommendations.length > 0) {
      setFeaturedProducts(recommendations);
    }
  }, []);

  const navigateToAR = () => {
    router.push('/ar/scan');
  };

  const navigateToAssistant = () => {
    router.push('/assistant');
  };

  const navigateToProducts = () => {
    router.push('/products');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>ZenMart</Text>
            <Text style={styles.subtitle}>Discover amazing products</Text>
          </View>
          <TouchableOpacity onPress={navigateToAssistant} style={styles.assistantButton}>
            <MessageCircle size={24} color={Colors.primary[600]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={navigateToAR} style={styles.actionCard}>
              <Camera size={32} color={Colors.primary[600]} />
              <Text style={styles.actionTitle}>AR Scan</Text>
              <Text style={styles.actionSubtitle}>Scan products in store</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={navigateToAssistant} style={styles.actionCard}>
              <Sparkles size={32} color={Colors.secondary[600]} />
              <Text style={styles.actionTitle}>AI Assistant</Text>
              <Text style={styles.actionSubtitle}>Get personalized help</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* AI Insights */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Card style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Sparkles size={24} color={Colors.accent[600]} />
              <Text style={styles.insightsTitle}>Your Shopping Insights</Text>
            </View>
            <Text style={styles.insightsText}>
              Based on your preferences, you might love our Electronics and Clothing collections.
              You typically shop weekly with a budget of $50-$200.
            </Text>
            <Button
              title="View Recommendations"
              onPress={navigateToProducts}
              variant="outline"
              style={styles.insightsButton}
            />
          </Card>
        </Animated.View>

        {/* Featured Products */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={navigateToProducts}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 100)}>
                <ProductCard product={item} />
              </Animated.View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categories}>
            {['Electronics', 'Clothing', 'Photography', 'Furniture'].map((category, index) => (
              <Animated.View
                key={category}
                entering={FadeInDown.delay(600 + index * 100)}
                style={styles.categoryItem}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/products?category=${category}`)}
                  style={styles.categoryButton}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  assistantButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 12,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  insightsCard: {
    backgroundColor: Colors.accent[50],
    borderColor: Colors.accent[200],
    borderWidth: 1,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  insightsText: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  insightsButton: {
    marginTop: 8,
  },
  productsList: {
    paddingVertical: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    width: (width - 60) / 2,
  },
  categoryButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});