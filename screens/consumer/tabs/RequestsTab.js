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
    fetchMyRequests,
    cancelRequest,
    setStatusFilter,
  } = useRequestsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    await fetchMyRequests(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (pagination.hasMore && !loadingMore) {
      setLoadingMore(true);
      await fetchMyRequests(pagination.currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleCancel = async (requestId) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelRequest(requestId);
            if (result.success) {
              Alert.alert('Success', 'Request cancelled successfully');
            } else {
              Alert.alert('Error', result.error?.error || 'Failed to cancel request');
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
      onCancel={item.status === 'pending' ? handleCancel : null}
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
        {statusFilter ? `No ${statusFilter} requests` : 'You have not requested any services yet'}
      </Text>
    </View>
  );

  const filters = ['', 'pending', 'accepted', 'completed', 'cancelled'];

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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
        </ScrollView>
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
  filterBar: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
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
