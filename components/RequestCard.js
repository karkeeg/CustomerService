import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

/**
 * RequestCard Component
 * Displays a service request with status
 */
export default function RequestCard({ request, onPress, showActions = false, onAccept, onReject, onCancel }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'accepted':
        return colors.info;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'accepted':
        return 'check-circle-outline';
      case 'completed':
        return 'check-all';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(request.status) + '20' }]}>
          <MaterialCommunityIcons 
            name={getStatusIcon(request.status)} 
            size={24} 
            color={getStatusColor(request.status)} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {request.serviceId?.title || 'Service'}
          </Text>
          <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {request.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {request.consumerId?.username || request.providerId?.username || 'User'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="currency-inr" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            Rs. {request.serviceId?.price || 0}
          </Text>
        </View>
      </View>

      {showActions && request.status === 'pending' && (
        <View style={styles.actions}>
          {onAccept && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => onAccept(request._id)}
            >
              <MaterialCommunityIcons name="check" size={20} color={colors.surface} />
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
          )}
          {onReject && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => onReject(request._id)}
            >
              <MaterialCommunityIcons name="close" size={20} color={colors.surface} />
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          )}
          {onCancel && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => onCancel(request._id)}
            >
              <MaterialCommunityIcons name="close" size={20} color={colors.surface} />
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});
