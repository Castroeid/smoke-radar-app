import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { getTrendingCuts, type RadarCut } from '@/services/smokeRadarService';

export default function RadarScreen() {
  const [items, setItems] = useState<RadarCut[]>([]);
  const [selectedCut, setSelectedCut] = useState<RadarCut | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [mode, setMode] = useState<'trend' | 'custom'>('trend');
  const [showTrendPicker, setShowTrendPicker] = useState(false);

  useEffect(() => {
    getTrendingCuts().then((cuts) => {
      setItems(cuts);
      setSelectedCut(cuts[0] ?? null);
    });
  }, []);

  const continueToActions = () => {
    if (selectedCut) {
      router.push({ pathname: '/selection', params: { meat: selectedCut.title } });
    }
  };

  const continueWithoutTrend = () => {
    router.push({ pathname: '/selection', params: { custom: 'true' } });
  };

  return (
    <AppScreen>
      <SectionTitle title="מה חם עכשיו?" subtitle="בחרו טרנד בשרי אחד והמשיכו למסלול שמתאים לכם." />

      <AppCard style={styles.pathCard}>
        <Text style={styles.pathTitle}>איך תרצו להתחיל?</Text>
        <View style={styles.pathButtons}>
          <Pressable style={[styles.pathButton, mode === 'trend' && styles.pathButtonActive]} onPress={() => setMode('trend')}>
            <Text style={[styles.pathButtonText, mode === 'trend' && styles.pathButtonTextActive]}>לבשל מתוך טרנד</Text>
          </Pressable>
          <Pressable style={[styles.pathButton, mode === 'custom' && styles.pathButtonActive]} onPress={() => setMode('custom')}>
            <Text style={[styles.pathButtonText, mode === 'custom' && styles.pathButtonTextActive]}>לבחור נתח משלי</Text>
          </Pressable>
        </View>
        <Text style={styles.pathHelper}>{mode === 'trend' ? 'בחרו מה חם עכשיו, והרדאר ימשיך איתכם למנה.' : 'דלגו על הטרנדים ובחרו בקר, טלה או עוף בעצמכם.'}</Text>
      </AppCard>

      <Pressable style={styles.infoButton} onPress={() => setShowInfo((current) => !current)}>
        <Text style={styles.infoIcon}>i</Text>
        <Text style={styles.infoText}>מה זה אומר?</Text>
      </Pressable>

      {showInfo ? (
        <AppCard style={styles.infoCard}>
          <Text style={styles.infoBody}>
            הרדאר מציג כרגע טרנדים מדומים ומומנטום לדוגמה כדי לדמות את זרימת האתר. בהמשך נחבר נתוני שימוש, חיפושים ומתכונים אמיתיים כדי לייצר דירוג חי.
          </Text>
        </AppCard>
      ) : null}

      {mode === 'trend' ? (
        <>
          <SmokeImage source={smokeImages.smoker} height={135} />

          <View style={styles.signal}>
            <Text style={styles.signalValue}>{selectedCut?.momentum ?? '--'}</Text>
            <Text style={styles.signalLabel}>רדאר פעיל</Text>
          </View>

          <AppCard elevated style={styles.card}>
            <Pressable style={styles.dropdownHeader} onPress={() => setShowTrendPicker((current) => !current)}>
              <Text style={styles.dropdownArrow}>{showTrendPicker ? '▲' : '▼'}</Text>
              <View style={styles.dropdownTextBlock}>
                <Text style={styles.dropdownLabel}>הטרנד שנבחר</Text>
                <Text style={styles.dropdownValue}>{selectedCut?.title ?? 'טוען טרנדים'}</Text>
              </View>
            </Pressable>

            {selectedCut ? (
              <>
                <Text style={styles.description}>{selectedCut.description}</Text>
                <Text style={styles.momentum}>מומנטום {selectedCut.momentum} · {selectedCut.heatScore}</Text>
              </>
            ) : null}

            {showTrendPicker ? (
              <View style={styles.dropdownList}>
                {items.map((item) => {
                  const selected = selectedCut?.id === item.id;

                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.dropdownOption, selected && styles.dropdownOptionActive]}
                      onPress={() => {
                        setSelectedCut(item);
                        setShowTrendPicker(false);
                      }}
                    >
                      <Text style={styles.score}>{item.heatScore}</Text>
                      <View style={styles.dropdownOptionText}>
                        <Text style={[styles.dropdownOptionTitle, selected && styles.dropdownOptionTitleActive]}>{item.title}</Text>
                        <Text style={styles.dropdownOptionMeta}>מומנטום {item.momentum}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </AppCard>

          <AppButton title="בחרו מנה" onPress={continueToActions} />
        </>
      ) : (
        <>
          <SmokeImage source={smokeImages.choiceCuts} height={135} />
          <AppCard elevated style={styles.customCard}>
            <Text style={styles.cardTitle}>בחרו את הנתח שלכם</Text>
            <Text style={styles.description}>מתאים למי שכבר יודע מה בא לו לבשל, או רוצה לבחור לפי בקר, טלה או עוף.</Text>
            <AppButton title="פתחו בחירת נתח" onPress={continueWithoutTrend} />
          </AppCard>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  pathCard: {
    gap: 12,
  },
  pathTitle: {
    color: smokeColors.text,
    fontSize: 20,
    fontWeight: '900',
    ...centerBlockText,
  },
  pathButtons: {
    ...rtlRow,
    gap: 10,
  },
  pathButton: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    paddingHorizontal: 10,
  },
  pathButtonActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  pathButtonText: {
    color: smokeColors.muted,
    fontSize: 15,
    fontWeight: '900',
    ...centerText,
  },
  pathButtonTextActive: {
    color: smokeColors.text,
  },
  pathHelper: {
    color: smokeColors.muted,
    fontSize: 14,
    lineHeight: 21,
    ...centerBlockText,
  },
  signal: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 18,
  },
  signalLabel: {
    color: smokeColors.muted,
    fontSize: 16,
    fontWeight: '800',
    ...centerText,
  },
  signalValue: {
    color: smokeColors.orange,
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    ...centerText,
  },
  infoButton: {
    alignSelf: 'center',
    ...rtlRow,
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: smokeColors.orange,
    color: smokeColors.black,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 24,
    ...centerText,
  },
  infoText: {
    color: smokeColors.text,
    fontSize: 14,
    fontWeight: '900',
    ...rtlText,
  },
  infoCard: {
    borderColor: smokeColors.orange,
  },
  infoBody: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  card: {
    alignItems: 'center',
  },
  cardTop: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cardTitle: {
    color: smokeColors.text,
    fontSize: 23,
    fontWeight: '900',
    ...centerBlockText,
  },
  score: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#2B140E',
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    ...centerText,
  },
  description: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...centerBlockText,
  },
  momentum: {
    color: smokeColors.orange,
    fontSize: 14,
    fontWeight: '900',
    ...centerBlockText,
  },
  dropdownHeader: {
    ...rtlRow,
    minHeight: 62,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 16,
    backgroundColor: '#120B08',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownArrow: {
    color: smokeColors.orange,
    fontSize: 16,
    fontWeight: '900',
  },
  dropdownTextBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  dropdownLabel: {
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    ...centerText,
  },
  dropdownValue: {
    color: smokeColors.text,
    fontSize: 21,
    fontWeight: '900',
    ...centerText,
  },
  dropdownList: {
    alignSelf: 'stretch',
    gap: 9,
  },
  dropdownOption: {
    ...rtlRow,
    alignItems: 'center',
    gap: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#120B08',
    padding: 12,
  },
  dropdownOptionActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  dropdownOptionText: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dropdownOptionTitle: {
    color: smokeColors.text,
    fontSize: 17,
    fontWeight: '900',
    ...centerText,
  },
  dropdownOptionTitleActive: {
    color: smokeColors.orange,
  },
  dropdownOptionMeta: {
    color: smokeColors.muted,
    fontSize: 13,
    fontWeight: '800',
    ...centerText,
  },
  customCard: {
    alignItems: 'center',
  },
});
