import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, smokeColors } from '@/constants/smokeTheme';
import { getTrendingCuts, type RadarCut } from '@/services/smokeRadarService';

export default function RadarScreen() {
  const [items, setItems] = useState<RadarCut[]>([]);
  const [selectedCut, setSelectedCut] = useState<RadarCut | null>(null);

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

  return (
    <AppScreen>
      <SectionTitle title="מה חם עכשיו?" subtitle="בחרו טרנד בשרי אחד והמשיכו למסלול שמתאים לכם." />

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
