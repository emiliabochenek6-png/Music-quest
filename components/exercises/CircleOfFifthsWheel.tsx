import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { View } from "react-native";
import { KeySignatureIconGroup } from "@/components/exercises/KeySignatureStaffIcon";
import { ALL_FIFTHS, getKeyPairDisplayName, getKeySignatureAccidentalNames, SEAM_FLAT_FIFTHS, SEAM_SHARP_FIFTHS } from "@/lib/music/keys";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";

interface CircleOfFifthsWheelProps {
  selectedFifths: number | null;
  onSelect: (fifths: number) => void;
  disabled?: boolean;
  /** Set once the answer is checked — drives correct/incorrect coloring
   * alongside `correctFifths`. Mirrors OptionButton's own checked/correct/
   * incorrect split. */
  checked?: boolean;
  correctFifths?: number | null;
  /** Sectors to visually call out as "given" context (not itself an
   * answer) — e.g. circle-step-choice's starting key. */
  highlightFifths?: readonly number[];
  /** Which ring(s) of text a sector shows. "both" (default) shows the
   * major/minor pair together — appropriate whenever the wheel is just a
   * reference, not itself the thing being recalled. "majorOnly"/
   * "minorOnly" hide the other mode's label, which relative-key-choice
   * needs so the player can't just read the pairing off the sector
   * instead of recalling it. */
  labelMode?: "both" | "majorOnly" | "minorOnly";
  locale: Locale;
  /** A fixed pixel size kept bumping into the same problem every time it
   * got bigger: a hardcoded number either overflows a narrow phone's
   * screen or leaves room unused on a wide one. Filling 100% of whatever
   * width the caller's own layout gives it (capped by `maxWidth` so it
   * doesn't sprawl on a tablet) grows the wheel to the largest size that
   * actually fits, automatically, on every screen — which is also just a
   * bigger wheel than any one fixed number could safely commit to. */
  maxWidth?: number;
}

const VIEW_SIZE = 940;
const CENTER = VIEW_SIZE / 2;
const OUTER_RADIUS = 182;
const RING_BOUNDARY = 122;
const INNER_RADIUS = 70;
const SECTOR_DEGREES = 30;
/** The non-interactive "seam" wedge where the sharp and flat sides of a
 * real circle of fifths meet — SEAM_SHARP_FIFTHS (Fis-dur) and
 * SEAM_FLAT_FIFTHS (Ges-dur) are the same pitch spelled two ways, so they
 * share this one wedge instead of each getting their own 30° sector (see
 * lib/music/keys.ts). Real key data (both labels, both key-signature
 * icons), just not independently clickable — answering "this key" would
 * be ambiguous between the two spellings. */
const SEAM_ANGLE_DEG = 180;
// Icons sit on a ring at 30°-spaced positions — the arc distance between
// two adjacent centers has to clear ICON_WIDTH (149) with real margin or
// neighboring icons overlap.
const ICON_RADIUS = OUTER_RADIUS + 138;
// The seam's two icons (SEAM_SHARP_FIFTHS, SEAM_FLAT_FIFTHS — 6 accidentals
// each, the most of any position) sit side by side, so together they're
// much wider than a single regular icon — pushed further out for real
// clearance from their Des/H neighbors, only 30° away.
const SEAM_ICON_RADIUS = ICON_RADIUS + 65;
// KeySignatureStaffIcon's own viewBox is 235 x 150 — wide enough that up
// to 6 (bold, fontSize-33) accidentals clear the clef glyph without
// overlapping. These sizes keep that ~1.57:1 ratio.
const ICON_WIDTH = 149;
const ICON_HEIGHT = 95;
const SEAM_ICON_WIDTH = 114;
const SEAM_ICON_HEIGHT = 73;

const RING_MAJOR_FILL = "#16a34a"; // tailwind green-600
const RING_MINOR_FILL = "#bbf7d0"; // tailwind green-200
const MAJOR_LABEL_FILL = "#ffffff";
const MINOR_LABEL_FILL = "#404040"; // tailwind neutral-700 — stays legible against the light-green ring regardless of app theme

function polarPoint(angleDeg: number, radius: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(angleRad), y: CENTER + radius * Math.sin(angleRad) };
}

/** An annular (donut) wedge path spanning `centerAngleDeg` +/- half a
 * sector, from `innerR` to `outerR`. */
