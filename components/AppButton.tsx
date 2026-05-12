import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { centerText, rtlRow, smokeColors } from '@/constants/smokeTheme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  icon?: ReactNode;
};

export function AppButton({ title, onPress, variant = 'primary', style, icon }: AppButtonProps) {
  return (
    <Pressable style={[styles.button, styles[variant], style]} onPress={onPress}>
      {icon}
      <Text style={[styles.text, variant === 'primary' ? styles.primaryText : styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...rtlRow,
    alignSelf: 'stretch',
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: smokeColors.orange,
  },
  secondary: {
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
  },
  ghost: {
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    ...centerText,
  },
  primaryText: {
    color: smokeColors.black,
  },
  secondaryText: {
    color: smokeColors.text,
  },
});
