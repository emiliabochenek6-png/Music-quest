import { Fragment } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Line, Ellipse, Text as SvgText } from "react-native-svg";
import { DarkButton } from "@/components/exercises/DarkButton";
import { describeStaffPosition, ledgerLineSteps, type Clef } from "@/lib/music/staff";
import { parseScientific } from "@/lib/music/notes";
import { getNoteDisplayName } from "@/lib/music/names";
import { STAFF_LINE_STEPS, VIEW_HEIGHT, stepToY } from "@/lib/music/staffGeometry";
import { t } from "@/lib/i18n/translate";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface LessonIntroProps {
  /** Scientific-pitch notes, e.g. "C4" — drawn left to right on one staff. */
  notes: string[];
  onContinue: () => void;
  locale: Locale;
  clef?: Clef;
  subtitle?: string;
}

const LINE_X1 = 10;
const FIRST_NOTE_X = 72;
const NOTE_SPACING = 30;
const RIGHT_PAD = 20;
const NOTE_RADIUS = 6;
const LEDGER_WIDTH = 22;

// Same viewBox HEIGHT (150) as staffGeometry's other consumers — vertical
// scale is what makes a clef glyph read as correctly sized against the
// staff lines, so these x/y/fontSize values are lifted directly from
// ClefTraceBoard's own CLEF_GLYPH (same rationale documented there): they
// only need re-deriving if VIEW_HEIGHT itself changes.
const CLEF_GLYPH: Record<Clef, { char: string; fontSize: number; x: number; y: number }> = {
  treble: { char: "𝄞", fontSize: 130, x: 9, y: 108 },
  bass: { char: "𝄢", fontSize: 92, x: 13, y: 93.5 },
};

interface LessonIntroStaffProps {
  notes: string[];
  locale: Locale;
  clef?: Clef;
  /** Overrides the default letter-name label under each note (e.g. with
   * solfège syllables) — "Zaczarowany Solfeż"'s own phrase-singing
   * exercise reuses this same staff-of-notes visual but needs do/re/mi/...
   * underneath instead of C/D/E/... Same length and order as `notes`;
   * falls back to getNoteDisplayName per-note when omitted. */
  labels?: string[];
  /** Index (into `notes`) of the one note currently expected to be sung —
   * "Zaczarowany Solfeż"'s own phrase-singing exercise passes this while
   * recording, live, to show which note of the scale the player should be
   * on right now. Drawn in theme.colors.success instead of the usual
   * primary purple, with a slightly larger notehead — undefined (the
   * default) draws every note the normal way. */
  highlightedIndex?: number;
}

/** The staff-of-notes visual itself — every note a lesson is about to quiz,
 * drawn in order on one staff (with its clef) and named underneath.
 * Extracted from LessonIntro (which wraps this with a title/subtitle and a
 * "Kontynuuj" button for the one-time screen) so LessonIntroRecap can reuse
 * the exact same visual for its own collapsed-by-default in-exercise
 * toggle, the introNotes-lesson counterpart of ExerciseIntroRecap (which
 * only handles the richer introSlides format). */
export function LessonIntroStaff({ notes, locale, clef = "treble", labels, highlightedIndex }: LessonIntroStaffProps) {
  const noteX = (index: number) => FIRST_NOTE_X + index * NOTE_SPACING;
  const contentWidth = noteX(Math.max(0, notes.length - 1)) + RIGHT_PAD;
  const renderWidth = Math.min(contentWidth, 340);
  const renderHeight = (renderWidth / contentWidth) * VIEW_HEIGHT;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
      <View style={{ width: renderWidth, height: renderHeight, backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.md }}>
        <Svg viewBox={`0 0 ${contentWidth} ${VIEW_HEIGHT}`} width={renderWidth} height={renderHeight}>
          {STAFF_LINE_STEPS.map((lineStep) => (
            <Line
              key={lineStep}
              x1={LINE_X1}
              x2={contentWidth - LINE_X1}
              y1={stepToY(lineStep)}
              y2={stepToY(lineStep)}
              stroke={theme.colors.ink}
              strokeWidth={1.5}
              opacity={0.6}
            />
          ))}

          <SvgText x={CLEF_GLYPH[clef].x} y={CLEF_GLYPH[clef].y} fontSize={CLEF_GLYPH[clef].fontSize} fill={theme.colors.ink}>
            {CLEF_GLYPH[clef].char}
          </SvgText>

          {notes.map((note, index) => {
            const parsed = parseScientific(note);
            const { step } = describeStaffPosition(parsed, clef);
            const x = noteX(index);
            const y = stepToY(step);
            const isHighlighted = index === highlightedIndex;
            return (
              <Fragment key={index}>
                {ledgerLineSteps(step).map((ledgerStep) => (
                  <Line
                    key={ledgerStep}
                    x1={x - LEDGER_WIDTH / 2}
                    x2={x + LEDGER_WIDTH / 2}
                    y1={stepToY(ledgerStep)}
                    y2={stepToY(ledgerStep)}
                    stroke={theme.colors.ink}
                    strokeWidth={1.5}
                  />
                ))}
                <Ellipse
                  cx={x}
                  cy={y}
                  rx={isHighlighted ? NOTE_RADIUS + 2.5 : NOTE_RADIUS}
                  ry={isHighlighted ? NOTE_RADIUS + 1.5 : NOTE_RADIUS - 1}
                  fill={isHighlighted ? theme.colors.success : theme.colors.primary}
                />
                <SvgText
                  x={x}
                  y={VIEW_HEIGHT - 6}
                  fontSize={15}
                  fontWeight="bold"
                  fill={isHighlighted ? theme.colors.success : theme.colors.ink}
                  textAnchor="middle"
                >
                  {labels ? labels[index] : getNoteDisplayName(parsed, locale)}
                </SvgText>
              </Fragment>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
}

/** A "get familiar" reference screen shown once before a lesson's exercises
 * — every note the lesson is about to quiz, drawn in order on one staff
 * (with its clef) and named underneath, so the player has seen the whole
 * picture before being tested on pieces of it. Ported in spirit from the
 * web app's LessonIntro.tsx, but as a single continuous staff (real sheet
 * music reads left to right on one staff, not as separate note flashcards)
 * rather than one small StaffNotation icon per note. */
export function LessonIntro({ notes, onContinue, locale, clef = "treble", subtitle }: LessonIntroProps) {
  return (
    <View style={{ alignItems: "center", gap: theme.spacing(3) }}>
      <View style={{ alignItems: "center", gap: theme.spacing(0.5) }}>
        <Text style={{ fontSize: theme.fontSize.heading, fontWeight: "800", color: theme.colors.ink, textAlign: "center" }}>
          {t("lesson.introTitle", locale)}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: theme.fontSize.body * 0.85, fontWeight: "600", color: theme.colors.muted, textAlign: "center" }}>
            {subtitle}
          </Text>
        )}
      </View>

      <LessonIntroStaff notes={notes} locale={locale} clef={clef} />

      <DarkButton label={t("lesson.introContinue", locale)} onPress={onContinue} />
    </View>
  );
}
