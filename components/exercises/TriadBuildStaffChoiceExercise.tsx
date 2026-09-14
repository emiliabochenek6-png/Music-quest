import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { TriadBuildStaffBoard } from "@/components/exercises/TriadBuildStaffBoard";
import { playNote } from "@/lib/audio/player";
import { getIntervalDisplayName } from "@/lib/music/intervals";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { QUALITY_THIRDS } from "@/lib/music/triads";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface TriadBuildStaffChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-build-staff-choice" }>;
  selectedThirdStep: number | null;
  selectedThirdAccidental: Accidental;
  selectedFifthStep: number | null;
  selectedFifthAccidental: Accidental;
  onSelectThirdStep: (step: number) => void;
  onSelectThirdAccidental: (accidental: Accidental) => void;
  onSelectFifthStep: (step: number) => void;
  onSelectFifthAccidental: (accidental: Accidental) => void;
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
const SINGLE_ACCIDENTAL_OPTIONS = ACCIDENTAL_OPTIONS.filter((option) => option.value !== -2 && option.value !== 2);

function AccidentalPickerRow({
  columnLabel,
  selected,
  onSelect,
  disabled,
  allowDoubleAccidentals,
}: {
  columnLabel: string;
  selected: Accidental;
  onSelect: (accidental: Accidental) => void;
  disabled: boolean;
  allowDoubleAccidentals: boolean;
}) {
  const options = allowDoubleAccidentals ? ACCIDENTAL_OPTIONS : SINGLE_ACCIDENTAL_OPTIONS;
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(0.75) }}>
      <Text
        style={{
          color: theme.colors.muted,
          fontSize: theme.fontSize.body * 0.7,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {columnLabel}
      </Text>
      <View style={{ flexDirection: "row", gap: theme.spacing(1) }}>
        {options.map((option) => (
          <DarkButton
            key={option.value}
            label={option.symbol}
            onPress={() => onSelect(option.value)}
            variant={selected === option.value ? "primary" : "secondary"}
            disabled={disabled}
            size={42}
            fontSize={17}
          />
        ))}
      </View>
    </View>
  );
}

/** "Fabryka Budowania" levels 9-11 — the staff-notation counterpart of a
 * keyboard triad builder: instead of clicking three keyboard keys, the
 * player places the third and fifth on the staff, each via its own step-
 * then-accidental picker (see TriadBuildStaffBoard's own docstring) — the
 * root stays fixed and read-only, same as the interval version's root
 * column. Ported from the web app's TriadBuildStaffChoiceExercise.tsx. */
export function TriadBuildStaffChoiceExercise({
  exercise,
  selectedThirdStep,
  selectedThirdAccidental,
  selectedFifthStep,
  selectedFifthAccidental,
  onSelectThirdStep,
  onSelectThirdAccidental,
  onSelectFifthStep,
  onSelectFifthAccidental,
  checked,
  locale,
}: TriadBuildStaffChoiceExerciseProps) {
  // Each column's label names the *stacked third* it represents (root->
  // third, then third->fifth), not "tercja"/"kwinta" — that's the whole
  // point of this level's "durowy = tercja wielka + tercja mała" framing
  // (see the intro slide): the fifth column is still clicking a fifth-
  // above-root note, but the quality question being drilled is "what kind
  // of third sits on top of the third", so its label says tercja too.
  const [rootThirdSemitones, thirdFifthSemitones] = QUALITY_THIRDS[exercise.quality];
  const thirdLabel = getIntervalDisplayName(rootThirdSemitones, locale);
  const fifthLabel = getIntervalDisplayName(thirdFifthSemitones, locale);

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.triadBuildStaffChoicePrompt", locale, { quality: exercise.qualityName, root: exercise.rootDisplayName })}
      </Text>

      <DarkButton
        label="🔊"
        onPress={() => playNote(parseScientific(exercise.rootNote))}
        variant="secondary"
        size={72}
        fontSize={30}
      />

      <TriadBuildStaffBoard
        rootNote={exercise.rootNote}
        clickableSteps={exercise.clickableSteps}
        third={{ step: selectedThirdStep, accidental: selectedThirdAccidental }}
        fifth={{ step: selectedFifthStep, accidental: selectedFifthAccidental }}
        onSelectThirdStep={onSelectThirdStep}
        onSelectFifthStep={onSelectFifthStep}
        disabled={checked}
        correctThird={checked ? { step: exercise.thirdStep, accidental: exercise.thirdAccidental } : null}
        correctFifth={checked ? { step: exercise.fifthStep, accidental: exercise.fifthAccidental } : null}
      />

      {checked && (
        <View style={{ maxWidth: 320, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing(1.5) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>
            {t("lesson.triadBuildStaffChoiceSolution", locale, {
              quality: exercise.qualityName,
              root: exercise.rootDisplayName,
              third: exercise.thirdDisplayName,
              fifth: exercise.fifthDisplayName,
            })}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: theme.spacing(3) }}>
        <AccidentalPickerRow
          columnLabel={thirdLabel}
          selected={selectedThirdAccidental}
          onSelect={onSelectThirdAccidental}
          disabled={checked}
          allowDoubleAccidentals={exercise.allowDoubleAccidentals}
        />
        <AccidentalPickerRow
          columnLabel={fifthLabel}
          selected={selectedFifthAccidental}
          onSelect={onSelectFifthAccidental}
          disabled={checked}
          allowDoubleAccidentals={exercise.allowDoubleAccidentals}
        />
      </View>
    </View>
  );
}
