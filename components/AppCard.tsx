import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { rtlView, smokeColors } from '@/constants/smokeTheme';

type AppCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
};

export function AppCard({ children, style, elevated = false }: AppCardProps) {
  return <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    ...rtlView,
    alignSelf: 'stretch',
    width: '100%',
    gap: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surface,
    padding: 18,
  },
  elevated: {
    borderColor: smokeColors.orange,
    backgroundColor: smokeColors.surfaceAlt,
  },
});
