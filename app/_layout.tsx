import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';

import { rtlText, rtlView, smokeColors } from '@/constants/smokeTheme';

const smokeTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: smokeColors.background,
    card: smokeColors.background,
    text: smokeColors.text,
    border: smokeColors.border,
    primary: smokeColors.orange,
  },
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
      document.body.dir = 'rtl';
    }
  }, []);

  return (
    <ThemeProvider value={smokeTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: smokeColors.background },
          headerTintColor: smokeColors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: smokeColors.background, ...rtlView },
          headerTitleAlign: 'left',
          headerTitle: ({ children }) => <Text style={styles.headerTitle}>{children}</Text>,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="radar" options={{ title: 'רדאר הבשרים' }} />
        <Stack.Screen name="selection" options={{ title: 'מה תרצו לעשות?' }} />
        <Stack.Screen name="recipe" options={{ title: 'מחולל מתכונים' }} />
        <Stack.Screen name="expert" options={{ title: 'שאל את המומחה' }} />
        <Stack.Screen name="butcher" options={{ title: 'קצביות קרובות' }} />
        <Stack.Screen name="result" options={{ title: 'תוצאה' }} />
        <Stack.Screen name="shopping" options={{ title: 'רשימת קניות' }} />
        <Stack.Screen name="modal" options={{ title: 'מידע' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    width: 260,
    color: smokeColors.text,
    fontSize: 18,
    fontWeight: '800',
    ...rtlText,
  },
});
