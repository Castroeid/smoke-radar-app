import { I18nManager, Platform, type TextStyle, type ViewStyle } from 'react-native';

void I18nManager.allowRTL(true);
void I18nManager.forceRTL(true);
void I18nManager.swapLeftAndRightInRTL(true);

export const smokeColors = {
  background: '#080605',
  surface: '#14100E',
  surfaceAlt: '#1D1714',
  border: '#35231C',
  text: '#FFF7F0',
  muted: '#B7A9A0',
  soft: '#6F625B',
  orange: '#FF7A1A',
  ember: '#E54018',
  gold: '#FFC166',
  black: '#120B08',
};

export const rtlText = {
  textAlign: 'right' as const,
  writingDirection: 'rtl' as const,
} satisfies TextStyle;

export const rtlBlockText = {
  ...rtlText,
  width: '100%' as const,
} satisfies TextStyle;

export const centerText = {
  textAlign: 'center' as const,
  writingDirection: 'rtl' as const,
} satisfies TextStyle;

export const centerBlockText = {
  ...centerText,
  width: '100%' as const,
  alignSelf: 'stretch' as const,
} satisfies TextStyle;

export const rtlView = (Platform.OS === 'web'
  ? {}
  : {
      direction: 'rtl',
    }) as ViewStyle;

export const rtlContent = {
  ...rtlView,
  alignItems: 'stretch' as const,
};

export const rtlRow = {
  ...rtlView,
  flexDirection: 'row-reverse' as const,
};

export const screenPadding = 20;
