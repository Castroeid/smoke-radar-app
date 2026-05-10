import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { rtlContent, rtlView, screenPadding, smokeColors } from '@/constants/smokeTheme';

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function AppScreen({ children, scroll = true, style }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = scroll ? Math.max(136, insets.bottom + 104) : Math.max(screenPadding, insets.bottom + screenPadding);

  if (!scroll) {
    return <View style={[styles.container, styles.content, { paddingBottom: bottomPadding }, style]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }, style]}
      contentInsetAdjustmentBehavior="always"
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
  },
});
