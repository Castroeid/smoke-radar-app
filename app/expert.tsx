import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { askExpert } from '@/services/smokeRadarService';

export default function ExpertScreen() {
  const { meat, question: initialQuestion } = useLocalSearchParams<{ meat?: string; question?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'הנתח שבחרתם';
  const [question, setQuestion] = useState(typeof initialQuestion === 'string' ? initialQuestion : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const text = question.trim() || `מה חשוב לדעת על ${selectedCut}?`;

    setLoading(true);
    setError('');

    try {
      const answer = await askExpert(text);
      router.push({ pathname: '/result', params: { source: 'expert', payload: JSON.stringify(answer), meat: selectedCut } });
    } catch {
      setError('לא הצלחנו לקבל תשובה כרגע. נסו שוב בעוד רגע.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="שאל את הפיטמאסטר"
        title="שאלה מהירה על בשר, אש ועשן"
        subtitle="תשובה קצרה ומעשית בסגנון פיטמאסטר: חום, זמן, מרקם וטעות אחת שכדאי לא לעשות."
      />

      <SmokeImage source={smokeImages.expert} height={155} />

      <AppCard>
        <Text style={styles.label}>על מה תרצו לשאול?</Text>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="שאלו על נתחים, זמני צלייה או טיפים למעשנה"
          placeholderTextColor={smokeColors.soft}
          multiline
          textAlign="right"
          textAlignVertical="top"
        />
        <View style={styles.context}>
          <Text style={styles.contextLabel}>הקשר</Text>
          <Text style={styles.contextValue}>{selectedCut}</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title={loading ? 'מעיר את הפיטמאסטר...' : 'שלחו שאלה'} onPress={submit} />
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: smokeColors.text,
    fontSize: 20,
    fontWeight: '900',
    ...centerBlockText,
  },
  input: {
    minHeight: 170,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    color: smokeColors.text,
    fontSize: 17,
    lineHeight: 25,
    padding: 16,
    writingDirection: 'rtl',
  },
  context: {
    ...rtlRow,
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: '#120B08',
    padding: 14,
  },
  contextLabel: {
    color: smokeColors.muted,
    fontSize: 14,
    fontWeight: '800',
    ...rtlText,
  },
  contextValue: {
    color: smokeColors.orange,
    fontSize: 15,
    fontWeight: '900',
    ...rtlText,
  },
  error: {
    color: smokeColors.gold,
    fontSize: 14,
    lineHeight: 22,
    ...rtlText,
  },
});
