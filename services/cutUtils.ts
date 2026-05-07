const trendWords = [
  'מעושן',
  'מעושנת',
  'צרובה',
  'צרוב',
  'קלאסי',
  'קלאסית',
  'בקדירה',
  'ברוטב אש',
];

const cutAliases: Record<string, string> = {
  אסאדו: 'אסאדו',
  בריסקט: 'בריסקט',
  פיקניה: 'פיקניה',
  כנפיים: 'כנפיים',
  'שורט ריבס': 'שורט ריבס',
  אנטריקוט: 'אנטריקוט',
  'צלעות טלה': 'צלעות טלה',
  פרגית: 'פרגית',
  'חזה עוף': 'חזה עוף',
};

export function normalizeCutName(value?: string | null) {
  const rawValue = (value || '').trim();

  if (!rawValue) {
    return 'אסאדו';
  }

  const directAlias = Object.keys(cutAliases).find((alias) => rawValue.includes(alias));
  if (directAlias) {
    return cutAliases[directAlias];
  }

  const cleanValue = trendWords
    .reduce((text, word) => text.replace(new RegExp(`\\s*${word}\\s*`, 'g'), ' '), rawValue)
    .replace(/\s+/g, ' ')
    .trim();

  return cleanValue || rawValue;
}
