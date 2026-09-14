import { Text, View } from "react-native";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { RestValueIcon } from "@/components/exercises/RestValueIcon";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Meter, RhythmNoteValue, RhythmRestValue } from "@/types/exercises";

interface MeteredNotationRowProps {
  bpm: number;
  meter: Meter;
  beatsPerMeasure: number;
  sequence: readonly (RhythmNoteValue | RhythmRestValue)[];
  slotTimesMs: readonly number[];
}

const REST_VALUES: ReadonlySet<string> = new Set<RhythmRestValue>(["quarterRest", "eighthRest"]);

function isRest(value: RhythmNoteValue | RhythmRestValue): value is RhythmRestValue {
  return REST_VALUES.has(value);
}

export function TimeSignature({ meter }: { meter: Meter }) {
  const [numerator, denominator] = meter.split("/");
  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginRight: theme.spacing(1) }}>
      <Text style={{ color: theme.colors.ink, fontSize: 20, fontWeight: "800", lineHeight: 22 }}>{numerator}</Text>
      <Text style={{ color: theme.colors.ink, fontSize: 20, fontWeight: "800", lineHeight: 22 }}>{denominator}</Text>
    </View>
  );
}

/** Renders a time signature followed by the sequence's note/rest glyphs,
 * grouped into measures with a bar line between them — ported in spirit
 * from the web app's MeteredNotationRow.tsx (font-glyph-based there; hand-
 * drawn SVG here, see NoteValueIcon's own doc). Measures wrap onto new
 * lines via flexWrap rather than horizontal scroll, so a measure is never
 * visually split and nothing runs off the edge of a phone screen — the
 * SAME "flexWrap over overflow" fix already used for this app's button
 * rows elsewhere. Bar lines are placed by ELAPSED TIME (slotTimesMs
 * divided into bpm-derived measure-length windows), not by whether a
 * note's own duration happens to land exactly on a measure boundary —
 * some of this world's authored content doesn't perfectly bar-align (e.g.
 * a whole note starting mid-measure), which is a pre-existing quirk of
 * the ported content, not something this component tries to "fix". */
export function MeteredNotationRow({ bpm, meter, beatsPerMeasure, sequence, slotTimesMs }: MeteredNotationRowProps) {
  const beatIntervalMs = (60 / bpm) * 1000;
  const measureDurationMs = beatsPerMeasure * beatIntervalMs;

  const measures: (RhythmNoteValue | RhythmRestValue)[][] = [];
  sequence.forEach((value, index) => {
    // The +1e-6 guards against a note landing EXACTLY on a measure
    // boundary getting bumped into the wrong measure by ordinary
    // floating-point rounding — a real risk once beatsPerMeasure/
    // measureDurationMs can be fractional (9/8's felt-pulse count is 4.5),
    // not just the round numbers Wioska Nut/Miasto Rytmu's own 4/4 and
    // 3/4 content happened to use.
    const measureIndex = Math.floor(slotTimesMs[index] / measureDurationMs + 1e-6);
    if (!measures[measureIndex]) {
      measures[measureIndex] = [];
    }
    measures[measureIndex].push(value);
  });

  // Each measure is one unbreakable flex-wrap item (a bar line inside a
  // measure would be meaningless), so a measure that's too wide to share
  // its line with the TimeSignature wraps as a WHOLE — leaving the time
  // signature stranded alone on the line above instead of beside the
  // notation. 12/8's densest content (12 straight eighth notes fitting in
  // one measure — see e.g. Przystań Taktów's own 12/8 lesson) is the
  // actual case that overflows a phone-width row at this row's original
  // fixed 22px icon size; shorter/sparser measures never needed shrinking
  // in the first place, so this only shrinks as much as the densest
  // measure in THIS sequence actually requires.
  const maxNotesInMeasure = Math.max(0, ...measures.map((measureValues) => measureValues.length));
  const iconSize = maxNotesInMeasure > 9 ? 13 : maxNotesInMeasure > 6 ? 17 : 22;
  const iconGap = maxNotesInMeasure > 9 ? 3 : maxNotesInMeasure > 6 ? 4 : 5;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", rowGap: theme.spacing(1.5) }}>
      <TimeSignature meter={meter} />
      {measures.map((measureValues, measureIndex) => (
        <View key={measureIndex} style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: iconGap }}>
            {measureValues.map((value, valueIndex) =>
              isRest(value) ? (
                <RestValueIcon key={valueIndex} value={value} size={iconSize} />
              ) : (
                <NoteValueIcon key={valueIndex} value={value} size={iconSize} />
              )
            )}
          </View>
          <View style={{ width: 1.5, height: 32, backgroundColor: theme.colors.ink, opacity: 0.5, marginHorizontal: theme.spacing(1) }} />
        </View>
      ))}
    </View>
  );
}
