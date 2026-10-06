import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { SeventhChordBuildStaffBoard } from "@/components/exercises/SeventhChordBuildStaffBoard";
import { playNote } from "@/lib/audio/player";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface DominantSeventhBuildStaffChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "dominant-seventh-build-staff-choice" }>;
  selectedCol1Step: number | null;
  selectedCol1Accidental: Accidental;
  selectedCol2Step: number | null;
  selectedCol2Accidental: Accidental;
  selectedCol3Step: number | null;
  selectedCol3Accidental: Accidental;
  onSelectCol1Step: (step: number) => void;
  onSelectCol1Accidental: (accidental: Accidental) => void;
  onSelectCol2Step: (step: number) => void;
  onSelectCol2Accidental: (accidental: Accidental) => void;
  onSelectCol3Step: (step: number) => void;
  onSelectCol3Accidental: (accidental: Accidental) => void;
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
            size={40}
            fontSize={16}
          />
        ))}
      </View>
    </View>
  );
}

/** "Fabryka Budowania"'s dominant-seventh counterpart of triad-build-
 * staff-choice — a fixed bass note (the chord's own root when
 * `inversion` is "root", whichever tone the target postać puts in the
 * bass otherwise) plus THREE build columns instead of a triad's two,
 * since this chord has four tones. Uses SeventhChordBuildStaffBoard (a
 * three-column sibling of TriadBuildStaffBoard) and the same per-column
 * precomputed interval labels (col1Label/col2Label/col3Label) triad-
 * inversion-build-staff-choice's own middleLabel/topLabel use — each
 * column's label is the interval from the PREVIOUS column (or the bass,
 * for the first), not always a "tercja" the way a root-position build
 * would be. */
export function DominantSeventhBuildStaffChoiceExercise({
  exercise,
  selectedCol1Step,
  selectedCol1Accidental,
  selectedCol2Step,
  selectedCol2Accidental,
  selectedCol3Step,
  selectedCol3Accidental,
  onSelectCol1Step,
  onSelectCol1Accidental,
  onSelectCol2Step,
  onSelectCol2Accidental,
  onSelectCol3Step,
  onSelectCol3Accidental,
  checked,
  locale,
}: DominantSeventhBuildStaffChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.dominantSeventhBuildStaffChoicePrompt", locale, {
          root: exercise.bassDisplayName,
          inversion: exercise.inversionName,
        })}
      </Text>

      <DarkButton
        label="🔊"
        onPress={() => playNote(parseScientific(exercise.bassNote))}
        variant="secondary"
        size={72}
        fontSize={30}
      />

      <SeventhChordBuildStaffBoard
        bassNote={exercise.bassNote}
        clickableSteps={exercise.clickableSteps}
        col1={{ step: selectedCol1Step, accidental: selectedCol1Accidental }}
        col2={{ step: selectedCol2Step, accidental: selectedCol2Accidental }}
        col3={{ step: selectedCol3Step, accidental: selectedCol3Accidental }}
        onSelectCol1Step={onSelectCol1Step}
        onSelectCol2Step={onSelectCol2Step}
        onSelectCol3Step={onSelectCol3Step}
        disabled={checked}
        correctCol1={checked ? { step: exercise.col1Step, accidental: exercise.col1Accidental } : null}
        correctCol2={checked ? { step: exercise.col2Step, accidental: exercise.col2Accidental } : null}
        correctCol3={checked ? { step: exercise.col3Step, accidental: exercise.col3Accidental } : null}
      />

      {checked && (
        <View style={{ maxWidth: 320, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing(1.5) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>
            {t("lesson.dominantSeventhBuildStaffChoiceSolution", locale, {
              inversion: exercise.inversionName,
              root: exercise.bassDisplayName,
              col1: exercise.col1DisplayName,
              col2: exercise.col2DisplayName,
              col3: exercise.col3DisplayName,
            })}
          </Text>
        </View>
      )}

      {/* The three columns of ♭ ♮ ♯ buttons are wider than a phone side by side: they wrap onto the next row instead of being cut off. */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: "100%", columnGap: theme.spacing(2), rowGap: theme.spacing(1.5) }}>
        <AccidentalPickerRow
          columnLabel={exercise.col1Label}
          selected={selectedCol1Accidental}
          onSelect={onSelectCol1Accidental}
          disabled={checked}
          allowDoubleAccidentals={exercise.allowDoubleAccidentals}
        />
        <AccidentalPickerRow
          columnLabel={exercise.col2Label}
          selected={selectedCol2Accidental}
          onSelect={onSelectCol2Accidental}
          disabled={checked}
          allowDoubleAccidentals={exercise.allowDoubleAccidentals}
        />
        <AccidentalPickerRow
          columnLabel={exercise.col3Label}
          selected={selectedCol3Accidental}
          onSelect={onSelectCol3Accidental}
          disabled={checked}
          allowDoubleAccidentals={exercise.allowDoubleAccidentals}
        />
      </View>
    </View>
  );
}
