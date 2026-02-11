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
import useServicesStore from '../../store/servicesStore';
import ServiceCard from '../../components/ServiceCard';

export default function ManageServicesScreen({ navigation }) {
  const {
    services,
    pagination,
    isLoading,
    fetchProviderServices,
    deleteService,
  } = useServicesStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    await fetchProviderServices(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (pagination.hasMore && !loadingMore) {
      setLoadingMore(true);
      await fetchProviderServices(pagination.currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleDeleteService = (serviceId) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteService(serviceId);
            if (result.success) {
              Alert.alert('Success', 'Service deleted successfully');
            } else {
              Alert.alert('Error', result.error?.error || 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  const handleEditService = (service) => {
    navigation.navigate('ServiceForm', { service });
  };

  const renderService = ({ item }) => (
    <View>
      <ServiceCard service={item} showProvider={false} onPress={() => {}} />
      <View style={styles.serviceActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditService(item)}
        >
          <MaterialCommunityIcons name="pencil" size={18} color={colors.surface} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteService(item._id)}
        >
          <MaterialCommunityIcons name="delete" size={18} color={colors.surface} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <MaterialCommunityIcons name="briefcase-remove-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyText}>No services yet</Text>
      <Text style={styles.emptySubtext}>Create your first service to get started</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>My Services</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={services}
        renderItem={renderService}
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ServiceForm')}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.fabGradient}
        >
          <MaterialCommunityIcons name="plus" size={28} color={colors.surface} />
        </LinearGradient>
      </TouchableOpacity>
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
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  serviceActions: {
    flexDirection: 'row',
    marginTop: -8,
    marginBottom: 16,
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
  editButton: {
    backgroundColor: colors.info,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
