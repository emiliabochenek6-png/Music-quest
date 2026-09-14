import type { WorldContent } from "@/types/exercises";

/**
 * "Cytadela Dominant" — a new world (not ported from the web app), built on
 * the same pattern as Jaskinia Akordów: teaches INVERSIONS (przewroty),
 * only this time of a four-note chord — the dominanta septymowa (dominant
 * seventh, D⁷/V⁷): a major triad built on the 5th scale degree with one
 * more minor third stacked on top. Where a triad has 3 possible inversions,
 * a four-note chord has 4 — see lib/music/seventhChords.ts's own
 * getSeventhChordInversionNotes/getSeventhChordInversionName. Bass-note
 * facts per postać (used throughout this file's intro slides):
 *
 *   postać zasadnicza (D⁷) — bas: pryma (V stopień gamy), brak cyfr lub "7"
 *   I przewrót (D⁶₅, kwintsekstakord) — bas: tercja (VII stopień gamy)
 *   II przewrót (D⁴₃, tercekwartakord) — bas: kwinta (II stopień gamy)
 *   III przewrót (D², sekundakord) — bas: septyma (IV stopień gamy)
 *
 * `noteRange` for every dominant-seventh-inversion-choice exercise here is
 * ["C4","E4"] — narrower even than Jaskinia Akordów's own ["C4","G4"] —
 * because the third inversion shifts the root, third AND fifth all up a
 * full octave above the bass (one octave further than a triad's own worst
 * case), so the highest root this range allows (E4) still lands its
 * topmost note (the fifth, third-inversion) on B5 — one semitone under
 * this app's NOTE_SAMPLES ceiling (C6), the same one-semitone margin
 * Jaskinia Akordów's own range keeps. Verified by hand for the one root in
 * this range needing the flatAlternateSpelling fallback (D#4 -> Eb4, to
 * avoid a double-sharp third) before authoring any content against it.
 */
export const CYTADELA_DOMINANT_CONTENT: WorldContent = {
  worldId: "cytadela-dominant",
  lessons: [
    {
      id: "cd-poziom-1-kwintsekstakord",
      order: 1,
      difficulty: 3,
      introSlides: [
        {
          body: "Dominanta septymowa (D⁷) to akord zbudowany na V stopniu gamy: trójdźwięk durowy z dołożoną jeszcze jedną tercją na górze (septymą małą). Bardzo chce się 'rozwiązać' do toniki — to najważniejszy akord napięcia w muzyce. W postaci zasadniczej w basie (na dole) stoi pryma akordu, czyli sam V stopień gamy.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza (D⁷)", degrees: [1, 3, 5, 7] },
          ],
        },
        {
          body: "Tak jak trójdźwięk, dominantę septymową też można przewrócić — tylko że ma ona AŻ TRZY przewroty (bo ma cztery różne dźwięki). Pierwszy z nich to kwintsekstakord (D⁶₅): w basie ląduje tercja akordu, czyli VII stopień gamy (dźwięk prowadzący).",
          triadExamples: [
            { notes: ["E4", "G4", "Bb4", "C5"], label: "kwintsekstakord (D⁶₅) — I przewrót", degrees: [3, 5, 7, 1] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l1-e1", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l1-e2", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l1-e3", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l1-e4", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l1-e5", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l1-e6", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
      ],
    },
    {
      id: "cd-poziom-2-tercekwartakord",
      order: 2,
      difficulty: 3,
      introSlides: [
        {
          body: "Drugi przewrót to tercekwartakord (D⁴₃): w basie ląduje kwinta akordu, czyli II stopień gamy. Pryma, tercja i septyma przenoszą się o oktawę wyżej, zachowując swoją kolejność.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza (D⁷)", degrees: [1, 3, 5, 7] },
            { notes: ["G4", "Bb4", "C5", "E5"], label: "tercekwartakord (D⁴₃) — II przewrót", degrees: [5, 7, 1, 3] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l2-e1", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
        { id: "cd-l2-e2", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
        { id: "cd-l2-e3", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
        { id: "cd-l2-e4", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
        { id: "cd-l2-e5", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
        { id: "cd-l2-e6", type: "dominant-seventh-inversion-choice", difficulty: 3, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "second"] } },
      ],
    },
    {
      id: "cd-poziom-3-sekundakord",
      order: 3,
      difficulty: 4,
      introSlides: [
        {
          body: "Trzeci, ostatni przewrót to sekundakord (D²): w basie ląduje septyma akordu, czyli IV stopień gamy. Pryma, tercja i kwinta przenoszą się o oktawę wyżej.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza (D⁷)", degrees: [1, 3, 5, 7] },
            { notes: ["Bb4", "C5", "E5", "G5"], label: "sekundakord (D²) — III przewrót", degrees: [7, 1, 3, 5] },
          ],
        },
        {
          body: "Podsumowanie: popatrz, który dźwięk akordu jest najniższy (w basie). Pryma → postać zasadnicza. Tercja → kwintsekstakord. Kwinta → tercekwartakord. Septyma → sekundakord.",
        },
      ],
      exercises: [
        { id: "cd-l3-e1", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
        { id: "cd-l3-e2", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
        { id: "cd-l3-e3", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
        { id: "cd-l3-e4", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
        { id: "cd-l3-e5", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
        { id: "cd-l3-e6", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], allowedInversions: ["root", "third"] } },
      ],
    },
    {
      id: "cd-poziom-4-wszystkie-postacie",
      order: 4,
      difficulty: 4,
      introSlides: [
        {
          body: "Teraz wszystkie cztery postacie na raz: postać zasadnicza, kwintsekstakord, tercekwartakord i sekundakord — te same cztery dźwięki, przełożone na cztery różne sposoby.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza (D⁷)", degrees: [1, 3, 5, 7] },
            { notes: ["E4", "G4", "Bb4", "C5"], label: "kwintsekstakord (D⁶₅)", degrees: [3, 5, 7, 1] },
            { notes: ["G4", "Bb4", "C5", "E5"], label: "tercekwartakord (D⁴₃)", degrees: [5, 7, 1, 3] },
            { notes: ["Bb4", "C5", "E5", "G5"], label: "sekundakord (D²)", degrees: [7, 1, 3, 5] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l4-e1", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l4-e2", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l4-e3", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l4-e4", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l4-e5", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l4-e6", type: "dominant-seventh-inversion-choice", difficulty: 4, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
      ],
    },
    {
      id: "cd-poziom-5-trudniejsze",
      order: 5,
      difficulty: 5,
      introSlides: [
        {
          body: "Teraz jeszcze trudniej — część zadań tylko ze słuchu, bez podglądu na pięciolinii. Skup się na tym, gdzie w akordzie leży bas.",
        },
      ],
      exercises: [
        { id: "cd-l5-e1", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l5-e2", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l5-e3", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l5-e4", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l5-e5", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l5-e6", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l5-e7", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l5-e8", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
      ],
    },
    {
      id: "cd-poziom-6-podsumowanie",
      order: 6,
      difficulty: 5,
      introSlides: [
        {
          body: "Podsumowanie: wszystkie cztery postacie dominanty septymowej, wymieszane, częściowo tylko ze słuchu. Pryma na dole — postać zasadnicza. Tercja na dole — kwintsekstakord. Kwinta na dole — tercekwartakord. Septyma na dole — sekundakord.",
        },
      ],
      exercises: [
        { id: "cd-l6-e1", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l6-e2", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l6-e3", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l6-e4", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"] } },
        { id: "cd-l6-e5", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l6-e6", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l6-e7", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l6-e8", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
      ],
    },
  ],
};
