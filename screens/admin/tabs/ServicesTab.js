import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import colors from '../../../constants/colors';
import adminService from '../../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await adminService.getServices();
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    const filtered = services.filter((service) =>
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase()) ||
      service.providerId?.username?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredServices(filtered);
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

  const renderServiceItem = ({ item }) => (
    <Card style={styles.serviceCard}>
      <Card.Content>
        <View style={styles.serviceHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.serviceTitle}>{item.title}</Title>
            <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
              {item.category}
            </Chip>
          </View>
          <IconButton
            icon="trash-can-outline"
            iconColor={colors.error}
            size={24}
            onPress={() => handleDeleteService(item._id)}
          />
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

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredServices.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="briefcase-off-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No services found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={renderServiceItem}
          contentContainerStyle={styles.listContent}
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
    paddingBottom: 20,
  },
  serviceCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryChip: {
    height: 24,
    backgroundColor: colors.primary + '15',
  },
  categoryText: {
    fontSize: 11,
    lineHeight: 12,
    color: colors.primary,
  },
  description: {
    marginTop: 8,
    color: colors.textSecondary,
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
    color: colors.success,
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
});

export default ServicesTab;
