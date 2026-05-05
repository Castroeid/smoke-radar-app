import { router, useLocalSearchParams } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { rtlText, smokeColors } from '@/constants/smokeTheme';
import type { ExpertAnswer, RecipeResult } from '@/services/smokeRadarService';

export default function ResultScreen() {
  const { source, payload, meat } = useLocalSearchParams<{ source?: string; payload?: string; meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה';
  const title = source === 'recipe' ? 'המתכון שלכם מוכן' : 'תשובה מהמומחה';

  const shareResult = async () => {
    await Share.share({ message: `Smoke Radar: ${title}` });
  };

  const tryAgain = () => {
    if (source === 'expert') {
      router.push({ pathname: '/expert', params: { meat: selectedCut } });
      return;
    }

    router.push({ pathname: '/recipe', params: { meat: selectedCut } });
  };

  return (
    <AppScreen>
      <SectionTitle title={title} subtitle="אפשר להמשיך, לשתף או לחזור לרדאר." />

      {source === 'recipe' && payload ? <RecipeView recipe={JSON.parse(payload) as RecipeResult} /> : null}
      {source === 'expert' && payload ? <ExpertView answer={JSON.parse(payload) as ExpertAnswer} /> : null}

      <AppCard>
        <Text style={styles.nextTitle}>פעולות המשך</Text>
        <View style={styles.actionGrid}>
          <AppButton title="נסו שוב" variant="secondary" onPress={tryAgain} style={styles.actionButton} />
          <AppButton title="חזרו לרדאר" onPress={() => router.push('/radar')} style={styles.actionButton} />
        </View>
        <AppButton title="שתפו" variant="ghost" onPress={shareResult} />
      </AppCard>
    </AppScreen>
  );
}

function RecipeView({ recipe }: { recipe: RecipeResult }) {
  return (
    <AppCard elevated>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <View style={styles.metaRow}>
        <Meta label="זמן הכנה" value={recipe.prepTime} />
        <Meta label="קושי" value={recipe.difficulty} />
      </View>

      <ResultSection title="מצרכים" items={recipe.ingredients} />
      <ResultSection title="שלבים" items={recipe.steps} numbered />
      <ResultSection title="תוספות מומלצות" items={recipe.sideDishes} />
      <ResultSection title="רטבים" items={recipe.sauces} />
    </AppCard>
  );
}

function ExpertView({ answer }: { answer: ExpertAnswer }) {
  const paragraphs = cleanExpertText(answer.answer);

  return (
    <AppCard elevated>
      <Text style={styles.question}>{answer.question}</Text>
      <View style={styles.answerBlock}>
        {paragraphs.map((paragraph) => (
          <Text key={paragraph} style={styles.answer}>{paragraph}</Text>
        ))}
      </View>
      <ResultSection title="טיפים קצרים" items={answer.tips.map(cleanInlineText)} numbered />
    </AppCard>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaBox}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function ResultSection({ title, items, numbered = false }: { title: string; items: string[]; numbered?: boolean }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={`${title}-${index}-${item}`} style={styles.itemRow}>
          <Text style={styles.bullet}>{numbered ? index + 1 : '•'}</Text>
          <Text style={styles.itemText}>{cleanInlineText(item)}</Text>
        </View>
      ))}
    </View>
  );
}

function cleanExpertText(value: string) {
  const cleaned = value
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
}

function cleanInlineText(value: string) {
  return value
    .replace(/^#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*[-*]\s+/g, '')
    .replace(/^\s*\d+\.\s+/g, '')
    .trim();
}

const styles = StyleSheet.create({
  recipeTitle: {
    color: smokeColors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 37,
    ...rtlText,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  metaBox: {
    flex: 1,
    gap: 5,
    borderRadius: 16,
    backgroundColor: '#120B08',
    padding: 13,
  },
  metaLabel: {
    color: smokeColors.muted,
    fontSize: 12,
    fontWeight: '800',
    ...rtlText,
  },
  metaValue: {
    color: smokeColors.orange,
    fontSize: 17,
    fontWeight: '900',
    ...rtlText,
  },
  section: {
    gap: 8,
    marginTop: 2,
  },
  sectionTitle: {
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  itemRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#120B08',
    padding: 12,
  },
  bullet: {
    width: 24,
    color: smokeColors.orange,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  itemText: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  question: {
    borderRadius: 16,
    backgroundColor: '#120B08',
    color: smokeColors.gold,
    fontSize: 17,
    lineHeight: 25,
    padding: 14,
    ...rtlText,
  },
  answerBlock: {
    gap: 10,
  },
  answer: {
    color: smokeColors.text,
    fontSize: 17,
    lineHeight: 28,
    ...rtlText,
  },
  nextTitle: {
    color: smokeColors.text,
    fontSize: 22,
    fontWeight: '900',
    ...rtlText,
  },
  actionGrid: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
