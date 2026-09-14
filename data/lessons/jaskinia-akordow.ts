import type { WorldContent } from "@/types/exercises";

/**
 * "Jaskinia Akordów" — a new world (not ported from the web app), built on
 * the same pattern as Zatoka Trójdźwięków: teaches triad INVERSIONS
 * (przewroty) for the two qualities that world already covers as fully
 * consonant, stable chords — durowy (major) and molowy (minor). Sekstakord
 * (I przewrót) puts the third in the bass; kwartsekstakord (II przewrót)
 * puts the fifth in the bass — see lib/music/triads.ts's own
 * getTriadInversionNotes/getTriadInversionName.
 *
 * `noteRange` for every triad-inversion-choice exercise here is
 * deliberately narrower than triad-quality-choice's own ["C4","C5"]
 * (Zatoka Trójdźwięków's convention) — second inversion shifts BOTH the
 * root and third up a full octave above the bass, so a root near the top
 * of a C4-C5 range could push a major third all the way to D#6, past this
 * app's NOTE_SAMPLES ceiling (C6). ["C4","G4"] keeps the worst case
 * (root=G4, major quality) at B5 — safely inside sample coverage. Verified
 * by hand for both major and minor qualities before authoring any content
 * against it.
 *
 * Final lesson mixes triad-quality-choice (Zatoka's own type, root
 * position, all 4 qualities) with this world's own triad-inversion-choice
 * (major/minor, all 3 inversions) — a combined recall of both worlds'
 * skills, per the world's own design brief.
 */
