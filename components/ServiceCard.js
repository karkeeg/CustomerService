import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

/**
 * ServiceCard Component
 * Displays a service with premium design
 */
export default function ServiceCard({ service, onPress, showProvider = true }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <LinearGradient
          colors={[colors.primary + '15', colors.secondary + '10']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="briefcase-outline" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={1}>
                {service.title}
              </Text>
              <Text style={styles.category}>{service.category}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Rs. {service.price}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {service.description}
          </Text>

          {showProvider && service.providerId && (
            <View style={styles.providerInfo}>
              <MaterialCommunityIcons 
                name="account" 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={styles.providerName}>
                {service.providerId.username || 'Provider'}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={[styles.statusBadge, service.isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={styles.statusText}>
                {service.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color={colors.primary} 
            />
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceContainer: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  providerName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: colors.success + '20',
  },
  inactiveBadge: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
