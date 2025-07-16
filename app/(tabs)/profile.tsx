import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, Package, CreditCard, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Sparkles, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/hooks/useCart';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, showChevron = true }: MenuItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>{icon}</View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color={Colors.text.muted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // In a real app, this would clear user session
          Alert.alert('Logged out successfully');
        }}
      ]
    );
  };

  const navigateToAssistant = () => {
    router.push('/assistant');
  };

  const navigateToAR = () => {
    router.push('/ar/scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User size={32} color={Colors.primary[600]} />
            </View>
            <View>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.email}>john.doe@example.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* AI Insights Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Card style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Sparkles size={24} color={Colors.accent[600]} />
              <Text style={styles.insightsTitle}>AI Insights</Text>
            </View>
            <Text style={styles.insightsText}>
              You've saved $127 this month with personalized recommendations!
            </Text>
            <View style={styles.insightsActions}>
              <Button
                title="View AI Assistant"
                onPress={navigateToAssistant}
                variant="outline"
                size="sm"
                style={styles.insightsButton}
              />
              <Button
                title="AR Features"
                onPress={navigateToAR}
                variant="ghost"
                size="sm"
                style={styles.insightsButton}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{getTotalItems()}</Text>
              <Text style={styles.statLabel}>Cart Items</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </Card>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Card style={styles.menuCard}>
            <MenuItem
              icon={<Package size={24} color={Colors.text.primary} />}
              title="My Orders"
              subtitle="Track your purchases"
              onPress={() => Alert.alert('My Orders', 'Feature coming soon!')}
            />
            <MenuItem
              icon={<Heart size={24} color={Colors.error} />}
              title="Wishlist"
              subtitle="Saved items"
              onPress={() => Alert.alert('Wishlist', 'Feature coming soon!')}
            />
            <MenuItem
              icon={<CreditCard size={24} color={Colors.text.primary} />}
              title="Payment Methods"
              subtitle="Manage cards & payment"
              onPress={() => Alert.alert('Payment Methods', 'Feature coming soon!')}
            />
            <MenuItem
              icon={<Camera size={24} color={Colors.secondary[600]} />}
              title="AR Features"
              subtitle="Scan & visualize products"
              onPress={navigateToAR}
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Card style={styles.menuCard}>
            <MenuItem
              icon={<Bell size={24} color={Colors.text.primary} />}
              title="Notifications"
              subtitle="Manage your preferences"
              onPress={() => Alert.alert('Notifications', 'Feature coming soon!')}
            />
            <MenuItem
              icon={<Settings size={24} color={Colors.text.primary} />}
              title="Settings"
              subtitle="App preferences"
              onPress={() => Alert.alert('Settings', 'Feature coming soon!')}
            />
            <MenuItem
              icon={<HelpCircle size={24} color={Colors.text.primary} />}
              title="Help & Support"
              subtitle="Get assistance"
              onPress={() => Alert.alert('Help & Support', 'Feature coming soon!')}
            />
          </Card>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Card style={styles.menuCard}>
            <MenuItem
              icon={<LogOut size={24} color={Colors.error} />}
              title="Logout"
              onPress={handleLogout}
              showChevron={false}
            />
          </Card>
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  email: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightsCard: {
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
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
  insightsActions: {
    flexDirection: 'row',
    gap: 12,
  },
  insightsButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
});