import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';

import { rtlText, smokeColors } from '@/constants/smokeTheme';

void I18nManager.allowRTL(true);
void I18nManager.forceRTL(true);

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
  return (
    <ThemeProvider value={smokeTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: smokeColors.background },
          headerTintColor: smokeColors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: smokeColors.background },
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
        <Stack.Screen name="modal" options={{ title: 'מידע' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    minWidth: 220,
    color: smokeColors.text,
    fontSize: 18,
    fontWeight: '800',
    ...rtlText,
  },
});
