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
  שפונדרה: 'אסאדו',
  'שורט ריבס': 'אסאדו',
  בריסקט: 'בריסקט',
  פיקניה: 'פיקניה',
  כנפיים: 'כנפיים',
  אנטריקוט: 'אנטריקוט',
  פילה: 'פילה',
  סינטה: 'סינטה',
  שייטל: 'שייטל',
  אונטריב: 'אונטריב',
  'צלעות טלה': 'צלעות טלה',
  'כתף טלה': 'כתף טלה',
  'שוק טלה': 'שוק טלה',
  'קבב טלה': 'קבב טלה',
  פרגית: 'פרגית',
  'חזה עוף': 'חזה עוף',
  כרעיים: 'כרעיים',
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
