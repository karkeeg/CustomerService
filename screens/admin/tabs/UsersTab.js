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
  List,
  Avatar,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import colors from '../../../constants/colors';
import adminService from '../../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UsersTab = ({ params }) => {
  const [role, setRole] = useState(params?.role || 'consumer');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = role === 'provider' 
        ? await adminService.getProviders() 
        : await adminService.getConsumers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.role) {
      setRole(params.role);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
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

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="account-off-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
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
});

export default UsersTab;
