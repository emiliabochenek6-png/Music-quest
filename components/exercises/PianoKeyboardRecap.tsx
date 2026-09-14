import { useState } from "react";
import { View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { PianoKeyboard } from "@/components/exercises/PianoKeyboard";
import { getSolfegeSyllable } from "@/lib/music/solfege";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface PianoKeyboardRecapProps {
  range: [string, string];
}

/** A collapsed-by-default "Zapoznaj się (pianino)" toggle shown above
 * every exercise in a lesson that carries LessonDefinition's own
 * pianoKeyboardReference — see that field's own doc for why this is a
 * SEPARATE toggle from ExerciseIntroRecap's "Zapoznaj się" rather than
 * nested inside it: a player mid-exercise wants the keyboard one tap
 * away, not buried inside the theory-text recap. Every key just plays
 * its own reference tone on tap (PianoKeyboard's usual "answer input"
 * role — onSelect, selectedNote, correctNote — is unused here: nothing on
 * this keyboard is ever graded). Keys are labeled with do/re/mi/... —
 * this world's own solfège naming (see lib/music/solfege.ts's own doc) —
 * rather than the C/D/E/... letter names every other PianoKeyboard caller
 * leaves unlabeled; only natural (white) keys get a label, since this
 * app's solfège naming is natural-notes-only and there's no correct
 * syllable for a black key. The lesson screen remounts this per exercise
 * (same `key={definition.id}` pattern ExerciseIntroRecap already uses),
 * so it always starts collapsed on a fresh exercise. */
export function PianoKeyboardRecap({ range }: PianoKeyboardRecapProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ width: "100%", marginBottom: theme.spacing(2) }}>
      <DarkButton
        label={expanded ? "Zwiń (pianino) ▲" : "Zapoznaj się (pianino) ▼"}
        onPress={() => setExpanded((value) => !value)}
        variant="secondary"
      />
      {expanded && (
        <View style={{ marginTop: theme.spacing(1.5), alignItems: "center" }}>
          <PianoKeyboard
            range={{ from: range[0], to: range[1] }}
            onSelect={() => {}}
            labelFor={(note) => (note.accidental === 0 ? getSolfegeSyllable(note.letter, "pl") : null)}
          />
        </View>
      )}
    </View>
  );
}
