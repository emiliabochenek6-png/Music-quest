import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ReactNode } from "react";

interface AnswerFeedbackPanelProps {
  /** The panel slides up when this turns true and back down when it turns false. */
  visible: boolean;
  /** true = green ("Świetnie!"), false = red; null is treated as red but should not be shown. */
  correct: boolean | null;
  title: string;
  /** A second line, e.g. "+10 XP · +2 nutki". */
  detail?: string;
  /** Something to show instead of the plain title, e.g. Solfek's comment. */
  children?: ReactNode;
  /** Text of the big button ("Dalej"); omit it to show no button (the game goes on by itself). */
  buttonLabel?: string;
  onContinue?: () => void;
  testID?: string;
}

const GREEN = { background: "#D7FFB8", title: "#58A700", button: "#58CC02", shadow: "#58A700" };
const RED = { background: "#FFDFE0", title: "#EA2B2B", button: "#FF4B4B", shadow: "#EA2B2B" };

/**
 * The feedback panel after "Sprawdź", in the style of Duolingo: a big green (or red) sheet slides up from the bottom of the
 * screen with a tick (or a cross), "Świetnie!" and a wide matching "Dalej" button. It covers the area where "Sprawdź" was, so the
 * player's thumb stays in the same place, and slides away again when the next exercise comes in.
 * Place it as the last child of a screen's root view (it positions itself at the bottom).
 */
export function AnswerFeedbackPanel({ visible, correct, title, detail, children, buttonLabel, onContinue, testID }: AnswerFeedbackPanelProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(260);
  const [shown, setShown] = useState(visible);
  const colors = correct ? GREEN : RED;

  useEffect(() => {
    if (visible) setShown(true);
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 260 : 180,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setShown(false);
    });
  }, [visible, progress]);

  function handleLayout(event: LayoutChangeEvent) {
    setHeight(event.nativeEvent.layout.height);
  }

  if (!shown && !visible) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height + 24, 0] });

  return (
    <Animated.View
      testID={testID}
      onLayout={handleLayout}
      pointerEvents={visible ? "auto" : "none"}
      accessibilityLiveRegion="polite"
      style={[styles.panel, { backgroundColor: colors.background, paddingBottom: insets.bottom + 18, opacity: progress, transform: [{ translateY }] }]}
    >
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: colors.button }]}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            {correct ? (
              <Path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <Circle cx={12} cy={12} r={0} fill="none" />
                <Path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" />
              </>
            )}
          </Svg>
        </View>
        <View style={styles.texts}>
          {children ?? <Text style={[styles.title, { color: colors.title }]}>{title}</Text>}
          {detail ? <Text style={[styles.detail, { color: colors.title }]}>{detail}</Text> : null}
        </View>
      </View>
      {buttonLabel && onContinue ? (
        <Pressable
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          testID={testID ? `${testID}-continue` : undefined}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.button, shadowColor: colors.shadow, transform: [{ translateY: pressed ? 3 : 0 }], shadowOffset: { width: 0, height: pressed ? 1 : 4 } }]}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

/** The next exercise fades and slides in a little instead of appearing with a jump (key it by the exercise). */
export function ExerciseTransition({ children }: { children: ReactNode }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [progress]);
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  return <Animated.View style={{ opacity: progress, transform: [{ translateX }] }}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  badge: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: 22, fontWeight: "800" },
  detail: { fontSize: 14, fontWeight: "700" },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  buttonText: { fontSize: 17, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.4 },
});
