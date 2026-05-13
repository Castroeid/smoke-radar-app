export const privacyPolicyHtml = `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>מדיניות פרטיות - Smoke Radar</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #080605;
        --card: #15100d;
        --text: #fff8ee;
        --muted: #c8b8a8;
        --accent: #ff771f;
        --border: rgba(255, 119, 31, 0.28);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: radial-gradient(circle at 50% 0%, rgba(255, 119, 31, 0.14), transparent 32rem), var(--bg);
        color: var(--text);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.75;
      }

      main {
        width: min(920px, calc(100% - 32px));
        margin: 0 auto;
        padding: 48px 0 72px;
      }

      article {
        background: rgba(21, 16, 13, 0.92);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: clamp(24px, 5vw, 48px);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
      }

      h1,
      h2 {
        margin: 0 0 16px;
        letter-spacing: 0;
      }

      h1 {
        color: var(--accent);
        font-size: clamp(2rem, 6vw, 4rem);
        line-height: 1.05;
      }

      h2 {
        margin-top: 34px;
        font-size: 1.35rem;
      }

      p,
      li {
        color: var(--muted);
        font-size: 1.05rem;
      }

      ul {
        padding-inline-start: 1.2rem;
      }

      a {
        color: var(--accent);
      }

      .updated {
        color: var(--text);
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <article>
        <h1>מדיניות פרטיות</h1>
        <p class="updated">עודכן לאחרונה: 13 במאי 2026</p>
        <p>
          Smoke Radar היא אפליקציה בעברית למחולל מתכוני בשר, שאלות לפיטמאסטר ומציאת קצביות קרובות.
          המדיניות הזו מסבירה אילו נתונים משמשים את האפליקציה ולמה.
        </p>

        <h2>איזה מידע נאסף</h2>
        <ul>
          <li>בחירות שהמשתמש מזין באפליקציה, כמו נתח, שיטת בישול, כשרות, סגנון תיבול ורמת השקעה.</li>
          <li>שאלות שנשלחות אל הפיטמאסטר כדי ליצור תשובה מתאימה.</li>
          <li>מיקום משוער או מדויק רק כאשר המשתמש מבקש למצוא קצביות קרובות.</li>
          <li>פרטי משוב שנשלחים ביוזמת המשתמש דרך אפליקציית המייל שלו.</li>
        </ul>

        <h2>למה המידע משמש</h2>
        <ul>
          <li>יצירת מתכונים מותאמים אישית.</li>
          <li>מתן תשובות מקצועיות בתחום בשר, גריל, מעשנה ובישול.</li>
          <li>הצגת קצביות קרובות לפי מיקום המשתמש.</li>
          <li>שיפור חוויית המשתמש ותיקון תקלות בעקבות משוב.</li>
        </ul>

        <h2>שמירת מתכונים</h2>
        <p>
          מתכונים שמורים נשמרים מקומית במכשיר או בדפדפן של המשתמש, תחת מזהה מקומי של אותה התקנה.
          כרגע אין חשבון משתמש בענן, ולכן מחיקת האפליקציה או ניקוי נתוני הדפדפן עלולים למחוק את המתכונים השמורים.
        </p>

        <h2>שירותים חיצוניים</h2>
        <p>
          האפליקציה עשויה להשתמש בשירותי OpenAI ליצירת מתכונים ותשובות, בשירותי Google Places או OpenStreetMap
          למציאת קצביות, וב-Render לצורך הפעלת שרת האפליקציה.
        </p>

        <h2>שיתוף ומכירה</h2>
        <p>
          Smoke Radar לא מוכרת מידע אישי. מידע נשלח רק לשירותים הנדרשים להפעלת הפיצ׳רים שהמשתמש מפעיל.
        </p>

        <h2>הרשאות מיקום</h2>
        <p>
          הרשאת מיקום משמשת למציאת קצביות קרובות בלבד. המשתמש יכול לסרב להרשאה או לכבות אותה בכל זמן דרך הגדרות המכשיר.
        </p>

        <h2>יצירת קשר</h2>
        <p>
          לשאלות פרטיות, בקשות מחיקה או משוב אפשר לפנות אל:
          <a href="mailto:castroeid@gmail.com">castroeid@gmail.com</a>
        </p>
      </article>
    </main>
  </body>
</html>`;
