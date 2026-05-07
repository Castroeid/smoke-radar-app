import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import type { RecipeResult, RecipeSauce, RecipeSideDish } from '@/services/smokeRadarTypes';

export default function ShoppingScreen() {
  const { payload, meat } = useLocalSearchParams<{ payload?: string; meat?: string }>();
  const selectedCut = typeof meat === 'string' && meat.length > 0 ? meat : 'המנה';
  const recipe = useMemo(() => parseRecipe(payload), [payload]);
  const shoppingItems = useMemo(() => buildShoppingItems(recipe, selectedCut), [recipe, selectedCut]);

  const sideDishes = normalizeSideDishes(recipe?.sideDishes ?? []);

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="השלב הבא"
        title="רשימת קניות"
        subtitle="כל מה שצריך לפני שעוברים לרדאר הקצביות."
      />

      <SmokeImage source={smokeImages.butcherShop} height={135} />

      <AppCard elevated>
        <Text style={styles.recipeName}>{recipe?.title ?? selectedCut}</Text>
        <ShoppingSection title="מצרכים למנה" items={shoppingItems.ingredients} />
        <ShoppingSection title="רטבים" items={shoppingItems.sauces} />
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
        <AppButton title="שלחו לוואטסאפ" variant="secondary" onPress={() => shareShoppingList(shoppingItems)} />
        <AppButton title="המשך לרדאר קצביות" onPress={() => router.push({ pathname: '/butcher', params: { meat: selectedCut } })} />
        <AppButton title="חזרה למתכון" variant="secondary" onPress={() => router.back()} />
      </AppCard>
    </AppScreen>
  );
}

function ShoppingSection({ title, items }: { title: string; items: string[] }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <Pressable
          key={`${title}-${index}-${item}`}
          style={styles.itemRow}
          onPress={() => setCheckedItems((current) => ({ ...current, [item]: !current[item] }))}>
          <View style={[styles.checkbox, checkedItems[item] && styles.checkboxChecked]}>
            {checkedItems[item] ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={[styles.itemText, checkedItems[item] && styles.itemDone]}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function buildShoppingItems(recipe: RecipeResult | null, selectedCut: string) {
  const sauces = normalizeSauces(recipe?.sauces ?? []);

  return {
    ingredients: recipe?.ingredients ?? [selectedCut],
    sauces: sauces.flatMap((sauce) => [`${sauce.title}:`, ...sauce.ingredients]),
  };
}

function shareShoppingList(items: { ingredients: string[]; sauces: string[] }) {
  const message = ['רשימת קניות Smoke Radar', '', 'מצרכים:', ...items.ingredients.map((item) => `• ${item}`)];

  if (items.sauces.length > 0) {
    message.push('', 'רטבים:', ...items.sauces.map((item) => `• ${item}`));
  }

  const encoded = encodeURIComponent(message.join('\n'));
  Linking.openURL(`https://wa.me/?text=${encoded}`);
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

function normalizeSauces(sauces: RecipeResult['sauces'] = []): RecipeSauce[] {
  return sauces.map((sauce) => {
    if (typeof sauce === 'string') {
      return {
        title: sauce,
        description: 'רוטב מומלץ ליד המנה.',
        ingredients: [sauce],
        steps: [],
      };
    }

    return sauce;
  });
}

const styles = StyleSheet.create({
  recipeName: {
    color: smokeColors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    ...centerBlockText,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: smokeColors.gold,
    fontSize: 18,
    fontWeight: '900',
    ...centerBlockText,
  },
  itemRow: {
    minHeight: 48,
    ...rtlRow,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#120B08',
    padding: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: smokeColors.orange,
  },
  checkboxChecked: {
    backgroundColor: smokeColors.orange,
  },
  checkmark: {
    color: smokeColors.black,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    color: smokeColors.text,
    fontSize: 16,
    lineHeight: 23,
    ...rtlText,
  },
  itemDone: {
    color: smokeColors.soft,
    textDecorationLine: 'line-through',
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
    ...centerBlockText,
  },
  nextText: {
    color: smokeColors.muted,
    fontSize: 16,
    lineHeight: 24,
    ...centerBlockText,
  },
});
