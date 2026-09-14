import { useState } from "react";
import { View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { LessonIntroStaff } from "@/components/exercises/LessonIntro";
import type { Clef } from "@/lib/music/staff";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface LessonIntroRecapProps {
  notes: string[];
  locale: Locale;
  clef?: Clef;
}

/** The introNotes-lesson counterpart of ExerciseIntroRecap (which only
 * handles the richer introSlides format) — same collapsed-by-default
 * "Zapoznaj się" toggle shown above every exercise, re-opening the exact
 * same staff-of-notes view LessonIntro shows once before the lesson
 * starts, so a player can glance back at it mid-exercise instead of only
 * ever seeing it that one time. */
export function LessonIntroRecap({ notes, locale, clef }: LessonIntroRecapProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ width: "100%", marginBottom: theme.spacing(2) }}>
      <DarkButton label={expanded ? "Zwiń zapoznaj się ▲" : "Zapoznaj się ▼"} onPress={() => setExpanded((value) => !value)} variant="secondary" />
      {expanded && (
        <View style={{ marginTop: theme.spacing(1.5) }}>
          <LessonIntroStaff notes={notes} locale={locale} clef={clef} />
        </View>
      )}
    </View>
  );
}
