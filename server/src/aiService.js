import { buildExpertAnswer, buildRecipe } from './mockData.js';
import { createOpenAiResponse, hasOpenAiKey } from './openaiClient.js';

const expertInstructions = `
אתה פיטמאסטר ומומחה בשר, גריל ומעשנה עבור אפליקציית Smoke Radar.
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
רשימת המצרכים חייבת לכלול כמויות ומשקלים ברורים. לדוגמה: "אסאדו - 1.5 ק״ג", "מלח גס - 18 גרם לכל ק״ג בשר", "שמן זית - 2 כפות".
שלבי ההכנה חייבים לכלול טמפרטורות, זמנים, סימני מוכנות ומנוחה. אל תסתפק במשפטים כלליים.
אם השיטה היא גריל פחמים, הסבר שזה מנגל/גריל עם גחלים לוחשות, אזור חם לצריבה ואזור עקיף/רגוע לסיום, ולא להבות ישירות.
אם נשלחה העדפת כשרות, כבד אותה. במתכון כשר אל תציע חמאה, גבינות, שמנת, בייקון, יין לא כשר או שילוב חלב ובשר. במתכון לא כשר מותר להציע רכיבים כאלה רק אם הם באמת מוסיפים למנה.
אם נשלח סגנון תיבול, התאם את כל המנה אליו: תיבול, רטבים, תוספות ושפה קולינרית.
אל תכתוב במצרכים "תיבול בסגנון ישראלי" או "תיבול בסגנון X". פרק את הסגנון לרכיבים וכמויות אמיתיים:
ישראלי = שמן זית, לימון, שום, פפריקה, כמון/בהרט במידה, פלפל שחור, מלח, עשבי תיבול.
קלאסי = מלח, פלפל שחור, שום, מעט שמן; בבקר משויש תיבול מינימלי.
מתוק מעושן = פפריקה מעושנת, סילאן/סוכר חום במידה, שום, פלפל, מלח; לא לשרוף סוכר על אש גבוהה.
מתקתק = סילאן/דבש/סוכר חום בכמות מדויקת ורק בשלב מתאים.
חריף = פלפל חריף/צ׳ילי/אריסה בכמות מדודה עם איזון חמיצות.
עשבי תיבול = רוזמרין/טימין/פטרוזיליה/כוסברה לפי הנתח.
אסייתי = סויה/ג׳ינג׳ר/שום/שומשום/צ׳ילי; בכשר השתמש בסויה כשרה ובלי רכיבים בעייתיים.
אל תחזיר מתכון גנרי. התאם ספציפית לנתח ולשיטת הבישול: אסאדו בקדירה צריך טיפול של קדירה, נוזלים, ריכוך וסיבי בשר; פיקניה בגריל צריכה שומן כלפי חום, פריסה נגד סיבים וצריבה; כנפיים צריכות זמנים קצרים ופריכות.
השתמש בשם הנתח האמיתי בכל שלב חשוב. אל תכתוב "הנתח" שוב ושוב כשאפשר לכתוב אסאדו, פיקניה, בריסקט, שורט ריבס וכו'.
ברשימת המצרכים כתוב את שם הנתח שקונים מהקצב בלבד. אל תכתוב "אסאדו מעושן", "פיקניה צרובה", "בריסקט קלאסי" או תיאור של טרנד כאילו הוא מוצר קנייה, אלא אם זה באמת שם הנתח.
אם כותרת הטרנד כוללת מילה כמו מעושן/צרובה/קלאסי אבל שיטת הבישול שנבחרה אחרת, התעלם מהמילה השיווקית והתאם רק לשיטה שנבחרה.
אסאדו, שפונדרה ושורט ריבס הם אותה משפחת נתחי צלעות. אם המשתמש בחר שורט ריבס, אפשר לקרוא לזה אסאדו/שורט ריבס בהסבר, אבל המצרך יהיה "אסאדו" או "שורט ריבס" עם משקל, לא שני פריטים כפולים.
אל תכתוב "מייבשים את הנתח" בכל מתכון. כתוב ייבוש רק כאשר זה באמת רלוונטי: פיקניה, סטייקים, כנפיים ועוף עם עור. בקדירה הדגש הוא צריבה, נוזלים וריכוך. בפרגית לא כותבים "פורסים" כמו סטייק; מגישים כנתח, רצועות או שיפודים.
הבדל בין שיטות: מנגל ישראלי הוא רשת פתוחה מעל גחלים, עבודה מהירה יחסית ואזור חם/רגוע. גריל פחמים הוא שליטה מדויקת יותר עם מכסה/אזורים, מתאים גם לעקיף ונתחים עבים. הסבר את ההבדל כשזה משפיע על ההכנה.
אם המשתמש בחר "לא כשר", אל תסתפק במשפט. שלב בפועל רכיב לא כשר רק אם הוא מתאים למנה: חמאה לסיום סטייק, יין אדום בקדירה, או גלייז עם רכיב מתאים. אם לא מתאים, כתוב למה בחרת להשאיר נקי.
כתוב כמו פיטמאסטר אמיתי: טמפרטורות, סימני מוכנות, טעויות להימנע מהן, מנוחה, מרקם רצוי, וכמות נוזלים או עשן כשצריך.
הקפד שלתוספות ולרטבים יהיו שמות ייחודיים ולא כפולים.
לכל תוספת החזר גם הסבר קצר וגם שלבי הכנה ברורים.
בחר תוספות ורטבים לפי השילוב הספציפי של נתח + שיטה + סגנון תיבול. אל תחזור אוטומטית על צ׳ימיצ׳ורי וברביקיו. לדוגמה: קדירה צריכה תוספת שסופגת רוטב; כנפיים צריכות משהו פריך/רענן; פיקניה צריכה חומציות שמאזנת שומן; טלה צריך עשבים/טחינה/לימון.
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
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'description', 'ingredients', 'steps'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          ingredients: {
            type: 'array',
            minItems: 3,
            maxItems: 7,
            items: { type: 'string' },
          },
          steps: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string' },
          },
        },
      },
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
      input: `צור מתכון אמיתי ומותאם, לא תבניתי, לפי הפרטים הבאים: ${JSON.stringify(normalizedReq)}. לפני הכתיבה סווג לעצמך את סוג הנתח, רמת השומן, האם זה בקר/טלה/עוף, ואת שיטת הבישול. התאם לנתח, לשיטת הבישול, לרמת ההשקעה, לכשרות ולסגנון התיבול. במצרכים חובה לתת כמויות ומשקלים, ובמצרך הראשון כתוב רק את שם הנתח שקונים מהקצב עם משקל. פרק את סגנון התיבול לרכיבים וכמויות, ואל תכתוב "תיבול בסגנון". השתמש בשם הנתח המדויק בכל מקום חשוב. אם זו מעשנה, פרט חום, עשן, זמן, סיבוב או היפוך, עטיפה ומנוחה. אם זו מנגל ישראלי, פרט רשת פתוחה מעל גחלים, אזור חם ואזור רגוע. אם זו גריל פחמים, פרט עבודה נשלטת יותר עם מכסה/עקיף אם רלוונטי. אם זו קדירה, פרט צריבה, נוזלים, חום, זמן, בדיקת רכות והגשה עם הרוטב. אם זו פרגית או כנפיים, אל תכתוב פריסה כמו סטייק ואל תתן זמני בקר. החזר רטבים כאובייקטים עם שם, הסבר, רכיבים ושלבי הכנה. אל תחזור על אותן תוספות ורטבים אם אינם מתאימים לפרטים שנשלחו.`,
      text: {
        format: {
          type: 'json_schema',
          name: 'smoke_radar_recipe',
          strict: true,
          schema: recipeSchema,
        },
      },
      maxOutputTokens: 2400,
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

  const aliases = new Map([
    ['שורט ריבס', 'אסאדו'],
    ['שפונדרה', 'אסאדו'],
    ['אסאדו', 'אסאדו'],
    ['בריסקט', 'בריסקט'],
    ['פיקניה', 'פיקניה'],
    ['כנפיים', 'כנפיים'],
    ['אנטריקוט', 'אנטריקוט'],
    ['פילה', 'פילה'],
    ['סינטה', 'סינטה'],
    ['שייטל', 'שייטל'],
    ['אונטריב', 'אונטריב'],
    ['צלעות טלה', 'צלעות טלה'],
    ['כתף טלה', 'כתף טלה'],
    ['שוק טלה', 'שוק טלה'],
    ['קבב טלה', 'קבב טלה'],
    ['פרגית', 'פרגית'],
    ['חזה עוף', 'חזה עוף'],
    ['כרעיים', 'כרעיים'],
  ]);
  const alias = [...aliases.keys()].find((item) => rawValue.includes(item));
  if (alias) {
    return aliases.get(alias);
  }

  return rawValue
    .replace(/\s*(מעושן|מעושנת|צרובה|צרוב|קלאסי|קלאסית|בקדירה|ברוטב אש)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
