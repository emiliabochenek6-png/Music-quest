import { Pressable, Text, View } from "react-native";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface NoteSequencingExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "note-sequencing" }>;
  selectedOrder: string[];
  onSelect: (order: string[]) => void;
  checked: boolean;
  locale: Locale;
}

/** "Kolejne dźwięki skali" — ported from the web app's
 * NoteSequencingExercise.tsx: click the shown notes in ascending pitch
 * order, each tap appends to the sequence, shown as a numbered badge. */
export function NoteSequencingExercise({ exercise, selectedOrder, onSelect, checked, locale }: NoteSequencingExerciseProps) {

  function handleTilePress(note: string) {
    if (checked || selectedOrder.includes(note)) return;
    onSelect([...selectedOrder, note]);
  }

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.noteSequencingPrompt", locale)}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
        {exercise.shuffledNotes.map((note) => {
          const position = selectedOrder.indexOf(note);
          const isSelected = position !== -1;
          const isCorrectPosition = checked && exercise.correctOrder[position] === note;
          let borderColor = theme.colors.border;
          if (checked && isCorrectPosition) borderColor = theme.colors.success;
          else if (checked && isSelected && !isCorrectPosition) borderColor = theme.colors.warning;
          else if (isSelected) borderColor = theme.colors.primary;

          return (
            <Pressable
              key={note}
              disabled={checked || isSelected}
              onPress={() => handleTilePress(note)}
              style={{
                borderWidth: 2,
                borderColor,
                borderRadius: theme.radius.md,
                padding: 4,
                backgroundColor: theme.colors.surface,
              }}
            >
              {isSelected && (
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -8,
                    zIndex: 10,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{position + 1}</Text>
                </View>
              )}
              <StaffNotation note={note} clef={exercise.clef} width={72} />
            </Pressable>
          );
        })}
      </View>
      {!checked && selectedOrder.length > 0 && (
        <Pressable onPress={() => onSelect([])}>
          <Text style={{ color: theme.colors.muted, fontSize: theme.fontSize.body * 0.85, textDecorationLine: "underline" }}>
            {t("lesson.resetOrder", locale)}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
