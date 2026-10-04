import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import { useEquippedOutfit } from "@/components/shop/useEquippedOutfit";
import { feedbackLine } from "@/lib/answerFeedback";

const HAPPY_SOLFEK = require("@/assets/soltek/radosny.png");
const SURPRISED_SOLFEK = require("@/assets/soltek/zaskoczony.png");

interface AnswerFeedbackPanelProps {
  /** The panel slides up when this turns true and back down when it turns false. */
  visible: boolean;
  /** true = green (it was right), false = red (it was wrong); null is treated as red but should not be shown. */
  correct: boolean | null;
  /** Leave it out to get one of Solfek's own lines ("Brawo!", "Prawie!"…), drawn fresh every time the panel opens. */
  title?: string;
  /** A second line under the title; leave it out to get Solfek's own. */
  note?: string;
  /** A reward line, e.g. "+10 XP · +2 nutki". */
  detail?: string;
  /** Something to show instead of the title and the note. */
  children?: ReactNode;
  /** Text of the big button ("Dalej"); omit it to show no button (the game goes on by itself). */
  buttonLabel?: string;
  onContinue?: () => void;
  testID?: string;
}

// Green = well done, red = a mistake — but warm, to sit in Solfek's orange world, instead of the cold tints of other apps.
const GREEN = { background: "#E3F6C9", title: "#3E8A0C", note: "#4F7A2A", button: "#58B80D", shadow: "#3E8A0C", chip: "#CDEBA4" };
const RED = { background: "#FFE3DA", title: "#C8321E", note: "#9A4A3C", button: "#EF4C3A", shadow: "#C8321E", chip: "#FFCDBF" };

/**
 * The feedback panel after "Sprawdź": a green sheet when the answer was right and a red one when it was wrong. Solfek peeks over
 * its top edge (happy for a hit, surprised for a miss), says something in his own words, and a round "Dalej" button sits where
 * "Sprawdź" was, so the player's thumb stays in the same place. It slides away again when the next exercise comes in.
 * Place it as the last child of a screen's root view (it positions itself at the bottom).
 */
export function AnswerFeedbackPanel({ visible, correct, title, note, detail, children, buttonLabel, onContinue, testID }: AnswerFeedbackPanelProps) {
  const insets = useSafeAreaInsets();
  const outfit = useEquippedOutfit().image;
  const progress = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(260);
  const [shown, setShown] = useState(visible);
  const [line, setLine] = useState(() => feedbackLine(true));
  // The game clears the result (null) the moment "Dalej" is pressed, while the sheet is still sliding away: keep the last real
  // result so a green "Brawo!" never turns red on its way out.
  const lastResult = useRef(true);
  if (correct !== null) lastResult.current = correct;
  const isRight = lastResult.current;
  const colors = isRight ? GREEN : RED;

  useEffect(() => {
    if (visible) {
      setShown(true);
      setLine(feedbackLine(isRight));
      bounce.setValue(0);
      Animated.sequence([
        Animated.delay(140),
        Animated.spring(bounce, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
      ]).start();
    }
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 260 : 180,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setShown(false);
    });
    // the result is read only at the moment the panel opens (the line must not change while it is shown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, progress, bounce]);

  function handleLayout(event: LayoutChangeEvent) {
    setHeight(event.nativeEvent.layout.height);
  }

  if (!shown && !visible) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height + 24, 0] });
  const solfekY = bounce.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  const solfekRotate = bounce.interpolate({ inputRange: [0, 1], outputRange: [isRight ? "-10deg" : "8deg", "0deg"] });
  const solfekImage = outfit ?? (isRight ? HAPPY_SOLFEK : SURPRISED_SOLFEK);

  return (
    <Animated.View
      testID={testID}
      onLayout={handleLayout}
      pointerEvents={visible ? "auto" : "none"}
      accessibilityLiveRegion="polite"
      style={[styles.panel, { backgroundColor: colors.background, paddingBottom: insets.bottom + 18, opacity: progress, transform: [{ translateY }] }]}
    >
      {/* Solfek leans over the edge of the sheet */}
      <Animated.View style={[styles.solfek, { transform: [{ translateY: solfekY }, { rotate: solfekRotate }] }]} pointerEvents="none">
        <Image source={solfekImage} style={styles.solfekImage} resizeMode="contain" accessibilityLabel={isRight ? "Solfek się cieszy" : "Solfek jest zaskoczony"} />
      </Animated.View>

      <View style={styles.texts}>
        {children ?? (
          <>
            <Text style={[styles.title, { color: colors.title }]}>{title ?? line.title}</Text>
            <Text style={[styles.note, { color: colors.note }]}>{note ?? line.note}</Text>
          </>
        )}
        {detail ? (
          <View style={[styles.chip, { backgroundColor: colors.chip }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="#FFC83D" stroke="#D9571A" strokeWidth={1.6} strokeLinejoin="round" />
            </Svg>
            <Text style={[styles.chipText, { color: colors.title }]}>{detail}</Text>
          </View>
        ) : null}
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
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
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
    paddingTop: 22,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 16,
  },
  solfek: { position: "absolute", right: 14, top: -62, width: 96, height: 96 },
  solfekImage: { width: 96, height: 96 },
  texts: { gap: 4, paddingRight: 96, minHeight: 56, justifyContent: "center" },
  title: { fontSize: 24, lineHeight: 28, fontWeight: "800" },
  note: { fontSize: 14, lineHeight: 19, fontWeight: "600" },
  chip: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: "800" },
  button: {
    height: 58,
    borderRadius: 29,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.3 },
});
