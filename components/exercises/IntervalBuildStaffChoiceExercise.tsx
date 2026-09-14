import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalBuildStaffBoard } from "@/components/exercises/IntervalBuildStaffBoard";
import { playNote } from "@/lib/audio/player";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface IntervalBuildStaffChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-build-staff-choice" }>;
  selectedStep: number | null;
  selectedAccidental: Accidental;
  onSelectStep: (step: number) => void;
  onSelectAccidental: (accidental: Accidental) => void;
  checked: boolean;
  locale: Locale;
}

const ACCIDENTAL_OPTIONS: { value: Accidental; symbol: string; labelKey: TranslationKey }[] = [
  { value: -2, symbol: "♭♭", labelKey: "lesson.accidentalDoubleFlat" },
  { value: -1, symbol: "♭", labelKey: "lesson.accidentalFlat" },
  { value: 0, symbol: "♮", labelKey: "lesson.accidentalNatural" },
  { value: 1, symbol: "♯", labelKey: "lesson.accidentalSharp" },
  { value: 2, symbol: "x", labelKey: "lesson.accidentalDoubleSharp" },
];

/** Fabryka Budowania's double-accidental level is the only one that ever
 * wants these two extra buttons — every other staff-notation level keeps
 * the original 3-button picker. */
const SINGLE_ACCIDENTAL_OPTIONS = ACCIDENTAL_OPTIONS.filter((option) => option.value !== -2 && option.value !== 2);

/** "Fabryka Budowania" levels 4-8/11 — the staff-notation counterpart of
 * interval-build-choice: instead of clicking a keyboard key, the player
 * writes the target note directly on the staff. That's two independent
 * choices combined into one answer (see IntervalBuildStaffBoard's own
 * docstring for why a staff position alone can't fix a pitch): which step
 * to click, and which accidental to prefix it with. The accidental picker
 * defaults to natural (♮) — a real resting choice, not an "unset"
 * placeholder the way the step starts out as (null, so nothing is drawn
 * on the staff until the player actually clicks a position). Ported from
 * the web app's IntervalBuildStaffChoiceExercise.tsx. */
export function IntervalBuildStaffChoiceExercise({
  exercise,
  selectedStep,
  selectedAccidental,
  onSelectStep,
  onSelectAccidental,
  checked,
  locale,
}: IntervalBuildStaffChoiceExerciseProps) {
  const options = exercise.allowDoubleAccidentals ? ACCIDENTAL_OPTIONS : SINGLE_ACCIDENTAL_OPTIONS;

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.intervalBuildStaffChoicePrompt", locale, {
          interval: exercise.intervalName,
          direction: t(exercise.direction === "up" ? "lesson.directionUpWord" : "lesson.directionDownWord", locale),
          root: exercise.rootDisplayName,
        })}
      </Text>

      <DarkButton
        label="🔊"
        onPress={() => playNote(parseScientific(exercise.rootNote))}
        variant="secondary"
        size={72}
        fontSize={30}
      />

      <IntervalBuildStaffBoard
        rootNote={exercise.rootNote}
        clickableSteps={exercise.clickableSteps}
        selectedStep={selectedStep}
        selectedAccidental={selectedAccidental}
        onSelectStep={onSelectStep}
        disabled={checked}
        correctStep={checked ? exercise.targetStep : null}
        correctAccidental={checked ? exercise.targetAccidental : null}
      />

      {checked && (
        <View style={{ maxWidth: 320, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing(1.5) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>
            {t("lesson.intervalBuildStaffChoiceSolution", locale, {
              interval: exercise.intervalName,
              direction: t(exercise.direction === "up" ? "lesson.directionUpWord" : "lesson.directionDownWord", locale),
              root: exercise.rootDisplayName,
              target: exercise.targetDisplayName,
            })}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: theme.spacing(1.5), flexWrap: "wrap", justifyContent: "center" }}>
        {options.map((option) => (
          <DarkButton
            key={option.value}
            label={option.symbol}
            onPress={() => onSelectAccidental(option.value)}
            variant={selectedAccidental === option.value ? "primary" : "secondary"}
            disabled={checked}
            size={48}
            fontSize={20}
          />
        ))}
      </View>
    </View>
  );
}
