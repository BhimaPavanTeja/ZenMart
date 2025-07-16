import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Grid2x2 as Grid, List } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/Colors';
import { sampleProducts } from '@/data/products';
import { Product } from '@/types';
import { useAI } from '@/hooks/useAI';

const { width } = Dimensions.get('window');

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const { trackSearch } = useAI(sampleProducts);

  const categories = ['All', ...Array.from(new Set(sampleProducts.map(p => p.category)))];

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const filterProducts = () => {
    let filtered = [...sampleProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      trackSearch(searchQuery);
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setProducts(filtered);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
    >
      <ProductCard product={item} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.headerButton}
          >
            {viewMode === 'grid' ? (
              <List size={24} color={Colors.text.primary} />
            ) : (
              <Grid size={24} color={Colors.text.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text.muted}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item === 'All' ? null : item)}
              style={[
                styles.categoryChip,
                (selectedCategory === item || (item === 'All' && !selectedCategory)) &&
                  styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  (selectedCategory === item || (item === 'All' && !selectedCategory)) &&
                    styles.categoryChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {['name', 'price', 'rating'].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSortBy(option as any)}
            style={[
              styles.sortOption,
              sortBy === option && styles.sortOptionActive,
            ]}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === option && styles.sortOptionTextActive,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  categoryChipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary[100],
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sortOptionTextActive: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridItem: {
    width: (width - 52) / 2,
    marginRight: 12,
    marginBottom: 16,
  },
  listItem: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});