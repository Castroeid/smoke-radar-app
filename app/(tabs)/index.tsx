import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SmokePulse } from '@/components/SmokePulse';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, smokeColors } from '@/constants/smokeTheme';
import { openPrivacyPolicy } from '@/services/feedback';

export default function HomeScreen() {
  const intro = useRef(new Animated.Value(0)).current;
  const launchFade = useRef(new Animated.Value(1)).current;
  const [showLaunch, setShowLaunch] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(launchFade, { toValue: 0, duration: 360, useNativeDriver: true }),
        Animated.timing(intro, { toValue: 1, duration: 620, useNativeDriver: true }),
      ]).start(() => setShowLaunch(false));
    }, 1450);

    return () => clearTimeout(timer);
  }, [intro, launchFade]);

  if (showLaunch) {
    return (
      <View style={[styles.launch, { paddingTop: Math.max(32, insets.top + 18), paddingBottom: Math.max(32, insets.bottom + 22) }]}>
        <Animated.View style={[styles.launchContent, { opacity: launchFade }]}>
          <Text style={styles.launchLogo}>SMOKE RADAR</Text>
          <SmokePulse captions={['סורק טרנדים חמים', 'בודק נתחים וקצביות', 'מדליק את הרדאר']} />
          <Text style={styles.launchText}>מעירים את הפיטמאסטר...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <AppScreen style={[styles.screen, { paddingTop: Math.max(22, insets.top + 14) }]}>
      <Animated.View
        style={[
          styles.intro,
          {
            opacity: intro,
            transform: [{ scale: intro.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
          },
        ]}>
      <View style={styles.top}>
        <Text style={styles.logo}>SMOKE RADAR</Text>
        <SmokeImage source={smokeImages.hero} height={150} contentFit="cover" />
        <SmokePulse captions={['סורק טרנדים חמים', 'מזהה נתחים מעולים', 'פותח מסלול לטעם הבא']} />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>ברוכים הבאים לרדאר העשן</Text>
        <Text style={styles.subtitle}>הטעם הבא שלכם מתחיל כאן</Text>
      </View>

      <AppCard style={styles.startCard}>
        <Text style={styles.cardText}>סרקו טרנדים, בחרו מנה, וקבלו מסלול מהיר למתכון, פיטמאסטר או קצבייה.</Text>
        <AppButton title="התחילו" onPress={() => router.push('/radar')} />
        <AppButton title="המתכונים שלי" variant="secondary" onPress={() => router.push('/my-recipes' as never)} />
        <AppButton title="שלחו משוב" variant="ghost" onPress={() => router.push({ pathname: '/feedback' as never, params: { source: 'home' } })} />
        <AppButton title="מדיניות פרטיות" variant="ghost" onPress={openPrivacyPolicy} />
      </AppCard>
      </Animated.View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  launch: {
    flex: 1,
    backgroundColor: smokeColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  launchContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    width: '100%',
  },
  launchLogo: {
    color: smokeColors.gold,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  launchText: {
    color: smokeColors.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  intro: {
    gap: 18,
  },
  top: {
    gap: 22,
  },
  logo: {
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  copy: {
    alignItems: 'stretch',
    gap: 10,
  },
  title: {
    color: smokeColors.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 39,
    ...centerBlockText,
  },
  subtitle: {
    color: smokeColors.orange,
    fontSize: 19,
    fontWeight: '900',
    ...centerBlockText,
  },
  startCard: {
    marginBottom: 6,
  },
  cardText: {
    color: smokeColors.muted,
    fontSize: 16,
    lineHeight: 25,
    ...centerBlockText,
  },
});
