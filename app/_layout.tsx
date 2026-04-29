import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import 'react-native-reanimated';

void I18nManager.allowRTL(true);
void I18nManager.forceRTL(true);

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#090909' },
          headerTintColor: '#F7F7F7',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#090909' },
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="radar" options={{ title: 'רדאר הבשרים' }} />
        <Stack.Screen name="selection" options={{ title: 'בחירת מסלול' }} />
        <Stack.Screen name="recipe" options={{ title: 'מחולל מתכונים' }} />
        <Stack.Screen name="expert" options={{ title: 'שאל את המומחה' }} />
        <Stack.Screen name="butcher" options={{ title: 'איתור קצביה' }} />
        <Stack.Screen name="result" options={{ title: 'תוצאה' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
