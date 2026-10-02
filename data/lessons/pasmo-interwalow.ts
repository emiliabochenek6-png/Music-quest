import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/pasmo-interwalow.json —
 * originally the same 8 lessons/47 exercises, restructured to fit this
 * app's own WorldContent/LessonDefinition/ExerciseDefinition shape
 * (types/exercises.ts). Both exercise types (interval-name-choice,
 * interval-timed-test) are new to this port — see
 * components/exercises/{IntervalNameChoice,IntervalTimedTest}Exercise.tsx,
 * lib/music/intervals.ts (interval math, ported near-verbatim from the
 * web app on top of this app's own lib/music/notes.ts primitives), and
 * lib/questions/intervalTimedTest.ts (level 8's pass-bar scoring). Every
 * exercise here uses the "random mode" spec shape (allowedSemitones +
 * noteRange) — the web app's alternate fixed-`notes` authoring mode is
 * never used by this world's content, so it isn't carried over (see
 * ExerciseSpec's own "interval-name-choice" variant in types/exercises.ts).
 * Lekcje 15-19 extend interval-name-choice/interval-sequence-choice with
 * `harmonic: true` — both notes of an interval start together as one
 * "dwudźwięk" (see playHarmonicInterval in lib/audio/player.ts) instead of
 * one after another. Lekcja 20 is this world's own boss level (Olbrzym
 * Oktawiusz), mixing exercises reused verbatim from earlier lekcje — same
 * pattern as Miasto Rytmu's Arytmik and Przystań Taktów's Ośmiotakt.
 */
export const PASMO_INTERWALOW_CONTENT: WorldContent = {
  worldId: "pasmo-interwalow",
  lessons: [
    {
      id: "pi-poziom-1-sekundy",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Interwał to odległość między dwoma dźwiękami, liczona w półtonach. Sekunda mała to jeden półton — najmniejsza odległość, jaka istnieje, jak dwa sąsiednie klawisze fortepianu. Sekunda wielka to dwa półtony. Posłuchaj uważnie różnicy między tymi dwoma najmniejszymi interwałami.",
          intervalExamples: [
            { notes: ["C4", "D4"], label: "sekunda wielka (2)" },
            { notes: ["B3", "C4"], label: "sekunda mała (2>)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l1-e1", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
        { id: "pi-l1-e2", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
        { id: "pi-l1-e3", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
        { id: "pi-l1-e4", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
        { id: "pi-l1-e5", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
        { id: "pi-l1-e6", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [1, 2], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      id: "pi-poziom-2-tercje",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Tercja mała to trzy półtony, tercja wielka — cztery. Te interwały budują akordy: tercja mała brzmi ciemniej i bardziej melancholijnie, tercja wielka — jaśniej i pogodniej.",
          intervalExamples: [
            { notes: ["D4", "F4"], label: "tercja mała (3>) — jak „Czerwone jabłuszko”" },
            { notes: ["C4", "E4"], label: "tercja wielka (3) — jak „Stary niedźwiedź mocno śpi”" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l2-e1", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l2-e2", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l2-e3", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l2-e4", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l2-e5", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l2-e6", type: "interval-name-choice", difficulty: 1, spec: { type: "interval-name-choice", allowedSemitones: [3, 4], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      id: "pi-poziom-3-sekundy-i-tercje",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Czas połączyć sekundy i tercje. Cztery interwały do rozróżnienia: sekunda mała (1 półton), sekunda wielka (2), tercja mała (3) i tercja wielka (4). Posłuchaj uważnie każdej pary.",
          intervalExamples: [
            { notes: ["B3", "C4"], label: "sekunda mała (2>)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (2)" },
            { notes: ["D4", "F4"], label: "tercja mała (3>)" },
            { notes: ["C4", "E4"], label: "tercja wielka (3)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l3-e1", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l3-e2", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l3-e3", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l3-e4", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l3-e5", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l3-e6", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l3-e7", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l3-e8", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], hideNotation: true } },
      ],
    },
    {
      id: "pi-poziom-4-kwarta-kwinta",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Kwarta czysta to pięć półtonów, kwinta czysta — siedem, a dokładnie pośrodku między nimi leży tryton — sześć półtonów. W przeciwieństwie do „czystych” kwarty i kwinty, tryton brzmi niepokojąco i napięcie, dlatego bywa nazywany „diabelskim interwałem”. Posłuchaj wszystkich trzech po kolei.",
          intervalExamples: [
            { notes: ["C4", "F4"], label: "kwarta czysta (4)" },
            { notes: ["C4", "F#4"], label: "tryton (4<)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (5)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l4-e1", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
        { id: "pi-l4-e2", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
        { id: "pi-l4-e3", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
        { id: "pi-l4-e4", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
        { id: "pi-l4-e5", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
        { id: "pi-l4-e6", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      id: "pi-poziom-5-seksty",
      order: 5,
      difficulty: 2,
      introSlides: [
        {
          body: "Seksta mała to osiem półtonów, seksta wielka — dziewięć. Posłuchaj obu przykładów po kolei.",
          intervalExamples: [
            { notes: ["E4", "C5"], label: "seksta mała (6>) — jak „Love Story”" },
            { notes: ["C4", "A4"], label: "seksta wielka (6) — jak „To nie ja”" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l5-e1", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l5-e2", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l5-e3", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l5-e4", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l5-e5", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l5-e6", type: "interval-name-choice", difficulty: 2, spec: { type: "interval-name-choice", allowedSemitones: [8, 9], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      id: "pi-poziom-6-kwarta-kwinta-seksty",
      order: 6,
      difficulty: 3,
      introSlides: [
        {
          body: "Teraz połącz kwartę, kwintę, tryton i obie seksty — pięć szerszych interwałów do rozróżnienia: kwarta czysta (5 półtonów), tryton (6), kwinta czysta (7), seksta mała (8) i seksta wielka (9). Posłuchaj wszystkich po kolei.",
          intervalExamples: [
            { notes: ["C4", "F4"], label: "kwarta czysta (4)" },
            { notes: ["C4", "F#4"], label: "tryton (4<)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (5)" },
            { notes: ["E4", "C5"], label: "seksta mała (6>)" },
            { notes: ["C4", "A4"], label: "seksta wielka (6)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l6-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l6-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l6-e3", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l6-e4", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"] } },
        { id: "pi-l6-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l6-e6", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l6-e7", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l6-e8", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [5, 6, 7, 8, 9], noteRange: ["C4", "C6"], hideNotation: true } },
      ],
    },
    {
      id: "pi-poziom-7-septymy-oktawa",
      order: 7,
      difficulty: 3,
      introSlides: [
        {
          body: "Septyma mała to dziesięć półtonów, septyma wielka — jedenaście, a oktawa czysta — dwanaście, czyli ten sam dźwięk o oktawę wyżej. To już największe interwały w tym paśmie. Posłuchaj wszystkich po kolei.",
          intervalExamples: [
            { notes: ["D4", "C5"], label: "septyma mała (7) — jak „Ja ci powiadała”" },
            { notes: ["C4", "B4"], label: "septyma wielka (7<) — jak „Take on me”" },
            { notes: ["C4", "C5"], label: "oktawa czysta (8)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l7-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
        { id: "pi-l7-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
        { id: "pi-l7-e3", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
        { id: "pi-l7-e4", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
        { id: "pi-l7-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
        { id: "pi-l7-e6", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [10, 11, 12], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      id: "pi-poziom-8-test-na-czas",
      order: 8,
      difficulty: 3,
      introSlides: [
        {
          body: "Test na czas: wszystkie dotąd poznane interwały wymieszane, w trybie testowym. Masz 60 sekund, żeby odpowiedzieć na jak najwięcej pytań poprawnie — po każdej odpowiedzi natychmiast pojawia się kolejne pytanie. Dla przypomnienia — wszystkie interwały po kolei, łącznie z prymą, czyli tym samym dźwiękiem powtórzonym dwa razy.",
          intervalExamples: [
            { notes: ["C4", "C4"], label: "pryma czysta (1)" },
            { notes: ["B3", "C4"], label: "sekunda mała (2>)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (2)" },
            { notes: ["D4", "F4"], label: "tercja mała (3>) — jak „Czerwone jabłuszko”" },
            { notes: ["C4", "E4"], label: "tercja wielka (3) — jak „Stary niedźwiedź mocno śpi”" },
            { notes: ["C4", "F4"], label: "kwarta czysta (4)" },
            { notes: ["C4", "F#4"], label: "tryton (4<)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (5)" },
            { notes: ["E4", "C5"], label: "seksta mała (6>) — jak „Love Story”" },
            { notes: ["C4", "A4"], label: "seksta wielka (6) — jak „To nie ja”" },
            { notes: ["D4", "C5"], label: "septyma mała (7) — jak „Ja ci powiadała”" },
            { notes: ["C4", "B4"], label: "septyma wielka (7<) — jak „Take on me”" },
            { notes: ["C4", "C5"], label: "oktawa czysta (8)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l8-e1", type: "interval-timed-test", difficulty: 3, spec: { type: "interval-timed-test", durationSeconds: 60, noteRange: ["C4", "C6"] } },
      ],
    },
    {
      // Every earlier level either narrows allowedSemitones to a
      // teachable subset, or (lekcja 8) covers the full range but under
      // time pressure with notation still shown. This is the missing
      // combination: the FULL 0-12 semitone range, hideNotation on every
      // single exercise (not just the harder tail of a level, like
      // lekcje 3/6 do), and no clock — pure, unhurried ear training.
      id: "pi-poziom-9-czyste-ucho",
      order: 9,
      difficulty: 3,
      introSlides: [
        {
          body: "Czas na czyste ucho — bez zerkania na zapis nutowy. Usłysz interwał i nazwij go, korzystając wyłącznie ze słuchu. Wszystkie dwanaście interwałów naraz, bez ograniczenia czasowego jak w poprzedniej lekcji — możesz się w pełni skupić na samym dźwięku.",
          intervalExamples: [
            { notes: ["C4", "C4"], label: "pryma czysta (1)" },
            { notes: ["B3", "C4"], label: "sekunda mała (2>)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (2)" },
            { notes: ["D4", "F4"], label: "tercja mała (3>)" },
            { notes: ["C4", "E4"], label: "tercja wielka (3)" },
            { notes: ["C4", "F4"], label: "kwarta czysta (4)" },
            { notes: ["C4", "F#4"], label: "tryton (4<)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (5)" },
            { notes: ["E4", "C5"], label: "seksta mała (6>)" },
            { notes: ["C4", "A4"], label: "seksta wielka (6)" },
            { notes: ["D4", "C5"], label: "septyma mała (7)" },
            { notes: ["C4", "B4"], label: "septyma wielka (7<)" },
            { notes: ["C4", "C5"], label: "oktawa czysta (8)" },
          ],
        },
      ],
      exercises: [
        { id: "pi-l9-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e3", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e4", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e6", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e7", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
        { id: "pi-l9-e8", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true } },
      ],
    },
    {
      // Same ear-only drill as lekcja 9, widened from the C4-C6 range
      // every earlier level used to the full C3-C6 span this app's own
      // playable note range tops out at — the same interval sounds
      // different low versus high (a minor third down in the bass reads
      // very differently by ear than one up in the treble), so this
      // tests recognizing it regardless of register, not just once more
      // in the same comfortable octave pair.
      id: "pi-poziom-10-szeroki-rejestr",
      order: 10,
      difficulty: 3,
      introSlides: [
        {
          body: "Ten sam trening co w poprzedniej lekcji, ale w szerszym rejestrze — od C3 do C6. Ten sam interwał brzmi inaczej nisko niż wysoko, ale to wciąż ten sam interwał. Ucho musi go rozpoznać niezależnie od tego, gdzie w skali akurat gra.",
        },
      ],
      exercises: [
        { id: "pi-l10-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e3", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e4", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e6", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e7", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l10-e8", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
      ],
    },
    {
      // The new interval-sequence-choice type (see its own doc in
      // types/exercises.ts) — two FRESH, independently-drawn intervals
      // play back to back and both need naming, one small picker per
      // position. Narrow semitone pool (seconds/thirds, lekcje 1-3's own
      // territory) here on purpose: holding two things in memory at once
      // is the new difficulty, not also facing the full interval range.
      id: "pi-poziom-11-dwa-interwaly",
      order: 11,
      difficulty: 3,
      introSlides: [
        {
          body: "Teraz usłyszysz dwa interwały pod rząd, jeden zaraz po drugim — Twoje zadanie to nazwać OBA, każdy osobno. Ucho musi zapamiętać pierwszy, zanim jeszcze zdąży usłyszeć drugi.",
        },
      ],
      exercises: [
        { id: "pi-l11-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l11-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l11-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l11-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l11-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l11-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      // Same "two in a row" idea as lekcja 11, now drawing from the FULL
      // interval range (0-12) instead of just seconds/thirds. optionCount
      // pinned to 5 (not "all 13", the field's own default) — with two
      // positions on screen at once, 13 options each would be a wall of
      // buttons; a random 5-option pool per position (correct answer
      // always included, see buildIntervalOptions) stays readable.
      id: "pi-poziom-12-dwa-interwaly-pelny-zakres",
      order: 12,
      difficulty: 3,
      introSlides: [
        {
          body: "Ten sam pomysł co w poprzedniej lekcji, ale teraz mogą pojawić się WSZYSTKIE poznane interwały — nie tylko sekundy i tercje, ale też kwarty, kwinty, seksty, septymy i oktawa.",
        },
      ],
      exercises: [
        { id: "pi-l12-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l12-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l12-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l12-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l12-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l12-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
      ],
    },
    {
      // Three in a row instead of two — back to the narrow seconds/
      // thirds pool (like lekcja 11), since adding a third position is
      // already a meaningfully bigger memory load on its own.
      id: "pi-poziom-13-trzy-interwaly",
      order: 13,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy interwały pod rząd zamiast dwóch — jeszcze więcej do zapamiętania naraz, zanim zdążysz odpowiedzieć na pierwsze pytanie.",
        },
      ],
      exercises: [
        { id: "pi-l13-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l13-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l13-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l13-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l13-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
        { id: "pi-l13-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"] } },
      ],
    },
    {
      // The capstone of this whole "sequence" idea — three in a row,
      // full interval range. Same optionCount=5 reasoning as lekcja 12
      // (three positions at once would be an even bigger wall of buttons
      // at the field's own "all 13" default).
      id: "pi-poziom-14-trzy-interwaly-pelny-zakres",
      order: 14,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy interwały, pełen zakres — najtrudniejsza wersja tego ćwiczenia. Wszystko, czego się nauczyłeś o interwałach, naraz.",
        },
      ],
      exercises: [
        { id: "pi-l14-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l14-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l14-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l14-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l14-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l14-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
      ],
    },
    {
      // The "dwudźwięk" (dyad) turn — every lekcja until now played its two
      // notes one after another (playInterval). Here both notes of the
      // interval sound AT ONCE (harmonic: true → playHarmonicInterval, see
      // player.ts) — the same interval, but recognized as one combined
      // sound instead of two separate ones in sequence. Full semitone
      // range, ear-only (hideNotation, since a real dyad's own staff
      // notation — two stacked noteheads — isn't drawn by
      // IntervalStaffNotation).
      id: "pi-poziom-15-dwudzwieki",
      order: 15,
      difficulty: 3,
      introSlides: [
        {
          body: "Do tej pory każdy interwał słyszałeś jako dwa dźwięki pod rząd. Teraz oba dźwięki zabrzmią NARAZ, jako jeden połączony dźwięk — to się nazywa dwudźwięk. Brzmi inaczej niż ta sama para zagrana pojedynczo, ale to wciąż ten sam interwał — Twoje ucho musi go rozpoznać także w tej nowej, „zlanej” formie.",
        },
      ],
      exercises: [
        { id: "pi-l15-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e3", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e4", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e6", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e7", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l15-e8", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
      ],
    },
    {
      // Lekcja 11's own "dwa interwały pod rząd" idea, teraz jako dwa
      // dwudźwięki pod rząd (harmonic: true na interval-sequence-choice) —
      // każda pozycja w sekwencji sama w sobie jest dwudźwiękiem, ale obie
      // pozycje wciąż grają one po drugiej (patrz HARMONIC_SEQUENCE_STEP_MS
      // w IntervalSequenceChoiceExercise.tsx — dłuższy odstęp, bo dwudźwięk
      // dźwięczy dłużej niż interwał melodyczny). Wąska pula (sekundy/
      // tercje), tak jak lekcja 11.
      id: "pi-poziom-16-dwa-dwudzwieki",
      order: 16,
      difficulty: 3,
      introSlides: [
        {
          body: "Teraz usłyszysz dwa dwudźwięki pod rząd — każdy z nich to para dźwięków zagranych NARAZ. Nazwij oba interwały, tak jak w lekcji o dwóch interwałach pod rząd, tylko tym razem żaden z nich nie jest rozłożony na dwa osobne dźwięki.",
        },
      ],
      exercises: [
        { id: "pi-l16-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l16-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l16-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l16-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l16-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l16-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
      ],
    },
    {
      // Lekcja 16, pełen zakres (jak lekcja 12 do lekcji 11) — optionCount
      // ograniczony do 5 z tego samego powodu co lekcja 12/14.
      id: "pi-poziom-17-dwa-dwudzwieki-pelny-zakres",
      order: 17,
      difficulty: 3,
      introSlides: [
        {
          body: "Ten sam pomysł co w poprzedniej lekcji, ale teraz mogą pojawić się WSZYSTKIE poznane interwały jako dwudźwięki — od sekundy po oktawę.",
        },
      ],
      exercises: [
        { id: "pi-l17-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l17-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l17-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l17-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l17-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l17-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
      ],
    },
    {
      // Lekcja 13's own "trzy interwały pod rząd" idea, jako trzy
      // dwudźwięki. Wąska pula, jak lekcja 13 i 16.
      id: "pi-poziom-18-trzy-dwudzwieki",
      order: 18,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy dwudźwięki pod rząd zamiast dwóch — jeszcze więcej do zapamiętania, a każdy z nich to znów dwa dźwięki zagrane naraz, nie osobno.",
        },
      ],
      exercises: [
        { id: "pi-l18-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l18-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l18-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l18-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l18-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
        { id: "pi-l18-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [1, 2, 3, 4], noteRange: ["C4", "C6"], harmonic: true } },
      ],
    },
    {
      // Kapitan tej podgrupy lekcji — trzy dwudźwięki, pełen zakres,
      // optionCount=5 jak lekcja 14/17.
      id: "pi-poziom-19-trzy-dwudzwieki-pelny-zakres",
      order: 19,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy dwudźwięki, pełen zakres — najtrudniejsza wersja tego ćwiczenia z dwudźwiękami. Wszystko, czego się nauczyłeś o interwałach granych naraz, w jednej lekcji.",
        },
      ],
      exercises: [
        { id: "pi-l19-e1", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l19-e2", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l19-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l19-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l19-e5", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l19-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
      ],
    },
    {
      // Boss lekcja — Olbrzym Oktawiusz. Jak Arytmik/Ośmiotakt: mix
      // ćwiczeń REUSED z wcześniejszych lekcji tej krainy (te same specs,
      // skopiowane) zamiast świeżo pisanej treści — melodyczne i harmoniczne
      // interval-name-choice, melodyczna i harmoniczna sekwencja, oraz test
      // na czas z lekcji 8.
      id: "pi-poziom-20-boss-oktawiusz",
      order: 20,
      difficulty: 3,
      isBoss: true,
      bossName: "Oktawiusz",
      introSlides: [
        {
          body: "Olbrzym Oktawiusz strzeże wyjścia z Pasma Interwałów — zna każdy interwał, zagrany zarówno pojedynczo, jak i w dwudźwiękach. Żeby go pokonać, pokaż, że rozpoznajesz je wszystkie: melodyczne, harmoniczne, pojedyncze i w sekwencjach.",
          bossPortrait: true,
        },
      ],
      exercises: [
        { id: "pi-l20-e1", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "pi-l20-e2", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l20-e3", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5 } },
        { id: "pi-l20-e4", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 2, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l20-e5", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C3", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l20-e6", type: "interval-sequence-choice", difficulty: 3, spec: { type: "interval-sequence-choice", sequenceLength: 3, allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], optionCount: 5, harmonic: true } },
        { id: "pi-l20-e7", type: "interval-name-choice", difficulty: 3, spec: { type: "interval-name-choice", allowedSemitones: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], noteRange: ["C4", "C6"], hideNotation: true, harmonic: true } },
        { id: "pi-l20-e8", type: "interval-timed-test", difficulty: 3, spec: { type: "interval-timed-test", durationSeconds: 60, noteRange: ["C4", "C6"] } },
      ],
    },
  ],
};
