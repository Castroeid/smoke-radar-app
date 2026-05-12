import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { getTrendingCuts, type RadarCut } from '@/services/smokeRadarService';

export default function RadarScreen() {
  const [items, setItems] = useState<RadarCut[]>([]);
  const [selectedCut, setSelectedCut] = useState<RadarCut | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    getTrendingCuts().then((cuts) => {
      setItems(cuts);
      setSelectedCut(cuts[0] ?? null);
    });
  }, []);

  const continueToActions = () => {
    if (selectedCut) {
      router.push({ pathname: '/selection', params: { meat: selectedCut.title } });
    }
  };

  const continueWithoutTrend = () => {
    router.push({ pathname: '/selection', params: { custom: 'true' } });
  };

  return (
    <AppScreen>
      <SectionTitle title="מה חם עכשיו?" subtitle="בחרו טרנד בשרי אחד והמשיכו למסלול שמתאים לכם." />

      <Pressable style={styles.infoButton} onPress={() => setShowInfo((current) => !current)}>
        <Text style={styles.infoIcon}>i</Text>
        <Text style={styles.infoText}>מה זה אומר?</Text>
      </Pressable>

      {showInfo ? (
        <AppCard style={styles.infoCard}>
          <Text style={styles.infoBody}>
            הרדאר מציג כרגע טרנדים מדומים ומומנטום לדוגמה כדי לדמות את זרימת האתר. בהמשך נחבר נתוני שימוש, חיפושים ומתכונים אמיתיים כדי לייצר דירוג חי.
          </Text>
        </AppCard>
      ) : null}

      <SmokeImage source={smokeImages.smoker} height={135} />

      <View style={styles.signal}>
        <Text style={styles.signalValue}>{selectedCut?.momentum ?? '--'}</Text>
        <Text style={styles.signalLabel}>רדאר פעיל</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const selected = selectedCut?.id === item.id;

          return (
            <Pressable key={item.id} onPress={() => setSelectedCut(item)}>
              <AppCard elevated={selected} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.score}>{item.heatScore}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.momentum}>מומנטום {item.momentum}</Text>
              </AppCard>
            </Pressable>
          );
        })}
      </View>

      <AppButton title="בחרו מנה" onPress={continueToActions} />
      <AppButton title="תנו לי לבחור את הנתח" variant="secondary" onPress={continueWithoutTrend} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  signal: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 18,
  },
  signalLabel: {
    color: smokeColors.muted,
    fontSize: 16,
    fontWeight: '800',
    ...centerText,
  },
  signalValue: {
    color: smokeColors.orange,
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    ...centerText,
  },
  list: {
    gap: 12,
  },
  infoButton: {
    alignSelf: 'center',
    ...rtlRow,
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: smokeColors.orange,
    color: smokeColors.black,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 24,
    ...centerText,
  },
  infoText: {
    color: smokeColors.text,
    fontSize: 14,
    fontWeight: '900',
    ...rtlText,
  },
  infoCard: {
    borderColor: smokeColors.orange,
  },
  infoBody: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  card: {
    minHeight: 158,
    alignItems: 'center',
  },
  cardTop: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cardTitle: {
    color: smokeColors.text,
    fontSize: 23,
    fontWeight: '900',
    ...centerBlockText,
  },
  score: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#2B140E',
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    ...centerText,
  },
  description: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...centerBlockText,
  },
  momentum: {
    color: smokeColors.orange,
    fontSize: 14,
    fontWeight: '900',
    ...centerBlockText,
  },
});
