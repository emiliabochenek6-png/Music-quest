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
    {
      id: "lekcja-6-linie-dodane-gora-nazywanie",
      order: 6,
      difficulty: 3,
      introNotes: ["A4", "B4", "C5", "D5", "E5", "F5", "G5"],
      introSubtitle: "Wyżej niż pięciolinia — linie dodane nad nią",
      introClef: "treble",
      exercises: [
        { id: "l6-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D5", distractorPool: ["C5", "E5", "B4", "F5"] } },
        { id: "l6-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "E5", distractorPool: ["C5", "D5", "F5", "G5"] } },
        { id: "l6-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F5", distractorPool: ["D5", "E5", "G5", "C5"] } },
        { id: "l6-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G5", distractorPool: ["E5", "F5", "D5", "C5"] } },
        { id: "l6-e5", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "C5", distractorPool: ["D5", "B4", "A4", "E5"] } },
        { id: "l6-e6", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "G5", correctSide: "high" } },
      ],
    },
    {
      id: "lekcja-7-linie-dodane-gora-cwiczenia",
      order: 7,
      difficulty: 3,
      introSlides: [{ body: "Te same nuty co przed chwilą — teraz w ruchu: kierunek melodii, kolejność i pisownia." }],
      exercises: [
        { id: "l7-e1", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "F5", correctSide: "high" } },
        { id: "l7-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["C5", "E5", "G5"], correctDirection: "up" } },
        { id: "l7-e3", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["G5", "D5", "C5"], correctDirection: "down" } },
        { id: "l7-e4", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["E5", "C5", "G5", "D5"] } },
        { id: "l7-e5", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["F5", "A4", "D5", "E5"] } },
        { id: "l7-e6", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "treble" } },
        { id: "l7-e7", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["C5", "G5"] } },
      ],
    },
    {
      id: "lekcja-8-linie-dodane-dol-nazywanie",
      order: 8,
      difficulty: 3,
      introNotes: ["G3", "A3", "B3", "C4", "D4", "E4"],
      introSubtitle: "Niżej niż pięciolinia — linie dodane pod nią",
      introClef: "treble",
      exercises: [
        { id: "l8-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["D4", "B3", "E4", "A3"] } },
        { id: "l8-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "B3", distractorPool: ["C4", "A3", "D4"] } },
        { id: "l8-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "A3", distractorPool: ["B3", "G3", "C4"] } },
        { id: "l8-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G3", distractorPool: ["A3", "B3", "C4"] } },
        { id: "l8-e5", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "C4", correctSide: "low" } },
      ],
    },
    {
      id: "lekcja-9-linie-dodane-dol-cwiczenia",
      order: 9,
      difficulty: 3,
      introSlides: [{ body: "Te same nuty co przed chwilą — teraz w ruchu: kierunek melodii, kolejność i pisownia." }],
      exercises: [
        { id: "l9-e1", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "G3", correctSide: "low" } },
        { id: "l9-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["E4", "C4", "G3"], correctDirection: "down" } },
        { id: "l9-e3", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["G3", "B3", "E4"], correctDirection: "up" } },
        { id: "l9-e4", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["C4", "A3", "E4", "G3"] } },
        { id: "l9-e5", type: "note-word-spelling", difficulty: 2, spec: { type: "note-word-spelling", notes: ["C4", "A3", "B3"] } },
        { id: "l9-e6", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "treble" } },
        { id: "l9-e7", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["C4", "G3"] } },
      ],
    },
    {
      id: "lekcja-10-kroki-i-skoki-1",
      order: 10,
      difficulty: 3,
      introSlides: [
        {
          body: "Kiedy dwie nuty siedzą tuż obok siebie (linia-pole-linia...), to KROK. Kiedy jest między nimi przerwa, to SKOK.",
        },
      ],
      exercises: [
        { id: "l10-e1", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["C4", "D4"] } },
        { id: "l10-e2", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["D4", "F4"] } },
        { id: "l10-e3", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["E4", "F4"] } },
        { id: "l10-e4", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["G4", "C5"] } },
        { id: "l10-e5", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["A4", "B4"] } },
        { id: "l10-e6", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["B4", "E5"] } },
      ],
    },
    {
      id: "lekcja-11-kroki-i-skoki-2",
      order: 11,
      difficulty: 3,
      introSlides: [{ body: "Poćwicz jeszcze raz, tym razem w szerszym zakresie i z kolejnością nut." }],
      exercises: [
        { id: "l11-e1", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["C5", "D5"] } },
        { id: "l11-e2", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["D5", "G5"] } },
        { id: "l11-e3", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["F4", "G4"] } },
        { id: "l11-e4", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["C4", "A4"] } },
        { id: "l11-e5", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["G4", "C4", "E4", "A4"] } },
        { id: "l11-e6", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["D5", "B4", "F4", "C5"] } },
      ],
    },
    {
      id: "lekcja-12-basowy-gora-nazywanie",
      order: 12,
      difficulty: 3,
      introNotes: ["A3", "B3", "C4", "D4"],
      introSubtitle: "Teraz odwrotnie — dźwięki WYŻEJ niż pięciolinia, w kluczu basowym",
      introClef: "bass",
      exercises: [
        { id: "l12-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "B3", distractorPool: ["A3", "C4", "D4"], clef: "bass" } },
        { id: "l12-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["B3", "D4", "A3"], clef: "bass" } },
        { id: "l12-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D4", distractorPool: ["C4", "B3", "A3"], clef: "bass" } },
        { id: "l12-e4", type: "multiple-choice-notation", difficulty: 2, spec: { type: "multiple-choice-notation", targetNote: "A3", distractorPool: ["B3", "G2", "C4"], clef: "bass" } },
        { id: "l12-e5", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["D4", "B3", "A3", "C4"], clef: "bass" } },
      ],
    },
    {
      id: "lekcja-13-basowy-gora-cwiczenia",
      order: 13,
      difficulty: 3,
      introSlides: [{ body: "Te same nuty co przed chwilą — teraz w ruchu." }],
      exercises: [
        { id: "l13-e1", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["A3", "C4", "D4"], correctDirection: "up" } },
        { id: "l13-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["D4", "B3", "A3"], correctDirection: "down" } },
        { id: "l13-e3", type: "melody-direction-choice", difficulty: 1, spec: { type: "melody-direction-choice", notes: ["C4", "C4", "C4"], correctDirection: "same" } },
        { id: "l13-e4", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["F3", "A3", "C4", "B3"], clef: "bass" } },
        { id: "l13-e5", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
      ],
    },
    {
      id: "lekcja-14-mieszanka-kluczy",
      order: 14,
      difficulty: 3,
      introSlides: [
        { body: "Ten sam zapis nutowy wygląda inaczej w zależności od klucza — teraz poćwiczysz oba na przemian." },
        {
          body: "1. Najpierw cała gama w kluczu wiolinowym:",
          staffSequence: { notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] },
        },
        {
          body: "2. Ta sama gama w kluczu basowym — zobacz, że wygląda inaczej:",
          staffSequence: { notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], clef: "bass" },
        },
      ],
      exercises: [
        { id: "l14-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["D4", "B3", "E4"] } },
        { id: "l14-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C4", distractorPool: ["B3", "D4", "A3"], clef: "bass" } },
        { id: "l14-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G3", distractorPool: ["A3", "B3", "C4"] } },
        { id: "l14-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G3", distractorPool: ["A3", "F2", "B3"], clef: "bass" } },
        { id: "l14-e5", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "G5", correctSide: "high" } },
      ],
    },
    {
      id: "lekcja-15-basowy-dol-nazywanie",
      order: 15,
      difficulty: 3,
      introNotes: ["C2", "D2", "E2", "F2", "G2", "A2", "B2"],
      introSubtitle: "Klucz basowy: linie dodane pod pięciolinią",
      introClef: "bass",
      exercises: [
        { id: "l15-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F2", distractorPool: ["G2", "E2", "D2"], clef: "bass" } },
        { id: "l15-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "E2", distractorPool: ["F2", "D2", "G2"], clef: "bass" } },
        { id: "l15-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D2", distractorPool: ["E2", "C2", "F2"], clef: "bass" } },
        { id: "l15-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C2", distractorPool: ["D2", "E2", "F2"], clef: "bass" } },
        { id: "l15-e5", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "C2", correctSide: "low" } },
        { id: "l15-e6", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "F2", correctSide: "low" } },
      ],
    },
    {
      id: "lekcja-16-basowy-dol-cwiczenia",
      order: 16,
      difficulty: 3,
      introSlides: [{ body: "Te same nuty co przed chwilą — teraz w ruchu." }],
      exercises: [
        { id: "l16-e1", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["G2", "D2", "C2"], correctDirection: "down" } },
        { id: "l16-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["C2", "D2", "G2"], correctDirection: "up" } },
        { id: "l16-e3", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["F2", "C2", "E2", "D2"], clef: "bass" } },
        { id: "l16-e4", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["F2", "E2", "D2"], clef: "bass" } },
        { id: "l16-e5", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
      ],
    },
    {
      id: "lekcja-17-caly-zakres-nazywanie",
      order: 17,
      difficulty: 3,
      introSlides: [
        {
          body: "Cały zakres na raz: linie dodane nad i pod pięciolinią, w kluczu wiolinowym i basowym — pomieszane, bez podpowiedzi który to rejestr.",
        },
      ],
      exercises: [
        { id: "l17-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G5", distractorPool: ["F5", "E5", "D5"] } },
        { id: "l17-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C2", distractorPool: ["D2", "E2", "F2"], clef: "bass" } },
        { id: "l17-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "B3", distractorPool: ["A3", "C4", "D4"], clef: "bass" } },
        { id: "l17-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "A3", distractorPool: ["B3", "C4", "G3"] } },
        { id: "l17-e5", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D4", distractorPool: ["C4", "B3", "E4"], clef: "bass" } },
        { id: "l17-e6", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "G2", correctSide: "low" } },
      ],
    },
    {
      id: "lekcja-18-caly-zakres-cwiczenia",
      order: 18,
      difficulty: 3,
      introSlides: [{ body: "Te same rejestry co przed chwilą — teraz w ruchu: kierunek melodii, kolejność i pisownia." }],
      exercises: [
        { id: "l18-e1", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "F5", correctSide: "high" } },
        { id: "l18-e2", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "D2", correctSide: "low" } },
        { id: "l18-e3", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["C2", "E2", "G2"], correctDirection: "up" } },
        { id: "l18-e4", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["G5", "D5", "C5"], correctDirection: "down" } },
        { id: "l18-e5", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["F2", "D2", "G2", "C2"], clef: "bass" } },
        { id: "l18-e6", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["C5", "A4", "F5", "E5"] } },
        { id: "l18-e7", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
      ],
    },
    {
      id: "lekcja-19-krzyzyk-i-bemol-nazywanie",
      order: 19,
      difficulty: 3,
      introSlides: [
        {
          body: "Krzyżyk (♯) podnosi dźwięk o pół tonu, bemol (♭) obniża go o pół tonu. To wciąż te same nuty co znasz — tylko trochę wyżej albo niżej.",
        },
        {
          body: "Posłuchaj różnicy:",
          noteExamples: [
            { note: "F4", label: "F" },
            { note: "F#4", label: "Fis (♯)" },
            { note: "B3", label: "H" },
            { note: "Bb3", label: "B (♭)" },
          ],
        },
      ],
      exercises: [
        { id: "l19-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F#4", distractorPool: ["F4", "G4", "E4"] } },
        { id: "l19-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C#5", distractorPool: ["C5", "D5", "B4"] } },
        { id: "l19-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "Bb3", distractorPool: ["B3", "A3", "C4"] } },
        { id: "l19-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G#4", distractorPool: ["G4", "A4", "F4"] } },
        { id: "l19-e5", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "Eb3", distractorPool: ["E3", "D3", "F3"], clef: "bass" } },
        { id: "l19-e6", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "C#5", correctSide: "high" } },
      ],
    },
    {
      id: "lekcja-20-krzyzyk-i-bemol-cwiczenia",
      order: 20,
      difficulty: 3,
      introSlides: [{ body: "Te same krzyżyki i bemole — teraz w ruchu i w kolejności." }],
      exercises: [
        { id: "l20-e1", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["F4", "F#4", "G4"], correctDirection: "up" } },
        { id: "l20-e2", type: "melody-direction-choice", difficulty: 2, spec: { type: "melody-direction-choice", notes: ["C5", "B4", "Bb4"], correctDirection: "down" } },
        { id: "l20-e3", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["G4", "F#4", "A4", "F4"] } },
        { id: "l20-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "A#4", distractorPool: ["A4", "B4", "G4"] } },
        { id: "l20-e5", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D#5", distractorPool: ["D5", "E5", "C5"] } },
        { id: "l20-e6", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "treble" } },
        { id: "l20-e7", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "Db3", correctSide: "low" } },
      ],
    },
    {
      id: "lekcja-21-wielkie-podsumowanie",
      order: 21,
      difficulty: 3,
      introSlides: [
        {
          body: "Wielkie podsumowanie Wioski Nut: wszystko na raz — oba klucze, linie dodane, kroki i skoki, krzyżyki i bemole. Powodzenia!",
        },
      ],
      exercises: [
        { id: "l21-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D5", distractorPool: ["C5", "E5", "B4"] } },
        { id: "l21-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "D2", distractorPool: ["C2", "E2", "F2"], clef: "bass" } },
        { id: "l21-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G#4", distractorPool: ["G4", "A4", "F4"] } },
        { id: "l21-e4", type: "interval-distance-choice", difficulty: 2, spec: { type: "interval-distance-choice", notes: ["D4", "G4"] } },
        { id: "l21-e5", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["B3", "F4", "D4", "G3"] } },
        { id: "l21-e6", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["G3", "A3", "D4"] } },
        { id: "l21-e7", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
      ],
    },
    {
      id: "lekcja-22-boss-krol-falszomir",
      order: 22,
      difficulty: 3,
      isBoss: true,
      introSlides: [
        {
          body: "Król Fałszomir strzeże ostatniej tajemnicy Wioski Nut! Żeby go pokonać, pokaż wszystko, czego się nauczyłeś — oba klucze, linie dodane, kroki i skoki, krzyżyki i bemole, bez podpowiedzi który to rejestr.",
        },
      ],
      exercises: [
        { id: "l22-e1", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G5", distractorPool: ["F5", "E5", "D5"] } },
        { id: "l22-e2", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "C2", distractorPool: ["D2", "E2", "F2"], clef: "bass" } },
        { id: "l22-e3", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "F#3", distractorPool: ["F3", "G3", "E3"], clef: "bass" } },
        { id: "l22-e4", type: "multiple-choice-notation", difficulty: 3, spec: { type: "multiple-choice-notation", targetNote: "G#5", distractorPool: ["G5", "A5", "F5"] } },
        { id: "l22-e5", type: "interval-distance-choice", difficulty: 3, spec: { type: "interval-distance-choice", notes: ["D4", "A4"] } },
        { id: "l22-e6", type: "note-sequencing", difficulty: 3, spec: { type: "note-sequencing", notes: ["D4", "A3", "B3", "C4"], clef: "bass" } },
        { id: "l22-e7", type: "note-word-spelling", difficulty: 3, spec: { type: "note-word-spelling", notes: ["F5", "A4", "C5", "E5"] } },
        { id: "l22-e8", type: "pitch-height-choice", difficulty: 2, spec: { type: "pitch-height-choice", targetNote: "C2", correctSide: "low" } },
        { id: "l22-e9", type: "clef-trace", difficulty: 2, spec: { type: "clef-trace", clef: "bass" } },
      ],
    },
  ],
};
