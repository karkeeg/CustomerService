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
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import useRequestsStore from '../../store/requestsStore';
import RequestCard from '../../components/RequestCard';

export default function ProviderRequestsScreen({ navigation }) {
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

  const handleComplete = async (requestId) => {
    const result = await updateRequestStatus(requestId, 'completed');
    if (result.success) {
      Alert.alert('Success', 'Request marked as completed');
    } else {
      Alert.alert('Error', result.error?.error || 'Failed to complete request');
    }
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
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Requests</Text>
          <View style={{ width: 40 }} />
        </View>

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
      </LinearGradient>

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
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterChipActive: {
    backgroundColor: colors.surface,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.surface,
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: colors.primary,
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
  },
});
