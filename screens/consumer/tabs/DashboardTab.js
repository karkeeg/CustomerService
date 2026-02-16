import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useRequestsStore from '../../../store/requestsStore';

export default function DashboardTab() {
  const requests = useRequestsStore((state) => state.requests);
  const fetchMyRequests = useRequestsStore((state) => state.fetchMyRequests);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchMyRequests(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = {
    pendingRequests: (requests || []).filter(r => r.status === 'pending').length,
    acceptedRequests: (requests || []).filter(r => r.status === 'accepted').length,
    completedRequests: (requests || []).filter(r => r.status === 'completed').length,
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.warning, '#f59e0b']}
            style={styles.statGradient}
          >
            <MaterialCommunityIcons name="clock-outline" size={28} color={colors.surface} />
            <Text style={styles.statValue}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </LinearGradient>
        </View>

        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.info, '#3b82f6']}
            style={styles.statGradient}
          >
            <MaterialCommunityIcons name="check-circle" size={28} color={colors.surface} />
            <Text style={styles.statValue}>{stats.acceptedRequests}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </LinearGradient>
        </View>

        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.success, '#10b981']}
            style={styles.statGradient}
          >
            <MaterialCommunityIcons name="check-all" size={28} color={colors.surface} />
            <Text style={styles.statValue}>{stats.completedRequests}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {(requests || []).slice(0, 5).map((request, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons 
                name={request.status === 'completed' ? 'check-circle' : 'clock-outline'} 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{request.serviceId?.title || 'Service Request'}</Text>
              <Text style={styles.activityStatus}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</Text>
            </View>
            <Text style={styles.activityDate}>
              {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
        {(requests || []).length === 0 && (
          <Text style={styles.emptyText}>No recent activity</Text>
        )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.surface,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  },
  activityStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  }
});