export const JASKINIA_AKORDOW_CONTENT: WorldContent = {
  worldId: "jaskinia-akordow",
  lessons: [
    {
      id: "ja-poziom-1-sekstakord",
      order: 1,
      difficulty: 3,
      introSlides: [
        {
          body: "Trójdźwięk nie zawsze stoi na tercjach jeden nad drugim od dźwięku podstawowego — można go 'przewrócić', czyli przełożyć dolny dźwięk o oktawę wyżej. Gdy w basie (na dole) znajdzie się tercja zamiast prymy, to sekstakord — pierwszy przewrót. Brzmi tak samo 'jasno' albo 'smutno' jak postać zasadnicza (to wciąż ten sam trójdźwięk), ale wygląda inaczej na pięciolinii.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy, postać zasadnicza (3+3>)", degrees: [1, 3, 5] },
            { notes: ["E4", "G4", "C5"], label: "durowy, sekstakord (I przewrót)", degrees: [3, 5, 1] },
            { notes: ["C4", "Eb4", "G4"], label: "molowy, postać zasadnicza (3>+3)", degrees: [1, 3, 5] },
            { notes: ["Eb4", "G4", "C5"], label: "molowy, sekstakord (I przewrót)", degrees: [3, 5, 1] },
          ],
        },
        {
          body: "Skrót: w sekstakordzie tercja trójdźwięku ląduje na dole, a dźwięk podstawowy (pryma) przenosi się na sam szczyt, o oktawę wyżej. Kwinta zostaje w środku, bez zmian.",
        },
      ],
      exercises: [
        { id: "ja-l1-e1", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
        { id: "ja-l1-e2", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
        { id: "ja-l1-e3", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
        { id: "ja-l1-e4", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
        { id: "ja-l1-e5", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
        { id: "ja-l1-e6", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "first"] } },
      ],
    },
    {
      id: "ja-poziom-2-kwartsekstakord",
      order: 2,
      difficulty: 3,
      introSlides: [
        {
          body: "Drugi przewrót to kwartsekstakord: w basie ląduje kwinta trójdźwięku, a pryma i tercja przenoszą się o oktawę wyżej, zachowując swoją kolejność (pryma niżej, tercja na szczycie).",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy, postać zasadnicza (3+3>)", degrees: [1, 3, 5] },
            { notes: ["G4", "C5", "E5"], label: "durowy, kwartsekstakord (II przewrót)", degrees: [5, 1, 3] },
            { notes: ["C4", "Eb4", "G4"], label: "molowy, postać zasadnicza (3>+3)", degrees: [1, 3, 5] },
            { notes: ["G4", "C5", "Eb5"], label: "molowy, kwartsekstakord (II przewrót)", degrees: [5, 1, 3] },
          ],
        },
        {
          body: "Rozpoznawanie: policz odległość od najniższego dźwięku do najbliższego kolejnego — jeśli to kwarta (4 dźwięki), masz kwartsekstakord. Jeśli tercja — sekstakord. Jeśli oba przedziały to tercje — postać zasadnicza.",
        },
      ],
      exercises: [
        { id: "ja-l2-e1", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
        { id: "ja-l2-e2", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
        { id: "ja-l2-e3", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
        { id: "ja-l2-e4", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
        { id: "ja-l2-e5", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
        { id: "ja-l2-e6", type: "triad-inversion-choice", difficulty: 3, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedInversions: ["root", "second"] } },
      ],
    },
    {
      id: "ja-poziom-3-trzy-postacie-durowe",
      order: 3,
      difficulty: 4,
      introSlides: [
        {
          body: "Teraz wszystkie trzy postacie na raz, ale tylko trójdźwięki durowe: postać zasadnicza, sekstakord i kwartsekstakord — te same trzy dźwięki, przełożone na trzy różne sposoby.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "postać zasadnicza (3+3>)", degrees: [1, 3, 5] },
            { notes: ["E4", "G4", "C5"], label: "sekstakord (I przewrót)", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "E5"], label: "kwartsekstakord (II przewrót)", degrees: [5, 1, 3] },
          ],
        },
      ],
      exercises: [
        { id: "ja-l3-e1", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"] } },
        { id: "ja-l3-e2", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"] } },
        { id: "ja-l3-e3", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"] } },
        { id: "ja-l3-e4", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"] } },
        { id: "ja-l3-e5", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"], hideNotation: true } },
        { id: "ja-l3-e6", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["major"], hideNotation: true } },
      ],
    },
    {
      id: "ja-poziom-4-trzy-postacie-molowe",
      order: 4,
      difficulty: 4,
      introSlides: [
        {
          body: "To samo, tylko dla trójdźwięków molowych: postać zasadnicza, sekstakord i kwartsekstakord.",
          triadExamples: [
            { notes: ["C4", "Eb4", "G4"], label: "postać zasadnicza (3>+3)", degrees: [1, 3, 5] },
            { notes: ["Eb4", "G4", "C5"], label: "sekstakord (I przewrót)", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "Eb5"], label: "kwartsekstakord (II przewrót)", degrees: [5, 1, 3] },
          ],
        },
      ],
      exercises: [
        { id: "ja-l4-e1", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"] } },
        { id: "ja-l4-e2", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"] } },
        { id: "ja-l4-e3", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"] } },
        { id: "ja-l4-e4", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"] } },
        { id: "ja-l4-e5", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"], hideNotation: true } },
        { id: "ja-l4-e6", type: "triad-inversion-choice", difficulty: 4, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], allowedQualities: ["minor"], hideNotation: true } },
      ],
    },
    {
      id: "ja-poziom-5-durowe-i-molowe-razem",
      order: 5,
      difficulty: 5,
      introSlides: [
        {
          body: "Teraz durowe i molowe wymieszane, w dowolnej z trzech postaci — dokładnie tak, jak będą się zdarzać w prawdziwej muzyce.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy, postać zasadnicza", degrees: [1, 3, 5] },
            { notes: ["Eb4", "G4", "C5"], label: "molowy, sekstakord", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "E5"], label: "durowy, kwartsekstakord", degrees: [5, 1, 3] },
          ],
        },
      ],
      exercises: [
        { id: "ja-l5-e1", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l5-e2", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l5-e3", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l5-e4", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l5-e5", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l5-e6", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], hideNotation: true } },
        { id: "ja-l5-e7", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], hideNotation: true } },
        { id: "ja-l5-e8", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], hideNotation: true } },
      ],
    },
    {
      id: "ja-poziom-6-podsumowanie",
      order: 6,
      difficulty: 5,
      introSlides: [
        {
          body: "Podsumowanie: wszystkie trójdźwięki poznane do tej pory. Czasem zapytamy o RODZAJ trójdźwięku (durowy, molowy, zmniejszony, zwiększony — wiedza z Zatoki Trójdźwięków, zawsze w postaci zasadniczej), a czasem o POSTAĆ, w jakiej stoi trójdźwięk durowy lub molowy (postać zasadnicza, sekstakord, kwartsekstakord — wiedza z Jaskini Akordów).",
        },
      ],
      exercises: [
        { id: "ja-l6-e1", type: "triad-quality-choice", difficulty: 5, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
        { id: "ja-l6-e2", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l6-e3", type: "triad-quality-choice", difficulty: 5, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
        { id: "ja-l6-e4", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"] } },
        { id: "ja-l6-e5", type: "triad-quality-choice", difficulty: 5, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], hideNotation: true } },
        { id: "ja-l6-e6", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], hideNotation: true } },
        { id: "ja-l6-e7", type: "triad-quality-choice", difficulty: 5, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], hideNotation: true } },
        { id: "ja-l6-e8", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C4", "G4"], hideNotation: true } },
      ],
    },
  ],
};
