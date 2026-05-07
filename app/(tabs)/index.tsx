import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, smokeColors } from '@/constants/smokeTheme';

export default function HomeScreen() {
  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [intro]);

  return (
    <AppScreen scroll={false} style={styles.screen}>
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
        <SmokeImage source={smokeImages.hero} height={150} />
        <View style={styles.radar}>
          <View style={styles.ringLarge}>
            <View style={styles.ringMedium}>
              <View style={styles.ringSmall}>
                <Text style={styles.radarText}>חם</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>ברוכים הבאים לרדאר העשן</Text>
        <Text style={styles.subtitle}>הטעם הבא שלכם מתחיל כאן</Text>
      </View>

      <AppCard style={styles.startCard}>
        <Text style={styles.cardText}>סרקו טרנדים, בחרו מנה, וקבלו מסלול מהיר למתכון, מומחה או קצבייה.</Text>
        <AppButton title="התחילו" onPress={() => router.push('/radar')} />
        <AppButton title="המתכונים שלי" variant="secondary" onPress={() => router.push('/my-recipes' as never)} />
      </AppCard>
      </Animated.View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
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
  radar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  ringLarge: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 115,
    borderWidth: 1,
    borderColor: '#3A2118',
    backgroundColor: '#110B08',
  },
  ringMedium: {
    width: 164,
    height: 164,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 82,
    borderWidth: 2,
    borderColor: smokeColors.ember,
    backgroundColor: '#1A100B',
  },
  ringSmall: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 43,
    backgroundColor: smokeColors.orange,
  },
  radarText: {
    color: smokeColors.black,
    fontSize: 22,
    fontWeight: '900',
    ...centerText,
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
