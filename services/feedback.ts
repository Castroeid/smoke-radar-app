import { Linking, Platform } from 'react-native';

const feedbackEmail = 'castroeid@gmail.com';
const privacyPolicyUrl = 'https://smoke-radar-app.onrender.com/privacy';

export function openFeedback(source: string) {
  const subject = encodeURIComponent(`Smoke Radar feedback - ${source}`);
  const body = encodeURIComponent(
    [
      'מה עבד טוב?',
      '',
      'מה היה חסר או מבלבל?',
      '',
      'באיזה מסך זה קרה?',
      '',
      `מקור: ${source}`,
      `פלטפורמה: ${Platform.OS}`,
    ].join('\n')
  );

  return Linking.openURL(`mailto:${feedbackEmail}?subject=${subject}&body=${body}`);
}

export function openPrivacyPolicy() {
  return Linking.openURL(privacyPolicyUrl);
}
