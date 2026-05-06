import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
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
        <Text style={styles.signalLabel}>רדאר פעיל</Text>
        <Text style={styles.signalValue}>{selectedCut?.momentum ?? '--'}</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const selected = selectedCut?.id === item.id;

          return (
            <Pressable key={item.id} onPress={() => setSelectedCut(item)}>
              <AppCard elevated={selected} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.score}>{item.heatScore}</Text>
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
    minHeight: 88,
    ...rtlRow,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 18,
  },
  signalLabel: {
    flex: 1,
    color: smokeColors.muted,
    fontSize: 16,
    fontWeight: '800',
    ...rtlText,
  },
  signalValue: {
    flexShrink: 0,
    minWidth: 92,
    color: smokeColors.orange,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'left',
  },
  list: {
    gap: 12,
  },
  card: {
    minHeight: 130,
  },
  cardTop: {
    ...rtlRow,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 23,
    fontWeight: '900',
    ...rtlText,
  },
  score: {
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#2B140E',
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    ...rtlText,
  },
  description: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  momentum: {
    color: smokeColors.orange,
    fontSize: 14,
    fontWeight: '900',
    ...rtlText,
  },
});
