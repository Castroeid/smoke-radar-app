import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { centerText, smokeColors } from '@/constants/smokeTheme';

type SmokePulseProps = {
  label?: string;
};

export function SmokePulse({ label = 'מחממים את המעשנה...' }: SmokePulseProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.08] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.outer, { opacity, transform: [{ scale }] }]}>
        <View style={styles.inner} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  outer: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 59,
    borderWidth: 2,
    borderColor: smokeColors.ember,
    backgroundColor: '#160C08',
  },
  inner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: smokeColors.orange,
  },
  label: {
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...centerText,
  },
});
