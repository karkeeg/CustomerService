import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAuthStore from '../../store/authStore';
import colors from '../../constants/colors';

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.role === 'provider') {
        navigation.replace('ProviderDashboard');
      } else if (user.role === 'consumer') {
        navigation.replace('ConsumerDashboard');
      } else {
        // Fallback or Admin handling if needed
        // For now, just stay here or show an error
        console.warn('Unknown user role:', user.role);
      }
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
