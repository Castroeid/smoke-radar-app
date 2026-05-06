import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import type { RecipeResult, RecipeSideDish } from '@/services/smokeRadarTypes';

export default function ShoppingScreen() {
  const { payload, meat } = useLocalSearchParams<{ payload?: string; meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה';
  const recipe = useMemo(() => parseRecipe(payload), [payload]);

  const sideDishes = normalizeSideDishes(recipe?.sideDishes ?? []);

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="השלב הבא"
        title="רשימת קניות"
        subtitle="כל מה שצריך לפני שעוברים לרדאר הקצביות."
      />

      <AppCard elevated>
        <Text style={styles.recipeName}>{recipe?.title ?? selectedCut}</Text>
        <ShoppingSection title="מצרכים למנה" items={recipe?.ingredients ?? [selectedCut]} />
        <ShoppingSection title="רטבים" items={recipe?.sauces ?? []} />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>תוספות להכנה</Text>
        {sideDishes.map((dish) => (
          <View key={dish.title} style={styles.sideItem}>
            <Text style={styles.sideTitle}>{dish.title}</Text>
            <Text style={styles.sideText}>{dish.description}</Text>
          </View>
        ))}
      </AppCard>

      <AppCard>
        <Text style={styles.nextTitle}>ממשיכים לקנות</Text>
        <Text style={styles.nextText}>עכשיו אפשר למצוא קצבייה מתאימה לנתח שבחרתם ולהשלים את חומרי הגלם.</Text>
        <AppButton title="המשך לרדאר קצביות" onPress={() => router.push({ pathname: '/butcher', params: { meat: selectedCut } })} />
        <AppButton title="חזרה למתכון" variant="secondary" onPress={() => router.back()} />
      </AppCard>
    </AppScreen>
  );
}

function ShoppingSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={`${title}-${index}-${item}`} style={styles.itemRow}>
          <View style={styles.checkbox} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function parseRecipe(payload?: string) {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as RecipeResult;
  } catch {
    return null;
  }
}

function normalizeSideDishes(sideDishes: RecipeResult['sideDishes'] | string[] = []): RecipeSideDish[] {
  return sideDishes.map((dish) => {
    if (typeof dish === 'string') {
      return {
        title: dish,
        description: 'תוספת מומלצת ליד המנה.',
        steps: [],
      };
    }

    return dish;
  });
}

const styles = StyleSheet.create({
  recipeName: {
    color: smokeColors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    ...rtlText,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  itemRow: {
    minHeight: 48,
    ...rtlRow,
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#120B08',
    padding: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: smokeColors.orange,
  },
  itemText: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 16,
    lineHeight: 23,
    ...rtlText,
  },
  sideItem: {
    gap: 4,
    borderRadius: 14,
    backgroundColor: '#120B08',
    padding: 12,
  },
  sideTitle: {
    color: smokeColors.text,
    fontSize: 17,
    fontWeight: '900',
    ...rtlText,
  },
  sideText: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 22,
    ...rtlText,
  },
  nextTitle: {
    color: smokeColors.text,
    fontSize: 22,
    fontWeight: '900',
    ...rtlText,
  },
  nextText: {
    color: smokeColors.muted,
    fontSize: 16,
    lineHeight: 24,
    ...rtlText,
  },
});
