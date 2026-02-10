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
import useRequestsStore from '../../store/requestsStore';
import ServiceCard from '../../components/ServiceCard';
import SearchBar from '../../components/SearchBar';

export default function BrowseServicesScreen({ route, navigation }) {
  const { category } = route.params || {};
  
  const {
    services,
    pagination,
    searchQuery,
    categoryFilter,
    isLoading,
    fetchServices,
    setSearchQuery,
    setCategoryFilter,
  } = useServicesStore();

  const { createRequest } = useRequestsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    if (category) {
      setCategoryFilter(category);
    }
    loadServices();
  }, [searchQuery, categoryFilter]);

  const loadServices = async () => {
    await fetchServices(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (pagination.hasMore && !loadingMore) {
      setLoadingMore(true);
      await fetchServices(pagination.currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleSearch = (text) => {
    setLocalSearch(text);
    // Debounce search
    const timer = setTimeout(() => {
      setSearchQuery(text);
    }, 500);
    return () => clearTimeout(timer);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const handleRequestService = (service) => {
    Alert.alert(
      'Request Service',
      `Request "${service.title}" from ${service.providerId?.username || 'provider'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async () => {
            const result = await createRequest(service._id, service.providerId._id);
            if (result.success) {
              Alert.alert('Success', 'Service requested successfully');
            } else {
              Alert.alert('Error', result.error?.error || 'Failed to request service');
            }
          },
        },
      ]
    );
  };

  const renderService = ({ item }) => (
    <ServiceCard 
      service={item} 
      showProvider={true} 
      onPress={() => handleRequestService(item)} 
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
      <MaterialCommunityIcons name="magnify-close" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyText}>No services found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery || categoryFilter 
          ? 'Try adjusting your search or filters' 
          : 'No services available at the moment'}
      </Text>
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
          <Text style={styles.headerTitle}>Browse Services</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <SearchBar
          value={localSearch}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search services..."
        />
        
        {categoryFilter && (
          <View style={styles.activeFilter}>
            <Text style={styles.activeFilterText}>Category: {categoryFilter}</Text>
            <TouchableOpacity onPress={() => setCategoryFilter('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

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
  searchContainer: {
    padding: 16,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