function wedgePath(centerAngleDeg: number, innerR: number, outerR: number): string {
  const startAngle = centerAngleDeg - SECTOR_DEGREES / 2;
  const endAngle = centerAngleDeg + SECTOR_DEGREES / 2;
  const outerStart = polarPoint(startAngle, outerR);
  const outerEnd = polarPoint(endAngle, outerR);
  const innerEnd = polarPoint(endAngle, innerR);
  const innerStart = polarPoint(startAngle, innerR);
  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

/** Caption listing a key signature's accidentals by name (e.g. "fis, cis"),
 * centered above a key-signature icon — the "podpisz u góry typu fis,
 * cis" reference-chart convention: naming the individual accidentals, not
 * just how many there are. Renders nothing for C, which has none. */
function AccidentalNamesCaption({
  fifths,
  centerX,
  iconTopY,
  locale,
  fontSize = 15,
}: {
  fifths: number;
  centerX: number;
  iconTopY: number;
  locale: Locale;
  fontSize?: number;
}) {
  const names = getKeySignatureAccidentalNames(fifths, locale);
  if (names.length === 0) {
    return null;
  }
  return (
    <SvgText x={centerX} y={iconTopY - 10} fontSize={fontSize} fill={theme.colors.ink} textAnchor="middle">
      {names.join(", ")}
    </SvgText>
  );
}

/**
 * Interactive circle-of-fifths wheel, styled after a traditional printed
 * circle-of-fifths chart — a two-tone ring (major tonics on the darker
 * outer band, relative minors on the lighter inner band) with each
 * sector's real key-signature notation shown just outside it. This is the
 * shared answer surface for every "Labirynt Tonacji" exercise: sharps run
 * clockwise from C at the top, flats counterclockwise, and tapping
 * anywhere in a sector's two rings answers with its fifths value (an
 * invisible top layer handles the actual hit-testing/state coloring, so
 * the decorative green rings underneath always look the same regardless
 * of interaction state). Ported from the web app's CircleOfFifthsWheel.tsx
 * (same wedge-path math, react-native-svg Path/onPress instead of DOM
 * path/onClick).
 */
export function CircleOfFifthsWheel({
  selectedFifths,
  onSelect,
  disabled = false,
  checked = false,
  correctFifths = null,
  highlightFifths = [],
  labelMode = "both",
  locale,
  maxWidth = 600,
}: CircleOfFifthsWheelProps) {
  const seamSharp = getKeyPairDisplayName(SEAM_SHARP_FIFTHS, locale);
  const seamFlat = getKeyPairDisplayName(SEAM_FLAT_FIFTHS, locale);
  const seamMajorPoint = polarPoint(SEAM_ANGLE_DEG, (RING_BOUNDARY + OUTER_RADIUS) / 2);
  const seamMinorPoint = polarPoint(SEAM_ANGLE_DEG, (INNER_RADIUS + RING_BOUNDARY) / 2);
  const seamIconPoint = polarPoint(SEAM_ANGLE_DEG, SEAM_ICON_RADIUS);

  return (
    <View style={{ width: "100%", maxWidth, aspectRatio: 1, alignSelf: "center" }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
        {ALL_FIFTHS.map((fifths) => {
          const angle = fifths * SECTOR_DEGREES;
          const { major, minor } = getKeyPairDisplayName(fifths, locale);
          const majorPoint = polarPoint(angle, (RING_BOUNDARY + OUTER_RADIUS) / 2);
          const minorPoint = polarPoint(angle, (INNER_RADIUS + RING_BOUNDARY) / 2);
          const iconPoint = polarPoint(angle, ICON_RADIUS);

          return (
            <G key={fifths}>
              {labelMode !== "minorOnly" && (
                <Path d={wedgePath(angle, RING_BOUNDARY, OUTER_RADIUS)} fill={RING_MAJOR_FILL} stroke={theme.colors.cream} strokeWidth={2} />
              )}
              {labelMode !== "majorOnly" && (
                <Path d={wedgePath(angle, INNER_RADIUS, RING_BOUNDARY)} fill={RING_MINOR_FILL} stroke={theme.colors.cream} strokeWidth={2} />
              )}
              {labelMode !== "minorOnly" && (
                <SvgText x={majorPoint.x} y={majorPoint.y + 6} fontSize={17} fontWeight="700" fill={MAJOR_LABEL_FILL} textAnchor="middle">
                  {major.replace("-dur", "")}
                </SvgText>
              )}
              {labelMode !== "majorOnly" && (
                <SvgText x={minorPoint.x} y={minorPoint.y + 4} fontSize={13} fill={MINOR_LABEL_FILL} textAnchor="middle">
                  {minor.replace("-moll", "")}
                </SvgText>
              )}
              <AccidentalNamesCaption fifths={fifths} centerX={iconPoint.x} iconTopY={iconPoint.y - ICON_HEIGHT / 2} locale={locale} />
              <KeySignatureIconGroup fifths={fifths} x={iconPoint.x - ICON_WIDTH / 2} y={iconPoint.y - ICON_HEIGHT / 2} width={ICON_WIDTH} height={ICON_HEIGHT} />
            </G>
          );
        })}

        {/* Seam wedge — see SEAM_ANGLE_DEG's own doc comment. Same colors as
            the real sectors (a real circle-of-fifths chart doesn't visually
            single it out), just never clickable: both key names and both
            key-signature icons (6 sharps, 6 flats) are shown together. */}
        <G>
          <Path d={wedgePath(SEAM_ANGLE_DEG, RING_BOUNDARY, OUTER_RADIUS)} fill={RING_MAJOR_FILL} stroke={theme.colors.cream} strokeWidth={2} />
          <Path d={wedgePath(SEAM_ANGLE_DEG, INNER_RADIUS, RING_BOUNDARY)} fill={RING_MINOR_FILL} stroke={theme.colors.cream} strokeWidth={2} />
          {/* The seam names two enharmonic spellings of the same key at
              once — cramming both into one slash-joined line ("Ges/Fis")
              read noticeably more cramped than every regular sector's own
              single clean name, at the same font size fighting for the
              same 30° of arc. Stacking them as two short lines instead
              (flat above, sharp below) keeps each line exactly as short
              as a regular sector's own label, reading just as evenly. */}
          {labelMode !== "minorOnly" && (
            <G>
              <SvgText x={seamMajorPoint.x} y={seamMajorPoint.y - 7} fontSize={15} fontWeight="700" fill={MAJOR_LABEL_FILL} textAnchor="middle">
                {seamFlat.major.replace("-dur", "")}
              </SvgText>
              <SvgText x={seamMajorPoint.x} y={seamMajorPoint.y + 12} fontSize={15} fontWeight="700" fill={MAJOR_LABEL_FILL} textAnchor="middle">
                {seamSharp.major.replace("-dur", "")}
              </SvgText>
            </G>
          )}
          {labelMode !== "majorOnly" && (
            <G>
              <SvgText x={seamMinorPoint.x} y={seamMinorPoint.y - 4} fontSize={11} fill={MINOR_LABEL_FILL} textAnchor="middle">
                {seamFlat.minor.replace("-moll", "")}
              </SvgText>
              <SvgText x={seamMinorPoint.x} y={seamMinorPoint.y + 10} fontSize={11} fill={MINOR_LABEL_FILL} textAnchor="middle">
                {seamSharp.minor.replace("-moll", "")}
              </SvgText>
            </G>
          )}
          <AccidentalNamesCaption
            fifths={SEAM_FLAT_FIFTHS}
            centerX={seamIconPoint.x - SEAM_ICON_WIDTH * 0.65}
            iconTopY={seamIconPoint.y - SEAM_ICON_HEIGHT / 2}
            locale={locale}
            fontSize={12}
          />
          <AccidentalNamesCaption
            fifths={SEAM_SHARP_FIFTHS}
            centerX={seamIconPoint.x + SEAM_ICON_WIDTH * 0.65}
            iconTopY={seamIconPoint.y - SEAM_ICON_HEIGHT / 2}
            locale={locale}
            fontSize={12}
          />
          <KeySignatureIconGroup
            fifths={SEAM_FLAT_FIFTHS}
            x={seamIconPoint.x - SEAM_ICON_WIDTH}
            y={seamIconPoint.y - SEAM_ICON_HEIGHT / 2}
            width={SEAM_ICON_WIDTH}
            height={SEAM_ICON_HEIGHT}
          />
          <KeySignatureIconGroup
            fifths={SEAM_SHARP_FIFTHS}
            x={seamIconPoint.x}
            y={seamIconPoint.y - SEAM_ICON_HEIGHT / 2}
            width={SEAM_ICON_WIDTH}
            height={SEAM_ICON_HEIGHT}
          />
        </G>

        {/* Invisible top layer: the actual tap target and interaction-state
            overlay for each of the 11 supported sectors, drawn last so it
            sits above the decorative rings without changing their own
            colors. */}
        {ALL_FIFTHS.map((fifths) => {
          const angle = fifths * SECTOR_DEGREES;
          const { major, minor } = getKeyPairDisplayName(fifths, locale);
          const isSelected = selectedFifths === fifths;
          const isCorrectSector = checked && correctFifths === fifths;
          const isWrongSelectedSector = checked && isSelected && correctFifths !== fifths;
          const isHighlighted = highlightFifths.includes(fifths);

          let fill = "transparent";
          let fillOpacity = 0;
          if (isCorrectSector) {
            fill = theme.colors.success;
            fillOpacity = 0.5;
          } else if (isWrongSelectedSector) {
            fill = theme.colors.warning;
            fillOpacity = 0.5;
          } else if (isSelected) {
            fill = theme.colors.primary;
            fillOpacity = 0.3;
          } else if (isHighlighted) {
            fill = "#fbbf24"; // tailwind amber-400 — a distinct "given context" tint, not the answer-state colors above
            fillOpacity = 0.4;
          }

          return (
            <Path
              key={`hit-${fifths}`}
              d={wedgePath(angle, INNER_RADIUS, OUTER_RADIUS)}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={theme.colors.primary}
              strokeWidth={isSelected || isHighlighted ? 3 : 0}
              onPress={() => !disabled && onSelect(fifths)}
              accessibilityLabel={`${major} / ${minor}`}
            />
          );
        })}
        <Circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 4} fill={theme.colors.cream} />
      </Svg>
    </View>
  );
}
