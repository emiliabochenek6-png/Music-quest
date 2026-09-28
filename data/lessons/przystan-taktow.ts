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
  RHYTHM_DICTATION_PT_L9_RECORDING_SAMPLES,
  RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES,
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
            referenceAudioSource: RHYTHM_DICTATION_PT_L7_RECORDING_SAMPLES[2],
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
    {
      // Lekcja 8 tested all seven meters at once — this narrows back down
      // to the pairs that are genuinely easy to confuse (same note count,
      // different felt grouping), rather than the whole grab-bag. The two
      // rhythm-dictation exercises use the literal SAME 12-eighth clap
      // pattern in 3/4 and 6/8 — the onsets themselves sound identical
      // (see lib/questions/validate.ts's own doc: only the gaps between
      // taps matter), so what actually distinguishes them is the
      // background metronome's own felt-pulse accenting (see
      // RhythmDictationExercise.tsx's feltBpm/feltBeatsPerMeasure doc) —
      // three even clicks per measure in 3/4 versus two bigger
      // dotted-quarter pulses in 6/8. That's the whole point of the pair.
      id: "pt-lekcja-9-podchwytliwe-pary",
      order: 9,
      difficulty: 3,
      introSlides: [
        {
          body: "Niektóre metra brzmią bardzo podobnie, jeśli liczysz tylko dźwięki. 3/4 i 6/8 mogą mieć dokładnie tyle samo ósemek, ale inaczej się \"kołyszą\" — 3/4 liczy trzy równe uderzenia, a 6/8 dwie większe grupy po trzy. Tak samo 6/8 i 12/8 różnią się tylko liczbą tych grup, nie ich brzmieniem. Posłuchaj uważnie, gdzie wypada mocne uderzenie.",
        },
      ],
      exercises: [
        {
          id: "pt-l9-e1",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["3/4", "6/8"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "pt-l9-e2",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 100, optionPool: ["3/4", "6/8"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l9-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "6/8", bpm: 96, optionPool: ["6/8", "12/8"], referenceAudioSource: DRUMMER_6_8_SAMPLE },
        },
        {
          id: "pt-l9-e4",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 96, optionPool: ["6/8", "12/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l9-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "3/4",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L9_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l9-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 120,
            meter: "6/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            // Identical onset pattern to pt-l9-e5 — same real recording works
            // for both (that's the whole point of this pair, see the
            // lesson's own intro-slide doc): only the felt-pulse accent
            // (background metronome) differs between the two meters, not
            // the clap pattern itself.
            referenceAudioSource: RHYTHM_DICTATION_PT_L9_RECORDING_SAMPLES[1],
          },
        },
      ],
    },
    {
      // Straight, unbroken eighth-note runs — no rests, no note-value
      // variety — across all three compound meters. The challenge here
      // isn't reading a tricky pattern (that's lekcja 9's own job), it's
      // staying EXACTLY even over a long stretch (12/18/24 taps in a
      // row) without drifting faster or slower, which gets harder purely
      // because the measure itself gets longer (6/8 → 9/8 → 12/8).
      id: "pt-lekcja-10-synkopy-w-metrum-zlozonym",
      order: 10,
      difficulty: 2,
      introSlides: [
        {
          body: "Metra złożone (6/8, 9/8, 12/8) stają się trudniejsze, gdy takt jest dłuższy — więcej ósemek do utrzymania w równym tempie, bez przyspieszania i zwalniania. Im dłuższy takt, tym łatwiej się pogubić.",
        },
      ],
      exercises: [
        {
          id: "pt-l10-e1",
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
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[0],
          },
        },
        {
          id: "pt-l10-e2",
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
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[1],
          },
        },
        {
          id: "pt-l10-e3",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[2],
          },
        },
        {
          id: "pt-l10-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[3],
          },
        },
        {
          id: "pt-l10-e5",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[4],
          },
        },
        {
          id: "pt-l10-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            referenceAudioSource: RHYTHM_DICTATION_PT_L10_RECORDING_SAMPLES[5],
          },
        },
      ],
    },
    {
      // Lekcja 9's own pairs compared meters that SHARE a measure length
      // (3/4↔6/8, 6/8↔12/8 — same total quarter-beats, different felt
      // grouping). This is the other classic confusable relationship:
      // meters that share the same PULSE COUNT (3 big beats, 4 big beats)
      // but split each pulse differently — a quarter-note pulse (simple)
      // vs a dotted-quarter pulse (compound). 3/4 and 9/8 both feel like
      // "three", 4/4 and 12/8 both feel like "four".
      id: "pt-lekcja-11-trojki-metrum",
      order: 11,
      difficulty: 3,
      introSlides: [
        {
          body: "3/4 i 9/8 mają tyle samo dużych pulsów — trzy. 4/4 i 12/8 też mają tyle samo — cztery. Różnica jest w tym, jak dzieli się KAŻDY puls: na dwie części (proste, jak 3/4) czy na trzy (złożone, jak 9/8). Licz pulsy, nie pojedyncze dźwięki.",
        },
      ],
      exercises: [
        {
          id: "pt-l11-e1",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "3/4", bpm: 100, optionPool: ["3/4", "9/8"], referenceAudioSource: DRUMMER_3_4_SAMPLE },
        },
        {
          id: "pt-l11-e2",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "9/8", bpm: 100, optionPool: ["3/4", "9/8"], referenceAudioSource: DRUMMER_9_8_SAMPLE },
        },
        {
          id: "pt-l11-e3",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "4/4", bpm: 100, optionPool: ["4/4", "12/8"], referenceAudioSource: DRUMMER_4_4_SAMPLE },
        },
        {
          id: "pt-l11-e4",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 100, optionPool: ["4/4", "12/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l11-e5",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "9/8", bpm: 92, optionPool: ["3/4", "9/8"], referenceAudioSource: DRUMMER_9_8_SAMPLE },
        },
        {
          id: "pt-l11-e6",
          type: "meter-choice",
          difficulty: 3,
          spec: { type: "meter-choice", correctMeter: "12/8", bpm: 92, optionPool: ["4/4", "12/8"], referenceAudioSource: DRUMMER_12_8_SAMPLE },
        },
        {
          id: "pt-l11-e7",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "9/8",
            sequence: [
              "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth",
              "eighth", "eighth", "eighth", "quarter", "eighth", "quarter", "eighth",
            ],
          },
        },
        {
          id: "pt-l11-e8",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 80,
            meter: "12/8",
            sequence: [
              "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth",
            ],
          },
        },
      ],
    },
    {
      // Miasto Rytmu teaches sixteenths only in simple meter (2/4, 3/4,
      // 4/4). This is the same subdivision — one eighth's own slot split
      // into two sixteenths — landing inside a compound meter's
      // dotted-quarter pulse instead, which packs more onsets into the
      // same 1.5-beat pulse than lekcje 4-11 have used so far.
      id: "pt-lekcja-12-szesnastki-w-zlozonym",
      order: 12,
      difficulty: 2,
      introSlides: [
        {
          body: "W prostym metrum już zamieniałeś jedną ósemkę na dwie szesnastki. Ten sam trik działa też w metrum złożonym — w miejscu jednej z trzech ósemek pulsu 6/8, 9/8 czy 12/8 mogą zmieścić się dwie szesnastki, przez co ten fragment pulsu brzmi gęściej niż reszta.",
        },
      ],
      exercises: [
        {
          id: "pt-l12-e1",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 72,
            meter: "6/8",
            sequence: [
              "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "eighth", "eighth",
            ],
          },
        },
        {
          id: "pt-l12-e2",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 72,
            meter: "6/8",
            sequence: [
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth",
            ],
          },
        },
        {
          id: "pt-l12-e3",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 68,
            meter: "9/8",
            sequence: [
              "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth",
              "quarter", "eighth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
          },
        },
        {
          id: "pt-l12-e4",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 68,
            meter: "9/8",
            sequence: [
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "quarter", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "quarter", "eighth",
            ],
          },
        },
        {
          id: "pt-l12-e5",
          type: "rhythm-dictation",
          difficulty: 2,
          spec: {
            type: "rhythm-dictation",
            bpm: 64,
            meter: "12/8",
            sequence: [
              "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth",
              "eighth", "eighth", "eighth", "quarter", "eighth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth",
            ],
          },
        },
        {
          id: "pt-l12-e6",
          type: "rhythm-dictation",
          difficulty: 3,
          spec: {
            type: "rhythm-dictation",
            bpm: 64,
            meter: "12/8",
            sequence: [
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth",
              "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth",
            ],
          },
        },
      ],
    },
  ],
};
