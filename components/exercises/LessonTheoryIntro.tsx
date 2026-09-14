import { ScrollView, Text } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntroSlideCards } from "@/components/exercises/IntroSlideCards";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { LessonTheorySlide } from "@/types/exercises";

interface LessonTheoryIntroProps {
  slides: LessonTheorySlide[];
  onContinue: () => void;
  locale: Locale;
}

/** A short multi-card rule explanation shown before a lesson's exercises —
 * each card is a paragraph plus, when the slide has one, an altered note on
 * the staff and a row of "before → after" examples. The actual per-slide
 * rendering lives in IntroSlideCards.tsx (shared with ExerciseIntroRecap's
 * collapsible in-exercise recap of the same content) — this component is
 * just that list's full-screen frame (title, scroll, continue button). */
export function LessonTheoryIntro({ slides, onContinue, locale }: LessonTheoryIntroProps) {
  return (
    <ScrollView
      style={{ flex: 1, width: "100%" }}
      contentContainerStyle={{ alignItems: "center", gap: theme.spacing(3), paddingBottom: theme.spacing(2) }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>
        {t("lesson.introTitle", locale)}
      </Text>

      <IntroSlideCards slides={slides} locale={locale} />

      <DarkButton label={t("lesson.introContinue", locale)} onPress={onContinue} />
    </ScrollView>
  );
}
