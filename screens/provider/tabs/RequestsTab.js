import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useRequestsStore from '../../../store/requestsStore';
import RequestCard from '../../../components/RequestCard';

export default function RequestsTab() {
  const {
    requests,
    pagination,
    statusFilter,
    isLoading,
    fetchProviderRequests,
    updateRequestStatus,
    setStatusFilter,
  } = useRequestsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    await fetchProviderRequests(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (pagination.hasMore && !loadingMore) {
      setLoadingMore(true);
      await fetchProviderRequests(pagination.currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleAccept = async (requestId) => {
    const result = await updateRequestStatus(requestId, 'accepted');
    if (result.success) {
      Alert.alert('Success', 'Request accepted');
    } else {
      Alert.alert('Error', result.error?.error || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            const result = await updateRequestStatus(requestId, 'cancelled');
            if (result.success) {
              Alert.alert('Success', 'Request rejected');
            } else {
              Alert.alert('Error', result.error?.error || 'Failed to reject request');
            }
          },
        },
      ]
    );
  };

  const renderRequest = ({ item }) => (
    <RequestCard
      request={item}
      showActions={true}
      onAccept={item.status === 'pending' ? handleAccept : null}
      onReject={item.status === 'pending' ? handleReject : null}
      onPress={() => {}}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="file-document-remove-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyText}>No requests found</Text>
      <Text style={styles.emptySubtext}>
        {statusFilter ? `No ${statusFilter} requests` : 'You have no service requests yet'}
      </Text>
    </View>
  );

  const filters = ['', 'pending', 'accepted', 'completed', 'cancelled'];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              statusFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter || 'All'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isLoading && renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: colors.surface,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
