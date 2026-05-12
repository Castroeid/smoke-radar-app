import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { saveRecipe } from '@/services/savedRecipes';
import type { ExpertAnswer, RecipeResult, RecipeSauce, RecipeSideDish } from '@/services/smokeRadarTypes';

type ResultSource = 'recipe' | 'expert';

export default function ResultScreen() {
  const { source, payload, meat } = useLocalSearchParams<{ source?: ResultSource; payload?: string; meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה';
  const title = source === 'recipe' ? 'המתכון שלכם מוכן' : 'תשובה מהפיטמאסטר';

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

  const goToShopping = () => {
    if (!payload) {
      return;
    }

    router.push({ pathname: '/shopping', params: { payload, meat: selectedCut } });
  };

  const parsedPayload = useMemo(() => parsePayload(payload), [payload]);
  const heroImage = getResultImage(source, parsedPayload, selectedCut);
  const [saveState, setSaveState] = useState('');

  return (
    <AppScreen>
      <SectionTitle title={title} subtitle="אפשר להמשיך לרשימת קניות, לשתף או לחזור לרדאר." />
      <SmokeImage source={heroImage} height={135} />

      {source === 'recipe' && parsedPayload ? <RecipeView recipe={parsedPayload as RecipeResult} /> : null}
      {source === 'expert' && parsedPayload ? <ExpertView answer={parsedPayload as ExpertAnswer} /> : null}

      <AppCard>
        <Text style={styles.nextTitle}>פעולות המשך</Text>
        {source === 'recipe' ? <AppButton title="המשך למצרכים" onPress={goToShopping} /> : null}
        {source === 'recipe' && parsedPayload ? (
          <>
            <AppButton
              title={saveState || 'שמרו מתכון'}
              variant="secondary"
              onPress={async () => {
                await saveRecipe(parsedPayload as RecipeResult);
                setSaveState('המתכון נשמר');
              }}
            />
            <AppButton title="שתפו מתכון מלא" variant="ghost" onPress={() => shareRecipe(parsedPayload as RecipeResult)} />
            <AppButton title="המתכונים שלי" variant="ghost" onPress={() => router.push('/my-recipes' as never)} />
          </>
        ) : null}
        <View style={styles.actionGrid}>
          <AppButton title="נסו שוב" variant="secondary" onPress={tryAgain} style={styles.actionButton} />
          <AppButton title="חזרו לרדאר" onPress={() => router.push('/radar')} style={styles.actionButton} />
        </View>
        {source !== 'recipe' ? <AppButton title="שתפו" variant="ghost" onPress={shareResult} /> : null}
      </AppCard>
    </AppScreen>
  );
}

async function shareRecipe(recipe: RecipeResult) {
  await Share.share({ message: formatRecipeForShare(recipe) });
}

function formatRecipeForShare(recipe: RecipeResult) {
  const sideDishes = normalizeSideDishes(recipe.sideDishes);
  const sauces = normalizeSauces(recipe.sauces);
  const lines = [
    `Smoke Radar - ${recipe.title}`,
    `זמן הכנה: ${recipe.prepTime}`,
    `קושי: ${recipe.difficulty}`,
    '',
    'מצרכים:',
    ...recipe.ingredients.map((item) => `• ${cleanInlineText(item)}`),
    '',
    'שלבי הכנה:',
    ...recipe.steps.map((item, index) => `${index + 1}. ${cleanInlineText(item)}`),
    '',
    'טיפים לשיטת הבישול:',
    ...getMethodGuide(recipe).map((item, index) => `${index + 1}. ${cleanInlineText(item)}`),
    '',
    'תוספות:',
    ...sideDishes.flatMap((dish) => [
      `• ${cleanInlineText(dish.title)} - ${cleanInlineText(dish.description)}`,
      ...dish.steps.map((step, index) => `  ${index + 1}. ${cleanInlineText(step)}`),
    ]),
    '',
    'רטבים:',
    ...sauces.flatMap((sauce) => [
      `• ${cleanInlineText(sauce.title)} - ${cleanInlineText(sauce.description)}`,
      `  רכיבים: ${sauce.ingredients.map(cleanInlineText).join(', ')}`,
      ...sauce.steps.map((step, index) => `  ${index + 1}. ${cleanInlineText(step)}`),
    ]),
    '',
    'חזרה מהירה לאפליקציה:',
    'smokeradarapp://my-recipes',
  ];

  return lines.join('\n');
}

function getResultImage(source: ResultSource | undefined, payload: unknown, selectedCut: string) {
  if (source === 'expert') {
    return smokeImages.expert;
  }

  const recipe = payload as Partial<RecipeResult> | null;
  const text = [
    selectedCut,
    recipe?.title,
    recipe?.prepTime,
    ...(recipe?.methodGuide ?? []),
    ...(recipe?.steps ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (text.includes('קדירה') || text.includes('סיר') || text.includes('תבשיל') || text.includes('braise')) {
    return smokeImages.stewResult;
  }

  if (text.includes('אסאדו') || text.includes('asado') || text.includes('שורט') || text.includes('ריבס')) {
    return smokeImages.asadoResult;
  }

  return smokeImages.result;
}

function RecipeView({ recipe }: { recipe: RecipeResult }) {
  const methodGuide = getMethodGuide(recipe);
  const sideDishes = normalizeSideDishes(recipe.sideDishes);
  const sauces = normalizeSauces(recipe.sauces);

  return (
    <AppCard elevated>
      <Text style={styles.recipeTitle}>{cleanInlineText(recipe.title)}</Text>
      <View style={styles.metaRow}>
        <Meta label="זמן הכנה" value={recipe.prepTime} />
        <Meta label="קושי" value={recipe.difficulty} />
      </View>

      <ResultSection title="מצרכים" items={recipe.ingredients} />
      <ResultSection title="שלבי הכנה" items={recipe.steps} numbered />
      <MethodGuideSection items={methodGuide} />
      <SideDishSection sideDishes={sideDishes} />
      <SauceSection sauces={sauces} />
    </AppCard>
  );
}

function MethodGuideSection({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Pressable style={[styles.infoCard, open && styles.infoCardOpen]} onPress={() => setOpen((value) => !value)}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoIcon}>i</Text>
        <Text style={styles.infoTitle}>טיפים לשיטת הבישול</Text>
        <Text style={styles.chevron}>{open ? '−' : '+'}</Text>
      </View>
      <Text style={styles.infoDescription}>מידע מקצועי לפני שמתחילים: חום, זמן, היפוך, עטיפה ומנוחה.</Text>
      {open ? <ResultSection title="מה חשוב לדעת" items={items} numbered compact /> : null}
    </Pressable>
  );
}

function SideDishSection({ sideDishes }: { sideDishes: RecipeSideDish[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>תוספות עם הכנה</Text>
      {sideDishes.map((dish, index) => {
        const isOpen = openIndex === index;

        return (
          <Pressable
            key={`${dish.title}-${index}`}
            style={[styles.sideCard, isOpen && styles.sideCardOpen]}
            onPress={() => setOpenIndex(isOpen ? -1 : index)}>
            <View style={styles.sideHeader}>
              <Text style={styles.sideTitle}>{cleanInlineText(dish.title)}</Text>
              <Text style={styles.chevron}>{isOpen ? '−' : '+'}</Text>
            </View>
            <Text style={styles.sideDescription}>{cleanInlineText(dish.description)}</Text>
            {isOpen ? <ResultSection title="איך מכינים" items={dish.steps} numbered compact /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function SauceSection({ sauces }: { sauces: RecipeSauce[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>רטבים עם הסבר</Text>
      {sauces.map((sauce, index) => {
        const isOpen = openIndex === index;

        return (
          <Pressable
            key={`${sauce.title}-${index}`}
            style={[styles.sideCard, isOpen && styles.sideCardOpen]}
            onPress={() => setOpenIndex(isOpen ? -1 : index)}>
            <View style={styles.sideHeader}>
              <Text style={styles.sideTitle}>{cleanInlineText(sauce.title)}</Text>
              <Text style={styles.chevron}>{isOpen ? '−' : '+'}</Text>
            </View>
            <Text style={styles.sideDescription}>{cleanInlineText(sauce.description)}</Text>
            {isOpen ? (
              <>
                <ResultSection title="רכיבים" items={sauce.ingredients} compact />
                <ResultSection title="איך מכינים" items={sauce.steps} numbered compact />
              </>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function ExpertView({ answer }: { answer: ExpertAnswer }) {
  const paragraphs = cleanExpertText(answer.answer);

  return (
    <AppCard elevated>
      <Text style={styles.question}>{answer.question}</Text>
      <View style={styles.answerBlock}>
        {paragraphs.map((paragraph) => (
          <Text key={paragraph} style={styles.answer}>
            {paragraph}
          </Text>
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

function ResultSection({
  title,
  items,
  numbered = false,
  compact = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={[styles.section, compact && styles.compactSection]}>
      <Text style={[styles.sectionTitle, compact && styles.compactTitle]}>{title}</Text>
      {items.map((item, index) => (
        <View key={`${title}-${index}-${item}`} style={[styles.itemRow, compact && styles.compactRow]}>
          <Text style={styles.bullet}>{numbered ? index + 1 : '•'}</Text>
          <Text style={styles.itemText}>{cleanInlineText(item)}</Text>
        </View>
      ))}
    </View>
  );
}

function parsePayload(payload?: string) {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getMethodGuide(recipe: RecipeResult) {
  if (Array.isArray(recipe.methodGuide) && recipe.methodGuide.length > 0) {
    return recipe.methodGuide;
  }

  return [
    'עובדים בחום יציב ומתאימים את הקצב לעובי הנתח.',
    'צורבים או מעשנים לפי השיטה שנבחרה, ואז ממשיכים בחום עקיף עד שהמרקם מתרכך.',
    'הופכים מעט ככל האפשר ובודקים לפי מרקם וטמפרטורה, לא רק לפי זמן.',
    'נותנים לנתח מנוחה לפני פריסה כדי לשמור על עסיסיות.',
  ];
}

function normalizeSideDishes(sideDishes: RecipeResult['sideDishes'] | string[] = []) {
  return sideDishes.map((dish) => {
    if (typeof dish === 'string') {
      return {
        title: dish,
        description: 'תוספת מומלצת ליד המנה, עם הכנה פשוטה ומהירה.',
        steps: ['מתבלים לפי הטעם.', 'מבשלים או צורבים עד רכות.', 'מגישים חם לצד הבשר.'],
      };
    }

    return dish;
  });
}

function normalizeSauces(sauces: RecipeResult['sauces'] = []): RecipeSauce[] {
  return sauces.map((sauce) => {
    if (typeof sauce === 'string') {
      return {
        title: sauce,
        description: 'רוטב מומלץ ליד המנה. פתחו כדי לראות רכיבים והכנה בסיסית.',
        ingredients: sauce.includes('צ׳ימיצ׳ורי')
          ? ['פטרוזיליה קצוצה', 'שום', 'שמן זית', 'לימון או חומץ', 'מלח ופלפל']
          : ['בסיס רוטב לפי הטעם', 'משהו חומצי', 'מלח', 'מעט חריפות או מתיקות'],
        steps: ['מערבבים את הרכיבים.', 'טועמים ומאזנים מלח, חמיצות ומתיקות.', 'מגישים לצד הבשר.'],
      };
    }

    return sauce;
  });
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

  return cleaned
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
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
    ...rtlRow,
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
  compactSection: {
    marginTop: 8,
  },
  sectionTitle: {
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  compactTitle: {
    fontSize: 15,
  },
  itemRow: {
    ...rtlRow,
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#120B08',
    padding: 12,
    justifyContent: 'flex-start',
  },
  compactRow: {
    backgroundColor: '#1A100C',
    padding: 10,
  },
  bullet: {
    width: 24,
    color: smokeColors.orange,
    fontSize: 17,
    fontWeight: '900',
    ...centerText,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    color: smokeColors.text,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  infoCard: {
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 13,
  },
  infoCardOpen: {
    borderColor: smokeColors.gold,
  },
  infoHeader: {
    ...rtlRow,
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 28,
    height: 28,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: smokeColors.gold,
    color: smokeColors.black,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 28,
    ...centerText,
  },
  infoTitle: {
    flex: 1,
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  infoDescription: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 22,
    ...rtlText,
  },
  sideCard: {
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 13,
  },
  sideCardOpen: {
    borderColor: smokeColors.orange,
  },
  sideHeader: {
    ...rtlRow,
    alignItems: 'center',
    gap: 10,
  },
  chevron: {
    width: 28,
    color: smokeColors.orange,
    fontSize: 24,
    fontWeight: '900',
    ...centerText,
  },
  sideTitle: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  sideDescription: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 22,
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
    ...centerBlockText,
  },
  actionGrid: {
    ...rtlRow,
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
