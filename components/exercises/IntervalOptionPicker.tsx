import { useEffect, useRef } from "react";
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, View } from "react-native";
import { OptionButton } from "@/components/exercises/OptionButton";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { MultipleChoiceOption } from "@/types/exercises";

interface IntervalOptionPickerProps {
  /** Already in the order to display — callers sort (e.g. ascending by
   * semitone) before passing these in; this component doesn't re-sort. */
  options: MultipleChoiceOption[];
  selectedOptionId: string | null;
  correctOptionId: string;
  checked: boolean;
  onSelect: (optionId: string) => void;
}

/** Height of exactly one option row — the window's own height is pinned to
 * this same number so only ONE option is ever visible at a time. */
const ITEM_HEIGHT = 84;

/** How long the picker waits after the LAST onScroll event before treating
 * the scroll as finished — wheel/trackpad scrolling on web fires no drag/
 * momentum-end event at all, so `snapToInterval` alone never actually
 * snaps there (confirmed live). Short enough that it doesn't feel laggy
 * once a finger/wheel genuinely stops, long enough not to fire mid-scroll
 * between two wheel ticks a few ms apart. */
const SCROLL_SETTLE_DELAY_MS = 120;

/**
 * A bordered, one-row-tall scrollable "okienko" (window) shared by
 * IntervalNameChoiceExercise's own full-range case and
 * IntervalSequenceChoiceExercise's own per-position pickers — scrolling
 * to an option to look at it and CHOOSING it are the same gesture (no
 * separate tap needed, though a tap still works too, redundantly), and
 * the window settles itself on whichever option it lands nearest, since
 * native `snapToInterval` doesn't actually snap on web (see
 * SCROLL_SETTLE_DELAY_MS's own doc).
 */
export function IntervalOptionPicker({ options, selectedOptionId, correctOptionId, checked, onSelect }: IntervalOptionPickerProps) {
  const pickerRef = useRef<ScrollView>(null);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function snapToNearest(offsetY: number) {
    const index = Math.max(0, Math.min(options.length - 1, Math.round(offsetY / ITEM_HEIGHT)));
    pickerRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    const landedOption = options[index];
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
        {options.map((option) => (
          <View key={option.id} style={{ height: ITEM_HEIGHT, justifyContent: "center", paddingHorizontal: theme.spacing(1) }}>
            <OptionButton
              label={option.label}
              selected={selectedOptionId === option.id}
              correct={checked && option.id === correctOptionId}
              incorrect={checked && selectedOptionId === option.id && option.id !== correctOptionId}
              disabled={checked}
              onPress={() => onSelect(option.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
