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
 *
 * Lekcje 7-8 extend this further. Lekcja 7 widens noteRange to ["C3","G4"]
 * — a full octave lower than every earlier lesson's ["C4","G4"] — the same
 * "wide register" step Zatoka Trójdźwięków's own lekcja 9 and Pasmo
 * Interwałów's lekcja 10 already take for their own topics. This is safe
 * against the ceiling concern the doc above raises: inversions only ever
 * push notes UP relative to the bass, so lowering the noteRange's floor
 * only makes the worst case (root=G3, major, second inversion) LOWER
 * (B4), never closer to the NOTE_SAMPLES ceiling — the octave-shift
 * fallback in resolveSample (lib/audio/player.ts) covers any note without
 * its own sample regardless. Lekcja 8 takes a structural, not ear-
 * training, angle on the same inversion concept — same idea as Zatoka
 * Trójdźwięków's own lekcja 8 (triad-fact-choice reasoning about WHICH
 * note changes/moves), applied here to "which note lands in the bass for
 * a given inversion" instead of "which note changes for a given quality".
 * Lekcje 9-10 stay structural too, but each teaches a DIFFERENT skill than
 * lekcja 8's own "which note is in the bass": lekcja 9 drills the
 * interval-counting shortcut lekcja 2's own intro slide already mentions
 * in passing (third-then-fourth = sekstakord, fourth-then-third =
 * kwartsekstakord, third-then-third = postać zasadnicza) as its own
 * dedicated exercise set; lekcja 10 reverses the direction entirely —
 * every earlier lesson shows/plays a finished inversion and asks to name
 * it, this one gives the NAME (+key) and asks to pick the correct
 * bottom-to-top spelling from three orderings of the same three notes.
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
    {
      // Same recognition task as lekcja 5, one octave lower on the floor
      // (["C3","G4"] instead of ["C4","G4"]) — see this file's own top
      // doc for why this stays safely under the sample ceiling. Ear-only
      // throughout, mixed qualities/inversions from the start (this isn't
      // teaching a new concept, just generalizing the existing one to a
      // register nothing earlier in this world has used).
      id: "ja-poziom-7-nizszy-rejestr",
      order: 7,
      difficulty: 5,
      introSlides: [
        {
          body: "Ten sam trening co wcześniej, ale w szerszym, niższym rejestrze — od C3. Ten sam przewrót brzmi inaczej nisko niż w dotychczasowym zakresie, ale to wciąż ten sam przewrót. Ucho musi go rozpoznać niezależnie od tego, gdzie w skali akurat gra.",
        },
      ],
      exercises: [
        { id: "ja-l7-e1", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e2", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e3", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e4", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e5", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e6", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
        { id: "ja-l7-e7", type: "triad-inversion-choice", difficulty: 5, spec: { type: "triad-inversion-choice", noteRange: ["C3", "G4"], hideNotation: true } },
      ],
    },
    {
      // A structural, not ear-training, angle on the same inversion
      // concept — same idea as Zatoka Trójdźwięków's own lekcja 8
      // (triad-fact-choice reasoning about a triad's structure), applied
      // here to "which note lands in the bass for a given inversion"
      // (and its reverse: "given this bass note, name the inversion").
      id: "ja-poziom-8-ktory-dzwiek-w-basie",
      order: 8,
      difficulty: 4,
      introSlides: [
        {
          body: "Każdy przewrót to inny dźwięk trójdźwięku w basie: w postaci zasadniczej — pryma, w sekstakordzie — tercja, w kwartsekstakordzie — kwinta. W tej lekcji zobaczysz trójdźwięk w postaci zasadniczej i będziesz szukać, który dźwięk musi wylądować w basie, żeby powstał dany przewrót — albo odwrotnie: mając dany bas, nazwiesz przewrót.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "postać zasadnicza — w basie pryma (C)", degrees: [1, 3, 5] },
            { notes: ["E4", "G4", "C5"], label: "sekstakord — w basie tercja (E)", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "E5"], label: "kwartsekstakord — w basie kwinta (G)", degrees: [5, 1, 3] },
          ],
        },
      ],
      exercises: [
        {
          id: "ja-l8-e1",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk C-dur w postaci zasadniczej: C-E-G. Który dźwięk musi wylądować w basie, żeby powstał sekstakord?",
            hint: "Sekstakord to I przewrót — w basie ląduje tercja.",
            options: ["C", "E", "G"],
            correctOptionIndex: 1,
            explanation: "W sekstakordzie (I przewrót) w basie jest tercja trójdźwięku — tutaj E.",
            notationNotes: ["C4", "E4", "G4"],
          },
        },
        {
          id: "ja-l8-e2",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk C-dur w postaci zasadniczej: C-E-G. Który dźwięk musi wylądować w basie, żeby powstał kwartsekstakord?",
            hint: "Kwartsekstakord to II przewrót — w basie ląduje kwinta.",
            options: ["C", "E", "G"],
            correctOptionIndex: 2,
            explanation: "W kwartsekstakordzie (II przewrót) w basie jest kwinta trójdźwięku — tutaj G.",
            notationNotes: ["C4", "E4", "G4"],
          },
        },
        {
          id: "ja-l8-e3",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk d-moll w postaci zasadniczej: D-F-A. W basie słyszysz F. Jak nazywa się ten przewrót?",
            hint: "F to środkowy dźwięk trójdźwięku — tercja.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 1,
            explanation: "F to tercja trójdźwięku d-moll — tercja w basie to sekstakord (I przewrót).",
            notationNotes: ["D4", "F4", "A4"],
          },
        },
        {
          id: "ja-l8-e4",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk d-moll w postaci zasadniczej: D-F-A. W basie słyszysz A. Jak nazywa się ten przewrót?",
            hint: "A to górny dźwięk trójdźwięku — kwinta.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 2,
            explanation: "A to kwinta trójdźwięku d-moll — kwinta w basie to kwartsekstakord (II przewrót).",
            notationNotes: ["D4", "F4", "A4"],
          },
        },
        {
          id: "ja-l8-e5",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Słyszysz sekstakord zbudowany z trójdźwięku G-dur (G-H-D — pryma G, tercja H, kwinta D). Jaki dźwięk jest teraz w basie?",
            hint: "Sekstakord to I przewrót — w basie ląduje tercja.",
            options: ["G", "H", "D"],
            correctOptionIndex: 1,
            explanation: "W sekstakordzie w basie jest tercja — dla G-dur to H.",
            notationNotes: ["G4", "B4", "D5"],
          },
        },
        {
          id: "ja-l8-e6",
          type: "triad-fact-choice",
          difficulty: 5,
          spec: {
            type: "triad-fact-choice",
            prompt: "Słyszysz kwartsekstakord zbudowany z trójdźwięku G-dur (G-H-D). Jaki dźwięk jest teraz w basie?",
            hint: "Kwartsekstakord to II przewrót — w basie ląduje kwinta.",
            options: ["G", "H", "D"],
            correctOptionIndex: 2,
            explanation: "W kwartsekstakordzie w basie jest kwinta — dla G-dur to D.",
            notationNotes: ["G4", "B4", "D5"],
          },
        },
      ],
    },
    {
      // Drills the interval-counting shortcut lekcja 2's own intro slide
      // mentions but never gets its own dedicated exercise: third-then-
      // fourth = sekstakord, fourth-then-third = kwartsekstakord, third-
      // then-third = postać zasadnicza — regardless of key or major/minor
      // quality. Abstract questions first (just the two distances), then
      // the same reasoning applied to a concrete written triad.
      id: "ja-poziom-9-odczytaj-z-odleglosci",
      order: 9,
      difficulty: 3,
      introSlides: [
        {
          body: "Jest jeszcze jeden sposób na rozpoznanie przewrotu — policzyć odległości między sąsiednimi dźwiękami, licząc od basu w górę. Tercja i tercja (3 lub 4 półtony, potem znów 3 lub 4) to postać zasadnicza. Tercja, a potem kwarta — sekstakord. Kwarta, a potem tercja — kwartsekstakord. Ta zasada działa zawsze, niezależnie od tonacji.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "tercja + tercja → postać zasadnicza", degrees: [1, 3, 5] },
            { notes: ["E4", "G4", "C5"], label: "tercja + kwarta → sekstakord", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "E5"], label: "kwarta + tercja → kwartsekstakord", degrees: [5, 1, 3] },
          ],
        },
      ],
      exercises: [
        {
          id: "ja-l9-e1",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "W trójdźwięku dolna odległość (od basu do środkowego dźwięku) to 4 półtony, a górna (od środkowego do najwyższego) to 5 półtonów. Jaka to postać?",
            hint: "4 półtony to tercja, 5 półtonów to kwarta — tercja na dole.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 1,
            explanation: "Tercja na dole (4 półtony) i kwarta na górze (5 półtonów) — tak wygląda sekstakord (I przewrót), niezależnie od tonacji.",
          },
        },
        {
          id: "ja-l9-e2",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Dolna odległość to 5 półtonów, a górna to 3 półtony. Jaka to postać?",
            hint: "5 półtonów to kwarta — kwarta na dole.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 2,
            explanation: "Kwarta na dole (5 półtonów) — tak wygląda kwartsekstakord (II przewrót), niezależnie od tonacji.",
          },
        },
        {
          id: "ja-l9-e3",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Dolna odległość to 3 półtony, a górna to 4 półtony. Jaka to postać?",
            hint: "Obie odległości to tercje (3 i 4 półtony) — żadna nie jest kwartą.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 0,
            explanation: "Dwie tercje jedna nad drugą (3 i 4 półtony) — to zawsze postać zasadnicza.",
          },
        },
        {
          id: "ja-l9-e4",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk zapisany jako D-G-H. Odległość D-G to kwarta, G-H to tercja. Jaka to postać?",
            hint: "Kwarta na dole — szukaj kwartsekstakordu.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 2,
            explanation: "Kwarta na dole (D-G) — to kwartsekstakord (II przewrót) trójdźwięku G-dur.",
            notationNotes: ["D4", "G4", "B4"],
          },
        },
        {
          id: "ja-l9-e5",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk zapisany jako F-A-D. Odległość F-A to tercja, A-D to kwarta. Jaka to postać?",
            hint: "Tercja na dole — szukaj sekstakordu.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 1,
            explanation: "Tercja na dole (F-A) — to sekstakord (I przewrót) trójdźwięku d-moll.",
            notationNotes: ["F4", "A4", "D5"],
          },
        },
        {
          id: "ja-l9-e6",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk zapisany jako E-G-H. Odległość E-G to tercja, G-H to tercja. Jaka to postać?",
            hint: "Dwie tercje — szukaj postaci zasadniczej.",
            options: ["postać zasadnicza", "sekstakord", "kwartsekstakord"],
            correctOptionIndex: 0,
            explanation: "Dwie tercje jedna nad drugą (E-G, G-H) — to postać zasadnicza trójdźwięku e-moll.",
            notationNotes: ["E4", "G4", "B4"],
          },
        },
      ],
    },
    {
      // The reverse direction — every earlier lesson shows/plays a
      // finished inversion and asks to name it; this one gives the NAME
      // (+ key) and asks to pick the correct bottom-to-top spelling from
      // three orderings of the same three notes. Same three keys as
      // lekcja 9's own concrete examples (C-dur, d-moll, G-dur), two
      // questions each (sekstakord, then kwartsekstakord).
      id: "ja-poziom-10-zapisz-nuty-przewrotu",
      order: 10,
      difficulty: 4,
      introSlides: [
        {
          body: "Tym razem zamiast rozpoznawać gotowy przewrót, sam go odtworzysz z pamięci — dostaniesz nazwę przewrotu i tonację, a Ty wskażesz poprawny zapis nut od najniższego dźwięku.",
        },
      ],
      exercises: [
        {
          id: "ja-l10-e1",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekstakordu C-dur?",
            hint: "Sekstakord to I przewrót — zaczyna się od tercji trójdźwięku.",
            options: ["C-E-G", "E-G-C", "G-C-E"],
            correctOptionIndex: 1,
            explanation: "Sekstakord C-dur zaczyna się od tercji (E), potem kwinta (G), na końcu pryma o oktawę wyżej (C).",
            notationNotes: ["C4", "E4", "G4"],
          },
        },
        {
          id: "ja-l10-e2",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwartsekstakordu C-dur?",
            hint: "Kwartsekstakord to II przewrót — zaczyna się od kwinty trójdźwięku.",
            options: ["C-E-G", "E-G-C", "G-C-E"],
            correctOptionIndex: 2,
            explanation: "Kwartsekstakord C-dur zaczyna się od kwinty (G), potem pryma (C), na końcu tercja o oktawę wyżej (E).",
            notationNotes: ["C4", "E4", "G4"],
          },
        },
        {
          id: "ja-l10-e3",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekstakordu d-moll?",
            hint: "Sekstakord to I przewrót — zaczyna się od tercji trójdźwięku.",
            options: ["D-F-A", "F-A-D", "A-D-F"],
            correctOptionIndex: 1,
            explanation: "Sekstakord d-moll zaczyna się od tercji (F), potem kwinta (A), na końcu pryma o oktawę wyżej (D).",
            notationNotes: ["D4", "F4", "A4"],
          },
        },
        {
          id: "ja-l10-e4",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwartsekstakordu d-moll?",
            hint: "Kwartsekstakord to II przewrót — zaczyna się od kwinty trójdźwięku.",
            options: ["D-F-A", "F-A-D", "A-D-F"],
            correctOptionIndex: 2,
            explanation: "Kwartsekstakord d-moll zaczyna się od kwinty (A), potem pryma (D), na końcu tercja o oktawę wyżej (F).",
            notationNotes: ["D4", "F4", "A4"],
          },
        },
        {
          id: "ja-l10-e5",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty sekstakordu G-dur?",
            hint: "Sekstakord to I przewrót — zaczyna się od tercji trójdźwięku.",
            options: ["G-H-D", "H-D-G", "D-G-H"],
            correctOptionIndex: 1,
            explanation: "Sekstakord G-dur zaczyna się od tercji (H), potem kwinta (D), na końcu pryma o oktawę wyżej (G).",
            notationNotes: ["G4", "B4", "D5"],
          },
        },
        {
          id: "ja-l10-e6",
          type: "triad-fact-choice",
          difficulty: 4,
          spec: {
            type: "triad-fact-choice",
            prompt: "Jak zapisane są (od najniższego dźwięku) nuty kwartsekstakordu G-dur?",
            hint: "Kwartsekstakord to II przewrót — zaczyna się od kwinty trójdźwięku.",
            options: ["G-H-D", "H-D-G", "D-G-H"],
            correctOptionIndex: 2,
            explanation: "Kwartsekstakord G-dur zaczyna się od kwinty (D), potem pryma (G), na końcu tercja o oktawę wyżej (H).",
            notationNotes: ["G4", "B4", "D5"],
          },
        },
      ],
    },
  ],
};
