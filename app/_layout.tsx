import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="selection"
          options={{
            title: 'Selection',
            headerStyle: { backgroundColor: '#090909' },
            headerTintColor: '#F7F7F7',
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#090909' },
          }}
        />
        <Stack.Screen
          name="radar"
          options={{
            title: 'Radar',
            headerStyle: { backgroundColor: '#090909' },
            headerTintColor: '#F7F7F7',
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#090909' },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
