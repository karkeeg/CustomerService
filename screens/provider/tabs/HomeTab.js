import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useServicesStore from '../../../store/servicesStore';
import useRequestsStore from '../../../store/requestsStore';
import useAuthStore from '../../../store/authStore';
import ServiceCard from '../../../components/ServiceCard';

export default function HomeTab({ navigation }) {
  const services = useServicesStore((state) => state.services);
  const requests = useRequestsStore((state) => state.requests);
  const fetchProviderServices = useServicesStore((state) => state.fetchProviderServices);
  const fetchProviderRequests = useRequestsStore((state) => state.fetchProviderRequests);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchProviderServices(1),
      fetchProviderRequests(1),
      refreshUser(),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = {
    totalServices: services.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    completedRequests: requests.filter(r => r.status === 'completed').length,
    totalEarnings: requests
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.serviceId?.price || 0), 0),
  };

  const recentServices = services.slice(0, 3);
  const recentRequests = requests.slice(0, 3);

  const quickActions = [
    { 
      title: 'Add Service', 
      icon: 'plus-circle', 
      color: colors.primary,
      onPress: () => navigation.navigate('ServiceForm', {})
    },
    { 
      title: 'View Requests', 
      icon: 'file-document', 
      color: colors.info,
      onPress: () => {} // Will switch to requests tab
    },
    { 
      title: 'Analytics', 
      icon: 'chart-line', 
      color: colors.success,
      onPress: () => {} // Will switch to analytics tab
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="briefcase" size={24} color={colors.surface} />
              <Text style={styles.statValue}>{stats.totalServices}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.warning, '#f59e0b']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="clock-outline" size={24} color={colors.surface} />
              <Text style={styles.statValue}>{stats.pendingRequests}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.success, '#10b981']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="check-all" size={24} color={colors.surface} />
              <Text style={styles.statValue}>{stats.completedRequests}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[colors.info, '#3b82f6']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="cash" size={24} color={colors.surface} />
              <Text style={styles.statValue}>Rs.{stats.totalEarnings}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}33` }]}>
                <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Services</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentServices.length > 0 ? (
          recentServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              showProvider={false}
              onPress={() => navigation.navigate('ServiceForm', { service })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="briefcase-remove-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No services yet</Text>
          </View>
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentRequests.length > 0 ? (
          recentRequests.map((request) => (
            <View key={request._id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons
                  name={
                    request.status === 'pending' ? 'clock-outline' :
                    request.status === 'accepted' ? 'check-circle' :
                    request.status === 'completed' ? 'check-all' : 'close-circle'
                  }
                  size={20}
                  color={
                    request.status === 'pending' ? colors.warning :
                    request.status === 'accepted' ? colors.info :
                    request.status === 'completed' ? colors.success : colors.error
                  }
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{request.serviceId?.title}</Text>
                <Text style={styles.activitySubtitle}>
                  {request.consumerId?.username} • {request.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
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
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
