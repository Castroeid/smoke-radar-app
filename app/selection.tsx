import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
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
        name: 'פילה',
        description: 'נתח רך מאוד ודל שומן. דורש צלייה קצרה ומדויקת כדי לא לאבד עסיסיות.',
        bestFor: 'צריבה קצרה, פלנצ׳ה, גריל חם ומדויק',
      },
      {
        number: '6',
        name: 'סינטה',
        description: 'נתח רזה יחסית, נקי ואלגנטי. צריך דיוק כדי לא לייבש אותו.',
        bestFor: 'צריבה קצרה, גריל, פריסה דקה',
      },
      {
        number: '7',
        name: 'שייטל',
        description: 'נתח אחורי רזה עם טעם בשרי עדין. טוב לשיפודים, רוסטביף או צריבה מהירה.',
        bestFor: 'שיפודים, פלנצ׳ה, רוסטביף',
      },
      {
        number: '8',
        name: 'אונטריב',
        description: 'נתח קדמי עם סיבים, שומן וטעם חזק. נהדר לבישול ארוך ופירוק.',
        bestFor: 'קדירה, פירוק, מעשנה עד רכות',
      },
    ],
  },
];

export default function SelectionScreen() {
  const { meat, custom } = useLocalSearchParams<{ meat?: string; custom?: string }>();
  const incomingCut = normalizeCutName(typeof meat === 'string' ? meat : undefined);
  const initialCategoryId = findCategoryByCut(incomingCut)?.id ?? 'beef';
  const [selectedCut, setSelectedCut] = useState(incomingCut);
  const [openCategoryId, setOpenCategoryId] = useState<CutCategoryId | null>(custom === 'true' || !meat ? initialCategoryId : null);
  const allowCustomCut = custom === 'true' || !meat;

  const selectedCategory = useMemo(() => findCategoryByCut(selectedCut) ?? cutCategories[0], [selectedCut]);
  const selectedOption = findCutOption(selectedCut) ?? selectedCategory.cuts[0];

  const selectCut = (cut: CutOption) => {
    setSelectedCut(cut.name);
  };

  return (
    <AppScreen style={styles.screen}>
      <SectionTitle title="מה תרצו לעשות?" subtitle={`בחרתם: ${selectedCut}`} />

      <AppCard style={styles.cutCard}>
        <Text style={styles.cutLabel}>המסלול הבא שלכם</Text>
        <Text style={styles.cutTitle}>{selectedCut}</Text>
        {selectedOption.alias ? <Text style={styles.aliasText}>{selectedOption.alias}</Text> : null}

        {allowCustomCut ? (
          <>
            <View style={styles.dropdowns}>
              {cutCategories.map((category) => {
                const isOpen = openCategoryId === category.id;
                const categorySelection = category.cuts.find((cut) => cut.name === selectedCut || cut.alias?.includes(selectedCut));

                return (
                  <CategoryDropdown
                    key={category.id}
                    category={category}
                    isOpen={isOpen}
                    selectedCut={selectedCut}
                    categorySelection={categorySelection}
                    onToggle={() => setOpenCategoryId(isOpen ? null : category.id)}
                    onSelect={selectCut}
                  />
                );
              })}
            </View>
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

function CategoryDropdown({
  category,
  isOpen,
  selectedCut,
  categorySelection,
  onToggle,
  onSelect,
}: {
  category: CutCategory;
  isOpen: boolean;
  selectedCut: string;
  categorySelection?: CutOption;
  onToggle: () => void;
  onSelect: (cut: CutOption) => void;
}) {
  return (
    <View style={styles.dropdownWrap}>
      <Pressable style={[styles.dropdownButton, isOpen && styles.dropdownButtonActive]} onPress={onToggle}>
        <View style={styles.dropdownHeaderText}>
          <Text style={styles.dropdownTitle}>{category.title}</Text>
          <Text style={styles.dropdownSubtitle}>{categorySelection ? `נבחר: ${formatCutName(categorySelection)}` : category.subtitle}</Text>
        </View>
        <Text style={styles.dropdownIcon}>{isOpen ? '−' : '+'}</Text>
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdownPanel}>
          {category.id === 'beef' ? <BeefCutLegend selectedNumber={categorySelection?.number} /> : null}
          {category.cuts.map((cut) => {
            const selected = cut.name === selectedCut;

            return (
              <Pressable key={cut.name} style={[styles.cutOption, selected && styles.cutOptionActive]} onPress={() => onSelect(cut)}>
                <Text style={[styles.cutOptionTitle, selected && styles.cutOptionTitleActive]}>{formatCutName(cut)}</Text>
                <Text style={styles.cutOptionText}>{cut.bestFor}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function BeefCutLegend({ selectedNumber }: { selectedNumber?: string }) {
  const beefCategory = cutCategories.find((category) => category.id === 'beef');

  if (!beefCategory) {
    return null;
  }

  return (
    <View style={styles.beefLegend}>
      <Text style={styles.beefLegendTitle}>מפתח נתחים בבקר</Text>
      <View style={styles.legendGrid}>
        {beefCategory.cuts.map((cut) => (
          <View key={cut.name} style={[styles.legendItem, selectedNumber === cut.number && styles.legendItemActive]}>
            <Text style={[styles.legendNumber, selectedNumber === cut.number && styles.legendNumberActive]}>{cut.number}</Text>
            <Text style={[styles.legendName, selectedNumber === cut.number && styles.legendNameActive]}>{cut.name}</Text>
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

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'flex-start',
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
  dropdowns: {
    gap: 10,
  },
  dropdownWrap: {
    gap: 8,
  },
  dropdownButton: {
    ...rtlRow,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  dropdownButtonActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  dropdownHeaderText: {
    flex: 1,
    gap: 4,
  },
  dropdownTitle: {
    color: smokeColors.text,
    fontSize: 18,
    fontWeight: '900',
    ...rtlText,
  },
  dropdownSubtitle: {
    color: smokeColors.muted,
    fontSize: 13,
    lineHeight: 18,
    ...rtlText,
  },
  dropdownIcon: {
    width: 34,
    color: smokeColors.orange,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
    ...centerText,
  },
  dropdownPanel: {
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: '#100A07',
    padding: 10,
  },
  beefLegend: {
    gap: 8,
    borderRadius: 15,
    backgroundColor: '#17100D',
    padding: 10,
  },
  beefLegendTitle: {
    color: smokeColors.gold,
    fontSize: 13,
    fontWeight: '900',
    ...centerBlockText,
  },
  legendGrid: {
    ...rtlRow,
    flexWrap: 'wrap',
    gap: 7,
    justifyContent: 'center',
  },
  legendItem: {
    ...rtlRow,
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: smokeColors.border,
    backgroundColor: smokeColors.surface,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  legendItemActive: {
    borderColor: smokeColors.orange,
    backgroundColor: '#2A150D',
  },
  legendNumber: {
    color: smokeColors.gold,
    fontSize: 12,
    fontWeight: '900',
    ...centerText,
  },
  legendNumberActive: {
    color: smokeColors.orange,
  },
  legendName: {
    color: smokeColors.muted,
    fontSize: 12,
    fontWeight: '800',
    ...rtlText,
  },
  legendNameActive: {
    color: smokeColors.text,
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
    marginBottom: 24,
  },
});
