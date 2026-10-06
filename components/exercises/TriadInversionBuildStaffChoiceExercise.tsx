import { Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { TriadBuildStaffBoard } from "@/components/exercises/TriadBuildStaffBoard";
import { playNote } from "@/lib/audio/player";
import { parseScientific, type Accidental } from "@/lib/music/notes";
import { t, type TranslationKey } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface TriadInversionBuildStaffChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "triad-inversion-build-staff-choice" }>;
  selectedMiddleStep: number | null;
  selectedMiddleAccidental: Accidental;
  selectedTopStep: number | null;
  selectedTopAccidental: Accidental;
  onSelectMiddleStep: (step: number) => void;
  onSelectMiddleAccidental: (accidental: Accidental) => void;
  onSelectTopStep: (step: number) => void;
  onSelectTopAccidental: (accidental: Accidental) => void;
  checked: boolean;
  locale: Locale;
}

const ACCIDENTAL_OPTIONS: { value: Accidental; symbol: string; labelKey: TranslationKey }[] = [
  { value: -1, symbol: "♭", labelKey: "lesson.accidentalFlat" },
  { value: 0, symbol: "♮", labelKey: "lesson.accidentalNatural" },
  { value: 1, symbol: "♯", labelKey: "lesson.accidentalSharp" },
];

function AccidentalPickerRow({
  columnLabel,
  selected,
  onSelect,
  disabled,
}: {
  columnLabel: string;
  selected: Accidental;
  onSelect: (accidental: Accidental) => void;
  disabled: boolean;
}) {
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
        {ACCIDENTAL_OPTIONS.map((option) => (
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

/** "Fabryka Budowania"'s inversion-aware sibling of triad-build-staff-
 * choice — same two-column TriadBuildStaffBoard UI (reused unchanged),
 * but the FIXED note on the left is now whichever chord tone the target
 * inversion puts in the bass (not always the root), and the two columns'
 * own labels come from the exercise's own precomputed middleLabel/
 * topLabel (the actual interval from bass->middle and middle->top for
 * THIS inversion — a third and a fourth, in some order, never the fixed
 * "tercja"/"kwinta" triad-build-staff-choice's own quality-from-root
 * framing assumes) instead of being derived from QUALITY_THIRDS. */
export function TriadInversionBuildStaffChoiceExercise({
  exercise,
  selectedMiddleStep,
  selectedMiddleAccidental,
  selectedTopStep,
  selectedTopAccidental,
  onSelectMiddleStep,
  onSelectMiddleAccidental,
  onSelectTopStep,
  onSelectTopAccidental,
  checked,
  locale,
}: TriadInversionBuildStaffChoiceExerciseProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.triadInversionBuildStaffChoicePrompt", locale, {
          quality: exercise.qualityName,
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

      <TriadBuildStaffBoard
        rootNote={exercise.bassNote}
        clickableSteps={exercise.clickableSteps}
        third={{ step: selectedMiddleStep, accidental: selectedMiddleAccidental }}
        fifth={{ step: selectedTopStep, accidental: selectedTopAccidental }}
        onSelectThirdStep={onSelectMiddleStep}
        onSelectFifthStep={onSelectTopStep}
        disabled={checked}
        correctThird={checked ? { step: exercise.middleStep, accidental: exercise.middleAccidental } : null}
        correctFifth={checked ? { step: exercise.topStep, accidental: exercise.topAccidental } : null}
      />

      {checked && (
        <View style={{ maxWidth: 320, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing(1.5) }}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textAlign: "center" }}>
            {t("lesson.triadInversionBuildStaffChoiceSolution", locale, {
              quality: exercise.qualityName,
              inversion: exercise.inversionName,
              root: exercise.bassDisplayName,
              third: exercise.middleDisplayName,
              fifth: exercise.topDisplayName,
            })}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: "100%", columnGap: theme.spacing(3), rowGap: theme.spacing(1.5) }}>
        <AccidentalPickerRow columnLabel={exercise.middleLabel} selected={selectedMiddleAccidental} onSelect={onSelectMiddleAccidental} disabled={checked} />
        <AccidentalPickerRow columnLabel={exercise.topLabel} selected={selectedTopAccidental} onSelect={onSelectTopAccidental} disabled={checked} />
      </View>
    </View>
  );
}
