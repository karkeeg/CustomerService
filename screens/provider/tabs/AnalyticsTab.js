import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useRequestsStore from '../../../store/requestsStore';
import useAuthStore from '../../../store/authStore';

export default function AnalyticsTab() {
  const requests = useRequestsStore((state) => state.requests);

  // Calculate analytics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const cancelledRequests = requests.filter(r => r.status === 'cancelled').length;

  const acceptanceRate = totalRequests > 0 
    ? ((acceptedRequests + completedRequests) / totalRequests * 100).toFixed(1)
    : 0;

  const completionRate = (acceptedRequests + completedRequests) > 0
    ? (completedRequests / (acceptedRequests + completedRequests) * 100).toFixed(1)
    : 0;

  const totalEarnings = requests
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.serviceId?.price || 0), 0);

  const avgEarningsPerRequest = completedRequests > 0
    ? (totalEarnings / completedRequests).toFixed(0)
    : 0;

  const { user } = useAuthStore();

  if (!user?.isApproved) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="chart-box-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Analytics Unavailable</Text>
        <Text style={styles.emptySubtext}>
          Analytics will be available once your account is verified and you start completing requests.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Earnings Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <View style={styles.earningsCard}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.earningsGradient}
          >
            <MaterialCommunityIcons name="cash-multiple" size={40} color={colors.surface} />
            <Text style={styles.earningsValue}>Rs. {totalEarnings}</Text>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <View style={styles.earningsStats}>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>{completedRequests}</Text>
                <Text style={styles.earningsStatLabel}>Completed</Text>
              </View>
              <View style={styles.earningsDivider} />
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>Rs. {avgEarningsPerRequest}</Text>
                <Text style={styles.earningsStatLabel}>Avg/Request</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: `${colors.success}33` }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{acceptanceRate}%</Text>
            <Text style={styles.metricLabel}>Acceptance Rate</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: `${colors.info}33` }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color={colors.info} />
            </View>
            <Text style={styles.metricValue}>{completionRate}%</Text>
            <Text style={styles.metricLabel}>Completion Rate</Text>
          </View>
        </View>
      </View>

      {/* Request Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Statistics</Text>
        
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <View style={[styles.statDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <Text style={styles.statValue}>{pendingRequests}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <View style={[styles.statDot, { backgroundColor: colors.info }]} />
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
            <Text style={styles.statValue}>{acceptedRequests}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <View style={[styles.statDot, { backgroundColor: colors.success }]} />
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <Text style={styles.statValue}>{completedRequests}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <View style={[styles.statDot, { backgroundColor: colors.error }]} />
              <Text style={styles.statLabel}>Cancelled</Text>
            </View>
            <Text style={styles.statValue}>{cancelledRequests}</Text>
          </View>

          <View style={[styles.statRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Requests</Text>
            <Text style={styles.totalValue}>{totalRequests}</Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.warning} />
          <Text style={styles.insightText}>
            {completionRate >= 80 
              ? "Great job! You're maintaining an excellent completion rate."
              : completionRate >= 50
              ? "Good work! Try to complete more accepted requests to improve your rating."
              : "Focus on completing accepted requests to build your reputation."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  earningsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  earningsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.surface,
    marginTop: 12,
  },
  earningsLabel: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },
  earningsStats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    width: '100%',
  },
  earningsStat: {
    flex: 1,
    alignItems: 'center',
  },
  earningsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  earningsStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.surface,
  },
  earningsStatLabel: {
    fontSize: 12,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
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
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.warning}26`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
