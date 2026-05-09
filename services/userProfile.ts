import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const userProfileKey = 'smoke-radar:user-id';
const userProfileFile = `${FileSystem.documentDirectory ?? ''}smoke-radar-user-id.txt`;
let memoryUserId = '';

export async function getCurrentUserId() {
  if (Platform.OS === 'web' && hasLocalStorage()) {
    const existing = globalThis.localStorage.getItem(userProfileKey);
    if (existing) {
      return existing;
    }

    const next = createLocalUserId();
    globalThis.localStorage.setItem(userProfileKey, next);
    return next;
  }

  if (FileSystem.documentDirectory) {
    const info = await FileSystem.getInfoAsync(userProfileFile);
    if (info.exists) {
      const existing = (await FileSystem.readAsStringAsync(userProfileFile)).trim();
      if (existing) {
        return existing;
      }
    }

    const next = createLocalUserId();
    await FileSystem.writeAsStringAsync(userProfileFile, next);
    return next;
  }

  if (!memoryUserId) {
    memoryUserId = createLocalUserId();
  }

  return memoryUserId;
}

function createLocalUserId() {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `local-${Date.now().toString(36)}-${randomPart}`;
}

function hasLocalStorage() {
  return typeof globalThis.localStorage !== 'undefined';
}
