import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ActivityIndicator,
  Searchbar,
  Card,
  Title,
  Paragraph,
  IconButton,
  Chip,
} from 'react-native-paper';
import colors from '../../constants/colors';
import adminService from '../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AdminManageServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchServices = async (pageNum = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const data = await adminService.getServices(pageNum);
      setServices(prev => append ? [...prev, ...data.services] : data.services);
      setFilteredServices(prev => append ? [...prev, ...data.services] : data.services); // Keep filteredServices in sync for search
      setPage(pageNum);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    fetchServices(1, false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      fetchServices(page + 1, true);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDeleteService = (id) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteService(id);
              fetchServices();
              Alert.alert('Success', 'Service deleted successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const handleModerateService = (id, status) => {
    Alert.alert(
      `${status.charAt(0).toUpperCase() + status.slice(1)} Service`,
      `Are you sure you want to ${status} this service?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status.charAt(0).toUpperCase() + status.slice(1),
          onPress: async () => {
            try {
              await adminService.moderateService(id, status);
              fetchServices();
              Alert.alert('Success', `Service ${status}ed successfully`);
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.warning;
    }
  };

  const renderServiceItem = ({ item }) => (
    <Card style={styles.serviceCard}>
      <Card.Content>
        <View style={styles.serviceHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.serviceTitle}>{item.title}</Title>
            <View style={styles.badgeRow}>
              <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
                {item.category}
              </Chip>
              <Chip 
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.moderationStatus) + '20' }]}
                textStyle={{ color: getStatusColor(item.moderationStatus), fontSize: 10 }}
              >
                {item.moderationStatus || 'pending'}
              </Chip>
            </View>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon="trash-can-outline"
              iconColor={colors.error}
              size={24}
              onPress={() => handleDeleteService(item._id)}
            />
          </View>
        </View>
        <Paragraph numberOfLines={2} style={styles.description}>
          {item.description}
        </Paragraph>
        <View style={styles.serviceFooter}>
          <View style={styles.providerInfo}>
            <MaterialCommunityIcons name="account-tie" size={16} color={colors.textSecondary} />
            <Text style={styles.providerName}>{item.providerId?.username || 'Unknown'}</Text>
          </View>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>

        {item.moderationStatus === 'pending' && (
          <View style={styles.moderationActions}>
            <TouchableOpacity 
              style={[styles.moderateButton, styles.approveButton]} 
              onPress={() => handleModerateService(item._id, 'approved')}
            >
              <MaterialCommunityIcons name="check" size={16} color={colors.surface} />
              <Text style={styles.moderateButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.moderateButton, styles.rejectButton]} 
              onPress={() => handleModerateService(item._id, 'rejected')}
            >
              <MaterialCommunityIcons name="close" size={16} color={colors.surface} />
              <Text style={styles.moderateButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search services..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          elevation={1}
        />
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : services.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="briefcase-off-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No services found</Text>
        </View>
      ) : (
        <FlatList
          data={services.filter(s => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.providerId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item._id}
          renderItem={renderServiceItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 15,
    backgroundColor: colors.surface,
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 10,
    paddingBottom: 40,
  },
  serviceCard: {
    marginBottom: 12,
    elevation: 3,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryChip: {
    height: 24,
    backgroundColor: colors.primary + '15',
  },
  statusChip: {
    height: 24,
  },
  categoryText: {
    fontSize: 11,
    lineHeight: 12,
    color: colors.primary,
  },
  description: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  moderationActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  moderateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  moderateButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  footerLoader: {
    paddingVertical: 15,
    alignItems: 'center',
  },
});

export default AdminManageServicesScreen;
