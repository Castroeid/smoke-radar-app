import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { SmokePulse } from '@/components/SmokePulse';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, rtlRow, smokeColors } from '@/constants/smokeTheme';
import { normalizeCutName } from '@/services/cutUtils';
import { generateRecipe } from '@/services/smokeRadarService';

const methods = ['מעשנה', 'מנגל ישראלי', 'גריל פחמים', 'סיר קדירה', 'תנור ביתי', 'פלנצ׳ה', 'בישול ארוך בתנור'];
const efforts = ['מהיר', 'מאוזן', 'מושקע'];
const kosherOptions = ['כשר', 'לא כשר'];
const seasoningStyles = ['קלאסי', 'ישראלי', 'מתוק מעושן', 'מתקתק', 'מעושן עמוק', 'חריף', 'עשבי תיבול', 'אסייתי'];
const methodDescriptions: Record<string, string> = {
  מעשנה: 'חום עקיף נמוך עם עשן עדין. מתאים לנתחים שצריכים זמן, צבע ורכות.',
  'מנגל ישראלי': 'רשת פתוחה מעל גחלים. עבודה מהירה יחסית עם אזור חם ואזור רגוע, כמו מנגל ביתי.',
  'גריל פחמים': 'שליטה מדויקת יותר עם גחלים, מכסה ואזורים. טוב גם לנתחים עבים שצריכים סיום עקיף.',
  'סיר קדירה': 'צריבה ואז בישול איטי בנוזלים עד רכות. מתאים לאסאדו, אונטריב ונתחים סיביים.',
  'תנור ביתי': 'בישול יציב ונוח בבית, עם צריבה לפני או אחרי לפי הנתח.',
  'פלנצ׳ה': 'משטח חם לצריבה מהירה. מתאים לנתחים דקים, פרגית וסטייקים קצרים.',
  'בישול ארוך בתנור': 'חום נמוך לאורך זמן, לריכוך נתח גדול בלי מעשנה.',
};
const seasoningDescriptions: Record<string, string> = {
  קלאסי: 'מלח, פלפל, שום ומעט שמן. נותן לנתח לדבר.',
  ישראלי: 'שמן זית, לימון, שום, פפריקה, כמון/בהרט ועשבי תיבול.',
  'מתוק מעושן': 'פפריקה מעושנת וסילאן בכמות מדויקת, עם זהירות מסוכר על אש גבוהה.',
  מתקתק: 'סילאן או דבש במידה, מתאים במיוחד לגלייז וסיום.',
  'מעושן עמוק': 'פפריקה מעושנת, פלפל ושום לטעם עמוק גם בלי הרבה רוטב.',
  חריף: 'אריסה, צ׳ילי או פלפל חריף עם איזון חמיצות.',
  'עשבי תיבול': 'רוזמרין, טימין, פטרוזיליה או כוסברה לפי הנתח.',
  אסייתי: 'סויה, ג׳ינג׳ר, שום, שומשום וצ׳ילי.',
};

export default function RecipeScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedTrend = typeof meat === 'string' && meat.length > 0 ? meat : 'אסאדו';
  const selectedCut = normalizeCutName(selectedTrend);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(methods[0]);
  const [effort, setEffort] = useState(efforts[1]);
  const [kosherPreference, setKosherPreference] = useState(kosherOptions[0]);
  const [seasoningStyle, setSeasoningStyle] = useState(seasoningStyles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');

    try {
      const recipe = await generateRecipe({ cut: selectedCut, method, effort, kosherPreference, seasoningStyle });
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

      <SmokeImage source={smokeImages.choiceCuts} height={140} />
      <SmokePulse
        captions={
          loading
            ? ['מעיר את הפיטמאסטר', 'בודק את הנתח שבחרתם', 'מרכיב מתכון לפי השיטה', 'מסיים כמויות וטמפרטורות']
            : ['סורק את הנתח', 'מתאים שיטת בישול', 'מחשב תיבול וזמנים']
        }
      />

      <View style={styles.progress}>
        {[1, 2, 3, 4, 5].map((item) => (
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
          descriptions={methodDescriptions}
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
          title="4. סגנון תיבול"
          options={seasoningStyles}
          value={seasoningStyle}
          onSelect={setSeasoningStyle}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
          descriptions={seasoningDescriptions}
        />
      ) : null}

      {step === 5 ? (
        <ChoiceStep
          title="5. זמן ורמת השקעה"
          options={efforts}
          value={effort}
          onSelect={setEffort}
          onBack={() => setStep(4)}
          onNext={generate}
          nextTitle={loading ? 'מעיר את הפיטמאסטר...' : 'חוללו מתכון'}
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
  descriptions?: Record<string, string>;
};

function ChoiceStep({ title, options, value, onSelect, onBack, onNext, nextTitle = 'המשך', error, descriptions }: ChoiceStepProps) {
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
      {descriptions?.[value] ? (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>מה זה אומר?</Text>
          <Text style={styles.descriptionText}>{descriptions[value]}</Text>
        </View>
      ) : null}
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
    justifyContent: 'center',
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
    ...centerBlockText,
  },
  selectedCut: {
    color: smokeColors.orange,
    fontSize: 30,
    fontWeight: '900',
    ...centerBlockText,
  },
  helper: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...centerBlockText,
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
    ...centerText,
  },
  optionTextSelected: {
    color: smokeColors.text,
  },
  descriptionBox: {
    gap: 5,
    borderRadius: 16,
    backgroundColor: '#120B08',
    padding: 13,
  },
  descriptionTitle: {
    color: smokeColors.gold,
    fontSize: 14,
    fontWeight: '900',
    ...centerBlockText,
  },
  descriptionText: {
    color: smokeColors.muted,
    fontSize: 14,
    lineHeight: 21,
    ...centerBlockText,
  },
  error: {
    color: smokeColors.gold,
    fontSize: 14,
    lineHeight: 22,
    ...centerBlockText,
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
