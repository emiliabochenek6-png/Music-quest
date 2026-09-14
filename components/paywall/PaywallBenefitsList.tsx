import { Text, View, StyleSheet } from "react-native";
import { t } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";

const BENEFIT_KEYS: TranslationKey[] = [
  "paywall.benefit.allWorlds",
  "paywall.benefit.dictation",
  "paywall.benefit.noAds",
  "paywall.benefit.sync",
];

/** Concrete benefits, not marketing generalities — see ARCHITECTURE.md
 * section 4.3. Each string in data/i18n/pl.json names an actual feature
 * the free tier lacks, not an adjective. */
export function PaywallBenefitsList() {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing(1.5) }}>
      {BENEFIT_KEYS.map((key) => (
        <View key={key} style={styles.row}>
          <Text style={{ fontSize: theme.fontSize.body }}>✓</Text>
          <Text style={{ fontSize: theme.fontSize.body, color: theme.colors.ink, flex: 1 }}>{t(key)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
