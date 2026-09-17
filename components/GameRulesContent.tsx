import { ScrollView, Text, View, StyleSheet } from "react-native";
import { AppIcon } from "@/components/icons/AppIcon";
import { RULES } from "@/lib/gamification/rulesText";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/** Static, presentational rules explainer for the side menu's own
 * "Zasady gry" view — plain text, no context reads, so it can't drift
 * out of sync with actual GAMEPLAY state (it explains MECHANICS, not
 * "here's your current XP"; GamificationHeaderBar/CalendarActivityView
 * already show the live numbers elsewhere). Pulls MAX_HEARTS/
 * HEART_REGEN_MS from types/gamification.ts rather than hardcoding "5"
 * and "4" so this text can't quietly go stale if those constants ever
 * change. */
export function GameRulesContent() {
  return (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
      {RULES.map((rule) => (
        <View key={rule.title} style={styles.row}>
          {"name" in rule.icon ? <AppIcon name={rule.icon.name} size={26} /> : <Text style={styles.icon}>{rule.icon.emoji}</Text>}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{rule.title}</Text>
            <Text style={styles.body}>{rule.body}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 3,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
  },
});
