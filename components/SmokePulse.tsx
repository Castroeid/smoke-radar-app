import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { centerText, smokeColors } from '@/constants/smokeTheme';

type SmokePulseProps = {
  label?: string;
  captions?: string[];
};

export function SmokePulse({ label = 'הרדאר סורק...', captions }: SmokePulseProps) {
  const scan = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const core = useRef(new Animated.Value(0)).current;
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 4600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const coreLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(core, { toValue: 1, duration: 980, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(core, { toValue: 0, duration: 980, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    scanLoop.start();
    pulseLoop.start();
    coreLoop.start();

    return () => {
      scanLoop.stop();
      pulseLoop.stop();
      coreLoop.stop();
    };
  }, [core, pulse, scan]);

  useEffect(() => {
    setCaptionIndex(0);

    if (!captions || captions.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCaptionIndex((current) => (current + 1) % captions.length);
    }, 1750);

    return () => clearInterval(interval);
  }, [captions]);

  const rotate = scan.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.52] });
  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] });
  const coreScale = core.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.035] });
  const activeCaption = captions?.[captionIndex] ?? label;

  return (
    <View style={styles.wrap}>
      <View style={styles.radar}>
        <Animated.View style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]} />
        <View style={styles.outerRing} />
        <View style={styles.middleRing} />
        <View style={styles.innerRing} />

        <Animated.View style={[styles.scanLayer, { transform: [{ rotate }] }]}>
          <View style={styles.smokeTrailOne} />
          <View style={styles.smokeTrailTwo} />
          <View style={styles.smokeTrailThree} />
          <View style={styles.scanLine} />
          <View style={styles.scanDot} />
        </Animated.View>

        <View style={[styles.signalDot, styles.signalDotOne]} />
        <View style={[styles.signalDot, styles.signalDotTwo]} />
        <View style={[styles.signalDot, styles.signalDotThree]} />

        <Animated.View style={[styles.core, { transform: [{ scale: coreScale }] }]}>
          <Text style={styles.coreText}>חם</Text>
        </Animated.View>
      </View>

      {activeCaption ? <Text style={styles.label}>{activeCaption}</Text> : null}
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
  radar: {
    width: 214,
    height: 214,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: 'rgba(255, 92, 22, 0.14)',
  },
  outerRing: {
    position: 'absolute',
    width: 188,
    height: 188,
    borderRadius: 94,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 26, 0.18)',
  },
  middleRing: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: 'rgba(229, 64, 24, 0.82)',
    backgroundColor: 'rgba(20, 8, 5, 0.48)',
  },
  innerRing: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 102, 0.26)',
  },
  scanLayer: {
    position: 'absolute',
    width: 188,
    height: 188,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  smokeTrailOne: {
    position: 'absolute',
    top: 28,
    width: 18,
    height: 66,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 247, 240, 0.10)',
    transform: [{ translateX: -14 }, { rotate: '-16deg' }],
  },
  smokeTrailTwo: {
    position: 'absolute',
    top: 42,
    width: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 122, 26, 0.10)',
    transform: [{ translateX: -25 }, { rotate: '-28deg' }],
  },
  smokeTrailThree: {
    position: 'absolute',
    top: 56,
    width: 8,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 193, 102, 0.12)',
    transform: [{ translateX: -34 }, { rotate: '-38deg' }],
  },
  scanLine: {
    position: 'absolute',
    top: 13,
    width: 3,
    height: 80,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 193, 102, 0.64)',
  },
  scanDot: {
    position: 'absolute',
    top: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: smokeColors.gold,
  },
  signalDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 193, 102, 0.72)',
  },
  signalDotOne: {
    top: 58,
    right: 52,
  },
  signalDotTwo: {
    left: 54,
    top: 96,
    backgroundColor: 'rgba(255, 122, 26, 0.64)',
  },
  signalDotThree: {
    right: 88,
    bottom: 42,
    backgroundColor: 'rgba(255, 247, 240, 0.42)',
  },
  core: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: smokeColors.orange,
    shadowColor: smokeColors.orange,
    shadowOpacity: 0.36,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  coreText: {
    color: smokeColors.black,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 29,
    ...centerText,
  },
  label: {
    minHeight: 22,
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...centerText,
  },
});
