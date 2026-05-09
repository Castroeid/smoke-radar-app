import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, centerText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { normalizeCutName } from '@/services/cutUtils';

type CutCategoryId = 'beef' | 'lamb' | 'chicken';

type CutOption = {
  name: string;
  number?: string;
  alias?: string;
  description: string;
  bestFor: string;
};

type CutCategory = {
  id: CutCategoryId;
  title: string;
  subtitle: string;
  cuts: CutOption[];
};

const cutCategories: CutCategory[] = [
  {
    id: 'beef',
    title: 'בקר',
    subtitle: 'נתחים של פרה, בעיקר למעשנה, קדירה, מנגל וגריל.',
    cuts: [
      {
        number: '1',
        name: 'אסאדו',
        alias: 'נקרא גם שורט ריבס / שפונדרה',
        description: 'נתח צלעות עשיר בשומן וקולגן. מתאים לבישול ארוך עד רכות עמוקה, לא לנתח מהיר.',
        bestFor: 'מעשנה, סיר קדירה, גריל עקיף ארוך',
      },
      {
        number: '2',
        name: 'בריסקט',
        description: 'חזה בקר סיבי ועמוק בטעם. דורש זמן, חום נמוך וסבלנות כדי להפוך לרך.',
        bestFor: 'מעשנה, בישול ארוך, כריכים מפורקים',
      },
      {
        number: '3',
        name: 'פיקניה',
        description: 'נתח אחורי עם שכבת שומן יפה. מצוין לצריבה, שיפוד ברזילאי או מנגל מדויק.',
        bestFor: 'מנגל ישראלי, גריל פחמים, צריבה ואז חום עקיף',
      },
      {
        number: '4',
        name: 'אנטריקוט',
        description: 'סטייק עסיסי ומשויש. מתאים למי שרוצה תוצאה מהירה עם שומן וטעם מודגש.',
        bestFor: 'גריל פחמים, פלנצ׳ה, מנגל חם',
      },
      {
        number: '5',
        name: 'סינטה',
        description: 'נתח רזה יחסית, נקי ואלגנטי. צריך דיוק כדי לא לייבש אותו.',
        bestFor: 'צריבה קצרה, גריל, פריסה דקה',
      },
      {
        number: '6',
        name: 'שייטל',
        description: 'נתח אחורי רזה עם טעם בשרי עדין. טוב לשיפודים, רוסטביף או צריבה מהירה.',
        bestFor: 'שיפודים, פלנצ׳ה, רוסטביף',
      },
      {
        number: '7',
        name: 'אונטריב',
        description: 'נתח קדמי עם סיבים, שומן וטעם חזק. נהדר לבישול ארוך ופירוק.',
        bestFor: 'קדירה, פירוק, מעשנה עד רכות',
      },
    ],
  },
  {
    id: 'lamb',
    title: 'כבש / טלה',
    subtitle: 'טעמים עמוקים יותר, שומן ארומטי וצלייה יחסית קצרה בנתחים קטנים.',
    cuts: [
      {
        name: 'צלעות טלה',
        description: 'נתח חגיגי ומהיר יחסית. צריך חום גבוה, צריבה קצרה ומנוחה קצרה.',
        bestFor: 'מנגל, גריל פחמים, מחבת כבדה',
      },
      {
        name: 'כתף טלה',
        description: 'נתח עשיר שמתאים לבישול ארוך עד פירוק. סופג תיבול ים־תיכוני מצוין.',
        bestFor: 'תנור ארוך, קדירה, מעשנה עדינה',
      },
      {
        name: 'שוק טלה',
        description: 'נתח גדול ומרשים עם סיבים עמוקים. מתאים לאירוח ולבישול איטי.',
        bestFor: 'תנור, קדירה, רוטב עשיר',
      },
      {
        name: 'קבב טלה',
        description: 'שומן וטעם חזקים במנה מהירה. חשוב לא לדחוס מדי כדי לשמור עסיסיות.',
        bestFor: 'מנגל ישראלי, פיתה, טחינה וירוקים',
      },
    ],
  },
  {
    id: 'chicken',
    title: 'עוף',
    subtitle: 'מנות מהירות יותר, עם דגש על עסיסיות, פריכות ותיבול מדויק.',
    cuts: [
      {
        name: 'כנפיים',
        description: 'קטנות, מהירות וסלחניות. המפתח הוא עור יבש, חום נכון ורוטב רק בסוף.',
        bestFor: 'גריל, מנגל, מעשנה קצרה, רוטב סיום',
      },
      {
        name: 'פרגית',
        description: 'ירך עוף מפורקת, עסיסית ונוחה למנגל. לא פורסים כמו סטייק; מגישים כנתח או רצועות.',
        bestFor: 'מנגל ישראלי, שיפודים, פלנצ׳ה',
      },
      {
        name: 'חזה עוף',
        description: 'רזה ומהיר, אבל מתייבש בקלות. דורש השריה קצרה וחום מדויק.',
        bestFor: 'צריבה קצרה, סלטים, כריכים',
      },
      {
        name: 'כרעיים',
        description: 'נתח עסיסי עם עצם ועור. מתאים לחום עקיף עד שהעור פריך והבשר רך.',
        bestFor: 'גריל עקיף, תנור, מעשנה קצרה',
      },
    ],
  },
];

