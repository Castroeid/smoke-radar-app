import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { rtlContent, rtlView, screenPadding, smokeColors } from '@/constants/smokeTheme';

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function AppScreen({ children, scroll = true, style }: AppScreenProps) {
  if (!scroll) {
    return <View style={[styles.container, styles.content, style]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: smokeColors.background,
    ...rtlView,
  },
  content: {
    ...rtlContent,
    gap: 18,
    padding: screenPadding,
    paddingBottom: 104,
  },
});
