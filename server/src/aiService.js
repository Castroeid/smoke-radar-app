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
הקפד שלתוספות ולרטבים יהיו שמות ייחודיים ולא כפולים.
`;

const recipeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'prepTime', 'difficulty', 'ingredients', 'steps', 'sideDishes', 'sauces'],
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
    steps: {
      type: 'array',
      minItems: 4,
      maxItems: 7,
      items: { type: 'string' },
    },
    sideDishes: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: { type: 'string' },
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
  if (!hasOpenAiKey()) {
    return buildRecipe(req);
  }

  try {
    const output = await createOpenAiResponse({
      instructions: recipeInstructions,
      input: `צור מתכון לפי הפרטים הבאים: ${JSON.stringify(req)}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'smoke_radar_recipe',
          strict: true,
          schema: recipeSchema,
        },
      },
      maxOutputTokens: 1200,
    });

    return JSON.parse(output);
  } catch (error) {
    console.warn('Falling back to mock recipe:', error.message);
    return buildRecipe(req);
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