export default function SelectionScreen() {
  const { meat, custom } = useLocalSearchParams<{ meat?: string; custom?: string }>();
  const incomingCut = normalizeCutName(typeof meat === 'string' ? meat : undefined);
  const initialCategoryId = findCategoryByCut(incomingCut)?.id ?? 'beef';
  const [categoryId, setCategoryId] = useState<CutCategoryId>(initialCategoryId);
  const [selectedCut, setSelectedCut] = useState(incomingCut);
  const [dropdownOpen, setDropdownOpen] = useState(custom === 'true' || !meat);
  const allowCustomCut = custom === 'true' || !meat;

  const activeCategory = useMemo(
    () => cutCategories.find((category) => category.id === categoryId) ?? cutCategories[0],
    [categoryId]
  );
  const selectedOption = findCutOption(selectedCut) ?? activeCategory.cuts[0];

  const selectCategory = (nextCategory: CutCategory) => {
    setCategoryId(nextCategory.id);
    setSelectedCut(nextCategory.cuts[0].name);
    setDropdownOpen(true);
  };

  const selectCut = (cut: CutOption) => {
    setSelectedCut(cut.name);
    setDropdownOpen(false);
  };

  return (
    <AppScreen style={styles.screen}>
      <SectionTitle title="מה תרצו לעשות?" subtitle={`בחרתם: ${selectedCut}`} />

      <SmokeImage source={smokeImages.choiceCuts} height={120} />

      <AppCard style={styles.cutCard}>
        <Text style={styles.cutLabel}>המסלול הבא שלכם</Text>
        <Text style={styles.cutTitle}>{selectedCut}</Text>
        {selectedOption.alias ? <Text style={styles.aliasText}>{selectedOption.alias}</Text> : null}

        {allowCustomCut ? (
          <>
            <View style={styles.categoryTabs}>
              {cutCategories.map((category) => {
                const selected = category.id === categoryId;

                return (
                  <Pressable
                    key={category.id}
                    style={[styles.categoryTab, selected && styles.categoryTabActive]}
                    onPress={() => selectCategory(category)}>
                    <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>{category.title}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.categorySubtitle}>{activeCategory.subtitle}</Text>
            {activeCategory.id === 'beef' ? <BeefCutMap selectedNumber={selectedOption.number} /> : null}

            <Pressable style={styles.dropdownButton} onPress={() => setDropdownOpen((open) => !open)}>
              <Text style={styles.dropdownTitle}>בחרו נתח</Text>
              <Text style={styles.dropdownValue}>{formatCutName(selectedOption)}</Text>
            </Pressable>

            {dropdownOpen ? (
              <View style={styles.cutList}>
                {activeCategory.cuts.map((cut) => {
                  const selected = cut.name === selectedCut;

                  return (
                    <Pressable key={cut.name} style={[styles.cutOption, selected && styles.cutOptionActive]} onPress={() => selectCut(cut)}>
                      <Text style={[styles.cutOptionTitle, selected && styles.cutOptionTitleActive]}>{formatCutName(cut)}</Text>
                      <Text style={styles.cutOptionText}>{cut.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </>
        ) : null}

        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>למה זה מתאים?</Text>
          <Text style={styles.detailText}>{selectedOption.description}</Text>
          <Text style={styles.bestFor}>{selectedOption.bestFor}</Text>
        </View>
      </AppCard>

      <View style={styles.actions}>
        <AppButton title="לחולל מתכון" onPress={() => router.push({ pathname: '/recipe', params: { meat: selectedCut } })} />
        <AppButton
          title="לשאול את הפיטמאסטר"
          variant="secondary"
          onPress={() => router.push({ pathname: '/expert', params: { meat: selectedCut } })}
        />
        <AppButton
          title="למצוא קצבייה קרובה"
          variant="secondary"
          onPress={() => router.push({ pathname: '/butcher', params: { meat: selectedCut } })}
        />
      </View>
    </AppScreen>
  );
}

function BeefCutMap({ selectedNumber }: { selectedNumber?: string }) {
  return (
    <View style={styles.mapWrap}>
      <Text style={styles.mapTitle}>מפת בקר מהירה</Text>
      <View style={styles.cowBody}>
        {cutCategories[0].cuts.map((cut, index) => (
          <View key={cut.name} style={[styles.mapDot, mapDotPositions[index], selectedNumber === cut.number && styles.mapDotActive]}>
            <Text style={[styles.mapDotText, selectedNumber === cut.number && styles.mapDotTextActive]}>{cut.number}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function formatCutName(cut: CutOption) {
  return cut.number ? `${cut.number}. ${cut.name}` : cut.name;
}

function findCategoryByCut(cutName: string) {
  return cutCategories.find((category) => category.cuts.some((cut) => cut.name === cutName || cut.alias?.includes(cutName)));
}

function findCutOption(cutName: string) {
  for (const category of cutCategories) {
    const match = category.cuts.find((cut) => cut.name === cutName || cut.alias?.includes(cutName));
    if (match) {
      return match;
    }
  }

  return null;
}

const mapDotPositions = [
  { right: 102, top: 38 },
  { right: 134, top: 42 },
  { right: 50, top: 34 },
  { right: 76, top: 44 },
  { right: 34, top: 52 },
  { right: 56, bottom: 20 },
  { right: 124, bottom: 22 },
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 760,
  },
  cutCard: {
    borderColor: smokeColors.orange,
  },
  cutLabel: {
    color: smokeColors.muted,
    fontSize: 14,
    fontWeight: '800',
    ...centerBlockText,
  },
  cutTitle: {
    color: smokeColors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    ...centerBlockText,
  },
  aliasText: {
    color: smokeColors.gold,
    fontSize: 14,
    fontWeight: '800',
    ...centerBlockText,
  },
  categoryTabs: {
    ...rtlRow,
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    paddingHorizontal: 10,
  },
  categoryTabActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  categoryText: {
    color: smokeColors.muted,
    fontSize: 14,
    fontWeight: '900',
    ...centerText,
  },
  categoryTextActive: {
    color: smokeColors.text,
  },
  categorySubtitle: {
    color: smokeColors.muted,
    fontSize: 14,
    lineHeight: 21,
    ...centerBlockText,
  },
  mapWrap: {
    gap: 8,
    alignItems: 'center',
  },
  mapTitle: {
    color: smokeColors.gold,
    fontSize: 14,
    fontWeight: '900',
    ...centerBlockText,
  },
  cowBody: {
    width: 190,
    height: 92,
    borderRadius: 48,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 26, 0.35)',
    backgroundColor: '#120B08',
  },
  mapDot: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
  },
  mapDotActive: {
    borderColor: smokeColors.orange,
    backgroundColor: smokeColors.orange,
  },
  mapDotText: {
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    ...centerText,
  },
  mapDotTextActive: {
    color: smokeColors.black,
  },
  dropdownButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: smokeColors.orange,
    backgroundColor: '#120B08',
    padding: 12,
  },
  dropdownTitle: {
    color: smokeColors.muted,
    fontSize: 12,
    fontWeight: '800',
    ...centerBlockText,
  },
  dropdownValue: {
    color: smokeColors.text,
    fontSize: 19,
    fontWeight: '900',
    ...centerBlockText,
  },
  cutList: {
    gap: 8,
  },
  cutOption: {
    gap: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    padding: 13,
  },
  cutOptionActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  cutOptionTitle: {
    color: smokeColors.text,
    fontSize: 17,
    fontWeight: '900',
    ...rtlText,
  },
  cutOptionTitleActive: {
    color: smokeColors.orange,
  },
  cutOptionText: {
    color: smokeColors.muted,
    fontSize: 13,
    lineHeight: 19,
    ...rtlText,
  },
  detailBox: {
    gap: 7,
    borderRadius: 18,
    backgroundColor: '#120B08',
    padding: 14,
  },
  detailTitle: {
    color: smokeColors.gold,
    fontSize: 15,
    fontWeight: '900',
    ...rtlText,
  },
  detailText: {
    color: smokeColors.text,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  bestFor: {
    color: smokeColors.orange,
    fontSize: 14,
    fontWeight: '900',
    ...rtlText,
  },
  actions: {
    gap: 12,
  },
});
