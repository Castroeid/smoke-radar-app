import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { RecipeResult } from '@/services/smokeRadarTypes';
import { getCurrentUserId } from '@/services/userProfile';

const savedRecipesKeyPrefix = 'smoke-radar:saved-recipes';
const legacySavedRecipesKey = 'smoke-radar:saved-recipes';
const legacySavedRecipesFile = `${FileSystem.documentDirectory ?? ''}smoke-radar-saved-recipes.json`;
const memoryStore: RecipeResult[] = [];

export async function saveRecipe(recipe: RecipeResult) {
  const userId = await getCurrentUserId();
  const existing = await getSavedRecipes();
  const next = [recipe, ...existing.filter((item) => item.title !== recipe.title)].slice(0, 20);

  if (Platform.OS === 'web' && hasLocalStorage()) {
    globalThis.localStorage.setItem(getSavedRecipesKey(userId), JSON.stringify(next));
    return next;
  }

  if (FileSystem.documentDirectory) {
    await FileSystem.writeAsStringAsync(getSavedRecipesFile(userId), JSON.stringify(next));
    return next;
  }

  memoryStore.splice(0, memoryStore.length, ...next);
  return next;
}

export async function getSavedRecipes() {
  const userId = await getCurrentUserId();

  if (Platform.OS === 'web' && hasLocalStorage()) {
    const raw = globalThis.localStorage.getItem(getSavedRecipesKey(userId)) ?? globalThis.localStorage.getItem(legacySavedRecipesKey);
    return parseSavedRecipes(raw);
  }

  if (FileSystem.documentDirectory) {
    const userFile = getSavedRecipesFile(userId);
    const info = await FileSystem.getInfoAsync(userFile);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(userFile);
      return parseSavedRecipes(raw);
    }

    const legacyInfo = await FileSystem.getInfoAsync(legacySavedRecipesFile);
    if (legacyInfo.exists) {
      const raw = await FileSystem.readAsStringAsync(legacySavedRecipesFile);
      return parseSavedRecipes(raw);
    }

    return [];
  }

  return memoryStore;
}

export async function deleteSavedRecipe(title: string) {
  const userId = await getCurrentUserId();
  const existing = await getSavedRecipes();
  const next = existing.filter((item) => item.title !== title);

  if (Platform.OS === 'web' && hasLocalStorage()) {
    globalThis.localStorage.setItem(getSavedRecipesKey(userId), JSON.stringify(next));
    return next;
  }

  if (FileSystem.documentDirectory) {
    await FileSystem.writeAsStringAsync(getSavedRecipesFile(userId), JSON.stringify(next));
    return next;
  }

  memoryStore.splice(0, memoryStore.length, ...next);
  return next;
}

function getSavedRecipesKey(userId: string) {
  return `${savedRecipesKeyPrefix}:${userId}`;
}

function getSavedRecipesFile(userId: string) {
  return `${FileSystem.documentDirectory ?? ''}smoke-radar-saved-recipes-${userId}.json`;
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
