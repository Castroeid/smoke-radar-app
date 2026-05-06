import { StyleSheet, Text, View } from 'react-native';

import { centerBlockText, rtlView, smokeColors } from '@/constants/smokeTheme';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...rtlView,
    gap: 8,
  },
  eyebrow: {
    color: smokeColors.orange,
    fontSize: 13,
    fontWeight: '900',
    ...centerBlockText,
  },
  title: {
    color: smokeColors.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 39,
    ...centerBlockText,
  },
  subtitle: {
    color: smokeColors.muted,
    fontSize: 16,
    lineHeight: 25,
    ...centerBlockText,
  },
});
