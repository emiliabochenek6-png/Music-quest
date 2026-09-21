import {
  DRUMMER_2_2_SAMPLE,
  DRUMMER_2_4_SAMPLE,
  DRUMMER_3_4_SAMPLE,
  DRUMMER_4_4_SAMPLE,
  DRUMMER_6_8_SAMPLE,
  DRUMMER_9_8_SAMPLE,
  DRUMMER_12_8_SAMPLE,
  RHYTHM_DICTATION_PT_L1_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L2_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L3_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L4_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L5_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L6_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L7_RECORDING_SAMPLES,
} from "@/lib/audio/samples";
import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/przystan-taktow.json — same
 * 8 lessons, restructured only to fit this app's own WorldContent/
 * LessonDefinition/ExerciseDefinition shape (types/exercises.ts); exercise
 * count and mix have since diverged from the web version (the two
 * "stukaj w rytm pulsu" pulse-tap exercises in lessons 1-2 were dropped,
 * and a few real-recording meter-choice exercises were added — see
 * MeterChoiceExercise.tsx's own referenceAudioSource doc). Every exercise
 * here is meter-choice or rhythm-dictation, both already ported for
 * Miasto Rytmu — no new exercise types. What's new is the METERS: this world
 * extends Miasto Rytmu's 3/4 and 4/4 to five more (2/4, 2/2, 6/8, 9/8,
 * 12/8), which is what actually needed engine work before this content
 * could ship correctly — see lib/rhythm/meter.ts's meterPulseSubdivision
 * (was wrong for 2/2), lib/audio/rhythmPlayer.ts's playDanceFragment (now
 * takes a pulseSubdivision option), and MeterChoiceExercise.tsx/
 * RhythmDictationExercise.tsx/RhythmNotationTapExercise.tsx (now scale
 * bpm/beatsPerMeasure by the meter's FELT pulse, not raw quarter-note
 * beats — a plain quarter-note click during 6/8 sounds exactly like 3/4's
 * pulse otherwise). Every lesson's introSlides is ported (all 8 have
 * exactly one, body-only, no noteValueReference/staffNote/examples).
 */
