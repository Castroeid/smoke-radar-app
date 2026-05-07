import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, smokeColors } from '@/constants/smokeTheme';

export default function SelectionScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה שנבחרה';

  return (
    <AppScreen scroll={false} style={styles.screen}>
      <SectionTitle title="מה תרצו לעשות?" subtitle={`בחרתם: ${selectedCut}`} />

      <SmokeImage source={smokeImages.fire} height={120} />

      <AppCard style={styles.cutCard}>
        <Text style={styles.cutLabel}>המסלול הבא שלכם</Text>
        <Text style={styles.cutTitle}>{selectedCut}</Text>
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
  actions: {
    gap: 12,
  },
});
