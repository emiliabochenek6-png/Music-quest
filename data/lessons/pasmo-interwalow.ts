import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/pasmo-interwalow.json —
 * same 8 lessons, same 47 exercises, same ids/specs, restructured only to
 * fit this app's own WorldContent/LessonDefinition/ExerciseDefinition
 * shape (types/exercises.ts). Both exercise types (interval-name-choice,
 * interval-timed-test) are new to this port — see
 * components/exercises/{IntervalNameChoice,IntervalTimedTest}Exercise.tsx,
 * lib/music/intervals.ts (interval math, ported near-verbatim from the
 * web app on top of this app's own lib/music/notes.ts primitives), and
 * lib/questions/intervalTimedTest.ts (level 8's pass-bar scoring). Every
 * exercise here uses the "random mode" spec shape (allowedSemitones +
 * noteRange) — the web app's alternate fixed-`notes` authoring mode is
 * never used by this world's content, so it isn't carried over (see
 * ExerciseSpec's own "interval-name-choice" variant in types/exercises.ts).
 * All 8 lessons carry exactly one introSlides entry, each with its own
 * intervalExamples row (LessonTheoryIntro's new render branch).
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
          body: "Wielki finał: wszystkie poznane interwały wymieszane, w trybie testowym na czas. Masz 60 sekund, żeby odpowiedzieć na jak najwięcej pytań poprawnie — po każdej odpowiedzi natychmiast pojawia się kolejne pytanie. Dla przypomnienia — wszystkie interwały po kolei, łącznie z prymą, czyli tym samym dźwiękiem powtórzonym dwa razy.",
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
  ],
};
