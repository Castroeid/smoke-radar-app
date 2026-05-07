import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, rtlText, smokeColors } from '@/constants/smokeTheme';
import { getSavedRecipes } from '@/services/savedRecipes';
import type { RecipeResult } from '@/services/smokeRadarTypes';

export default function MyRecipesScreen() {
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);

  useEffect(() => {
    getSavedRecipes().then(setRecipes);
  }, []);

  return (
    <AppScreen>
      <SectionTitle title="המתכונים שלי" subtitle="כל המתכונים ששמרתם באפליקציה במקום אחד." />
      <SmokeImage source={smokeImages.saved} height={125} />

      {recipes.length === 0 ? (
        <AppCard>
          <Text style={styles.emptyTitle}>עוד אין מתכונים שמורים</Text>
          <Text style={styles.emptyText}>אחרי שתשמרו מתכון ממסך התוצאה, הוא יופיע כאן.</Text>
          <AppButton title="חזרו לרדאר" onPress={() => router.push('/radar')} />
        </AppCard>
      ) : (
        <View style={styles.list}>
          {recipes.map((recipe) => (
            <AppCard key={recipe.title}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.meta}>{recipe.prepTime} · {recipe.difficulty}</Text>
              <AppButton
                title="פתחו מתכון"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/result',
                    params: { source: 'recipe', payload: JSON.stringify(recipe), meat: recipe.title },
                  })
                }
              />
            </AppCard>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  emptyTitle: {
    color: smokeColors.text,
    fontSize: 23,
    fontWeight: '900',
    ...centerBlockText,
  },
  emptyText: {
    color: smokeColors.muted,
    fontSize: 16,
    lineHeight: 24,
    ...centerBlockText,
  },
  recipeTitle: {
    color: smokeColors.text,
    fontSize: 22,
    fontWeight: '900',
    ...rtlText,
  },
  meta: {
    color: smokeColors.orange,
    fontSize: 15,
    fontWeight: '900',
    ...rtlText,
  },
});
