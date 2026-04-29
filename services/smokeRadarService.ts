export type RecipeRequest = {
  meat: string;
  style: string;
  level: string;
};

export async function getTrendingCuts() {
  // TODO: Replace with real API call when endpoint is available.
  return [
    { id: '1', title: 'בריסקט', description: 'נתח מוביל לעישון ארוך', momentum: '+87%' },
    { id: '2', title: 'אסאדו', description: 'שומניות מדויקת לצלייה איטית', momentum: '+74%' },
    { id: '3', title: 'פיקניה', description: 'נתח פרימיום שגדל מהר בטרנדים', momentum: '+69%' },
  ];
}

export async function generateRecipe(req: RecipeRequest) {
  // TODO: Replace mock with backend integration.
  return {
    title: `מתכון ${req.style} ל-${req.meat}`,
    summary: `רמת ${req.level} · הכנה משוערת: 3 שעות`,
    steps: ['לתבל היטב עם מלח גס ופלפל שחור.', 'לחמם מעשנה ל-120 מעלות.', 'לעשן עד ליבה רצויה ולהגיש חם.'],
  };
}

export async function askExpert(question: string) {
  // TODO: Replace mock with LLM/knowledge endpoint.
  return `שאלה מצוינת. לגבי "${question}": מומלץ להתחיל בצריבה קצרה ואז לעבור לחום עקיף לשמירה על עסיסיות.`;
}

export async function findNearbyButchers() {
  // TODO: Replace with location-aware search endpoint.
  return [
    { name: 'קצביית הגחלים', distance: '1.2 ק"מ' },
    { name: 'בשרים על האש', distance: '2.8 ק"מ' },
  ];
}
