import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { rtlRow, rtlText, rtlView, smokeColors } from '@/constants/smokeTheme';

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
          contentStyle: { backgroundColor: smokeColors.background, ...rtlView },
          header: ({ options, route, navigation, back }) => (
            <RtlHeader
              title={String(options.title ?? route.name)}
              canGoBack={Boolean(back)}
              onBack={() => navigation.goBack()}
            />
          ),
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="radar" options={{ title: 'רדאר הבשרים' }} />
        <Stack.Screen name="selection" options={{ title: 'מה תרצו לעשות?' }} />
        <Stack.Screen name="recipe" options={{ title: 'מחולל מתכונים' }} />
        <Stack.Screen name="expert" options={{ title: 'שאל את המומחה' }} />
        <Stack.Screen name="butcher" options={{ title: 'קצביות קרובות' }} />
        <Stack.Screen name="result" options={{ title: 'תוצאה' }} />
        <Stack.Screen name="shopping" options={{ title: 'רשימת קניות' }} />
        <Stack.Screen name="my-recipes" options={{ title: 'המתכונים שלי' }} />
        <Stack.Screen name="modal" options={{ title: 'מידע' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

function RtlHeader({ title, canGoBack, onBack }: { title: string; canGoBack: boolean; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {canGoBack ? (
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{'<'}</Text>
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    ...rtlRow,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#120B08',
    backgroundColor: smokeColors.background,
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 18,
    fontWeight: '800',
    ...rtlText,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: smokeColors.text,
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 38,
    textAlign: 'center',
  },
});
