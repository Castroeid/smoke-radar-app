import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { centerText, smokeColors } from '@/constants/smokeTheme';

type SmokePulseProps = {
  label?: string;
};

export function SmokePulse({ label = 'מחממים את המעשנה...' }: SmokePulseProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    );
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    sweepLoop.start();
    return () => {
      pulseLoop.stop();
      sweepLoop.stop();
    };
  }, [pulse, sweep]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.08] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] });
  const rotate = sweep.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.wrap}>
      <View style={styles.radar}>
        <Animated.View style={[styles.outerGlow, { opacity, transform: [{ scale }] }]} />
        <View style={styles.ringOuter} />
        <View style={styles.ringMiddle} />
        <View style={styles.ringInner} />
        <Animated.View style={[styles.sweep, { transform: [{ rotate }] }]}>
          <View style={styles.sweepArm} />
          <View style={styles.sweepDot} />
        </Animated.View>
        <View style={styles.core} />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
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
  radar: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: 'rgba(229, 64, 24, 0.12)',
  },
  ringOuter: {
    position: 'absolute',
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 1,
    borderColor: '#3A1A12',
  },
  ringMiddle: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: smokeColors.ember,
    backgroundColor: 'rgba(22, 12, 8, 0.6)',
  },
  ringInner: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#7A2B18',
  },
  sweep: {
    position: 'absolute',
    width: 142,
    height: 142,
    alignItems: 'center',
  },
  sweepArm: {
    width: 3,
    height: 70,
    borderRadius: 2,
    backgroundColor: smokeColors.orange,
  },
  sweepDot: {
    position: 'absolute',
    top: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: smokeColors.gold,
  },
  core: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: smokeColors.orange,
    borderWidth: 2,
    borderColor: '#FFB169',
  },
  label: {
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...centerText,
  },
});
