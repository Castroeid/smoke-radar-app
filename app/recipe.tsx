import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { generateRecipe } from '@/services/smokeRadarService';

const methods = ['מעשנה', 'מנגל ישראלי', 'גריל פחמים', 'סיר קדירה', 'תנור ביתי', 'פלנצ׳ה', 'בישול ארוך בתנור'];
const efforts = ['מהיר', 'מאוזן', 'מושקע'];
const kosherOptions = ['כשר', 'לא כשר'];

export default function RecipeScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'אסאדו מעושן';
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(methods[0]);
  const [effort, setEffort] = useState(efforts[1]);
  const [kosherPreference, setKosherPreference] = useState(kosherOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');

    try {
      const recipe = await generateRecipe({ cut: selectedCut, method, effort, kosherPreference });
      router.push({ pathname: '/result', params: { source: 'recipe', payload: JSON.stringify(recipe), meat: selectedCut } });
    } catch {
      setError('לא הצלחנו ליצור מתכון כרגע. נסו שוב בעוד רגע.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="מחולל מתכונים"
        title="בונים מנה בכמה נגיעות"
        subtitle={`הנתח שנבחר: ${selectedCut}`}
      />

      <SmokeImage source={smokeImages.fire} height={130} />

      <View style={styles.progress}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={[styles.dot, item <= step && styles.dotActive]}>
            <Text style={[styles.dotText, item <= step && styles.dotTextActive]}>{item}</Text>
          </View>
        ))}
      </View>

      {step === 1 ? (
        <AppCard>
          <Text style={styles.stepTitle}>1. הנתח שנבחר</Text>
          <Text style={styles.selectedCut}>{selectedCut}</Text>
          <Text style={styles.helper}>אפשר לחזור לרדאר בכל רגע ולבחור מנה אחרת.</Text>
          <AppButton title="המשך לשיטת בישול" onPress={() => setStep(2)} />
        </AppCard>
      ) : null}

      {step === 2 ? (
        <ChoiceStep
          title="2. שיטת בישול"
          options={methods}
          value={method}
          onSelect={setMethod}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      ) : null}

      {step === 3 ? (
        <ChoiceStep
          title="3. כשרות"
          options={kosherOptions}
          value={kosherPreference}
          onSelect={setKosherPreference}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      ) : null}

      {step === 4 ? (
        <ChoiceStep
          title="4. זמן ורמת השקעה"
          options={efforts}
          value={effort}
          onSelect={setEffort}
          onBack={() => setStep(3)}
          onNext={generate}
          nextTitle={loading ? 'מחולל מתכון...' : 'חוללו מתכון'}
          error={error}
        />
      ) : null}
    </AppScreen>
  );
}

type ChoiceStepProps = {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  nextTitle?: string;
  error?: string;
};

function ChoiceStep({ title, options, value, onSelect, onBack, onNext, nextTitle = 'המשך', error }: ChoiceStepProps) {
  return (
    <AppCard>
      <Text style={styles.stepTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;

          return (
            <Pressable key={option} style={[styles.option, selected && styles.optionSelected]} onPress={() => onSelect(option)}>
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonRow}>
        <AppButton title="חזרה" variant="ghost" onPress={onBack} style={styles.rowButton} />
        <AppButton title={nextTitle} onPress={onNext} style={styles.rowButtonWide} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  progress: {
    ...rtlRow,
    gap: 10,
  },
  dot: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surface,
  },
  dotActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2D160E',
  },
  dotText: {
    color: smokeColors.soft,
    fontSize: 16,
    fontWeight: '900',
  },
  dotTextActive: {
    color: smokeColors.orange,
  },
  stepTitle: {
    color: smokeColors.text,
    fontSize: 24,
    fontWeight: '900',
    ...rtlText,
  },
  selectedCut: {
    color: smokeColors.orange,
    fontSize: 32,
    fontWeight: '900',
    ...rtlText,
  },
  helper: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  options: {
    gap: 10,
  },
  option: {
    minHeight: 58,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    paddingHorizontal: 16,
  },
  optionSelected: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  optionText: {
    color: smokeColors.muted,
    fontSize: 17,
    fontWeight: '900',
    ...rtlText,
  },
  optionTextSelected: {
    color: smokeColors.text,
  },
  error: {
    color: smokeColors.gold,
    fontSize: 14,
    lineHeight: 22,
    ...rtlText,
  },
  buttonRow: {
    ...rtlRow,
    gap: 10,
  },
  rowButton: {
    flex: 1,
  },
  rowButtonWide: {
    flex: 1.6,
  },
});
