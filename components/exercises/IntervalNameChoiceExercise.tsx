import { useEffect, useRef } from "react";
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
import { OptionButton } from "@/components/exercises/OptionButton";
import { playInterval } from "@/lib/audio/player";
import { parseScientific } from "@/lib/music/notes";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { GeneratedExercise } from "@/types/exercises";

interface IntervalNameChoiceExerciseProps {
  exercise: Extract<GeneratedExercise, { type: "interval-name-choice" }>;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  checked: boolean;
  locale: Locale;
}

/** Above this many options, the plain stacked-button list (lekcje 1-7's
 * own 2-5 option pools) turns into a long random-order scroll that's hard
 * to scan for the right answer — the full-range levels (8-10) always show
 * every named interval at once. Past this threshold, this component
 * switches to the sorted, one-at-a-time "okienko" layout below instead. */
const FULL_RANGE_OPTION_THRESHOLD = 8;

/** Height of exactly one option row in the full-range picker window below
 * — the window's own height is pinned to this same number so only ONE
 * option is ever visible at a time, and `snapToInterval={ITEM_HEIGHT}`
 * makes a swipe always settle on a whole option, never half of two. */
const ITEM_HEIGHT = 84;

/** How long the picker waits after the LAST onScroll event before treating
 * the scroll as finished — see handleScroll's own doc for why this exists
 * (wheel/trackpad scrolling on web fires no drag/momentum-end event at
 * all). Short enough that it doesn't feel laggy once a finger/wheel
 * genuinely stops, long enough not to fire mid-scroll between two wheel
 * ticks a few ms apart. */
const SCROLL_SETTLE_DELAY_MS = 120;

/**
 * "Pasmo Interwałów" — two notes shown on a staff (IntervalStaffNotation)
 * and, via the speaker button, audible as a melodic interval (playInterval).
 * The player names the interval from a multiple-choice pool — same
 * OptionButton/correctOptionId shape as multiple-choice-notation, no new
 * scoring logic needed. When exercise.hideNotation is set, the staff is
 * swapped for a plain "listen only" label — used partway through a level
 * once the visual shape is established, so the player has to rely on
 * hearing alone. Ported from the web app's IntervalNameChoiceExercise.tsx.
 */
export function IntervalNameChoiceExercise({ exercise, selectedOptionId, onSelect, checked, locale }: IntervalNameChoiceExerciseProps) {
  function play() {
    const [a, b] = exercise.notes;
    playInterval([parseScientific(a), parseScientific(b)]);
  }

  // Option ids ARE the semitone count (see generateExercise's own
  // `correctOptionId: String(semitones)`) — sorting by that number puts
  // every option in genuine "smallest to largest interval" order, not an
  // alphabetical accident.
  const isFullRange = exercise.options.length > FULL_RANGE_OPTION_THRESHOLD;
  const orderedOptions = isFullRange
    ? [...exercise.options].sort((a, b) => Number(a.id) - Number(b.id))
    : exercise.options;

  const pickerRef = useRef<ScrollView>(null);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // `snapToInterval` alone doesn't actually snap on web (confirmed live —
  // mouse-wheel/trackpad scrolling there never fires the native
  // scroll-snap behavior touch does), so the picker window settles itself
  // manually: round the current offset to the nearest whole row, animate
  // to exactly that row, and select whichever option landed there —
  // scrolling to an option to look at it and CHOOSING it are the same
  // gesture, no separate tap needed (a tap still works too, redundantly).
  function snapToNearest(offsetY: number) {
    const index = Math.max(0, Math.min(orderedOptions.length - 1, Math.round(offsetY / ITEM_HEIGHT)));
    pickerRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    const landedOption = orderedOptions[index];
    if (landedOption && landedOption.id !== selectedOptionId) {
      onSelect(landedOption.id);
    }
  }
  function handleScrollEndEvent(event: NativeSyntheticEvent<NativeScrollEvent>) {
    snapToNearest(event.nativeEvent.contentOffset.y);
  }
  // Touch dragging fires onScrollEndDrag/onMomentumScrollEnd reliably (see
  // handleScrollEndEvent above), but a mouse wheel or trackpad on web
  // never fires either — there's no "drag" or "momentum" to end, just a
  // stream of onScroll events that stops. This debounce catches THAT
  // case: every onScroll resets a short timer, and once scrolling has
  // genuinely paused (no new event for SCROLL_SETTLE_DELAY_MS), it snaps
  // exactly the same way. Harmless overlap with the touch handlers above
  // when both would fire — snapping to the same already-settled offset a
  // second time is a no-op.
  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (scrollSettleTimer.current) {
      clearTimeout(scrollSettleTimer.current);
    }
    scrollSettleTimer.current = setTimeout(() => snapToNearest(offsetY), SCROLL_SETTLE_DELAY_MS);
  }
  useEffect(() => {
    return () => {
      if (scrollSettleTimer.current) {
        clearTimeout(scrollSettleTimer.current);
      }
    };
  }, []);

  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <Text style={{ fontSize: theme.fontSize.body, fontWeight: "600", color: theme.colors.ink, textAlign: "center" }}>
        {t(exercise.hideNotation ? "lesson.intervalNameChoiceListenOnlyPrompt" : "lesson.intervalNameChoicePrompt", locale)}
      </Text>

      {exercise.hideNotation ? (
        <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.85, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>
          {t("lesson.intervalNameChoiceListenOnlyLabel", locale)}
        </Text>
      ) : (
        <IntervalStaffNotation notes={exercise.notes} />
      )}

      <DarkButton label="🔊" onPress={play} variant="secondary" size={72} fontSize={32} />

      {isFullRange ? (
        // A bordered picker window pinned to exactly ONE row's height
        // (ITEM_HEIGHT) — scrolling/swiping moves through the sorted
        // "smallest to largest, and back" list one option at a time,
        // snapping cleanly on each (snapToInterval), rather than showing
        // several rows at once. No fill color — just the border marks
        // the window's own edge.
        <View
          style={{
            width: "100%",
            height: ITEM_HEIGHT,
            borderWidth: theme.borderWidth,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            overflow: "hidden",
          }}
        >
          <ScrollView
            ref={pickerRef}
            decelerationRate="fast"
            nestedScrollEnabled
            showsVerticalScrollIndicator
            scrollEnabled={!checked}
            onScrollEndDrag={handleScrollEndEvent}
            onMomentumScrollEnd={handleScrollEndEvent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {orderedOptions.map((option) => (
              <View key={option.id} style={{ height: ITEM_HEIGHT, justifyContent: "center", paddingHorizontal: theme.spacing(1) }}>
                <OptionButton
                  label={option.label}
                  selected={selectedOptionId === option.id}
                  correct={checked && option.id === exercise.correctOptionId}
                  incorrect={checked && selectedOptionId === option.id && option.id !== exercise.correctOptionId}
                  disabled={checked}
                  onPress={() => onSelect(option.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={{ width: "100%", gap: theme.spacing(1.5) }}>
          {orderedOptions.map((option) => (
            <OptionButton
              key={option.id}
              label={option.label}
              selected={selectedOptionId === option.id}
              correct={checked && option.id === exercise.correctOptionId}
              incorrect={checked && selectedOptionId === option.id && option.id !== exercise.correctOptionId}
              disabled={checked}
              onPress={() => onSelect(option.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
