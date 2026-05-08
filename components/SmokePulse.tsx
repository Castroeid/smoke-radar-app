import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { centerText, smokeColors } from '@/constants/smokeTheme';

type SmokePulseProps = {
  label?: string;
};

export function SmokePulse({ label = 'בודק טמפרטורה...' }: SmokePulseProps) {
  const heat = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const heatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(heat, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.delay(520),
        Animated.timing(heat, {
          toValue: 0.7,
          duration: 720,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(420),
        Animated.timing(heat, {
          toValue: 0.2,
          duration: 680,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );

    heatLoop.start();
    glowLoop.start();

    return () => {
      heatLoop.stop();
      glowLoop.stop();
    };
  }, [glow, heat]);

  const fillWidth = heat.interpolate({ inputRange: [0, 1], outputRange: ['18%', '84%'] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.75] });
  const meatScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.meat, { transform: [{ scale: meatScale }] }]}>
        <Animated.View style={[styles.heatGlow, { opacity: glowOpacity }]} />
        <View style={styles.fatLine} />
        <View style={styles.searLineOne} />
        <View style={styles.searLineTwo} />
        <View style={styles.probe}>
          <View style={styles.probeTip} />
          <View style={styles.thermometerTrack}>
            <Animated.View style={[styles.thermometerFill, { width: fillWidth }]} />
          </View>
          <View style={styles.probeCap}>
            <Text style={styles.tempText}>72°</Text>
          </View>
        </View>
      </Animated.View>
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
  meat: {
    width: 178,
    height: 116,
    justifyContent: 'center',
    borderRadius: 58,
    borderWidth: 2,
    borderColor: '#5C2317',
    backgroundColor: '#2A0E08',
    overflow: 'hidden',
    shadowColor: smokeColors.ember,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  heatGlow: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 110,
    height: 72,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 122, 26, 0.22)',
  },
  fatLine: {
    position: 'absolute',
    right: 22,
    top: 22,
    width: 118,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 193, 102, 0.28)',
    transform: [{ rotate: '-7deg' }],
  },
  searLineOne: {
    position: 'absolute',
    right: 42,
    bottom: 26,
    width: 86,
    height: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(12, 5, 3, 0.7)',
    transform: [{ rotate: '13deg' }],
  },
  searLineTwo: {
    position: 'absolute',
    right: 52,
    bottom: 45,
    width: 74,
    height: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(12, 5, 3, 0.58)',
    transform: [{ rotate: '13deg' }],
  },
  probe: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  probeTip: {
    width: 28,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D9D2C8',
  },
  thermometerTrack: {
    width: 92,
    height: 14,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#D9D2C8',
    backgroundColor: '#170A06',
  },
  thermometerFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: smokeColors.orange,
  },
  probeCap: {
    minWidth: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#D9D2C8',
    backgroundColor: smokeColors.gold,
  },
  tempText: {
    color: smokeColors.black,
    fontSize: 13,
    fontWeight: '900',
    ...centerText,
  },
  label: {
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...centerText,
  },
});
