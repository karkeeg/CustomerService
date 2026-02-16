import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useAuthStore from '../../../store/authStore';

export default function HomeTab({ navigation }) {
  const user = useAuthStore((state) => state.user);
  
  const categories = [
    { name: 'Home Services', icon: 'home', color: colors.primary },
    { name: 'Repair', icon: 'tools', color: colors.secondary },
    { name: 'Cleaning', icon: 'broom', color: colors.info },
    { name: 'Beauty', icon: 'face-woman', color: colors.warning },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.welcomeText}>Welcome back, {user?.user}!</Text>
        <Text style={styles.subtitle}>What service do you need today?</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('BrowseServices', { category: category.name })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <MaterialCommunityIcons name={category.icon} size={28} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BrowseServices')}
        >
          <View style={styles.actionIcon}>
            <MaterialCommunityIcons name="magnify" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Search Services</Text>
            <Text style={styles.actionSubtitle}>Find and request services</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('MyRequests')}
        >
          <View style={styles.actionIcon}>
            <MaterialCommunityIcons name="file-document-multiple" size={24} color={colors.secondary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Track My Requests</Text>
            <Text style={styles.actionSubtitle}>Check your request status</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
