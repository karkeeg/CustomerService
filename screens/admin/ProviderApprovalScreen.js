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
  List,
  Avatar,
  Button,
} from 'react-native-paper';
import colors from '../../constants/colors';
import adminService from '../../services/adminService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProviderApprovalScreen = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProviders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProviders();
      // Filter for unapproved providers only
      const pending = data.filter((p) => !p.isApproved);
      setProviders(pending);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveProvider(id);
      Alert.alert('Success', 'Provider approved successfully');
      fetchPendingProviders();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const handleReject = (id) => {
    Alert.alert(
      'Reject Provider',
      'Are you sure you want to reject and delete this provider request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteUser(id);
              fetchPendingProviders();
              Alert.alert('Success', 'Provider request rejected');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const renderProviderItem = ({ item }) => (
    <List.Item
      title={item.username}
      description={item.email}
      left={(props) => (
        <Avatar.Icon
          {...props}
          icon="account-clock"
          size={48}
          backgroundColor={colors.warning + '20'}
          color={colors.warning}
        />
      )}
      right={() => (
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => handleApprove(item._id)}
            style={styles.approveButton}
            buttonColor={colors.success}
          >
            Approve
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleReject(item._id)}
            textColor={colors.error}
            style={styles.rejectButton}
          >
            Reject
          </Button>
        </View>
      )}
      style={styles.providerItem}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
        <Text style={styles.headerSubtitle}>{providers.length} providers waiting</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="check-decagram-outline" size={64} color={colors.success} />
          <Text style={styles.emptyText}>All caught up! No pending approvals.</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item._id}
          renderItem={renderProviderItem}
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
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  providerItem: {
    backgroundColor: colors.surface,
    marginBottom: 1,
    paddingVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approveButton: {
    marginRight: 8,
  },
  rejectButton: {
    borderColor: colors.error,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProviderApprovalScreen;
