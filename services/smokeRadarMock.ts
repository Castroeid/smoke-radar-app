import type { Butcher, ExpertAnswer, RadarCut, RecipeRequest, RecipeResult } from '@/services/smokeRadarTypes';

export async function getMockTrendingCuts(): Promise<RadarCut[]> {
  return [
    {
      id: 'asado',
      title: 'אסאדו מעושן',
      description: 'נתח שומני ועשיר שמתאים לבישול ארוך, עשן עדין והרבה סבלנות.',
      momentum: '+87%',
      heatScore: 'חום גבוה',
    },
    {
      id: 'brisket',
      title: 'בריסקט קלאסי',
      description: 'הבחירה הגדולה של חובבי המעשנה: עמוק, רך ומלא אופי.',
      momentum: '+81%',
      heatScore: 'טרנד חזק',
    },
    {
      id: 'picanha',
      title: 'פיקניה צרובה',
      description: 'מהיר יחסית, חגיגי מאוד, עם שכבת שומן שנותנת טעם דרמטי.',
      momentum: '+73%',
      heatScore: 'מתחמם',
    },
    {
      id: 'wings',
      title: 'כנפיים ברוטב אש',
      description: 'מנה זריזה, חריפה ומתאימה לפתיחה לפני הנתחים הכבדים.',
      momentum: '+66%',
      heatScore: 'חריף',
    },
  ];
}

export async function generateMockRecipe(req: RecipeRequest): Promise<RecipeResult> {
  return {
    title: `${req.cut} ב${req.method}`,
    prepTime: req.effort === 'מהיר' ? '45-60 דקות' : req.effort === 'מאוזן' ? '2-3 שעות' : '5-7 שעות',
    difficulty: req.effort === 'מהיר' ? 'קל' : req.effort === 'מאוזן' ? 'בינוני' : 'מתקדם',
    ingredients: [
      req.cut,
      'מלח גס',
      'פלפל שחור גרוס',
      'פפריקה מעושנת',
      'שמן זית',
      'מעט סוכר חום',
    ],
    steps: [
      'מייבשים את הנתח היטב ומורחים שכבה דקה של שמן זית.',
      'מערבבים מלח, פלפל, פפריקה וסוכר חום ומצפים את הנתח מכל הצדדים.',
      `מבשלים בשיטת ${req.method} עד שהצבע עמוק והמרקם מתחיל להתרכך.`,
      'נותנים מנוחה של 10-20 דקות לפני פריסה כדי לשמור על עסיסיות.',
    ],
    sideDishes: ['תפוחי אדמה מדורה', 'סלט עגבניות חרוך'],
    sauces: ['צ׳ימיצ׳ורי עשבי תיבול', 'ברביקיו מעושן-מתקתק'],
  };
}

export async function askMockExpert(question: string): Promise<ExpertAnswer> {
  return {
    question,
    answer:
      'הכיוון הנכון הוא לעבוד לאט ומדויק: להתחיל בחום יציב, להימנע מפתיחות מיותרות של המכסה, ולתת לנתח לנוח לפני ההגשה.',
    tips: [
      'אם הנתח מתייבש, הורידו חום והוסיפו מנוחה ארוכה יותר.',
      'עטיפה מתאימה כשהצבע כבר עמוק והחלק החיצוני יציב.',
      'עדיף למדוד לפי מרקם וטמפרטורה, לא רק לפי זמן.',
    ],
  };
}

export async function findMockNearbyButchers(): Promise<Butcher[]> {
  return [
    {
      id: 'embers',
      name: 'קצביית הגחלים',
      rating: '4.9',
      address: 'רחוב האש 12, תל אביב',
      reviewHighlight: 'לקוחות מציינים נתחים מעולים למעשנה ושירות שמבין בברביקיו.',
    },
    {
      id: 'smoke-market',
      name: 'Smoke Market',
      rating: '4.8',
      address: 'דרך מנגלים 7, רמת גן',
      reviewHighlight: 'מבחר יפה של אסאדו, בריסקט ורטבים חריפים.',
    },
    {
      id: 'butcher-lab',
      name: 'מעבדת הבשר',
      rating: '4.7',
      address: 'שדרות הפחמים 4, גבעתיים',
      reviewHighlight: 'חיתוך מדויק במקום והמלצות טובות לזמני צלייה.',
    },
  ];
}
