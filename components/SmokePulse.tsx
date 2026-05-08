import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { centerText, smokeColors } from '@/constants/smokeTheme';

const thermometerMeat = require('../assets/images/smoke-thermometer-meat.jpg');

type SmokePulseProps = {
  label?: string;
};

export function SmokePulse({ label = 'בודק טמפרטורה...' }: SmokePulseProps) {
  const heat = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const smoke = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const heatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(heat, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.delay(720),
        Animated.timing(heat, {
          toValue: 0.76,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(460),
        Animated.timing(heat, {
          toValue: 0.18,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1350, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1350, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const smokeLoop = Animated.loop(
      Animated.timing(smoke, {
        toValue: 1,
        duration: 2600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    );

    heatLoop.start();
    breatheLoop.start();
    smokeLoop.start();

    return () => {
      heatLoop.stop();
      breatheLoop.stop();
      smokeLoop.stop();
    };
  }, [breathe, heat, smoke]);

  const fillWidth = heat.interpolate({ inputRange: [0, 1], outputRange: [22, 124] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.48] });
  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.05] });
  const smokeLift = smoke.interpolate({ inputRange: [0, 1], outputRange: [12, -18] });
  const smokeOpacity = smoke.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 0.28, 0] });

  return (
    <View style={styles.wrap}>
      <View style={styles.visual}>
        <Image source={thermometerMeat} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="memory-disk" />
        <View style={styles.photoShade} />
        <Animated.View style={[styles.heatGlow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
        <Animated.View
          style={[styles.smokeWisp, styles.smokeOne, { opacity: smokeOpacity, transform: [{ translateY: smokeLift }, { rotate: '-14deg' }] }]}
        />
        <Animated.View
          style={[styles.smokeWisp, styles.smokeTwo, { opacity: smokeOpacity, transform: [{ translateY: smokeLift }, { rotate: '14deg' }] }]}
        />

        <View style={styles.tempPanel}>
          <View style={styles.tempTop}>
            <Text style={styles.tempNumber}>72°</Text>
            <Text style={styles.tempCaption}>מתייצב</Text>
          </View>
          <View style={styles.tempTrack}>
            <Animated.View style={[styles.tempFill, { width: fillWidth }]} />
          </View>
        </View>
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
    paddingVertical: 16,
  },
  visual: {
    width: 232,
    height: 146,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#3C241A',
    backgroundColor: '#0C0806',
    shadowColor: smokeColors.orange,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  photoShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  heatGlow: {
    position: 'absolute',
    right: 18,
    bottom: 10,
    width: 168,
    height: 72,
    borderRadius: 56,
    backgroundColor: 'rgba(255, 104, 20, 0.34)',
  },
  smokeWisp: {
    position: 'absolute',
    width: 58,
    height: 108,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 247, 240, 0.18)',
  },
  smokeOne: {
    top: 18,
    left: 34,
  },
  smokeTwo: {
    top: 22,
    right: 34,
  },
  tempPanel: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    width: 154,
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 102, 0.3)',
    backgroundColor: 'rgba(8, 6, 5, 0.72)',
    padding: 11,
  },
  tempTop: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  tempNumber: {
    color: smokeColors.gold,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tempCaption: {
    color: smokeColors.muted,
    fontSize: 12,
    fontWeight: '900',
    ...centerText,
  },
  tempTrack: {
    width: '100%',
    height: 7,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 247, 240, 0.16)',
  },
  tempFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: smokeColors.orange,
  },
  label: {
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...centerText,
  },
});
