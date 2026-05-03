import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { rtlText, smokeColors } from '@/constants/smokeTheme';

export default function SelectionScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה שנבחרה';

  return (
    <AppScreen scroll={false} style={styles.screen}>
      <SectionTitle title="מה תרצו לעשות?" subtitle={`בחרתם: ${selectedCut}`} />

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
    ...rtlText,
  },
  cutTitle: {
    color: smokeColors.text,
    fontSize: 34,
    fontWeight: '900',
    ...rtlText,
  },
  actions: {
    gap: 12,
  },
});
