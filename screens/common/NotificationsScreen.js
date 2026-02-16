import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';
import useNotificationStore from '../../store/notificationStore';


export default function NotificationsScreen({ navigation }) {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasMore,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    fetchNotifications();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchNotifications(true);
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // Logic to navigate based on notification type and metadata
    if (notification.type === 'request' && notification.metadata?.requestId) {
      // Navigate to request details or requests tab
      // For now, just show info
      Alert.alert(notification.title, notification.message);
    } else {
      Alert.alert(notification.title, notification.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNotification(id) },
      ]
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderNotificationItem = ({ item }) => (
    <Surface style={[styles.card, !item.isRead && styles.unreadCard]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '22' }]}>
          <MaterialCommunityIcons
            name={getIconName(item.type)}
            size={24}
            color={getIconColor(item.type)}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.notificationTitle, !item.isRead && styles.boldText]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.timeText}>
            {format(new Date(item.createdAt), 'MMM d, h:mm a')}
          </Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
      <IconButton
        icon="delete-outline"
        size={20}
        iconColor={colors.textSecondary}
        onPress={() => handleDelete(item._id)}
      />
    </Surface>
  );

  const getIconName = (type) => {
    switch (type) {
      case 'request': return 'file-document-outline';
      case 'approval': return 'shield-check-outline';
      case 'update': return 'update';
      default: return 'bell-outline';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'request': return colors.info;
      case 'approval': return colors.success;
      case 'update': return colors.warning;
      default: return colors.primary;
    }
  };

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
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.headerAction}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </LinearGradient>

      {isLoading && !notifications.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isLoading && !notifications.length} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="bell-off-outline" size={80} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                We'll notify you when something important happens.
              </Text>
            </View>
          }
        />
      )}
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
  headerAction: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  unreadCard: {
    backgroundColor: '#f0f4ff', // Subtle highlight for unread
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
