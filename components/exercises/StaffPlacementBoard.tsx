import { Pressable, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import { describeLineOrSpaceOrdinal } from "@/lib/music/staff";
import { STAFF_LINE_STEPS, STEP_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, stepToY } from "@/lib/music/staffGeometry";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface StaffPlacementBoardProps {
  selectedStep: number | null;
  onSelect: (step: number) => void;
  disabled: boolean;
  correctStep?: number | null;
  locale: Locale;
}

const CLICKABLE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** An empty, clickable 5-line staff — ported from the web app's
 * StaffPlacementBoard.tsx: real Pressables absolutely positioned over the
 * SVG at each of 9 line/space slots, same click-target/a11y reasoning as
 * that file's own doc (proper tap targets instead of SVG hit regions). */
export function StaffPlacementBoard({ selectedStep, onSelect, disabled, correctStep = null, locale }: StaffPlacementBoardProps) {
  const boardWidth = 220;
  const boardHeight = (VIEW_HEIGHT / VIEW_WIDTH) * boardWidth;

  return (
    <View style={{ width: boardWidth, height: boardHeight, alignSelf: "center" }}>
      <Svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} width={boardWidth} height={boardHeight} style={{ position: "absolute" }}>
        {STAFF_LINE_STEPS.map((step) => (
          <Line
            key={step}
            x1={10}
            x2={VIEW_WIDTH - 10}
            y1={stepToY(step)}
            y2={stepToY(step)}
            stroke={theme.colors.ink}
            strokeWidth={1.5}
          />
        ))}
      </Svg>

      {CLICKABLE_STEPS.map((step) => {
        const y = stepToY(step);
        const isSelected = selectedStep === step;
        const isCorrect = correctStep === step;
        const isWrongSelected = disabled && isSelected && !isCorrect;
        const ordinal = describeLineOrSpaceOrdinal(step);
        const label = ordinal
          ? t(ordinal.kind === "line" ? "lesson.placeOnLine" : "lesson.placeOnSpace", locale, { n: ordinal.ordinal })
          : undefined;
        const dotColor = isCorrect ? theme.colors.success : isWrongSelected ? theme.colors.warning : theme.colors.ink;

        return (
          <Pressable
            key={step}
            disabled={disabled}
            onPress={() => onSelect(step)}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={{
              position: "absolute",
              left: "30%",
              width: "40%",
              top: `${(y / VIEW_HEIGHT) * 100}%`,
              height: `${(STEP_HEIGHT / VIEW_HEIGHT) * 100}%`,
              transform: [{ translateY: -((STEP_HEIGHT / VIEW_HEIGHT) * boardHeight) / 2 }],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(isSelected || isCorrect) && (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: dotColor,
                  shadowColor: dotColor,
                  shadowOpacity: 0.9,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 0 },
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
