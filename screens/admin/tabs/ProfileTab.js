import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, List, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import useAuthStore from '../../../store/authStore';

const ProfileTab = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.user?.substring(0, 2).toUpperCase() || 'AD'} 
          style={styles.avatar}
          backgroundColor={colors.primary}
        />
        <Text style={styles.userName}>{user?.user || 'Administrator'}</Text>
        <Text style={styles.userRole}>System Administrator</Text>
      </View>

      <View style={styles.section}>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="account-edit-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('EditProfile')}
        />
        <Divider />
        <List.Item
          title="System Settings"
          left={(props) => <List.Icon {...props} icon="cog-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Security"
          left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.logoutSection}>
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.error}
          icon="logout"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.surface,
  },
  avatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    backgroundColor: colors.surface,
  },
  logoutSection: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});

export default ProfileTab;
