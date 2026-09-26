import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { BeamedNotation } from "@/components/exercises/BeamedNotation";
import { ChromaticKeyboardReference } from "@/components/exercises/ChromaticKeyboardReference";
import { CircleOfFifthsWheel } from "@/components/exercises/CircleOfFifthsWheel";
import { DarkButton } from "@/components/exercises/DarkButton";
import { IntervalStaffNotation } from "@/components/exercises/IntervalStaffNotation";
import { NoteValueIcon } from "@/components/exercises/NoteValueIcon";
import { RestValueIcon } from "@/components/exercises/RestValueIcon";
import { StaffNotation } from "@/components/exercises/StaffNotation";
import { TriadStaffNotation } from "@/components/exercises/TriadStaffNotation";
import { playChord, playInterval, playNote, playSample, type SamplePlaybackHandle } from "@/lib/audio/player";
import { getNoteDisplayName } from "@/lib/music/names";
import { parseScientific } from "@/lib/music/notes";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import type { Locale } from "@/types/locale";
import type { LessonTheorySlide, RhythmRestValue } from "@/types/exercises";

const REST_VALUES: ReadonlySet<string> = new Set<RhythmRestValue>(["quarterRest", "eighthRest"]);

interface IntroSlideCardsProps {
  slides: LessonTheorySlide[];
  locale: Locale;
}

/** The actual per-slide "rule card" list — everything a lesson's theory
 * intro (or, elsewhere, a per-exercise "Zapoznaj się" recap) shows for
 * each LessonTheorySlide, factored out of LessonTheoryIntro.tsx so both
 * the full-screen intro and the collapsible in-exercise recap
 * (ExerciseIntroRecap.tsx) render identically from one place instead of
 * two copies drifting apart. No outer ScrollView/title/continue button of
 * its own — callers that need those (LessonTheoryIntro) supply them;
 * callers that don't (ExerciseIntroRecap, already inside another
 * ScrollView) just drop this straight in. */
