import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { rtlText, smokeColors } from '@/constants/smokeTheme';
import { submitFeedback } from '@/services/feedback';

export default function FeedbackScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendFeedback = async () => {
    const cleanMessage = message.trim();

    if (cleanMessage.length < 6) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      await submitFeedback({
        source: source ?? 'app',
        message: cleanMessage,
        contact: contact.trim() || undefined,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <AppScreen>
        <SectionTitle eyebrow="משוב" title="תודה, קיבלנו" subtitle="המשוב נשמר אצלנו ויעזור לדייק את Smoke Radar לגרסה הבאה." />
        <AppCard elevated>
          <Text style={styles.sentText}>אם כתבתם על תקלה, כדאי לציין אותה גם בבדיקה הקרובה כדי שנוכל לוודא שהיא נפתרה.</Text>
          <AppButton title="חזרה לבית" onPress={() => router.push('/')} />
          <AppButton title="חזרה לרדאר" variant="secondary" onPress={() => router.push('/radar')} />
        </AppCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="משוב"
        title="מה לשפר?"
        subtitle="כתבו בקצרה מה עבד, מה היה מבלבל, או איפה הרגשתם שחסר דיוק."
      />

      <AppCard elevated>
        <Text style={styles.label}>המשוב שלכם</Text>
        <TextInput
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            if (status === 'error') {
              setStatus('idle');
            }
          }}
          placeholder="לדוגמה: במסך הקצביות התוצאה הראשונה לא הייתה הכי קרובה אליי"
          placeholderTextColor={smokeColors.soft}
          multiline
          textAlign="right"
          textAlignVertical="top"
          style={[styles.input, styles.messageInput]}
        />

        <Text style={styles.label}>פרטי קשר, לא חובה</Text>
        <TextInput
          value={contact}
          onChangeText={setContact}
          placeholder="אימייל או טלפון אם תרצו שנחזור אליכם"
          placeholderTextColor={smokeColors.soft}
          textAlign="right"
          style={styles.input}
        />

        {status === 'error' ? <Text style={styles.error}>כדאי לכתוב לפחות כמה מילים. אם השליחה נכשלה, נסו שוב בעוד רגע.</Text> : null}

        <View style={styles.actions}>
          {status === 'sending' ? <ActivityIndicator color={smokeColors.orange} /> : null}
          <AppButton title={status === 'sending' ? 'שולחים...' : 'שלחו משוב'} onPress={sendFeedback} />
          <AppButton title="חזרה" variant="ghost" onPress={() => router.back()} />
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: smokeColors.gold,
    fontSize: 16,
    fontWeight: '900',
    ...rtlText,
  },
  input: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: smokeColors.border,
    borderRadius: 18,
    backgroundColor: '#120B08',
    color: smokeColors.text,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    writingDirection: 'rtl',
  },
  messageInput: {
    minHeight: 150,
  },
  error: {
    color: smokeColors.orange,
    fontSize: 14,
    lineHeight: 21,
    ...rtlText,
  },
  actions: {
    gap: 10,
  },
  sentText: {
    color: smokeColors.muted,
    fontSize: 17,
    lineHeight: 26,
    ...rtlText,
  },
});
