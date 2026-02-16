import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';

export default function TabBar({ activeTab, onTabChange, role = 'provider' }) {
  const getTabsForRole = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'users', label: 'Users', icon: 'account-group-outline' },
          { id: 'services', label: 'Services', icon: 'briefcase-outline' },
          { id: 'categories', label: 'Categories', icon: 'folder-multiple-outline' },
          { id: 'home', label: 'Home', icon: 'view-dashboard-outline', isCenter: true },
          { id: 'approvals', label: 'Approvals', icon: 'shield-check-outline' },
          { id: 'profile', label: 'Profile', icon: 'account-outline' },
        ];
      case 'consumer':
        return [
          { id: 'home', label: 'Home', icon: 'home-outline' },
          { id: 'explore', label: 'Explore', icon: 'magnify' },
          { id: 'dashboard', label: 'Dashboard', icon: 'view-grid-outline', isCenter: true },
          { id: 'requests', label: 'Requests', icon: 'file-document-outline' },
          { id: 'profile', label: 'Profile', icon: 'account-outline' },
        ];
      case 'provider':
      default:
        return [
          { id: 'services', label: 'Services', icon: 'briefcase-outline' },
          { id: 'requests', label: 'Requests', icon: 'file-document-multiple-outline' },
          { id: 'home', label: 'Home', icon: 'home', isCenter: true },
          { id: 'analytics', label: 'Analytics', icon: 'chart-line' },
          { id: 'profile', label: 'Profile', icon: 'account-outline' },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.centerTabContainer}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isActive ? [colors.primary, colors.secondary] : [colors.surface, colors.surface]}
                  style={styles.centerTab}
                >
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={28}
                    color={isActive ? colors.surface : colors.textSecondary}
                  />
                </LinearGradient>
                <Text style={styles.centerLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              {isActive && (
                <LinearGradient
                  colors={[`${colors.primary}33`, `${colors.secondary}33`]}
                  style={styles.activeBackground}
                />
              )}
              <MaterialCommunityIcons
                name={tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  centerTabContainer: {
    alignItems: 'center',
    marginTop: -30,
    marginHorizontal: 8,
  },
  centerTab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.background,
  },
  centerLabel: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 6,
    fontWeight: '700',
  },
});
