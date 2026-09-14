import { DRUMMER_3_4_SAMPLE, DRUMMER_4_4_SAMPLE } from "@/lib/audio/samples";
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
        { id: "mr-l1-e1", type: "pulse-tap", difficulty: 1, spec: { type: "pulse-tap", bpm: 80, beatsPerMeasure: 1, measureCount: 20, minHits: 15 } },
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
        { id: "mr-l2-e1", type: "pulse-tap", difficulty: 1, spec: { type: "pulse-tap", bpm: 96, beatsPerMeasure: 4, measureCount: 6, minHits: 17 } },
        { id: "mr-l2-e2", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 450] } },
        { id: "mr-l2-e3", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 400, 800] } },
        { id: "mr-l2-e4", type: "rhythm-echo", difficulty: 3, spec: { type: "rhythm-echo", onsetsMs: [0, 300, 750] } },
        { id: "mr-l2-e5", type: "rhythm-echo", difficulty: 3, spec: { type: "rhythm-echo", onsetsMs: [0, 300, 750, 1050] } },
        { id: "mr-l2-e6", type: "rhythm-sequencing", difficulty: 2, spec: { type: "rhythm-sequencing", motif: ["quarter", "quarter", "half"], bpm: 90 } },
        { id: "mr-l2-e7", type: "rhythm-sequencing", difficulty: 2, spec: { type: "rhythm-sequencing", motif: ["half", "quarter", "whole"], bpm: 90 } },
        { id: "mr-l2-e8", type: "rhythm-sequencing", difficulty: 3, spec: { type: "rhythm-sequencing", motif: ["quarter", "half", "quarter", "half"], bpm: 90 } },
        { id: "mr-l2-e9", type: "rhythm-sequencing", difficulty: 3, spec: { type: "rhythm-sequencing", motif: ["whole", "quarter", "half", "quarter"], bpm: 90 } },
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
        { id: "mr-l3-e1", type: "pulse-tap", difficulty: 1, spec: { type: "pulse-tap", bpm: 96, beatsPerMeasure: 4, measureCount: 6, minHits: 17 } },
        { id: "mr-l3-e2", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 400] } },
        { id: "mr-l3-e3", type: "rhythm-echo", difficulty: 2, spec: { type: "rhythm-echo", onsetsMs: [0, 350, 700] } },
        { id: "mr-l3-e4", type: "rhythm-echo", difficulty: 3, spec: { type: "rhythm-echo", onsetsMs: [0, 250, 650] } },
        { id: "mr-l3-e5", type: "rhythm-echo", difficulty: 3, spec: { type: "rhythm-echo", onsetsMs: [0, 250, 650, 900] } },
        { id: "mr-l3-e6", type: "rhythm-sequencing", difficulty: 2, spec: { type: "rhythm-sequencing", motif: ["eighth", "eighth", "quarter"], bpm: 90 } },
        { id: "mr-l3-e7", type: "rhythm-sequencing", difficulty: 2, spec: { type: "rhythm-sequencing", motif: ["quarter", "eighth", "eighth", "half"], bpm: 90 } },
        { id: "mr-l3-e8", type: "rhythm-sequencing", difficulty: 3, spec: { type: "rhythm-sequencing", motif: ["sixteenth", "sixteenth", "eighth", "quarter"], bpm: 80 } },
        {
          id: "mr-l3-e9",
          type: "rhythm-sequencing",
          difficulty: 3,
          spec: { type: "rhythm-sequencing", motif: ["eighth", "sixteenth", "sixteenth", "quarter", "half"], bpm: 80 },
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
            bpm: 76,
            meter: "4/4",
            sequence: ["quarter", "quarterRest", "quarter", "quarterRest", "quarter", "quarterRest", "quarter", "quarterRest"],
          },
        },
        {
          id: "mr-l4-e2",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "4/4",
            sequence: [
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
              "eighth", "eighthRest", "eighth", "eighthRest",
            ],
          },
        },
        {
          id: "mr-l4-e3",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 84,
            meter: "4/4",
            sequence: [
              "quarter", "quarterRest", "eighth", "eighth", "quarterRest",
              "quarter", "quarterRest", "eighth", "eighth", "quarterRest",
            ],
          },
        },
        {
          id: "mr-l4-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "4/4",
            sequence: ["whole", "half", "half", "quarterRest", "quarter", "quarter", "quarterRest"],
          },
        },
        {
          id: "mr-l4-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 88,
            meter: "4/4",
            // Reordered from the web app's own authored sequence (half,
            // quarter, eighth, eighth, quarterRest, whole, quarterRest,
            // quarter, quarter, half, half) — that order put "whole"
            // right after a single quarterRest, starting it one beat
            // into a 4/4 measure. A whole note is, by definition, an
            // entire measure — it can't start mid-measure, so that
            // arrangement wasn't valid notation to begin with (and made
            // MeteredNotationRow's bar-line grouping, which places bars
            // by elapsed time, split the whole note awkwardly across two
            // "measures"). Same multiset of note/rest values, same total
            // length, just reordered so every measure actually adds up
            // to 4 beats: [half,quarter,eighth,eighth] | [whole] |
            // [quarterRest,quarter,quarter,quarterRest] | [half,half].
            sequence: [
              "half", "quarter", "eighth", "eighth",
              "whole",
              "quarterRest", "quarter", "quarter", "quarterRest",
              "half", "half",
            ],
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
          spec: { type: "rhythm-notation-tap", bpm: 92, meter: "4/4", sequence: ["quarter", "quarter", "half", "quarter", "quarter", "half"] },
        },
        {
          id: "mr-l5-e2",
          type: "rhythm-notation-tap",
          difficulty: 2,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 100,
            meter: "3/4",
            sequence: ["quarter", "quarter", "quarter", "half", "quarter", "quarterRest", "quarter", "quarterRest"],
          },
        },
        {
          id: "mr-l5-e3",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 88,
            meter: "4/4",
            sequence: ["eighth", "eighth", "quarter", "half", "quarter", "quarter", "eighth", "eighth", "quarter"],
          },
        },
        {
          id: "mr-l5-e4",
          type: "rhythm-notation-tap",
          difficulty: 3,
          spec: {
            type: "rhythm-notation-tap",
            bpm: 96,
            meter: "3/4",
            sequence: ["half", "quarterRest", "quarter", "eighth", "eighth", "quarter", "quarterRest", "quarter", "quarter"],
          },
        },
      ],
    },
  ],
};
