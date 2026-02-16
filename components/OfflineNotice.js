import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();
  const animation = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable !== false);
      setIsOffline(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    if (isOffline) {
      Animated.timing(animation, {
        toValue: insets.top,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: -100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isOffline, insets.top]);

  if (!isOffline && animation.__getValue() === -100) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { top: animation }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="wifi-off" size={20} color={colors.surface} />
        <Text style={styles.text}>No Internet Connection. Showing offline data.</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: colors.error,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  text: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});
