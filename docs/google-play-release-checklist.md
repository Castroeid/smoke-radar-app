# Smoke Radar - Google Play release checklist

## מה כבר מוכן

- אפליקציית Android נבנית דרך EAS.
- חיבור לשרת Render מוגדר ב-production וב-preview.
- הרשאות מיקום ואינטרנט קיימות ב-Android.
- יש דף פרטיות ציבורי:
  - https://smoke-radar-app.onrender.com/privacy
  - https://smoke-radar-app.onrender.com/privacy-policy
- יש כפתור משוב בתחילת התהליך ובמסך התוצאה.
- מתכונים שמורים מקומית לכל התקנת אפליקציה/מכשיר, כולל מחיקה.

## מה למלא ב-Google Play Console

### App content

- Privacy Policy URL:
  - https://smoke-radar-app.onrender.com/privacy
- App category:
  - Food & Drink
- Ads:
  - No, unless ads are added later.
- Target audience:
  - Adults / general audience, לפי הבחירה העסקית.

### Data safety

יש לדווח שהאפליקציה משתמשת בנתונים הבאים:

- Location:
  - Used for app functionality.
  - Used when the user asks to find nearby butcheries.
  - Not sold.
- App activity / app interactions:
  - Recipe choices and Pitmaster questions are sent to the Smoke Radar server to generate answers.
  - Some requests may be processed by OpenAI.
- User-provided feedback:
  - Sent only if the user taps feedback and sends an email.

### Permissions

- Location permission:
  - Purpose: finding nearby butcheries.
- Internet permission:
  - Purpose: calling Smoke Radar API, OpenAI-backed recipe/expert responses, and butcher search.

## בדיקות לפני העלאה

- להתקין את build ה-production על מכשיר אמיתי.
- לבדוק:
  - פתיחת האפליקציה.
  - רדאר בשרים.
  - תנו לי לבחור את הנתח.
  - מחולל מתכונים.
  - שמירת מתכון.
  - מחיקת מתכון.
  - רשימת קניות.
  - שאל את הפיטמאסטר.
  - שאלת המשך.
  - חוללו מתכון לפי הכיוון.
  - קצביות לפי מיקום.
  - מדיניות פרטיות נפתחת מהאפליקציה.
  - שליחת משוב פותחת מייל.

## פקודות build

Build פנימי לבדיקה:

```powershell
npx --yes eas-cli@latest build -p android --profile preview
```

Build לחנות:

```powershell
npx --yes eas-cli@latest build -p android --profile production
```

אחרי build production, מורידים את קובץ ה-AAB ומעלים אותו ל-Google Play Console.

## הערה חשובה על חשבון חדש

בחשבונות מפתח אישיים חדשים Google עשויה לדרוש בדיקת closed testing עם 12 בודקים למשך 14 ימים לפני פתיחת Production.
אם זה מופיע לך בקונסול, מתחילים מ-Internal testing או Closed testing ורק אחר כך עוברים ל-Production.
