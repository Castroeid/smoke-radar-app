import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, smokeColors } from '@/constants/smokeTheme';

const cuts = ['אסאדו מעושן', 'בריסקט קלאסי', 'פיקניה צרובה', 'כנפיים ברוטב אש', 'שורט ריבס', 'אנטריקוט', 'צלעות טלה', 'פרגית', 'חזה עוף'];

export default function SelectionScreen() {
  const { meat, custom } = useLocalSearchParams<{ meat?: string; custom?: string }>();
  const initialCut = typeof meat === 'string' && meat.length > 0 ? meat : cuts[0];
  const [selectedCut, setSelectedCut] = useState(initialCut);
  const allowCustomCut = custom === 'true' || !meat;

  return (
    <AppScreen style={styles.screen}>
      <SectionTitle title="מה תרצו לעשות?" subtitle={`בחרתם: ${selectedCut}`} />

      <SmokeImage source={smokeImages.fire} height={120} />

      <AppCard style={styles.cutCard}>
        <Text style={styles.cutLabel}>המסלול הבא שלכם</Text>
        <Text style={styles.cutTitle}>{selectedCut}</Text>
        {allowCustomCut ? (
          <View style={styles.cutGrid}>
            {cuts.map((cut) => (
              <AppButton
                key={cut}
                title={cut}
                variant={cut === selectedCut ? 'primary' : 'secondary'}
                onPress={() => setSelectedCut(cut)}
                style={styles.cutOption}
              />
            ))}
          </View>
        ) : null}
      </AppCard>

      <View style={styles.actions}>
        <AppButton title="לחולל מתכון" onPress={() => router.push({ pathname: '/recipe', params: { meat: selectedCut } })} />
        <AppButton
          title="לשאול את המומחה"
          variant="secondary"
          onPress={() => router.push({ pathname: '/expert', params: { meat: selectedCut } })}
        />
        <AppButton
          title="למצוא קצבייה קרובה"
          variant="secondary"
          onPress={() => router.push({ pathname: '/butcher', params: { meat: selectedCut } })}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 760,
  },
  cutCard: {
    borderColor: smokeColors.orange,
  },
  cutLabel: {
    color: smokeColors.muted,
    fontSize: 14,
    fontWeight: '800',
    ...centerBlockText,
  },
  cutTitle: {
    color: smokeColors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    ...centerBlockText,
  },
  cutGrid: {
    gap: 8,
  },
  cutOption: {
    minHeight: 48,
  },
  actions: {
    gap: 12,
  },
});
