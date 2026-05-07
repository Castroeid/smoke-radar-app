import { buildExpertAnswer, buildRecipe } from './mockData.js';
import { createOpenAiResponse, hasOpenAiKey } from './openaiClient.js';

const expertInstructions = `
אתה מומחה בשר, גריל ומעשנה עבור אפליקציית Smoke Radar.
ענה בעברית בלבד, בצורה קצרה, מעשית, בטוחה וברורה.
אל תשתמש ב-Markdown: בלי כותרות ##, בלי הדגשות **, בלי טבלאות ובלי רשימות Markdown.
כתוב 2-4 פסקאות קצרות בטקסט נקי שמתאים לתצוגה באפליקציה.
אם השאלה לא ברורה, תן תשובה כללית מועילה ושאל שאלה ממקדת בסוף.
`;

const recipeInstructions = `
אתה מחולל מתכונים לאפליקציית Smoke Radar.
החזר מתכון בעברית בלבד.
שמור על סגנון פרימיום, מעשי ופשוט לביצוע בבית.
אל תשתמש ב-Markdown: בלי כותרות ##, בלי הדגשות **, בלי טבלאות ובלי רשימות Markdown.
המתכון חייב להיות מפורט לפי שיטת הבישול שנבחרה: להסביר מה השיטה אומרת, באיזה חום עובדים, כמה זמן בערך, מתי הופכים או מסובבים, מתי עוטפים אם רלוונטי, ומתי נותנים מנוחה.
אם נשלחה העדפת כשרות, כבד אותה. במתכון כשר אל תציע חמאה, גבינות, שמנת, בייקון, יין לא כשר או שילוב חלב ובשר. במתכון לא כשר מותר להציע רכיבים כאלה רק אם הם באמת מוסיפים למנה.
אם נשלח סגנון תיבול, התאם את כל המנה אליו: תיבול, רטבים, תוספות ושפה קולינרית.
אל תחזיר מתכון גנרי. התאם ספציפית לנתח ולשיטת הבישול: אסאדו בקדירה צריך טיפול של קדירה, נוזלים, ריכוך וסיבי בשר; פיקניה בגריל צריכה שומן כלפי חום, פריסה נגד סיבים וצריבה; כנפיים צריכות זמנים קצרים ופריכות.
השתמש בשם הנתח האמיתי בכל שלב חשוב. אל תכתוב "הנתח" שוב ושוב כשאפשר לכתוב אסאדו, פיקניה, בריסקט, שורט ריבס וכו'.
ברשימת המצרכים כתוב את שם הנתח שקונים מהקצב בלבד. אל תכתוב "אסאדו מעושן", "פיקניה צרובה", "בריסקט קלאסי" או תיאור של טרנד כאילו הוא מוצר קנייה, אלא אם זה באמת שם הנתח.
אם כותרת הטרנד כוללת מילה כמו מעושן/צרובה/קלאסי אבל שיטת הבישול שנבחרה אחרת, התעלם מהמילה השיווקית והתאם רק לשיטה שנבחרה.
כתוב כמו פיטמאסטר אמיתי: טמפרטורות, סימני מוכנות, טעויות להימנע מהן, מנוחה, מרקם רצוי, וכמות נוזלים או עשן כשצריך.
הקפד שלתוספות ולרטבים יהיו שמות ייחודיים ולא כפולים.
לכל תוספת החזר גם הסבר קצר וגם שלבי הכנה ברורים.
`;

const recipeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'prepTime', 'difficulty', 'ingredients', 'methodGuide', 'steps', 'sideDishes', 'sauces'],
  properties: {
    title: { type: 'string' },
    prepTime: { type: 'string' },
    difficulty: { type: 'string' },
    ingredients: {
      type: 'array',
      minItems: 5,
      maxItems: 10,
      items: { type: 'string' },
    },
    methodGuide: {
      type: 'array',
      minItems: 4,
      maxItems: 7,
      items: { type: 'string' },
    },
    steps: {
      type: 'array',
      minItems: 5,
      maxItems: 9,
      items: { type: 'string' },
    },
    sideDishes: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'description', 'steps'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          steps: {
            type: 'array',
            minItems: 3,
            maxItems: 5,
            items: { type: 'string' },
          },
        },
      },
    },
    sauces: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: { type: 'string' },
    },
  },
};

export async function generateRecipeWithAi(req) {
  const normalizedReq = { ...req, cut: normalizeCutName(req?.cut) };

  if (!hasOpenAiKey()) {
    return buildRecipe(normalizedReq);
  }

  try {
    const output = await createOpenAiResponse({
      instructions: recipeInstructions,
      input: `צור מתכון אמיתי ומותאם, לא תבניתי, לפי הפרטים הבאים: ${JSON.stringify(normalizedReq)}. התאם לנתח, לשיטת הבישול, לרמת ההשקעה, לכשרות ולסגנון התיבול. השתמש בשם הנתח המדויק בכל מקום חשוב, ובמצרכים כתוב רק את שם הנתח שקונים מהקצב. אם זו מעשנה, פרט חום, עשן, זמן, סיבוב או היפוך, עטיפה ומנוחה. אם זו גריל, מנגל ישראלי או פלנצ'ה, פרט אזור חם, אזור עקיף, צריבה, היפוך ומנוחה. אם זו קדירה, פרט צריבה, נוזלים, חום, זמן, בדיקת רכות והגשה עם הרוטב. אל תחזור על אותן תוספות ורטבים אם אינם מתאימים לפרטים שנשלחו.`,
      text: {
        format: {
          type: 'json_schema',
          name: 'smoke_radar_recipe',
          strict: true,
          schema: recipeSchema,
        },
      },
      maxOutputTokens: 1800,
    });

    return JSON.parse(output);
  } catch (error) {
    console.warn('Falling back to mock recipe:', error.message);
    return buildRecipe(normalizedReq);
  }
}

export async function answerExpertWithAi(question) {
  if (!hasOpenAiKey()) {
    return buildExpertAnswer(question);
  }

  try {
    const answer = await createOpenAiResponse({
      instructions: expertInstructions,
      input: `שאלת המשתמש: ${question}`,
      maxOutputTokens: 650,
    });

    return {
      question,
      answer: cleanMarkdown(answer),
      tips: buildTipsFromAnswer(answer),
    };
  } catch (error) {
    console.warn('Falling back to mock expert answer:', error.message);
    return buildExpertAnswer(question);
  }
}

function buildTipsFromAnswer(answer) {
  const sentences = cleanMarkdown(answer)
    .split(/[.!?]\s|\. |\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length >= 3) {
    return sentences.slice(0, 3);
  }

  return [
    'עבדו עם חום יציב וסבלנות.',
    'תנו לנתח לנוח לפני פריסה.',
    'בדקו מרקם וטמפרטורה במקום להסתמך רק על זמן.',
  ];
}

function cleanMarkdown(value) {
  return value
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeCutName(value) {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return 'אסאדו';
  }

  const aliases = ['אסאדו', 'בריסקט', 'פיקניה', 'כנפיים', 'שורט ריבס', 'אנטריקוט', 'צלעות טלה', 'פרגית', 'חזה עוף'];
  const alias = aliases.find((item) => rawValue.includes(item));
  if (alias) {
    return alias;
  }

  return rawValue
    .replace(/\s*(מעושן|מעושנת|צרובה|צרוב|קלאסי|קלאסית|בקדירה|ברוטב אש)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