export const PRZYSTAN_TAKTOW_CONTENT: WorldContent = {
  worldId: "przystan-taktow",
  lessons: [
    {
      id: "pt-lekcja-1-metrum-2-4",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Metrum 2/4 liczy tylko do dwóch — RAZ-dwa, RAZ-dwa. To najprostszy krok marszowy, jakby połowa taktu 4/4: dwa mocne uderzenia zamiast czterech.",
          referenceAudio: [
            { source: DRUMMER_2_4_SAMPLE, label: "Posłuchaj przykładu w metrum 2/4" },
            { source: DRUMMER_3_4_SAMPLE, label: "Posłuchaj przykładu w metrum 3/4" },
            { source: DRUMMER_4_4_SAMPLE, label: "Posłuchaj przykładu w metrum 4/4" },
          ],
        },
      ],
      exercises: [
        {
          id: "pt-l1-e2",
          type: "meter-choice",
          difficulty: 1,
          spec: { type: "meter-choice", correctMeter: "2/4", bpm: 100, optionPool: ["2/4", "3/4", "4/4"], referenceAudioSource: DRUMMER_2_4_SAMPLE },
        },
        {
          id: "pt-l1-e3",
          type: "meter-choice",
          difficulty: 1,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 100, optionPool: ["2/4", "3/4", "4/4"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "pt-l1-e4",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["2/4", "3/4", "4/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "pt-l1-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 90,
            meter: "2/4",
            sequence: ["quarter", "quarter", "quarter", "quarterRest"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L1_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l1-e6",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "2/4",
            sequence: ["eighth", "eighth", "quarter", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L1_RECORDING_SAMPLES[1],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-2-metrum-2-2",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Metrum 2/2 (zwane 'alla breve' albo 'na dwa') też liczy do dwóch, ale każde uderzenie to teraz półnuta, nie ćwierćnuta — brzmi jak bardzo szybkie 4/4 policzone w dwa zamiast w cztery. Każde uderzenie w 2/2 dzieli się w środku na dwie ćwiartki — usłyszysz ciche 'i' pomiędzy, czego 2/4 nie ma. To właśnie ta różnica pozwala je rozróżnić na słuch, nie tylko w zapisie.",
        },
      ],
      exercises: [
        {
          id: "pt-l2-e2",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 96,
            meter: "2/2",
            sequence: ["half", "quarter", "quarter", "half", "half"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L2_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l2-e3",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "2/2", bpm: 100, optionPool: ["2/2", "2/4", "4/4"], referenceAudioSource: DRUMMER_2_2_SAMPLE },
        },
        {
          id: "pt-l2-e4",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "2/4", bpm: 100, optionPool: ["2/2", "2/4", "4/4"], referenceAudioSource: DRUMMER_2_4_SAMPLE },
        },
        {
          id: "pt-l2-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 100,
            meter: "2/2",
            sequence: ["half", "half", "half", "half"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L2_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l2-e6",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "2/2",
            sequence: ["whole", "half", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L2_RECORDING_SAMPLES[2],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-3-mix-metrum-prostych",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Czas przećwiczyć wszystkie cztery metra proste razem: 2/4, 2/2, 3/4 i 4/4. Różnią się tym, do ilu liczysz w takcie (dwa, trzy albo cztery) i jak długie jest jedno uderzenie (ćwierćnuta albo półnuta) — w 2/2 usłyszysz dodatkowe, ciche 'i' w środku każdego uderzenia (bo to półnuta dzieląca się na dwie ćwiartki), czego 2/4 nie ma.",
        },
      ],
      exercises: [
        {
          id: "pt-l3-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "2/4", bpm: 100, optionPool: ["2/4", "2/2", "3/4", "4/4"], referenceAudioSource: DRUMMER_2_4_SAMPLE },
        },
        {
          id: "pt-l3-e2",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "2/2", bpm: 100, optionPool: ["2/4", "2/2", "3/4", "4/4"], referenceAudioSource: DRUMMER_2_2_SAMPLE },
        },
        {
          id: "pt-l3-e3",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["2/4", "2/2", "3/4", "4/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "pt-l3-e4",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "2/4",
            sequence: ["quarter", "quarter", "eighth", "eighth", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L3_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l3-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "2/2",
            sequence: ["half", "quarter", "quarter", "half", "half"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L3_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l3-e6",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 92,
            meter: "3/4",
            sequence: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L3_RECORDING_SAMPLES[2],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-4-metrum-6-8",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Metrum złożone liczy inaczej: zamiast liczyć pojedyncze uderzenia, liczysz grupy po trzy ósemki. W 6/8 są dwie takie grupy — liczysz 'RAZ-dwa-trzy, RAZ-dwa-trzy', nie 'raz-dwa-trzy-cztery-pięć-sześć'. Każda trójka to jeden wyczuwalny, duży puls.",
        },
      ],
      exercises: [
        {
          id: "pt-l4-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 100, optionPool: ["6/8", "3/4", "4/4"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l4-e2",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 88, optionPool: ["6/8", "3/4", "4/4"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l4-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["6/8", "3/4"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "pt-l4-e4",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "6/8",
            sequence: ["quarter", "eighth", "quarter", "eighth", "quarter", "eighth", "quarter", "eighth"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L4_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l4-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "6/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L4_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l4-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "6/8",
            sequence: ["eighth", "eighth", "eighth", "quarter", "eighth", "quarter", "eighth", "eighthRest", "eighth", "eighth"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L4_RECORDING_SAMPLES[2],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-5-metrum-9-8",
      order: 5,
      difficulty: 2,
      introSlides: [
        {
          body: "9/8 działa tak samo jak 6/8, tylko ma trzy grupy zamiast dwóch: 'RAZ-dwa-trzy, RAZ-dwa-trzy, RAZ-dwa-trzy'.",
        },
      ],
      exercises: [
        {
          id: "pt-l5-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "9/8", bpm: 100, optionPool: ["9/8", "6/8", "3/4"], referenceAudioSource: DRUMMER_9_8_SAMPLE },
        },
        {
          id: "pt-l5-e2",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "9/8", bpm: 92, optionPool: ["9/8", "6/8", "3/4"], referenceAudioSource: DRUMMER_9_8_SAMPLE },
        },
        {
          id: "pt-l5-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 100, optionPool: ["9/8", "6/8"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l5-e4",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "quarter", "eighth", "quarter", "eighth", "quarter", "eighth",
              "quarter", "eighth", "quarter", "eighth", "quarter", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L5_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l5-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L5_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l5-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "quarter", "eighth", "quarter", "eighth", "quarter", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L5_RECORDING_SAMPLES[2],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-6-metrum-12-8",
      order: 6,
      difficulty: 2,
      introSlides: [
        {
          body: "12/8 ma cztery grupy po trzy ósemki: 'RAZ-dwa-trzy, RAZ-dwa-trzy, RAZ-dwa-trzy, RAZ-dwa-trzy' — brzmi podobnie do 4/4, ale każde uderzenie 'kołysze się' w trójkach zamiast dzielić się na pół.",
        },
      ],
      exercises: [
        {
          id: "pt-l6-e1",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 100, optionPool: ["12/8", "4/4", "6/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l6-e2",
          type: "meter-choice",
          difficulty: 2,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 88, optionPool: ["12/8", "4/4", "6/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l6-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 100, optionPool: ["12/8", "4/4"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "pt-l6-e4",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "quarter", "eighth", "quarter", "eighth", "quarter", "eighth", "quarter", "eighth",
              "quarter", "eighth", "quarter", "eighth", "quarter", "eighth", "quarter", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L6_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l6-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L6_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l6-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "quarter", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth", "quarter", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L6_RECORDING_SAMPLES[2],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-7-mix-metrum-zlozonych",
      order: 7,
      difficulty: 2,
      introSlides: [
        {
          body: "Przećwicz teraz 6/8, 9/8 i 12/8 razem — różni je tylko liczba dużych pulsów (dwa, trzy, cztery), ale każdy zawsze dzieli się na trzy ósemki.",
        },
      ],
      exercises: [
        {
          id: "pt-l7-e1",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 96, optionPool: ["6/8", "9/8", "12/8"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l7-e2",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "9/8", bpm: 96, optionPool: ["6/8", "9/8", "12/8"], referenceAudioSource: DRUMMER_9_8_SAMPLE },
        },
        {
          id: "pt-l7-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 96, optionPool: ["6/8", "9/8", "12/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l7-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "6/8",
            sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "eighthRest", "eighth", "eighth", "quarter", "eighth"],
            referenceAudioSource: RHYTHM_DICTATION_PT_L7_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l7-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "quarter", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter",
              "eighthRest", "eighth", "eighth", "quarter", "eighth", "eighth", "eighthRest", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L7_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l7-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "quarter", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "eighthRest", "eighth", "eighth",
              "eighth", "eighth", "eighth", "quarter", "eighth", "eighthRest", "eighth", "eighth", "eighth", "quarter",
            ],
          },
        },
      ],
    },
    {
      id: "pt-lekcja-8-rozpoznawanie-metrum",
      order: 8,
      difficulty: 3,
      introSlides: [
        {
          body: "Poznałeś już wszystkie siedem metrum tej krainy — czas nauczyć się rozróżniać je samym słuchem, bez patrzenia na zapis. Przypomnienie, jak każde brzmi: 2/4 to prosty krok 'RAZ-dwa'. 2/2 brzmi podobnie, ale każde uderzenie dzieli się w środku na dwie ćwiartki — słychać ciche 'i' pomiędzy, czego 2/4 nie ma. 3/4 to walc 'RAZ-dwa-trzy'. 4/4 liczy do czterech, 'RAZ-dwa-trzy-cztery'. Metra złożone kołyszą się w grupach po trzy ósemki: 6/8 to dwie takie grupy ('RAZ-dwa-trzy, RAZ-dwa-trzy'), 9/8 to trzy grupy, a 12/8 to cztery. Teraz usłysz je wszystkie obok siebie i rozpoznaj każde na słuch.",
        },
      ],
      exercises: [
        {
          id: "pt-l8-e1",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "4/4",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_4_4_SAMPLE,
          },
        },
        {
          id: "pt-l8-e2",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "9/8",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_9_8_SAMPLE,
          },
        },
        {
          id: "pt-l8-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "2/2",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_2_2_SAMPLE,
          },
        },
        {
          id: "pt-l8-e4",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "6/8",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_6_8_SAMPLE,
          },
        },
        {
          id: "pt-l8-e5",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "3/4",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_3_4_SAMPLE,
          },
        },
        {
          id: "pt-l8-e6",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "12/8",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_12_8_SAMPLE,
          },
        },
        {
          id: "pt-l8-e7",
          type: "meter-choice",
          difficulty: 3,
          spec: {
            type: "meter-choice",
            correctMeter: "2/4",
            bpm: 100,
            optionPool: ["2/4", "2/2", "3/4", "4/4", "6/8", "9/8", "12/8"],
            referenceAudioSource: DRUMMER_2_4_SAMPLE,
          },
        },
      ],
    },
  ],
};
