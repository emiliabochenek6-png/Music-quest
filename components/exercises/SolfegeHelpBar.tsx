import { Pressable, Text, View } from "react-native";
import { t } from "@/lib/i18n/translate";
import { useSolfegeHelp } from "@/lib/solfege/helpPreferences";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface SolfegeHelpBarProps {
  /** Show the 🐌 slow-tempo switch. */
  showSlow?: boolean;
  /** Show the 🎤 microphone switch. */
  showMic?: boolean;
  /** Disables both switches (e.g. while a take is being recorded). */
  disabled?: boolean;
  locale: Locale;
}

/** The small row of help switches under a Zaczarowany Solfeż exercise —
 * 🐌 slow tempo and 🎤 microphone on/off, remembered on this device (see
 * lib/solfege/helpPreferences.ts). Each is a plain toggle chip: lit
 * border when on, so the current setting is readable at a glance. */
export function SolfegeHelpBar({ showSlow = true, showMic = true, disabled = false, locale }: SolfegeHelpBarProps) {
  const { slow, micEnabled, setSlow, setMicEnabled } = useSolfegeHelp();

  function chip(label: string, on: boolean, onPress: () => void) {
    return (
      <Pressable
        key={label}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: on, disabled }}
        style={{
          minHeight: theme.minTapTarget,
          paddingHorizontal: theme.spacing(2),
          borderRadius: theme.radius.md,
          borderWidth: 2,
          borderColor: on ? theme.colors.primary : theme.colors.border,
          backgroundColor: on ? theme.colors.accentSoft : theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: on ? theme.colors.primary : theme.colors.muted, fontWeight: "700", fontSize: theme.fontSize.body * 0.85 }}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
      {showSlow && chip(t("lesson.solfegeHelpSlow", locale), slow, () => setSlow(!slow))}
      {showMic && chip(t(micEnabled ? "lesson.solfegeHelpMicOn" : "lesson.solfegeHelpMicOff", locale), micEnabled, () => setMicEnabled(!micEnabled))}
    </View>
  );
}
