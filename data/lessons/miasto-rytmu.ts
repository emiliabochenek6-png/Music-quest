import {
  DRUMMER_3_4_SAMPLE,
  DRUMMER_4_4_SAMPLE,
  RHYTHM_DICTATION_L4_RECORDING_SAMPLES,
  RHYTHM_DICTATION_L7_RECORDING_SAMPLES,
  RHYTHM_DICTATION_L9_RECORDING_SAMPLES,
  RHYTHM_DICTATION_L12_RECORDING_SAMPLES,
  RHYTHM_DICTATION_L15_RECORDING_SAMPLES,
  RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES,
  RHYTHM_NOTATION_TAP_L7_RECORDING_SAMPLES,
  RHYTHM_NOTATION_TAP_L9_RECORDING_SAMPLES,
  RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES,
  RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES,
  RHYTHM_SEQUENCING_RECORDING_SAMPLES,
} from "@/lib/audio/samples";
import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/miasto-rytmu.json — same 5
 * lessons, same 30 exercises, same ids/specs, restructured only to fit
 * this app's own WorldContent/LessonDefinition/ExerciseDefinition shape
 * (types/exercises.ts). All 6 rhythm exercise types (pulse-tap,
 * meter-choice, rhythm-echo, rhythm-sequencing, rhythm-dictation,
 * rhythm-notation-tap) are new to this port — see
 * components/exercises/{PulseTap,MeterChoice,RhythmEcho,
 * RhythmSequencing,RhythmDictation,RhythmNotationTap}Exercise.tsx and
 * lib/audio/rhythmPlayer.ts for the audio side (pre-rendered
 * metronome/clap one-shots rather than live Web Audio oscillators — see
 * that file's own doc for why). Lessons 1-4's introSlides are ported;
 * lesson 5 has none in the source content either.
 */
export const MIASTO_RYTMU_CONTENT: WorldContent = {
  worldId: "miasto-rytmu",
  lessons: [
    {
      id: "mr-lekcja-1-podstawy",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Puls to stałe, miarowe tykanie — serce muzyki. Takt dzieli ten puls na grupy uderzeń; pierwsze uderzenie w każdej grupie jest zwykle najmocniejsze. To właśnie akcent.",
        },
        {
          body: "Metrum mówi, do ilu liczymy w takcie. W metrum 4/4 liczymy do czterech — RAZ-dwa-trzy-cztery, RAZ-dwa-trzy-cztery — to równy, marszowy krok. W metrum 3/4 liczymy do trzech — RAZ-dwa-trzy, RAZ-dwa-trzy — to kołyszący rytm, jak w walcu.",
        },
      ],
      exercises: [
        {
          id: "mr-l1-e3",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 100, referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "mr-l1-e4",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
      ],
    },
    {
      id: "mr-lekcja-2-wartosci-nut",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Każda nuta ma swoją długość, liczoną w uderzeniach pulsu. Ćwierćnuta trwa jedno uderzenie — jeden krok. Półnuta trwa dwa uderzenia — dwa razy dłużej. Cała nuta wypełnia cały takt 4/4, czyli cztery uderzenia — najdłuższa z tej trójki.",
          noteValueReference: [
            { value: "quarter", caption: "ćwierćnuta — 1 uderzenie" },
            { value: "half", caption: "półnuta — 2 uderzenia" },
            { value: "whole", caption: "cała nuta — 4 uderzenia" },
          ],
        },
      ],
      exercises: [
        // referenceAudioSource deliberately NOT set on these 4 — see
        // RHYTHM_ECHO_RECORDING_SAMPLES's own doc in lib/audio/samples.ts
        // for why rhythm-echo's real recordings aren't wired in yet
        // (isValidRhythmEcho needs onsetsMs to match the recording's
        // ACTUAL clap count/timing exactly, which turned out not to be
        // reliably recoverable by automatic onset detection). These 4
        // play the synthesized click+clap demo built from onsetsMs
        // itself, guaranteeing the audio and the grading always agree.
        // showStandaloneMetronome:false on every exercise in lekcje 2
        // and 3 — see RhythmEchoExercise.tsx's own doc for what that
        // hides (the separate tappable metronome dot).
        { id: "mr-l2-e2", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 450], showStandaloneMetronome: false } },
        {
          id: "mr-l2-e3",
          type: "rhythm-echo",
          difficulty: 2,
          spec: { type: "rhythm-echo", onsetsMs: [0, 400, 800], showStandaloneMetronome: false },
        },
        {
          id: "mr-l2-e4",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 300, 750], showStandaloneMetronome: false },
        },
        {
          id: "mr-l2-e5",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 300, 750, 1050], showStandaloneMetronome: false },
        },
        {
          id: "mr-l2-e6",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["quarter", "quarter", "half"],
            bpm: 90,
            referenceAudioSource: RHYTHM_SEQUENCING_RECORDING_SAMPLES[0],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l2-e7",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["half", "quarter", "whole"],
            bpm: 90,
            referenceAudioSource: RHYTHM_SEQUENCING_RECORDING_SAMPLES[1],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l2-e8",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["quarter", "half", "quarter", "half"],
            bpm: 90,
            referenceAudioSource: RHYTHM_SEQUENCING_RECORDING_SAMPLES[2],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l2-e9",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["whole", "quarter", "half", "quarter"],
            bpm: 90,
            referenceAudioSource: RHYTHM_SEQUENCING_RECORDING_SAMPLES[3],
            showStandaloneMetronome: false,
          },
        },
      ],
    },
    {
      id: "mr-lekcja-3-wartosci-rytmiczne",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Wiesz już, że ćwierćnuta to jedno uderzenie, półnuta — dwa, a cała nuta — cztery. Są też wartości krótsze niż ćwierćnuta: ósemka trwa pół uderzenia (dwie ósemki = jedna ćwierćnuta), a szesnastka ćwierć uderzenia (cztery szesnastki = jedna ćwierćnuta). Im krótsza nuta, tym więcej ich mieści się w jednym uderzeniu pulsu.",
          noteValueReference: [
            { value: "sixteenth", caption: "szesnastka — 1/4 uderzenia" },
            { value: "eighth", caption: "ósemka — 1/2 uderzenia" },
            { value: "quarter", caption: "ćwierćnuta — 1 uderzenie" },
            { value: "half", caption: "półnuta — 2 uderzenia" },
            { value: "whole", caption: "cała nuta — 4 uderzenia" },
          ],
        },
      ],
      exercises: [
        { id: "mr-l3-e2", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 500, 750], showStandaloneMetronome: false } },
        {
          id: "mr-l3-e3",
          type: "rhythm-echo",
          difficulty: 2,
          spec: { type: "rhythm-echo", onsetsMs: [0, 250, 500, 1000], showStandaloneMetronome: false },
        },
        {
          id: "mr-l3-e4",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 500, 750, 1000, 1500], showStandaloneMetronome: false },
        },
        {
          id: "mr-l3-e5",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 500, 625, 750, 1000, 1500], showStandaloneMetronome: false },
        },
        {
          id: "mr-l3-e6",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["eighth", "eighth", "quarter"],
            bpm: 90,
            showStandaloneMetronome: false,
            referenceAudioSource: RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l3-e7",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["quarter", "eighth", "eighth", "half"],
            bpm: 90,
            showStandaloneMetronome: false,
            referenceAudioSource: RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l3-e8",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["sixteenth", "sixteenth", "eighth", "quarter"],
            bpm: 80,
            showStandaloneMetronome: false,
            referenceAudioSource: RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l3-e9",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["eighth", "sixteenth", "sixteenth", "quarter", "half"],
            bpm: 80,
            showStandaloneMetronome: false,
            referenceAudioSource: RHYTHM_SEQUENCING_L3_RECORDING_SAMPLES[3],
          },
        },
      ],
    },
    {
      id: "mr-lekcja-4-pauzy-i-synkopy",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Pauza to cisza o określonej długości — tak samo ważna jak dźwięk. Pauza ćwierćnutowa trwa jedno uderzenie ciszy, pauza ósemkowa pół uderzenia. Synkopa to przesunięcie akcentu na słabszą część taktu — uderzenie tam, gdzie normalnie byłaby cisza lub słabsza miara. To uczy precyzji nie tylko w uderzaniu, ale i w kontrolowaniu ciszy.",
          noteValueReference: [
            { value: "quarterRest", caption: "pauza ćwierćnutowa — 1 uderzenie ciszy" },
            { value: "eighthRest", caption: "pauza ósemkowa — 1/2 uderzenia ciszy" },
          ],
        },
      ],
      exercises: [
        {
          id: "mr-l4-e1",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "4/4",
            sequence: ["quarter", "quarterRest", "quarter", "quarterRest", "quarter", "quarterRest", "quarter", "quarterRest"],
            referenceAudioSource: RHYTHM_DICTATION_L4_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l4-e2",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "4/4",
            sequence: [
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L4_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l4-e3",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "4/4",
            sequence: [
              "quarter", "quarterRest", "eighth", "eighth", "quarterRest",
              "quarter", "quarterRest", "eighth", "eighth", "quarterRest",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L4_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l4-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "4/4",
            sequence: ["whole", "half", "half", "quarterRest", "quarter", "quarter", "quarterRest"],
            referenceAudioSource: RHYTHM_DICTATION_L4_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l4-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "4/4",
            // Reordered from the web app's own authored sequence (half,
            // quarter, eighth, eighth, quarterRest, whole, quarterRest,
            // quarter, quarter, half, half) — that order put "whole"
            // right after a single quarterRest, starting it one beat
            // into a 4/4 measure. A whole note is, by definition, an
            // entire measure — it can't start mid-measure, so that
            // arrangement wasn't valid notation to begin with (and made
            // BeamedRhythmRow's bar-line grouping split the whole note
            // awkwardly across two "measures"). Same multiset of note/
            // rest values, same total length, just reordered so every
            // measure actually adds up to 4 beats:
            // [half,quarter,eighth,eighth] | [whole] |
            // [quarterRest,quarter,quarter,quarterRest] | [half,half].
            sequence: [
              "half", "quarter", "eighth", "eighth",
              "whole",
              "quarterRest", "quarter", "quarter", "quarterRest",
              "half", "half",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L4_RECORDING_SAMPLES[4],
          },
        },
      ],
    },
    {
      id: "mr-lekcja-5-dyktanda",
      order: 5,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz połączymy wszystko: zobaczysz zapisany rytm na pięciolinii (nuty i pauzy) i musisz wystukać go dokładnie tak, jak jest napisany — bez podpowiedzi z odsłuchu.",
        },
      ],
      exercises: [
        {
          id: "mr-l5-e1",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 120,
            meter: "4/4",
            sequence: ["quarter", "quarter", "half", "quarter", "quarter", "half"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l5-e2",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 120,
            meter: "3/4",
            sequence: ["quarter", "quarter", "quarter", "half", "quarter", "quarterRest", "quarter", "quarterRest"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l5-e3",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 120,
            meter: "4/4",
            sequence: ["eighth", "eighth", "quarter", "half", "quarter", "quarter", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l5-e4",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 120,
            meter: "3/4",
            sequence: ["half", "quarterRest", "quarter", "eighth", "eighth", "quarter", "quarterRest", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L5_RECORDING_SAMPLES[3],
          },
        },
      ],
    },
    {
      // First content to actually use pulse-tap anywhere in the app (see
      // components/exercises/PulseTapExercise.tsx) — every exercise omits
      // referenceAudioSource/minHits (both optional, see
      // types/exercises.ts's own doc), relying on generate.ts's synthesized
      // click track and 70%-of-beats default tolerance, same "no new
      // recording needed" pattern lekcja 2's own mr-l2-e2..e5 established
      // for rhythm-echo. Restored (2026-09-27) after a brief detour
      // replacing it with other exercise types — kept after all, now with
      // an explicit 3-beat lead-in count-in (leadInBeats, see
      // types/exercises.ts's own doc) on every exercise here, rather than
      // the engine's own default of one full measure (4 beats for the 4/4
      // ones) — a fixed "1, 2, 3, go" count-in regardless of meter.
      id: "mr-lekcja-6-tempo",
      order: 6,
      difficulty: 2,
      introSlides: [
        {
          body: "Tempo to szybkość pulsu — jak szybko biją \"kroki\" muzyki. Wolne tempo brzmi spokojnie, jak spacer. Szybkie tempo brzmi żwawo, jak bieg. Ten sam rytm zagrany wolno i szybko wciąż jest tym samym rytmem — zmienia się tylko to, jak szybko go wystukujesz.",
        },
        {
          body: "Na początku usłyszysz kilka pulsów \"na rozbieg\" — to jeszcze nie liczy się do wyniku. Dołącz do nich stukaniem i zostań w rytmie, gdy zacznie się liczyć naprawdę.",
        },
      ],
      exercises: [
        {
          id: "mr-l6-e1",
          type: "pulse-tap",
          difficulty: 1,
          spec: { type: "pulse-tap", bpm: 66, beatsPerMeasure: 4, measureCount: 3, leadInBeats: 3 },
        },
        {
          id: "mr-l6-e2",
          type: "pulse-tap",
          difficulty: 1,
          spec: { type: "pulse-tap", bpm: 100, beatsPerMeasure: 4, measureCount: 3, leadInBeats: 3 },
        },
        {
          id: "mr-l6-e3",
          type: "pulse-tap",
          difficulty: 2,
          spec: { type: "pulse-tap", bpm: 138, beatsPerMeasure: 4, measureCount: 3, leadInBeats: 3 },
        },
        {
          id: "mr-l6-e4",
          type: "pulse-tap",
          difficulty: 2,
          spec: { type: "pulse-tap", bpm: 96, beatsPerMeasure: 3, measureCount: 4, leadInBeats: 3 },
        },
        {
          id: "mr-l6-e5",
          type: "pulse-tap",
          difficulty: 3,
          spec: { type: "pulse-tap", bpm: 126, beatsPerMeasure: 4, measureCount: 4, accentOnly: true, leadInBeats: 3 },
        },
      ],
    },
    {
      // Deliberately stays within lekcje 1-5's own established territory —
      // 3/4 and 4/4 only, no compound meters (6/8/9/8/12/8 are Przystań
      // Taktów's own new topic, see that file's doc — introducing them
      // here would duplicate/pre-empt that world's role) and no dotted
      // values (Gaj Grupowania/Szczyt Dyktand's own topic). Combines two
      // things lekcje 3 and 4 taught SEPARATELY — sixteenth notes and
      // syncopated rests — into the same sequences, same "teraz połączymy
      // wszystko" idea lekcja 5 already used for notation-tap specifically.
      id: "mr-lekcja-7-rytmy-zaawansowane",
      order: 7,
      difficulty: 3,
      introSlides: [
        {
          body: "Czas połączyć to, co już umiesz: szesnastki z lekcji 3 i synkopy z lekcji 4 — czasem w jednym takcie. Słuchaj i patrz uważnie, gdzie w rytmie jest cisza, a gdzie dźwięk.",
        },
      ],
      exercises: [
        {
          id: "mr-l7-e1",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 108,
            meter: "4/4",
            sequence: [
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "eighth", "half",
              "quarterRest", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L7_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l7-e2",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 108,
            meter: "4/4",
            sequence: [
              "eighth", "quarter", "eighth", "quarter", "quarter",
              "eighth", "eighth", "quarterRest", "eighth", "eighth", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L7_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l7-e3",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "3/4",
            sequence: ["sixteenth", "sixteenth", "eighth", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L7_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l7-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "3/4",
            sequence: ["eighth", "quarter", "eighthRest", "quarter", "quarterRest", "eighth", "eighth", "eighth", "eighth"],
            referenceAudioSource: RHYTHM_DICTATION_L7_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l7-e5",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 108,
            meter: "4/4",
            sequence: [
              "quarter", "eighth", "eighth", "quarter", "quarter",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "half", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L7_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l7-e6",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 108,
            meter: "4/4",
            sequence: [
              "eighth", "sixteenth", "sixteenth", "quarter", "quarter", "quarter",
              "quarterRest", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L7_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l7-e7",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 100,
            meter: "3/4",
            sequence: ["quarter", "eighth", "eighth", "quarter", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L7_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l7-e8",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 100,
            meter: "3/4",
            sequence: ["eighth", "quarter", "eighthRest", "quarter", "quarterRest", "eighth", "eighth", "eighth", "eighth"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L7_RECORDING_SAMPLES[3],
          },
        },
      ],
    },
    {
      // A concept lekcje 1-7 never named outright, despite having taught
      // both halves of it separately all along: puls (lekcje 1, 6) is the
      // steady, unchanging background beat; rytm (lekcje 2-5, 7) is the
      // pattern of different-length notes played AGAINST that beat. Makes
      // the distinction explicit by alternating pulse-tap (the pulse
      // itself) with rhythm-echo (a rhythm on top of it) rather than
      // introducing new note values or meters — a conceptual lesson, not
      // a content-difficulty one, though the rhythm-echo patterns
      // themselves are still new and a notch longer than lekcja 6's own.
      id: "mr-lekcja-8-puls-kontra-rytm",
      order: 8,
      difficulty: 2,
      introSlides: [
        {
          body: "Puls i rytm to nie to samo. Puls to stałe, równe tło — jak tykanie zegara, zawsze takie samo. Rytm to wzór różnych długości dźwięków, który GRASZ na tym tle — czasem szybciej, czasem wolniej niż sam puls.",
        },
        {
          body: "W tej lekcji na przemian: raz stukasz czysty puls, raz powtarzasz usłyszany rytm. Posłuchaj różnicy między nimi.",
        },
      ],
      exercises: [
        { id: "mr-l8-e1", type: "pulse-tap", difficulty: 2, spec: { type: "pulse-tap", bpm: 90, beatsPerMeasure: 4, measureCount: 3, leadInBeats: 3 } },
        {
          id: "mr-l8-e2",
          type: "rhythm-echo",
          difficulty: 2,
          spec: { type: "rhythm-echo", onsetsMs: [0, 400, 800, 1000, 1400, 1800, 2400], showStandaloneMetronome: false },
        },
        { id: "mr-l8-e3", type: "pulse-tap", difficulty: 2, spec: { type: "pulse-tap", bpm: 120, beatsPerMeasure: 3, measureCount: 4, leadInBeats: 3 } },
        {
          id: "mr-l8-e4",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 300, 450, 750, 900, 1350, 1650, 1800], showStandaloneMetronome: false },
        },
        {
          id: "mr-l8-e5",
          type: "pulse-tap",
          difficulty: 3,
          spec: { type: "pulse-tap", bpm: 104, beatsPerMeasure: 4, measureCount: 4, leadInBeats: 3, accentOnly: true },
        },
        {
          id: "mr-l8-e6",
          type: "rhythm-echo",
          difficulty: 3,
          spec: { type: "rhythm-echo", onsetsMs: [0, 200, 400, 700, 1100, 1300, 1700, 2100, 2300], showStandaloneMetronome: false },
        },
      ],
    },
    {
      // Lekcja 4's own syncopation was always cued by a REST right before
      // the off-beat note (easier to feel — silence tells you something's
      // coming). This pushes further: the off-beat entry comes right at
      // the very start of a measure/half-measure (a rest ON beat 1 itself,
      // or a sixteenth-rest pickup), a genuinely harder syncopation to
      // feel since there's no earlier note to feel "displaced" from — you
      // have to feel the empty downbeat itself. Still only 3/4 and 4/4,
      // still no dotted values (see lekcja 7's own doc for why those stay
      // out of this world).
      id: "mr-lekcja-9-trudniejsze-synkopy",
      order: 9,
      difficulty: 3,
      introSlides: [
        {
          body: "Znasz już synkopy, które zaczynają się po krótkiej ciszy w środku taktu. Teraz cisza pojawia się na samym początku — na \"raz\", tam gdzie zwykle słyszysz pierwsze uderzenie. Musisz poczuć puls, nawet gdy on sam milczy.",
        },
      ],
      exercises: [
        {
          id: "mr-l9-e1",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 104,
            meter: "4/4",
            sequence: [
              "eighthRest", "eighth", "quarter", "quarter", "quarter",
              "quarter", "eighthRest", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L9_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l9-e2",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 104,
            meter: "4/4",
            sequence: [
              "sixteenthRest", "sixteenth", "eighth", "quarter", "quarter", "quarter",
              "eighthRest", "eighth", "eighthRest", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L9_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l9-e3",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "3/4",
            sequence: ["eighthRest", "eighth", "quarter", "quarter", "quarter", "eighthRest", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L9_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l9-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "3/4",
            sequence: ["sixteenthRest", "sixteenth", "eighth", "quarter", "quarter", "eighthRest", "eighth", "eighthRest", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L9_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l9-e5",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 104,
            meter: "4/4",
            sequence: [
              "quarter", "eighthRest", "eighth", "quarter", "quarter",
              "eighthRest", "eighth", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L9_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l9-e6",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 104,
            meter: "4/4",
            sequence: [
              "sixteenthRest", "sixteenth", "sixteenth", "sixteenth", "eighth", "quarter", "eighth", "quarter",
              "eighthRest", "eighth", "quarterRest", "eighth", "eighth", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L9_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l9-e7",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 96,
            meter: "3/4",
            sequence: ["quarter", "eighthRest", "eighth", "quarter", "eighthRest", "eighth", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L9_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l9-e8",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 96,
            meter: "3/4",
            sequence: ["eighthRest", "eighth", "eighthRest", "eighth", "quarter", "sixteenthRest", "sixteenth", "eighth", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L9_RECORDING_SAMPLES[3],
          },
        },
      ],
    },
    {
      // rhythm-sequencing hasn't been touched since lekcja 3, where every
      // motif topped out at 4 notes — these run 5-6, mixing quarter/
      // eighth/sixteenth/half in one motif so ORDERING them (not just
      // hearing them) is the actual challenge, harder to hold in memory
      // than a short 3-4-note one.
      id: "mr-lekcja-10-rytmiczne-ukladanki",
      order: 10,
      difficulty: 2,
      introSlides: [
        {
          body: "Czas na dłuższe układanki rytmiczne. Usłyszysz wzór z pięciu albo sześciu dźwięków o różnych długościach i musisz poukładać kawałki we właściwej kolejności — im dłuższy wzór, tym trudniej go zapamiętać za pierwszym razem.",
        },
      ],
      exercises: [
        {
          id: "mr-l10-e1",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: { type: "rhythm-sequencing", motif: ["quarter", "eighth", "eighth", "half", "quarter"], bpm: 90, showStandaloneMetronome: false },
        },
        {
          id: "mr-l10-e2",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["eighth", "eighth", "quarter", "eighth", "eighth", "quarter"],
            bpm: 90,
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l10-e3",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: {
            type: "rhythm-sequencing",
            motif: ["sixteenth", "sixteenth", "eighth", "quarter", "half"],
            bpm: 85,
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l10-e4",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["quarter", "sixteenth", "sixteenth", "eighth", "quarter", "quarter"],
            bpm: 85,
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l10-e5",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["eighth", "sixteenth", "sixteenth", "eighth", "eighth", "half"],
            bpm: 80,
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l10-e6",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["half", "eighth", "eighth", "sixteenth", "sixteenth", "quarter"],
            bpm: 80,
            showStandaloneMetronome: false,
          },
        },
      ],
    },
    {
      // meter-choice hasn't been touched since lekcja 1, where it only
      // ever got 2 exercises — nowhere near enough to make telling 4/4
      // from 3/4 apart by ear an actual reflex. Same two meters, but more
      // reps AND a wide tempo spread (70-150 bpm, echoing lekcja 6's own
      // tempo range) so recognition has to hold up regardless of speed,
      // not just at whatever one tempo lekcja 1 happened to use.
      id: "mr-lekcja-11-wyczul-metrum",
      order: 11,
      difficulty: 2,
      introSlides: [
        {
          body: "Znasz już 4/4 i 3/4 z lekcji 1. Teraz poćwicz rozpoznawanie ich ze słuchu w różnych tempach — od bardzo wolnych do bardzo szybkich. Licz uderzenia w grupach: cztery, albo trzy.",
        },
      ],
      exercises: [
        {
          id: "mr-l11-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 76, optionPool: ["4/4", "3/4"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "mr-l11-e2",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 132, optionPool: ["3/4", "4/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "mr-l11-e3",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 150, optionPool: ["4/4", "3/4"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "mr-l11-e4",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 70, optionPool: ["3/4", "4/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "mr-l11-e5",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 112, optionPool: ["4/4", "3/4"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "mr-l11-e6",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 108, optionPool: ["3/4", "4/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
      ],
    },
    {
      // Every rhythm-dictation exercise so far (lekcje 4, 7, 9) ran 2
      // measures. Same familiar note values (quarter/eighth/sixteenth/
      // half/whole + rests, still no dotted values) — length itself is
      // the new axis: 3 measures means more to hold in memory and write
      // down correctly, not a harder rhythm figure.
      id: "mr-lekcja-12-dluzsze-dyktanda",
      order: 12,
      difficulty: 2,
      introSlides: [
        {
          body: "Te dyktanda są dłuższe niż wcześniej — trzy takty zamiast dwóch. Wartości nut znasz już wszystkie, ale musisz zapamiętać więcej naraz, zanim zaczniesz wystukiwać.",
        },
      ],
      exercises: [
        {
          id: "mr-l12-e1",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "4/4",
            sequence: ["whole", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l12-e2",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "4/4",
            sequence: [
              "quarter", "quarter", "half",
              "eighth", "eighth", "eighth", "eighth", "quarter", "quarter",
              "half", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l12-e3",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "4/4",
            sequence: [
              "quarterRest", "quarter", "eighth", "eighth", "quarter",
              "sixteenth", "sixteenth", "eighth", "quarter", "half",
              "eighth", "eighth", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l12-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "4/4",
            sequence: [
              "eighth", "eighth", "quarter", "quarter", "quarter",
              "quarterRest", "eighth", "eighth", "quarter", "quarter",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "half", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l12-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "3/4",
            sequence: ["half", "quarter", "quarter", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[4],
          },
        },
        {
          id: "mr-l12-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "3/4",
            sequence: [
              "quarterRest", "eighth", "eighth", "quarter",
              "sixteenth", "sixteenth", "eighth", "quarter", "quarter",
              "eighth", "eighth", "eighth", "eighth", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[5],
          },
        },
      ],
    },
    {
      // Every rhythm-notation-tap exercise so far (lekcje 5, 7, 9) played
      // at 96-120 bpm. Same 2-measure length, same familiar values — the
      // new axis here is pure speed (120-140), same idea lekcja 6 already
      // used for pulse-tap: tapping the SAME kind of rhythm accurately
      // gets harder as the tempo climbs, independent of how complex the
      // rhythm itself is.
      id: "mr-lekcja-13-szybkie-odczytanie",
      order: 13,
      difficulty: 2,
      introSlides: [
        {
          body: "Te same rodzaje rytmów, które już znasz — tylko szybciej. Im wyższe tempo, tym mniej czasu na zastanowienie się między uderzeniami.",
        },
      ],
      exercises: [
        {
          id: "mr-l13-e1",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 128,
            meter: "4/4",
            sequence: [
              "quarter", "quarter", "quarter", "quarter",
              "eighth", "eighth", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l13-e2",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 132,
            meter: "4/4",
            sequence: [
              "eighth", "eighth", "quarter", "quarter", "quarter",
              "quarter", "eighth", "eighth", "quarter", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "mr-l13-e3",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 136,
            meter: "4/4",
            sequence: [
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter", "quarter", "quarter",
              "eighth", "eighth", "eighth", "eighth", "half",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "mr-l13-e4",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 140,
            meter: "4/4",
            sequence: [
              "quarterRest", "eighth", "eighth", "quarter", "quarter",
              "eighth", "eighth", "quarterRest", "eighth", "eighth", "quarter",
            ],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l13-e5",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 124,
            meter: "3/4",
            sequence: ["quarter", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[4],
          },
        },
        {
          id: "mr-l13-e6",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 130,
            meter: "3/4",
            sequence: ["sixteenth", "sixteenth", "eighth", "quarter", "quarter", "eighth", "eighth", "quarterRest", "quarter"],
            referenceAudioSource: RHYTHM_NOTATION_TAP_L13_RECORDING_SAMPLES[5],
          },
        },
      ],
    },
    {
      // rhythm-echo hasn't been deepened since lekcja 8 (max 9 onsets
      // there) — these run 10-12, longer than anything before, same
      // "length is the new axis" idea lekcja 12 already used for
      // rhythm-dictation.
      id: "mr-lekcja-14-dluzsze-echo",
      order: 14,
      difficulty: 2,
      introSlides: [
        {
          body: "Te echa są dłuższe niż wcześniej — nawet dziesięć albo dwanaście uderzeń w jednym wzorze. Słuchaj uważnie całości, zanim zaczniesz powtarzać.",
        },
      ],
      exercises: [
        {
          id: "mr-l14-e1",
          type: "rhythm-echo",
          difficulty: 2,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l14-e2",
          type: "rhythm-echo",
          difficulty: 2,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 400, 700, 1000, 1300, 1800, 2100, 2400, 2900, 3200],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l14-e3",
          type: "rhythm-echo",
          difficulty: 3,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 250, 500, 750, 1000, 1350, 1600, 1850, 2100, 2450, 2700],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l14-e4",
          type: "rhythm-echo",
          difficulty: 3,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 300, 450, 750, 900, 1200, 1500, 1650, 1950, 2250, 2550],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l14-e5",
          type: "rhythm-echo",
          difficulty: 3,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 200, 400, 600, 900, 1100, 1400, 1600, 1900, 2100, 2400, 2700],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l14-e6",
          type: "rhythm-echo",
          difficulty: 3,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 250, 400, 650, 900, 1050, 1350, 1550, 1800, 2150, 2400, 2650],
            showStandaloneMetronome: false,
          },
        },
      ],
    },
    {
      // The first lesson to genuinely MIX types — every prior lesson
      // stuck to one type (or, at most, two alternating — lekcja 8's own
      // pulse-tap/rhythm-echo pairing). This draws from four: meter-
      // choice, pulse-tap, rhythm-sequencing, rhythm-dictation — a real
      // checkpoint pulling together everything this world has taught
      // rather than a new skill of its own.
      id: "mr-lekcja-15-wielka-powtorka",
      order: 15,
      difficulty: 2,
      introSlides: [
        {
          body: "Czas na przegląd wszystkiego naraz: metrum, puls, układanki i dyktanda — jedno po drugim, tak jak przyjdzie. Żadnych nowych zasad, tylko to, co już umiesz.",
        },
      ],
      exercises: [
        {
          id: "mr-l15-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 100, optionPool: ["4/4", "3/4"] },
        },
        {
          id: "mr-l15-e2",
          type: "pulse-tap",
          difficulty: 2,
          spec: { type: "pulse-tap", bpm: 100, beatsPerMeasure: 4, measureCount: 3, leadInBeats: 3 },
        },
        {
          id: "mr-l15-e3",
          type: "rhythm-sequencing",
          difficulty: 2,
          spec: { type: "rhythm-sequencing", motif: ["quarter", "eighth", "eighth", "half"], bpm: 90, showStandaloneMetronome: false },
        },
        {
          id: "mr-l15-e4",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 110, optionPool: ["3/4", "4/4"] },
        },
        {
          id: "mr-l15-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 104,
            meter: "4/4",
            sequence: ["eighth", "eighth", "quarter", "quarter", "quarter", "sixteenth", "sixteenth", "eighth", "quarter", "half"],
            referenceAudioSource: RHYTHM_DICTATION_L15_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "mr-l15-e6",
          type: "pulse-tap",
          difficulty: 3,
          spec: { type: "pulse-tap", bpm: 120, beatsPerMeasure: 3, measureCount: 4, leadInBeats: 3, accentOnly: true },
        },
        {
          id: "mr-l15-e7",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "3/4",
            sequence: ["quarterRest", "eighth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_L15_RECORDING_SAMPLES[1],
          },
        },
      ],
    },
    {
      // Miasto Rytmu's own bonus/boss level, same pattern as Wioska
      // Nut's "Pokonaj króla Fałszomira" (see LessonNode.tsx/
      // IntroSlideCards.tsx's own bossName-registry doc,
      // components/map/bossPortraits.ts) — portrait always visible on
      // the map even locked, only the level itself stays gated behind
      // finishing every lesson before it. Draws from all six of this
      // world's own exercise types at their hardest settings seen so
      // far (fastest tempos, longest patterns, sharpest syncopation)
      // rather than inventing boss-only mechanics.
      id: "mr-lekcja-16-boss-arytmik",
      order: 16,
      difficulty: 3,
      isBoss: true,
      bossName: "Arytmik",
      introSlides: [
        {
          body: "Arytmik miesza rytmy, jak chce — przyspiesza, zwalnia, gubi uderzenia. Żeby go pokonać, pokaż, że Twój zmysł rytmu jest silniejszy niż jego chaos: puls, metrum, echo, układanki i dyktanda, wszystko naraz.",
          bossPortrait: true,
        },
      ],
      exercises: [
        {
          id: "mr-l16-e1",
          type: "pulse-tap",
          difficulty: 3,
          spec: { type: "pulse-tap", bpm: 150, beatsPerMeasure: 4, measureCount: 4, leadInBeats: 3, accentOnly: true },
        },
        {
          id: "mr-l16-e2",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 160, optionPool: ["3/4", "4/4"] },
        },
        {
          id: "mr-l16-e3",
          type: "rhythm-echo",
          difficulty: 3,
          spec: {
            type: "rhythm-echo",
            onsetsMs: [0, 200, 350, 600, 800, 950, 1200, 1400, 1550, 1800, 2000, 2250, 2500],
            showStandaloneMetronome: false,
          },
        },
        {
          id: "mr-l16-e4",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: {
            type: "rhythm-sequencing",
            motif: ["sixteenth", "sixteenth", "eighth", "quarter", "eighth", "half"],
            bpm: 100,
            showStandaloneMetronome: false,
          },
        },
        {
          // Reuses lekcja 12's own hardest 4/4 dictation content (and its
          // real recording) rather than authoring a new one that would
          // need a fresh .wav — see this file's own "Posłuchaj rytmu"
          // exercises elsewhere for the established pattern of only
          // adding referenceAudioSource once a real recording exists.
          id: "mr-l16-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "4/4",
            sequence: [
              "eighth", "eighth", "quarter", "quarter", "quarter",
              "quarterRest", "eighth", "eighth", "quarter", "quarter",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "half", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "mr-l16-e6",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 144,
            meter: "4/4",
            sequence: [
              "eighthRest", "eighth", "quarter", "quarter", "quarter",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "eighth", "quarter", "quarter",
            ],
          },
        },
        {
          id: "mr-l16-e7",
          type: "pulse-tap",
          difficulty: 3,
          spec: { type: "pulse-tap", bpm: 140, beatsPerMeasure: 3, measureCount: 4, leadInBeats: 3 },
        },
        {
          // Same reasoning as mr-l16-e5 above — lekcja 12's own hardest
          // 3/4 dictation, real recording included.
          id: "mr-l16-e8",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "3/4",
            sequence: [
              "quarterRest", "eighth", "eighth", "quarter",
              "sixteenth", "sixteenth", "eighth", "quarter", "quarter",
              "eighth", "eighth", "eighth", "eighth", "quarter",
            ],
            referenceAudioSource: RHYTHM_DICTATION_L12_RECORDING_SAMPLES[5],
          },
        },
      ],
    },
  ],
};
