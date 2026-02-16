import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import colors from '../../../constants/colors';
import adminService from '../../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color, onPress }) => (
  <Card style={styles.statCard} onPress={onPress}>
    <Card.Content style={styles.statCardContent}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={30} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Title style={styles.statValue}>{value}</Title>
        <Paragraph style={styles.statTitle}>{title}</Paragraph>
      </View>
    </Card.Content>
  </Card>
);

const DashboardTab = ({ navigation, onTabChange }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>System Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Consumers"
          value={stats?.consumers || 0}
          icon="account-group"
          color={colors.primary}
          onPress={() => onTabChange('users', { role: 'consumer' })}
        />
        <StatCard
          title="Providers"
          value={stats?.providers || 0}
          icon="truck-delivery"
          color={colors.secondary}
          onPress={() => onTabChange('users', { role: 'provider' })}
        />
        <StatCard
          title="Services"
          value={stats?.services || 0}
          icon="briefcase-check"
          color={colors.success}
          onPress={() => onTabChange('services')}
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingProviders || 0}
          icon="account-clock"
          color={colors.warning}
          onPress={() => onTabChange('approvals')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 40) / 2,
    margin: 5,
    elevation: 2,
    borderRadius: 12,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default DashboardTab;
