import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/wioska-nut.json — same 5
 * lessons, same 61 exercises, same ids/specs, restructured only to fit
 * this app's own WorldContent/LessonDefinition/ExerciseDefinition shape
 * (types/exercises.ts). Two intro styles are ported: the simpler
 * `introNotes`/`introSubtitle`/`introClef` "get familiar with these notes
 * on the staff" screen (components/exercises/LessonIntro.tsx), and the
 * richer `introSlides` rule-explanation cards (LessonTheoryIntro.tsx) —
 * the latter narrowed to text + one staff note + examples per slide, since
 * this port has no piano-keyboard component (see LessonTheorySlide's own
 * doc in types/exercises.ts for exactly what's dropped from the web
 * version's slide shape).
 */
export const WIOSKA_NUT_CONTENT: WorldContent = {
  worldId: "wioska-nut",
  lessons: [
    {
      id: "lekcja-1-do-re-mi",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Witaj w Wiosce Nut! Zanim zaczniesz: dźwięki mogą być wysokie albo niskie, melodia może iść w górę, w dół albo zostawać na tym samym miejscu, a na pięciolinii nuty siedzą na liniach albo w polach między nimi.",
        },
      ],
      exercises: [
        { id: "l1-e0a", type: "pitch-height-choice", difficulty: 1, spec: { type: "pitch-height-choice", targetNote: "C6", correctSide: "high" } },
        { id: "l1-e0b", type: "pitch-height-choice", difficulty: 1, spec: { type: "pitch-height-choice", targetNote: "C3", correctSide: "low" } },
        { id: "l1-e0c", type: "melody-direction-choice", difficulty: 1, spec: { type: "melody-direction-choice", notes: ["C4", "E4", "G4"], correctDirection: "up" } },
        { id: "l1-e0d", type: "melody-direction-choice", difficulty: 1, spec: { type: "melody-direction-choice", notes: ["G4", "D4", "C4"], correctDirection: "down" } },
        { id: "l1-e0e", type: "melody-direction-choice", difficulty: 1, spec: { type: "melody-direction-choice", notes: ["E4", "E4", "E4"], correctDirection: "same" } },
        { id: "l1-e0f", type: "staff-placement", difficulty: 1, spec: { type: "staff-placement", targetStep: 4 } },
        { id: "l1-e0g", type: "staff-placement", difficulty: 1, spec: { type: "staff-placement", targetStep: 3 } },
        { id: "l1-e5", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "treble" } },
      ],
    },
    {
      id: "lekcja-2-fa-sol-la",
      order: 2,
      difficulty: 2,
      introNotes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
      introSubtitle: "Nuty w kluczu wiolinowym",
      introClef: "treble",
      exercises: [
        { id: "l2-e1", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["D4", "E4", "F4", "G4"] } },
        { id: "l2-e2", type: "note-sequencing", difficulty: 2, spec: { type: "note-sequencing", notes: ["C4", "D4", "E4"] } },
        { id: "l2-e3", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "F4", distractorPool: ["C4", "D4", "E4", "G4"] } },
        { id: "l2-e4", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "G4", distractorPool: ["C4", "D4", "E4", "F4"] } },
        { id: "l2-e5", type: "line-or-space-choice", difficulty: 2, spec: { type: "line-or-space-choice", targetNote: "F4" } },
        { id: "l2-e6", type: "line-or-space-choice", difficulty: 2, spec: { type: "line-or-space-choice", targetNote: "G4" } },
        { id: "l2-e7", type: "note-word-spelling", difficulty: 2, spec: { type: "note-word-spelling", notes: ["C4", "A4", "F4", "E4"] } },
        { id: "l2-e8", type: "note-word-spelling", difficulty: 2, spec: { type: "note-word-spelling", notes: ["D4", "A4", "G4"] } },
        { id: "l2-e9", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "A4", distractorPool: ["D4", "E4", "F4", "G4"] } },
        { id: "l2-e10", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "B4", distractorPool: ["D4", "E4", "F4", "G4", "A4"] } },
      ],
    },
    {
      id: "lekcja-3-si-i-skala",
      order: 3,
      difficulty: 3,
      introSlides: [
        {
          body: "Krzyżyk (♯) podwyższa dźwięk o jeden półton (idziemy w prawo na klawiaturze). Do nazwy dodajemy końcówkę „-is”.",
          staffNote: "F#4",
          examples: [
            { from: "F4", to: "F#4" },
            { from: "G4", to: "G#4" },
          ],
        },
        {
          body: "Bemol (♭) obniża dźwięk o jeden półton (idziemy w lewo na klawiaturze). Do nazwy dodajemy końcówkę „-es” lub „-s”.",
          staffNote: "Bb4",
          examples: [
            { from: "D4", to: "Db4" },
            { from: "B4", to: "Bb4", note: "wyjątek" },
          ],
        },
      ],
      exercises: [
        { id: "l3-e1", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "A4", distractorPool: ["C4", "D4", "E4", "F4", "G4"] } },
        { id: "l3-e2", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "B4", distractorPool: ["C4", "D4", "E4", "F4", "G4"] } },
        { id: "l3-e3", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "C5", distractorPool: ["D4", "E4", "F4", "G4", "A4"] } },
        { id: "l3-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F#4", distractorPool: ["F4", "G4", "E4"] } },
        { id: "l3-e5", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C#4", distractorPool: ["C4", "D4", "B4"] } },
        { id: "l3-e6", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "Bb4", distractorPool: ["B4", "A4", "C5"] } },
        { id: "l3-e7", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "Eb4", distractorPool: ["E4", "D4", "F4"] } },
        { id: "l3-e8", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "F4", distractorPool: ["F#4", "G4", "E4"] } },
        { id: "l3-e9", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "A4", distractorPool: ["G#4", "B4", "G4"] } },
        { id: "l3-e10", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["C#4", "D4", "B4"] } },
        { id: "l3-e11", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D#4", distractorPool: ["D4", "E4", "C#4"] } },
        { id: "l3-e12", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G4", distractorPool: ["F#4", "A4", "F4"] } },
        { id: "l3-e13", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "A#4", distractorPool: ["A4", "B4", "G#4"] } },
        { id: "l3-e14", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C5", distractorPool: ["B4", "A4", "C4"] } },
      ],
    },
    {
      id: "lekcja-4-pieciolinia",
      order: 4,
      difficulty: 3,
      introNotes: ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"],
      introSubtitle: "Nuty w kluczu basowym",
      introClef: "bass",
      exercises: [
        { id: "l4-e1", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
        { id: "l4-e2", type: "staff-placement", difficulty: 2, spec: { type: "staff-placement", targetStep: 6 } },
        { id: "l4-e5", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "E3", distractorPool: ["C3", "D3", "F3", "G3"], clef: "bass" } },
        { id: "l4-e7", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "G3", distractorPool: ["C3", "D3", "E3", "F3"], clef: "bass" } },
        { id: "l4-e3", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "C3", distractorPool: ["D3", "E3", "F3", "G3"], clef: "bass" } },
        { id: "l4-e9", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "B3", distractorPool: ["D3", "E3", "F3", "G3", "A3"], clef: "bass" } },
        { id: "l4-e4", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "D3", distractorPool: ["C3", "E3", "F3", "G3"], clef: "bass" } },
        { id: "l4-e10", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["D3", "E3", "F3", "G3", "A3"], clef: "bass" } },
        { id: "l4-e8", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "A3", distractorPool: ["D3", "E3", "F3", "G3"], clef: "bass" } },
        { id: "l4-e6", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "F3", distractorPool: ["C3", "D3", "E3", "G3"], clef: "bass" } },
      ],
    },
    {
      id: "lekcja-5-powtorka",
      order: 5,
      difficulty: 3,
      introSlides: [
        {
          body: "Powtórka: przypomnij sobie wszystko, czego nauczyłaś/eś się w tej krainie — nazwy nut, wysokość dźwięku, kierunek melodii oraz klucz wiolinowy i basowy.",
        },
      ],
      exercises: [
        { id: "l5-e1", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "D4", correctSide: "low" } },
        { id: "l5-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["C4", "D4", "E4"], correctDirection: "up" } },
        { id: "l5-e3", type: "staff-placement", difficulty: 3, spec: { type: "staff-placement", targetStep: 7 } },
        { id: "l5-e4", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["B4", "A4", "G4"], correctDirection: "down" } },
        { id: "l5-e5", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "A4", correctSide: "high" } },
        { id: "l5-e6", type: "clef-trace", difficulty: 3, spec: { type: "clef-trace", clef: "bass" } },
        { id: "l5-e7", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F#4", distractorPool: ["F4", "G4", "E4"] } },
        { id: "l5-e8", type: "interval-distance-choice", difficulty: 3, spec: { type: "interval-distance-choice", notes: ["C4", "D4"] } },
        { id: "l5-e9", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D3", distractorPool: ["C3", "E3", "F3"], clef: "bass" } },
        { id: "l5-e10", type: "interval-distance-choice", difficulty: 3, spec: { type: "interval-distance-choice", notes: ["C4", "F4"] } },
        { id: "l5-e11", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["G4", "C4", "E4", "A4"] } },
        { id: "l5-e12", type: "line-or-space-choice", difficulty: 3, spec: { type: "line-or-space-choice", targetNote: "B4" } },
        { id: "l5-e13", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["C4", "A4", "G4", "E4", "D4"] } },
        { id: "l5-e14", type: "interval-distance-choice", difficulty: 3, spec: { type: "interval-distance-choice", notes: ["G4", "C5"] } },
      ],
    },
  ],
};
