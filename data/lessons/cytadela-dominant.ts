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
 *
 * Lekcje 7-14 mirror Jaskinia Akordów's own later lessons, adapted for a
 * four-note chord. Lekcja 7 widens noteRange's floor to ["C3","E4"] (safe
 * for the same reason as Jaskinia's own lekcja 7 — inversions only push
 * notes up). Lekcja 8 takes a structural angle (triad-fact-choice
 * reasoning about which note is in the bass, and its reverse) — same
 * idea as Jaskinia's lekcja 8, but with NO notationNotes (that field is a
 * fixed 3-tuple, this chord has 4 notes), so the question relies on its
 * own prompt text. Lekcja 9 reverses direction entirely (name + root ->
 * pick the correct spelling from all 4 rotations). Lekcja 10 drills
 * lekcje 8-9's own two skills on two new roots (F, D). Deliberately
 * SKIPPED: Jaskinia's own lekcja 9 ("odczytaj z odległości") has no clean
 * equivalent here — a triad's "third-then-third/third-then-fourth/
 * fourth-then-third" adjacent-interval shortcut doesn't hold for a
 * seventh chord (e.g. kwintsekstakord's own adjacent intervals are
 * m3-m3-M2, not a clean third/fourth pattern); the real classical
 * shorthand (6/5, 4/3, 2 — intervals counted FROM THE BASS, not between
 * neighbors) is meaningfully harder to teach correctly, so this world
 * leans on lekcja 8's own bass-note reasoning instead. Lekcje 11-14 add
 * the new `dominant-seventh-inversion-sequence-choice` type (types/
 * exercises.ts) — this world's own version of Jaskinia's triad-
 * inversion-sequence-choice: 2 or 3 fresh dominant sevenths play back to
 * back (still each one a normal simultaneous chord via
 * playChordSequence), one IntervalOptionPicker "okienko" per position,
 * narrow (root/kwintsekstakord only) then full-postacie variants
 * mirroring Jaskinia's own narrow→full sequence ladder.
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
    {
      // Same recognition task as lekcje 5-6, one octave lower on the
      // floor (["C3","E4"] instead of ["C4","E4"]) — safe against the
      // sample ceiling this file's own top doc raises, since inversions
      // only ever push notes UP relative to the bass (same reasoning
      // Jaskinia Akordów's own lekcja 7 uses for triads).
      id: "cd-poziom-7-szerszy-rejestr",
      order: 7,
      difficulty: 5,
      introSlides: [
        {
          body: "Ten sam trening co wcześniej, ale w szerszym, niższym rejestrze — od C3. Ten sam przewrót brzmi inaczej nisko niż w dotychczasowym zakresie, ale to wciąż ten sam przewrót.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza w dotychczasowym rejestrze (C4)", degrees: [1, 3, 5, 7] },
            { notes: ["C3", "E3", "G3", "Bb3"], label: "ta sama postać zasadnicza, oktawę niżej (C3)", degrees: [1, 3, 5, 7] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l7-e1", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e2", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e3", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e4", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e5", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e6", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        { id: "cd-l7-e7", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
      ],
    },
    {
      // A structural, not ear-training, angle on the same inversion
      // concept — same idea as Jaskinia Akordów's own lekcja 8
      // (triad-fact-choice reasoning about "which note lands in the bass
      // for a given inversion", and its reverse). No notationNotes here
      // (that field is a fixed 3-tuple, this chord has 4 notes) — the
      // question relies on the prompt's own text instead.
      id: "cd-poziom-8-ktory-dzwiek-w-basie",
      order: 8,
      difficulty: 4,
      introSlides: [
        {
          body: "Każdy przewrót to inny dźwięk akordu w basie: w postaci zasadniczej — pryma, w kwintsekstakordzie — tercja, w tercekwartakordzie — kwinta, w sekundakordzie — septyma. W tej lekcji zobaczysz dominantę septymową w postaci zasadniczej i będziesz szukać, który dźwięk musi wylądować w basie, żeby powstał dany przewrót — albo odwrotnie: mając dany bas, nazwiesz przewrót.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza — w basie pryma (C)", degrees: [1, 3, 5, 7] },
            { notes: ["E4", "G4", "Bb4", "C5"], label: "kwintsekstakord — w basie tercja (E)", degrees: [3, 5, 7, 1] },
            { notes: ["G4", "Bb4", "C5", "E5"], label: "tercekwartakord — w basie kwinta (G)", degrees: [5, 7, 1, 3] },
            { notes: ["Bb4", "C5", "E5", "G5"], label: "sekundakord — w basie septyma (B♭)", degrees: [7, 1, 3, 5] },
          ],
        },
      ],
      exercises: [
        {
          id: "cd-l8-e1",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku C: C-E-G-B♭ (pryma-tercja-kwinta-septyma). Który dźwięk musi wylądować w basie, żeby powstał kwintsekstakord (I przewrót)?",
            hint: "Kwintsekstakord to I przewrót — w basie ląduje tercja.",
            options: ["C", "E", "G", "B♭"],
            correctOptionIndex: 1,
            explanation: "W kwintsekstakordzie (I przewrót) w basie jest tercja akordu — tutaj E.",
          },
        },
        {
          id: "cd-l8-e2",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku C: C-E-G-B♭. Który dźwięk musi wylądować w basie, żeby powstał tercekwartakord (II przewrót)?",
            hint: "Tercekwartakord to II przewrót — w basie ląduje kwinta.",
            options: ["C", "E", "G", "B♭"],
            correctOptionIndex: 2,
            explanation: "W tercekwartakordzie (II przewrót) w basie jest kwinta akordu — tutaj G.",
          },
        },
        {
          id: "cd-l8-e3",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku C: C-E-G-B♭. Który dźwięk musi wylądować w basie, żeby powstał sekundakord (III przewrót)?",
            hint: "Sekundakord to III przewrót — w basie ląduje septyma.",
            options: ["C", "E", "G", "B♭"],
            correctOptionIndex: 3,
            explanation: "W sekundakordzie (III przewrót) w basie jest septyma akordu — tutaj B♭.",
          },
        },
        {
          id: "cd-l8-e4",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku G: G-H-D-F (pryma-tercja-kwinta-septyma). W basie słyszysz H. Jak nazywa się ten przewrót?",
            hint: "H to tercja tego akordu.",
            options: ["postać zasadnicza", "kwintsekstakord", "tercekwartakord", "sekundakord"],
            correctOptionIndex: 1,
            explanation: "H to tercja akordu zbudowanego na G — tercja w basie to kwintsekstakord (I przewrót).",
          },
        },
        {
          id: "cd-l8-e5",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku G: G-H-D-F. W basie słyszysz D. Jak nazywa się ten przewrót?",
            hint: "D to kwinta tego akordu.",
            options: ["postać zasadnicza", "kwintsekstakord", "tercekwartakord", "sekundakord"],
            correctOptionIndex: 2,
            explanation: "D to kwinta akordu zbudowanego na G — kwinta w basie to tercekwartakord (II przewrót).",
          },
        },
        {
          id: "cd-l8-e6",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku G: G-H-D-F. W basie słyszysz F. Jak nazywa się ten przewrót?",
            hint: "F to septyma tego akordu.",
            options: ["postać zasadnicza", "kwintsekstakord", "tercekwartakord", "sekundakord"],
            correctOptionIndex: 3,
            explanation: "F to septyma akordu zbudowanego na G — septyma w basie to sekundakord (III przewrót).",
          },
        },
      ],
    },
    {
      // The reverse direction — every earlier lesson shows/plays a
      // finished inversion and asks to name it; this one gives the NAME
      // (+ root) and asks to pick the correct bottom-to-top spelling
      // from all four orderings of the same four notes. Same idea as
      // Jaskinia Akordów's own lekcja 10.
      id: "cd-poziom-9-zapisz-nuty-przewrotu",
      order: 9,
      difficulty: 4,
      introSlides: [
        {
          body: "Tym razem zamiast rozpoznawać gotowy przewrót, sam go odtworzysz z pamięci — dostaniesz nazwę przewrotu i dźwięk, na którym zbudowano akord, a Ty wskażesz poprawny zapis nut od najniższego dźwięku.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza — C-E-G-B♭", degrees: [1, 3, 5, 7] },
            { notes: ["E4", "G4", "Bb4", "C5"], label: "kwintsekstakord — E-G-B♭-C", degrees: [3, 5, 7, 1] },
            { notes: ["G4", "Bb4", "C5", "E5"], label: "tercekwartakord — G-B♭-C-E", degrees: [5, 7, 1, 3] },
            { notes: ["Bb4", "C5", "E5", "G5"], label: "sekundakord — B♭-C-E-G", degrees: [7, 1, 3, 5] },
          ],
        },
      ],
      exercises: [
        {
          id: "cd-l9-e1",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwintsekstakordu zbudowanego na dźwięku C?",
            hint: "Kwintsekstakord to I przewrót — zaczyna się od tercji akordu.",
            options: ["C-E-G-B♭", "E-G-B♭-C", "G-B♭-C-E", "B♭-C-E-G"],
            correctOptionIndex: 1,
            explanation: "Kwintsekstakord zaczyna się od tercji (E), potem kwinta (G), septyma (B♭), na końcu pryma o oktawę wyżej (C).",
          },
        },
        {
          id: "cd-l9-e2",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty tercekwartakordu zbudowanego na dźwięku C?",
            hint: "Tercekwartakord to II przewrót — zaczyna się od kwinty akordu.",
            options: ["C-E-G-B♭", "E-G-B♭-C", "G-B♭-C-E", "B♭-C-E-G"],
            correctOptionIndex: 2,
            explanation: "Tercekwartakord zaczyna się od kwinty (G), potem septyma (B♭), pryma (C), na końcu tercja o oktawę wyżej (E).",
          },
        },
        {
          id: "cd-l9-e3",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekundakordu zbudowanego na dźwięku C?",
            hint: "Sekundakord to III przewrót — zaczyna się od septymy akordu.",
            options: ["C-E-G-B♭", "E-G-B♭-C", "G-B♭-C-E", "B♭-C-E-G"],
            correctOptionIndex: 3,
            explanation: "Sekundakord zaczyna się od septymy (B♭), potem pryma (C), tercja (E), na końcu kwinta o oktawę wyżej (G).",
          },
        },
        {
          id: "cd-l9-e4",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwintsekstakordu zbudowanego na dźwięku G?",
            hint: "Kwintsekstakord to I przewrót — zaczyna się od tercji akordu.",
            options: ["G-H-D-F", "H-D-F-G", "D-F-G-H", "F-G-H-D"],
            correctOptionIndex: 1,
            explanation: "Kwintsekstakord zaczyna się od tercji (H), potem kwinta (D), septyma (F), na końcu pryma o oktawę wyżej (G).",
          },
        },
        {
          id: "cd-l9-e5",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty tercekwartakordu zbudowanego na dźwięku G?",
            hint: "Tercekwartakord to II przewrót — zaczyna się od kwinty akordu.",
            options: ["G-H-D-F", "H-D-F-G", "D-F-G-H", "F-G-H-D"],
            correctOptionIndex: 2,
            explanation: "Tercekwartakord zaczyna się od kwinty (D), potem septyma (F), pryma (G), na końcu tercja o oktawę wyżej (H).",
          },
        },
        {
          id: "cd-l9-e6",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekundakordu zbudowanego na dźwięku G?",
            hint: "Sekundakord to III przewrót — zaczyna się od septymy akordu.",
            options: ["G-H-D-F", "H-D-F-G", "D-F-G-H", "F-G-H-D"],
            correctOptionIndex: 3,
            explanation: "Sekundakord zaczyna się od septymy (F), potem pryma (G), tercja (H), na końcu kwinta o oktawę wyżej (D).",
          },
        },
      ],
    },
    {
      // Same two structural skills as lekcje 8-9 (which note is in the
      // bass, reverse-direction spelling), practiced on two roots
      // neither lesson has used yet (F, D) — more practice on the same
      // skill, not a new one, the same "more keys" step Jaskinia
      // Akordów's own lekcja 11 takes.
      id: "cd-poziom-10-wiecej-tonacji",
      order: 10,
      difficulty: 5,
      introSlides: [
        {
          body: "Te same dwie sztuczki co w poprzednich lekcjach — który dźwięk ląduje w basie i odtwarzanie zapisu nut z pamięci — tym razem na dwóch nowych dźwiękach podstawowych: F i D.",
          triadExamples: [
            { notes: ["F4", "A4", "C5", "Eb5"], label: "dominanta septymowa na F — F-A-C-Es", degrees: [1, 3, 5, 7] },
            { notes: ["D4", "F#4", "A4", "C5"], label: "dominanta septymowa na D — D-Fis-A-C", degrees: [1, 3, 5, 7] },
          ],
        },
      ],
      exercises: [
        {
          id: "cd-l10-e1",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku F: F-A-C-Es (pryma-tercja-kwinta-septyma). Który dźwięk musi wylądować w basie, żeby powstał kwintsekstakord (I przewrót)?",
            hint: "Kwintsekstakord to I przewrót — w basie ląduje tercja.",
            options: ["F", "A", "C", "Es"],
            correctOptionIndex: 1,
            explanation: "W kwintsekstakordzie w basie jest tercja akordu — tutaj A.",
          },
        },
        {
          id: "cd-l10-e2",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekundakordu zbudowanego na dźwięku F?",
            hint: "Sekundakord to III przewrót — zaczyna się od septymy akordu.",
            options: ["F-A-C-Es", "A-C-Es-F", "C-Es-F-A", "Es-F-A-C"],
            correctOptionIndex: 3,
            explanation: "Sekundakord zaczyna się od septymy (Es), potem pryma (F), tercja (A), na końcu kwinta o oktawę wyżej (C).",
          },
        },
        {
          id: "cd-l10-e3",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku F: F-A-C-Es. Który dźwięk musi wylądować w basie, żeby powstał tercekwartakord (II przewrót)?",
            hint: "Tercekwartakord to II przewrót — w basie ląduje kwinta.",
            options: ["F", "A", "C", "Es"],
            correctOptionIndex: 2,
            explanation: "W tercekwartakordzie w basie jest kwinta akordu — tutaj C.",
          },
        },
        {
          id: "cd-l10-e4",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku D: D-Fis-A-C (pryma-tercja-kwinta-septyma). Który dźwięk musi wylądować w basie, żeby powstał sekundakord (III przewrót)?",
            hint: "Sekundakord to III przewrót — w basie ląduje septyma.",
            options: ["D", "Fis", "A", "C"],
            correctOptionIndex: 3,
            explanation: "W sekundakordzie w basie jest septyma akordu — tutaj C.",
          },
        },
        {
          id: "cd-l10-e5",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwintsekstakordu zbudowanego na dźwięku D?",
            hint: "Kwintsekstakord to I przewrót — zaczyna się od tercji akordu.",
            options: ["D-Fis-A-C", "Fis-A-C-D", "A-C-D-Fis", "C-D-Fis-A"],
            correctOptionIndex: 1,
            explanation: "Kwintsekstakord zaczyna się od tercji (Fis), potem kwinta (A), septyma (C), na końcu pryma o oktawę wyżej (D).",
          },
        },
        {
          id: "cd-l10-e6",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku D: D-Fis-A-C. Który dźwięk musi wylądować w basie, żeby powstał tercekwartakord (II przewrót)?",
            hint: "Tercekwartakord to II przewrót — w basie ląduje kwinta.",
            options: ["D", "Fis", "A", "C"],
            correctOptionIndex: 2,
            explanation: "W tercekwartakordzie w basie jest kwinta akordu — tutaj A.",
          },
        },
      ],
    },
    {
      // This world's own version of Jaskinia Akordów's triad-inversion-
      // sequence-choice — two fresh dominant seventh chords play back to
      // back, each still a normal simultaneous 4-note chord, and both
      // inversions need naming. Narrow pool (root/kwintsekstakord only)
      // here on purpose: holding two full 4-note chords in memory at
      // once is the new difficulty, not also facing all four postacie.
      id: "cd-poziom-11-dwa-akordy",
      order: 11,
      difficulty: 5,
      introSlides: [
        {
          body: "Teraz usłyszysz dwie dominanty septymowe pod rząd, jedna zaraz po drugiej — każda brzmi normalnie, jako cztery dźwięki naraz. Twoje zadanie to nazwać postać OBU, każdą osobno, w swoim okienku.",
          triadExamples: [
            { notes: ["C4", "E4", "G4", "Bb4"], label: "postać zasadnicza", degrees: [1, 3, 5, 7] },
            { notes: ["E4", "G4", "Bb4", "C5"], label: "kwintsekstakord", degrees: [3, 5, 7, 1] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l11-e1", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l11-e2", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l11-e3", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l11-e4", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l11-e5", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l11-e6", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
      ],
    },
    {
      // Lekcja 11, all four postacie instead of just root/kwintsekstakord
      // — same "narrow → full" step Jaskinia Akordów's own lekcja 12→13
      // already takes.
      id: "cd-poziom-12-dwa-akordy-pelny-zakres",
      order: 12,
      difficulty: 5,
      introSlides: [
        {
          body: "Ten sam pomysł co w poprzedniej lekcji, ale teraz mogą pojawić się WSZYSTKIE postacie — nie tylko postać zasadnicza i kwintsekstakord, ale też tercekwartakord i sekundakord.",
          triadExamples: [
            { notes: ["G4", "Bb4", "C5", "E5"], label: "tercekwartakord", degrees: [5, 7, 1, 3] },
            { notes: ["Bb4", "C5", "E5", "G5"], label: "sekundakord", degrees: [7, 1, 3, 5] },
          ],
        },
      ],
      exercises: [
        { id: "cd-l12-e1", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        { id: "cd-l12-e2", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        { id: "cd-l12-e3", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        { id: "cd-l12-e4", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        { id: "cd-l12-e5", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        { id: "cd-l12-e6", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
      ],
    },
    {
      // Three in a row instead of two — back to the narrow root/
      // kwintsekstakord pool (like lekcja 11), since adding a third
      // position is already a meaningfully bigger memory load on its own.
      id: "cd-poziom-13-trzy-akordy",
      order: 13,
      difficulty: 5,
      introSlides: [
        {
          body: "Trzy dominanty septymowe pod rząd zamiast dwóch — jeszcze więcej do zapamiętania, zanim zdążysz odpowiedzieć na pierwsze pytanie.",
        },
      ],
      exercises: [
        { id: "cd-l13-e1", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l13-e2", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l13-e3", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l13-e4", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l13-e5", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
        { id: "cd-l13-e6", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"], allowedInversions: ["root", "first"] } },
      ],
    },
    {
      // The capstone of this whole "sequence" idea — three in a row, all
      // four postacie. Same step as lekcja 12 took after lekcja 11.
      id: "cd-poziom-14-trzy-akordy-pelny-zakres",
      order: 14,
      difficulty: 5,
      introSlides: [
        {
          body: "Trzy dominanty septymowe, wszystkie postacie — najtrudniejsza wersja tego ćwiczenia. Wszystko, czego się nauczyłeś o rozpoznawaniu przewrotów dominanty septymowej, naraz.",
        },
      ],
      exercises: [
        { id: "cd-l14-e1", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        { id: "cd-l14-e2", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        { id: "cd-l14-e3", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        { id: "cd-l14-e4", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        { id: "cd-l14-e5", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        { id: "cd-l14-e6", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
      ],
    },
    {
      // Boss lekcja — Rycerz Dominik V. Jak Arytmik/Ośmiotakt/Oktawiusz/
      // Trójgłos/Akordeon: mix ćwiczeń REUSED z wcześniejszych lekcji tej
      // krainy (część specs skopiowana dosłownie) zamiast świeżo pisanej
      // treści — rozpoznawanie ze słuchu (zwykłe i w szerszym rejestrze),
      // struktura (który dźwięk w basie, zapis nut, więcej tonacji) i
      // sekwencje przewrotów.
      id: "cd-poziom-15-boss-dominik",
      order: 15,
      difficulty: 5,
      isBoss: true,
      bossName: "Dominik",
      introSlides: [
        {
          body: "Rycerz Dominik V strzeże wyjścia z Cytadeli Dominant — jego tarcza nosi rzymskie V, a proporzec V⁷. Wiecznie czeka w pozie napięcia na rozwiązanie, które nie nadchodzi. Zna każdy przewrót dominanty septymowej: ze słuchu, z zapisu i w sekwencjach. Żeby go pokonać, pokaż, że opanowałeś je wszystkie.",
          bossPortrait: true,
        },
      ],
      exercises: [
        { id: "cd-l15-e1", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l15-e2", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C3", "E4"], hideNotation: true } },
        {
          id: "cd-l15-e3",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku C: C-E-G-B♭ (pryma-tercja-kwinta-septyma). Który dźwięk musi wylądować w basie, żeby powstał kwintsekstakord (I przewrót)?",
            hint: "Kwintsekstakord to I przewrót — w basie ląduje tercja.",
            options: ["C", "E", "G", "B♭"],
            correctOptionIndex: 1,
            explanation: "W kwintsekstakordzie (I przewrót) w basie jest tercja akordu — tutaj E.",
          },
        },
        { id: "cd-l15-e4", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 2, noteRange: ["C4", "E4"] } },
        {
          id: "cd-l15-e5",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwintsekstakordu zbudowanego na dźwięku C?",
            hint: "Kwintsekstakord to I przewrót — zaczyna się od tercji akordu.",
            options: ["C-E-G-B♭", "E-G-B♭-C", "G-B♭-C-E", "B♭-C-E-G"],
            correctOptionIndex: 1,
            explanation: "Kwintsekstakord zaczyna się od tercji (E), potem kwinta (G), septyma (B♭), na końcu pryma o oktawę wyżej (C).",
          },
        },
        { id: "cd-l15-e6", type: "dominant-seventh-inversion-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-choice", noteRange: ["C4", "E4"], hideNotation: true } },
        { id: "cd-l15-e7", type: "dominant-seventh-inversion-sequence-choice", difficulty: 5, spec: { type: "dominant-seventh-inversion-sequence-choice", sequenceLength: 3, noteRange: ["C4", "E4"] } },
        {
          id: "cd-l15-e8",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz dominantę septymową zbudowaną na dźwięku F: F-A-C-Es (pryma-tercja-kwinta-septyma). Który dźwięk musi wylądować w basie, żeby powstał kwintsekstakord (I przewrót)?",
            hint: "Kwintsekstakord to I przewrót — w basie ląduje tercja.",
            options: ["F", "A", "C", "Es"],
            correctOptionIndex: 1,
            explanation: "W kwintsekstakordzie w basie jest tercja akordu — tutaj A.",
          },
        },
      ],
    },
  ],
};
