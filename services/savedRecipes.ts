import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { RecipeResult } from '@/services/smokeRadarTypes';

const savedRecipesKey = 'smoke-radar:saved-recipes';
const savedRecipesFile = `${FileSystem.documentDirectory ?? ''}smoke-radar-saved-recipes.json`;
const memoryStore: RecipeResult[] = [];

export async function saveRecipe(recipe: RecipeResult) {
  const existing = await getSavedRecipes();
  const next = [recipe, ...existing.filter((item) => item.title !== recipe.title)].slice(0, 20);

  if (Platform.OS === 'web' && hasLocalStorage()) {
    globalThis.localStorage.setItem(savedRecipesKey, JSON.stringify(next));
    return next;
  }

  if (FileSystem.documentDirectory) {
    await FileSystem.writeAsStringAsync(savedRecipesFile, JSON.stringify(next));
    return next;
  }

  memoryStore.splice(0, memoryStore.length, ...next);
  return next;
}

export async function getSavedRecipes() {
  if (Platform.OS === 'web' && hasLocalStorage()) {
    const raw = globalThis.localStorage.getItem(savedRecipesKey);
    return parseSavedRecipes(raw);
  }

  if (FileSystem.documentDirectory) {
    const info = await FileSystem.getInfoAsync(savedRecipesFile);
    if (!info.exists) {
      return [];
    }

    const raw = await FileSystem.readAsStringAsync(savedRecipesFile);
    return parseSavedRecipes(raw);
  }

  return memoryStore;
}

function parseSavedRecipes(raw: string | null) {
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as RecipeResult[];
  } catch {
    return [];
  }
}

function hasLocalStorage() {
  return typeof globalThis.localStorage !== 'undefined';
}