export function IntroSlideCards({ slides, locale }: IntroSlideCardsProps) {
  // Which referenceAudio row (by "slideIndex-referenceIndex" key) is
  // currently playing, if any — a real play/stop player rather than a
  // fire-and-forget button: pressing the playing row's own button stops
  // it, pressing a DIFFERENT row's button stops whatever was playing
  // first, so at most one of these long reference tracks ever sounds at
  // once. playbackHandleRef holds the live handle so stopping doesn't
  // need to re-derive it from playingKey.
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const playbackHandleRef = useRef<SamplePlaybackHandle | null>(null);

  useEffect(() => {
    return () => {
      playbackHandleRef.current?.stop();
    };
  }, []);

  function toggleReferenceAudio(key: string, source: number) {
    const wasPlaying = playingKey === key;
    playbackHandleRef.current?.stop();
    playbackHandleRef.current = null;
    if (wasPlaying) {
      setPlayingKey(null);
      return;
    }
    setPlayingKey(key);
    playbackHandleRef.current = playSample(source, 0.85, () => {
      setPlayingKey((current) => (current === key ? null : current));
      playbackHandleRef.current = null;
    });
  }

  return (
    <View style={{ width: "100%", gap: theme.spacing(2) }}>
      {slides.map((slide, index) => (
        <View
          key={index}
          style={{
            alignItems: "center",
            gap: theme.spacing(1.5),
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing(2),
          }}
        >
          <Text style={{ color: theme.colors.ink, fontSize: theme.fontSize.body, textAlign: "center", lineHeight: theme.fontSize.body * 1.4 }}>
            {slide.body}
          </Text>

          {slide.staffNote && <StaffNotation note={slide.staffNote} clef={slide.staffClef} width={100} />}

          {slide.chromaticKeyboardReference && (
            <ChromaticKeyboardReference range={slide.chromaticKeyboardReference.range} locale={locale} />
          )}

          {slide.noteValueReference && slide.noteValueReference.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2) }}>
              {slide.noteValueReference.map((row, rowIndex) => (
                <View key={rowIndex} style={{ alignItems: "center", gap: theme.spacing(0.5), width: 84 }}>
                  {REST_VALUES.has(row.value) ? (
                    <RestValueIcon value={row.value as RhythmRestValue} size={26} />
                  ) : (
                    <NoteValueIcon value={row.value as Exclude<typeof row.value, RhythmRestValue>} size={26} />
                  )}
                  <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "700", textAlign: "center" }}>
                    {row.caption}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {slide.intervalExamples && slide.intervalExamples.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2.5) }}>
              {slide.intervalExamples.map((example, exampleIndex) => (
                <View key={exampleIndex} style={{ alignItems: "center", gap: theme.spacing(0.75), width: 112 }}>
                  <IntervalStaffNotation notes={example.notes} width={112} />
                  <DarkButton
                    label="🔊"
                    onPress={() => playInterval([parseScientific(example.notes[0]), parseScientific(example.notes[1])])}
                    variant="secondary"
                    size={40}
                    fontSize={18}
                  />
                  <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "700", textAlign: "center" }}>
                    {example.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {slide.triadExamples && slide.triadExamples.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(2.5) }}>
              {slide.triadExamples.map((example, exampleIndex) => (
                <View key={exampleIndex} style={{ alignItems: "center", gap: theme.spacing(0.75), width: 120 }}>
                  <TriadStaffNotation notes={example.notes} width={100} degreeLabels={example.degrees} />
                  <DarkButton
                    label="🔊"
                    onPress={() => playChord(example.notes.map((note) => parseScientific(note)))}
                    variant="secondary"
                    size={56}
                    fontSize={26}
                  />
                  <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "700", textAlign: "center" }}>
                    {example.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {slide.noteExamples && slide.noteExamples.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing(1.5) }}>
              {slide.noteExamples.map((example, exampleIndex) => (
                <View key={exampleIndex} style={{ alignItems: "center", gap: theme.spacing(0.75), width: 76 }}>
                  <StaffNotation note={example.note} clef={example.clef} width={76} />
                  <DarkButton
                    label="🔊"
                    onPress={() => playNote(parseScientific(example.note))}
                    variant="secondary"
                    size={40}
                    fontSize={18}
                  />
                  <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "700", textAlign: "center" }}>
                    {example.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {slide.circleHighlight && (
            <CircleOfFifthsWheel
              selectedFifths={slide.circleHighlight.fifths}
              onSelect={() => {}}
              disabled
              highlightFifths={[slide.circleHighlight.fifths]}
              labelMode={slide.circleHighlight.labelMode ?? "both"}
              locale={locale}
            />
          )}

          {slide.referenceAudio && slide.referenceAudio.length > 0 && (
            <View style={{ width: "100%", gap: theme.spacing(1) }}>
              {slide.referenceAudio.map((reference, referenceIndex) => {
                const key = `${index}-${referenceIndex}`;
                const isPlaying = playingKey === key;
                return (
                  <DarkButton
                    key={referenceIndex}
                    label={isPlaying ? `⏹ ${reference.label}` : `🔊 ${reference.label}`}
                    onPress={() => toggleReferenceAudio(key, reference.source)}
                    variant={isPlaying ? "primary" : "secondary"}
                  />
                );
              })}
            </View>
          )}

          {slide.groupingExamples && slide.groupingExamples.length > 0 && (
            <View style={{ width: "100%", gap: theme.spacing(2) }}>
              {slide.groupingExamples.map((example, exampleIndex) => (
                <View key={exampleIndex} style={{ alignItems: "center", gap: theme.spacing(0.75) }}>
                  <BeamedNotation
                    sequence={example.sequence}
                    groups={example.groups}
                    ties={example.ties}
                    meter={example.meter}
                    barBeforeIndex={example.barBeforeIndex}
                  />
                  <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontWeight: "700", textAlign: "center" }}>
                    {example.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {slide.examples && slide.examples.length > 0 && (
            <View style={{ gap: theme.spacing(0.5) }}>
              {slide.examples.map((example, exampleIndex) => (
                <View key={exampleIndex} style={{ flexDirection: "row", alignItems: "baseline", gap: theme.spacing(0.75), justifyContent: "center" }}>
                  <Text style={{ color: theme.colors.ink, fontWeight: "700", fontSize: theme.fontSize.body * 0.95 }}>
                    {getNoteDisplayName(parseScientific(example.from), locale)}
                    {" → "}
                    {getNoteDisplayName(parseScientific(example.to), locale)}
                  </Text>
                  {example.note && (
                    <Text style={{ color: theme.colors.primary, fontSize: theme.fontSize.body * 0.75, fontStyle: "italic" }}>
                      ({example.note})
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
