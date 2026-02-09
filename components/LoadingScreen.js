import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

/**
 * Universal Loading Screen - Transparent Overlay
 * Shows animated running man with horizontal loading bar
 * 
 * @param {string} message - Optional loading message
 */
export default function LoadingScreen({ message = 'Loading...' }) {
  // Animation values
  const runAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Running man animation (left to right)
    Animated.loop(
      Animated.sequence([
        Animated.timing(runAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(runAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation (0 to 100%)
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Calculate running man position
  const runTranslateX = runAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, width - 50],
  });

  // Calculate progress bar width
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.popup, { opacity: fadeAnimation }]}>
        {/* Running Man Animation */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.runningMan,
              {
                transform: [{ translateX: runTranslateX }],
              },
            ]}
          >
            <MaterialCommunityIcons 
              name="run" 
              size={50} 
              color={colors.primary} 
            />
          </Animated.View>
        </View>

        {/* Horizontal Loading Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        {/* Loading Message */}
        {message && <Text style={styles.loadingText}>{message}</Text>}

        {/* Loading Dots Animation */}
        <LoadingDots />
      </Animated.View>
    </View>
  );
}

// Animated loading dots component
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  const dotStyle = (animation) => ({
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, dotStyle(dot1)]} />
      <Animated.View style={[styles.dot, dotStyle(dot2)]} />
      <Animated.View style={[styles.dot, dotStyle(dot3)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  popup: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 40,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  animationContainer: {
    width: '100%',
    height: 70,
    marginBottom: 20,
    position: 'relative',
  },
  runningMan: {
    position: 'absolute',
    top: 10,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
