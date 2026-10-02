import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DarkButton } from "@/components/exercises/DarkButton";
import { AppIcon } from "@/components/icons/AppIcon";
import { SoltekMascot } from "@/components/SoltekMascot";
import { GUIDE_STEPS } from "@/lib/guide/guideSteps";
import { measureTourTarget } from "@/lib/guide/tourTargets";
import type { TourRect } from "@/lib/guide/tourTargets";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface GameGuideProps {
  /** Called when the tour is finished or skipped. */
  onClose: () => void;
}

const DIM = "rgba(20,10,0,0.68)";
const HIGHLIGHT = "#FFC94A";
const PAD = 6;
const CARD_MAX_WIDTH = 360;
const GAP = 14;
const ARROW = 14;

/** The tour of the whole game: the screen is dimmed, the real element the
 * step is about is lit up with a gold frame, and Soltek's card points at it
 * ("Kliknij tutaj…"). Pressing the lit-up spot (or "Dalej") moves on. A step
 * with no target, or whose spot isn't on screen, shows a card in the middle.
 * Mount it only while it should show (a closing RN-web Modal can linger). */
export function GameGuide({ onClose }: GameGuideProps) {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<TourRect | null>(null);
  // False while a step's spot is still being looked up (nothing is drawn but the dimming, so the card never flashes in the middle first).
  const [measured, setMeasured] = useState(false);
  const step = GUIDE_STEPS[index];
  const isFirst = index === 0;
  const isLast = index === GUIDE_STEPS.length - 1;

  // Find where this step's spot is on screen (again whenever the step or the window changes).
  useEffect(() => {
    let cancelled = false;
    setRect(null);
    setMeasured(!step.target);
    if (!step.target) return;
    const target = step.target;
    const timer = setTimeout(() => {
      void measureTourTarget(target).then((found) => {
        if (cancelled) return;
        setRect(found);
        setMeasured(true);
      });
    }, 60);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [index, step.target, width, height]);

  const next = () => (isLast ? onClose() : setIndex(index + 1));
  const back = () => setIndex(index - 1);

  const card = (
    <View style={[styles.card, { width: Math.min(CARD_MAX_WIDTH, width - 32) }]} accessibilityLabel={`Przewodnik, krok ${index + 1} z ${GUIDE_STEPS.length}`}>
      <View style={styles.topRow}>
        <Text style={styles.counter}>
          {index + 1} / {GUIDE_STEPS.length}
        </Text>
        {!isLast && (
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Pomiń przewodnik" hitSlop={12}>
            <Text style={styles.skip}>Pomiń</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.titleRow}>
        <AppIcon name={step.icon} size={34} />
        <Text style={styles.title}>{step.title}</Text>
      </View>
      <SoltekMascot size="sm" expression={step.expression} frameless message={step.message} />
      <View style={styles.dots}>
        {GUIDE_STEPS.map((item, dotIndex) => (
          <View key={item.id} style={[styles.dot, dotIndex === index && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.buttons}>
        {!isFirst && (
          <View style={{ flex: 1 }}>
            <DarkButton label="Wstecz" onPress={back} variant="secondary" />
          </View>
        )}
        <View style={{ flex: 2 }}>
          <DarkButton label={isLast ? "Zaczynajmy!" : "Dalej"} onPress={next} />
        </View>
      </View>
    </View>
  );

  // Pointing at a spot: dim everything around it, frame it, put the card on the roomier side.
  if (rect) {
    const left = Math.max(0, rect.x - PAD);
    const top = Math.max(0, rect.y - PAD);
    const right = Math.min(width, rect.x + rect.width + PAD);
    const bottom = Math.min(height, rect.y + rect.height + PAD);
    const placeBelow = top + (bottom - top) / 2 < height / 2;
    const cardWidth = Math.min(CARD_MAX_WIDTH, width - 32);
    const cardLeft = (width - cardWidth) / 2;
    const arrowCenter = Math.min(Math.max(rect.x + rect.width / 2, cardLeft + 24), cardLeft + cardWidth - 24);

    return (
      <Modal visible transparent animationType="none" onRequestClose={onClose}>
        <View style={StyleSheet.absoluteFill}>
          {/* Four dim panels around the lit-up spot (they swallow taps; the spot itself stays tappable). */}
          <View style={[styles.dim, { left: 0, top: 0, right: 0, height: top }]} />
          <View style={[styles.dim, { left: 0, top: bottom, right: 0, bottom: 0 }]} />
          <View style={[styles.dim, { left: 0, top, width: left, height: bottom - top }]} />
          <View style={[styles.dim, { left: right, top, right: 0, height: bottom - top }]} />
          <Pressable
            onPress={next}
            accessibilityRole="button"
            accessibilityLabel={`Podświetlone miejsce: ${step.title}. Dalej`}
            style={[styles.spot, { left, top, width: right - left, height: bottom - top }]}
          />
          <View
            pointerEvents="none"
            style={[
              styles.cardWrap,
              placeBelow ? { top: bottom + GAP + ARROW / 2 } : { bottom: height - top + GAP + ARROW / 2 },
              { left: cardLeft, width: cardWidth },
            ]}
          >
            <View
              style={[
                styles.arrow,
                placeBelow ? { top: -ARROW / 2 } : { bottom: -ARROW / 2 },
                { left: arrowCenter - cardLeft - ARROW / 2 },
              ]}
            />
          </View>
          <View style={[styles.cardWrap, placeBelow ? { top: bottom + GAP + ARROW / 2 } : { bottom: height - top + GAP + ARROW / 2 }, { left: cardLeft, width: cardWidth }]}>
            {card}
          </View>
        </View>
      </Modal>
    );
  }

  if (!measured) {
    return (
      <Modal visible transparent animationType="none" onRequestClose={onClose}>
        <View style={styles.centerBackdrop} />
      </Modal>
    );
  }

  // No spot (a welcome/closing step, or the spot isn't on screen): a card in the middle.
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.centerBackdrop}>{card}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { position: "absolute", backgroundColor: DIM },
  spot: {
    position: "absolute",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: HIGHLIGHT,
    shadowColor: HIGHLIGHT,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  cardWrap: { position: "absolute" },
  arrow: {
    position: "absolute",
    width: ARROW,
    height: ARROW,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: theme.borderWidth,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  centerBackdrop: { flex: 1, backgroundColor: DIM, alignItems: "center", justifyContent: "center", padding: 16 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing(2),
    alignItems: "center",
    gap: theme.spacing(1),
  },
  topRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 18 },
  counter: { fontSize: 12, fontWeight: "800", color: theme.colors.muted },
  skip: { fontSize: 13, fontWeight: "800", color: theme.colors.muted },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: theme.fontSize.heading * 0.9, fontWeight: "800", color: theme.colors.ink, flexShrink: 1 },
  dots: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted },
  dotActive: { width: 22, backgroundColor: theme.colors.primary },
  buttons: { width: "100%", flexDirection: "row", gap: theme.spacing(1) },
});
