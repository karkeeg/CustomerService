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
  List,
  Avatar,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import colors from '../../constants/colors';
import adminService from '../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ManageUsersScreen = ({ route }) => {
  const initialRole = route.params?.role || 'consumer';
  const [role, setRole] = useState(initialRole);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async (pageNum = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const data = role === 'provider' 
        ? await adminService.getProviders(pageNum) 
        : await adminService.getConsumers(pageNum);
      
      const newUsers = role === 'provider' ? data.providers : data.consumers;
      
      setUsers(prev => append ? [...prev, ...newUsers] : newUsers);
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
    fetchUsers(1, false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      fetchUsers(page + 1, true);
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
    fetchUsers();
  }, [role]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDeleteUser = (id) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteUser(id);
              fetchUsers();
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <List.Item
      title={item.username}
      description={item.email}
      left={(props) => (
        <Avatar.Icon
          {...props}
          icon={item.role === 'provider' ? 'truck-delivery' : 'account'}
          size={48}
          backgroundColor={item.role === 'provider' ? colors.secondary + '20' : colors.primary + '20'}
          color={item.role === 'provider' ? colors.secondary : colors.primary}
        />
      )}
      right={(props) => (
        <View style={styles.rightActions}>
          <IconButton
            icon="delete-outline"
            iconColor={colors.error}
            onPress={() => handleDeleteUser(item._id)}
          />
        </View>
      )}
      style={styles.userItem}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SegmentedButtons
          value={role}
          onValueChange={setRole}
          buttons={[
            { value: 'consumer', label: 'Consumers' },
            { value: 'provider', label: 'Providers' },
          ]}
          style={styles.segmentedButtons}
        />
        <Searchbar
          placeholder="Search users..."
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
      ) : users.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="account-off-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={users.filter(u => 
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
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
  segmentedButtons: {
    marginBottom: 15,
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    backgroundColor: colors.surface,
    marginBottom: 1,
    paddingVertical: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default ManageUsersScreen;
