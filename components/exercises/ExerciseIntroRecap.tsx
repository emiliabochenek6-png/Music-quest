import { useState } from "react";
import { View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntroSlideCards } from "@/components/exercises/IntroSlideCards";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { LessonTheorySlide } from "@/types/exercises";

interface ExerciseIntroRecapProps {
  slides: LessonTheorySlide[];
  locale: Locale;
}

/** A collapsed-by-default "Zapoznaj się" toggle shown above every exercise
 * in a lesson that has its own theory intro — lets the player re-open that
 * same intro content (IntroSlideCards, the exact cards LessonTheoryIntro
 * itself shows once before the lesson starts) at any point during the
 * lesson, instead of only ever seeing it that one time. The lesson screen
 * remounts this per exercise (same `key={definition.id}` it already gives
 * ExerciseRenderer), so it always starts collapsed on a fresh exercise and
 * any audio a still-expanded recap had playing stops with it rather than
 * leaking into the next exercise. */
export function ExerciseIntroRecap({ slides, locale }: ExerciseIntroRecapProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ width: "100%", marginBottom: theme.spacing(2) }}>
      <DarkButton label={expanded ? "Zwiń zapoznaj się ▲" : "Zapoznaj się ▼"} onPress={() => setExpanded((value) => !value)} variant="secondary" />
      {expanded && (
        <View style={{ marginTop: theme.spacing(1.5) }}>
          <IntroSlideCards slides={slides} locale={locale} />
        </View>
      )}
    </View>
  );
}
