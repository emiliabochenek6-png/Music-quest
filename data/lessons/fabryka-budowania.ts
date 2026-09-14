import type { WorldContent } from "@/types/exercises";

/**
 * "Fabryka Budowania" — the construction inverse of Pasmo Interwałów and
 * Zatoka Trójdźwięków: instead of naming an interval/triad you're shown,
 * you build one from a given root. Levels 1-3 build on a virtual piano
 * keyboard (interval-build-choice); levels 4-8 and 11 build on a staff by
 * clicking a position then an accidental (interval-build-staff-choice,
 * level 8 adds double sharp/flat); levels 9-11 build a triad's third and
 * fifth the same staff way, next to a fixed root (triad-build-staff-
 * choice). Content transcribed verbatim from the web app's
 * data/worlds/fabryka-budowania.json.
 */
export const FABRYKA_BUDOWANIA_CONTENT: WorldContent = {
  worldId: "fabryka-budowania",
  lessons: [
    {
      id: "fb-poziom-1-interwaly-sekundy-tercje",
      order: 1,
      difficulty: 2,
      introSlides: [
        {
          body: "Tu odwracasz to, czego nauczyłeś się w Paśmie Interwałów: zamiast rozpoznawać nazwany interwał, sam go zbudujesz. Zobaczysz dźwięk startowy (prymę) i nazwę interwału — Twoje zadanie to policzyć właściwą liczbę półtonów w górę lub w dół (polecenie zawsze mówi, w którą stronę) i kliknąć odpowiedni klawisz na klawiaturze. Dźwięk startowy zostaje lekko podświetlony przez całe zadanie, żebyś zawsze wiedział, od czego liczyć. Poniżej masz pełną klawiaturę oktawy — każdy klawisz (biały i czarny) podpisany nazwą dźwięku i liczbą półtonów od C, razem z odpowiadającym zapisem nutowym nad klawiaturą. Przykład: budując sekundę wielką w górę od C, licz 2 półtony w górę — trafiasz na D.",
          chromaticKeyboardReference: { range: ["C4", "C5"] },
          intervalExamples: [
            { notes: ["C4", "Db4"], label: "sekunda mała" },
            { notes: ["C4", "D4"], label: "sekunda wielka" },
            { notes: ["C4", "Eb4"], label: "tercja mała" },
            { notes: ["C4", "E4"], label: "tercja wielka" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l1-e1", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2] } },
        { id: "fb-l1-e2", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2] } },
        { id: "fb-l1-e3", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [3, 4] } },
        { id: "fb-l1-e4", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [3, 4] } },
        { id: "fb-l1-e5", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4] } },
        { id: "fb-l1-e6", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4] } },
      ],
    },
    {
      id: "fb-poziom-2-interwaly-kwarty-kwinty-seksty",
      order: 2,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz buduj większe interwały — kwarty, tryton, kwinty i seksty (5 do 9 półtonów). Ta sama zasada: policz półtony od podświetlonego dźwięku startowego (w górę lub w dół, zgodnie z poleceniem) i kliknij właściwy klawisz.",
          chromaticKeyboardReference: { range: ["C4", "C5"] },
          intervalExamples: [
            { notes: ["C4", "F4"], label: "kwarta czysta" },
            { notes: ["C4", "F#4"], label: "tryton" },
            { notes: ["C4", "G4"], label: "kwinta czysta" },
            { notes: ["C4", "Ab4"], label: "seksta mała" },
            { notes: ["C4", "A4"], label: "seksta wielka" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l2-e1", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7] } },
        { id: "fb-l2-e2", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7] } },
        { id: "fb-l2-e3", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9] } },
        { id: "fb-l2-e4", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9] } },
        { id: "fb-l2-e5", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7, 8, 9] } },
        { id: "fb-l2-e6", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7, 8, 9] } },
      ],
    },
    {
      id: "fb-poziom-3-interwaly-septymy-oktawa",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Ostatnie interwały do zbudowania na klawiaturze — septymy i oktawa (10 do 12 półtonów), tak jak w ostatnim poziomie Pasma Interwałów. Pamiętaj, że polecenie może kazać zbudować interwał w dół, nie tylko w górę.",
          chromaticKeyboardReference: { range: ["C4", "C5"] },
          intervalExamples: [
            { notes: ["C4", "Bb4"], label: "septyma mała" },
            { notes: ["C4", "B4"], label: "septyma wielka" },
            { notes: ["C4", "C5"], label: "oktawa czysta" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l3-e1", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11] } },
        { id: "fb-l3-e2", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11] } },
        { id: "fb-l3-e3", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [12] } },
        { id: "fb-l3-e4", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11, 12] } },
        { id: "fb-l3-e5", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11, 12] } },
        { id: "fb-l3-e6", type: "interval-build-choice", difficulty: 2, spec: { type: "interval-build-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11, 12] } },
      ],
    },
    {
      id: "fb-poziom-4-pieciolinia-sekundy-tercje",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz przenosisz budowanie interwałów z klawiatury na pięciolinię. Zobaczysz prymę zapisaną na pięciolinii i nazwę interwału — kliknij pozycję (linię lub przestrzeń), na której ma się znaleźć druga nuta, a potem wybierz jej znak chromatyczny (bemol, kasownik albo krzyżyk). Zaczynasz od najmniejszych interwałów: sekund i tercji (1 do 4 półtony). Przykład: budując sekundę wielką w górę od C, klikasz pozycję linii/przestrzeni o jeden stopień wyżej niż C (czyli D) i wybierasz kasownik — bez żadnego znaku chromatycznego.",
          intervalExamples: [
            { notes: ["C4", "Db4"], label: "sekunda mała (pół tonu)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (cały ton)" },
            { notes: ["C4", "Eb4"], label: "tercja mała (cały ton + pół tonu)" },
            { notes: ["C4", "E4"], label: "tercja wielka (2 całe tony)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l4-e1", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2] } },
        { id: "fb-l4-e2", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2] } },
        { id: "fb-l4-e3", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [3, 4] } },
        { id: "fb-l4-e4", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [3, 4] } },
        { id: "fb-l4-e5", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4] } },
        { id: "fb-l4-e6", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4] } },
      ],
    },
    {
      id: "fb-poziom-5-pieciolinia-kwarty-tryton-kwinty",
      order: 5,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz buduj na pięciolinii kwarty, tryton i kwinty (5 do 7 półtonów). Ta sama zasada: kliknij pozycję nuty, a potem jej znak chromatyczny.",
          intervalExamples: [
            { notes: ["C4", "F4"], label: "kwarta czysta (2 całe tony + pół tonu)" },
            { notes: ["C4", "F#4"], label: "tryton (3 całe tony)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (3 całe tony + pół tonu)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l5-e1", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6] } },
        { id: "fb-l5-e2", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6] } },
        { id: "fb-l5-e3", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [7] } },
        { id: "fb-l5-e4", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7] } },
        { id: "fb-l5-e5", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7] } },
        { id: "fb-l5-e6", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [5, 6, 7] } },
      ],
    },
    {
      id: "fb-poziom-6-pieciolinia-seksty-septymy-oktawa",
      order: 6,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz buduj na pięciolinii seksty, septymy i oktawę (8 do 12 półtonów) — największe interwały do zbudowania na pięciolinii.",
          intervalExamples: [
            { notes: ["C4", "Ab4"], label: "seksta mała (4 całe tony)" },
            { notes: ["C4", "A4"], label: "seksta wielka (4 całe tony + pół tonu)" },
            { notes: ["C4", "Bb4"], label: "septyma mała (5 całych tonów)" },
            { notes: ["C4", "B4"], label: "septyma wielka (5 całych tonów + pół tonu)" },
            { notes: ["C4", "C5"], label: "oktawa czysta (6 całych tonów)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l6-e1", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9] } },
        { id: "fb-l6-e2", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9] } },
        { id: "fb-l6-e3", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11, 12] } },
        { id: "fb-l6-e4", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [10, 11, 12] } },
        { id: "fb-l6-e5", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9, 10, 11, 12] } },
        { id: "fb-l6-e6", type: "interval-build-staff-choice", difficulty: 2, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [8, 9, 10, 11, 12] } },
      ],
    },
    {
      id: "fb-poziom-7-pieciolinia-mix",
      order: 7,
      difficulty: 3,
      introSlides: [
        {
          body: "Podsumowanie budowania na pięciolinii — mieszanka wszystkich interwałów (od sekundy do oktawy) poznanych w trzech poprzednich poziomach. Pamiętaj o kierunku podanym w poleceniu — w górę albo w dół od prymy.",
          intervalExamples: [
            { notes: ["C4", "Db4"], label: "sekunda mała (pół tonu)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (cały ton)" },
            { notes: ["C4", "Eb4"], label: "tercja mała (cały ton + pół tonu)" },
            { notes: ["C4", "E4"], label: "tercja wielka (2 całe tony)" },
            { notes: ["C4", "F4"], label: "kwarta czysta (2 całe tony + pół tonu)" },
            { notes: ["C4", "F#4"], label: "tryton (3 całe tony)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (3 całe tony + pół tonu)" },
            { notes: ["C4", "Ab4"], label: "seksta mała (4 całe tony)" },
            { notes: ["C4", "A4"], label: "seksta wielka (4 całe tony + pół tonu)" },
            { notes: ["C4", "Bb4"], label: "septyma mała (5 całych tonów)" },
            { notes: ["C4", "B4"], label: "septyma wielka (5 całych tonów + pół tonu)" },
            { notes: ["C4", "C5"], label: "oktawa czysta (6 całych tonów)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l7-e1", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l7-e2", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l7-e3", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l7-e4", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l7-e5", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l7-e6", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
      ],
    },
    {
      id: "fb-poziom-8-interwaly-podwojne-znaki",
      order: 8,
      difficulty: 3,
      introSlides: [
        {
          body: 'Dalej budujesz interwały na pięciolinii — ale czasem dźwięk trzeba podnieść lub obniżyć o dwa półtony zamiast jednego. Wtedy zamiast pojedynczego krzyżyka (♯) używa się podwójnego krzyżyka (zapisywanego tu jako "x"), a zamiast pojedynczego bemola (♭) — podwójnego bemola ("bb"). Pod wyborem pozycji nuty pojawią się teraz dwa dodatkowe przyciski. Przykład: tryton (6 półtonów) w górę od dźwięku cis (C♯) to nie F♯ (to tylko 5 półtonów), tylko Fx — F podniesione dwukrotnie. Klikasz pozycję F, a potem przycisk podwójnego krzyżyka zamiast pojedynczego. W tym poziomie takie przypadki trafiają się czasem, a czasem nie.',
        },
      ],
      exercises: [
        { id: "fb-l8-e1", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C#4", "C#4"], allowedSemitones: [6], allowDoubleAccidentals: true } },
        { id: "fb-l8-e2", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["D#4", "D#4"], allowedSemitones: [6], allowDoubleAccidentals: true } },
        { id: "fb-l8-e3", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["G#4", "G#4"], allowedSemitones: [1], allowDoubleAccidentals: true } },
        { id: "fb-l8-e4", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["G#4", "G#4"], allowedSemitones: [11], allowDoubleAccidentals: true } },
        {
          id: "fb-l8-e5",
          type: "interval-build-staff-choice",
          difficulty: 3,
          spec: { type: "interval-build-staff-choice", noteRange: ["F#4", "F#4"], allowedSemitones: [1, 3, 4, 6, 8, 9, 11], allowDoubleAccidentals: true },
        },
        {
          id: "fb-l8-e6",
          type: "interval-build-staff-choice",
          difficulty: 3,
          spec: { type: "interval-build-staff-choice", noteRange: ["A#4", "A#4"], allowedSemitones: [1, 3, 4, 6, 8, 9, 11], allowDoubleAccidentals: true },
        },
        { id: "fb-l8-e7", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 4, 11], allowDoubleAccidentals: true } },
        {
          id: "fb-l8-e8",
          type: "interval-build-staff-choice",
          difficulty: 3,
          spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 3, 4, 6, 8, 9, 11], allowDoubleAccidentals: true },
        },
      ],
    },
    {
      id: "fb-poziom-9-trojdzwieki-dur-moll",
      order: 9,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz buduj trójdźwięki poznane w Zatoce Trójdźwięków, ale na pięciolinii — zamiast klawiatury, dostajesz sąsiadujące kolumny na tercję i kwintę obok stałej prymy. Dla każdej z osobna klikasz pozycję (linię/przestrzeń), a potem wybierasz jej znak chromatyczny. Trójdźwięk durowy (3 + 3>) to tercja wielka (4 półtony) plus tercja mała (3 półtony) — np. od C: tercja wielka daje E, a tercja mała nad E daje G. Trójdźwięk molowy (3> + 3) to odwrotnie: tercja mała plus tercja wielka — od C: Eb, a nad nim G. Skrót: 3 = tercja wielka, 3> = tercja mała.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy (3+3>)" },
            { notes: ["C4", "Eb4", "G4"], label: "molowy (3>+3)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l9-e1", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["major"] } },
        { id: "fb-l9-e2", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["major"] } },
        { id: "fb-l9-e3", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor"] } },
        { id: "fb-l9-e4", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor"] } },
        { id: "fb-l9-e5", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "fb-l9-e6", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
      ],
    },
    {
      id: "fb-poziom-10-trojdzwieki-zmniejszony-zwiekszony",
      order: 10,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz najtrudniejsze rodzaje trójdźwięków, dalej na pięciolinii: zmniejszony i zwiększony. Trójdźwięk zmniejszony to tercja mała plus tercja mała (3>+3>) — np. od C: Eb, a nad nim Gb. Trójdźwięk zwiększony to tercja wielka plus tercja wielka (3+3) — np. od C: E, a nad nim G♯. Ta sama zasada co w poprzednim poziomie: osobna kolumna (pozycja + znak chromatyczny) na tercję i na kwintę.",
          triadExamples: [
            { notes: ["C4", "Eb4", "Gb4"], label: "zmniejszony (3>+3>)" },
            { notes: ["C4", "E4", "G#4"], label: "zwiększony (3+3)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l10-e1", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["diminished"] } },
        { id: "fb-l10-e2", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["diminished"] } },
        { id: "fb-l10-e3", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["augmented"] } },
        { id: "fb-l10-e4", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["augmented"] } },
        { id: "fb-l10-e5", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["diminished", "augmented"] } },
        { id: "fb-l10-e6", type: "triad-build-staff-choice", difficulty: 2, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"], allowedQualities: ["diminished", "augmented"] } },
      ],
    },
    {
      id: "fb-poziom-11-podsumowanie",
      order: 11,
      difficulty: 3,
      introSlides: [
        {
          body: "To poziom podsumowujący — mieszanka budowania na pięciolinii interwałów (wszystkie, do oktawy, w górę i w dół) i trójdźwięków (wszystkie 4 rodzaje) poznanych w poprzednich dziesięciu poziomach.",
          intervalExamples: [
            { notes: ["C4", "Db4"], label: "sekunda mała (pół tonu)" },
            { notes: ["C4", "D4"], label: "sekunda wielka (cały ton)" },
            { notes: ["C4", "Eb4"], label: "tercja mała (cały ton + pół tonu)" },
            { notes: ["C4", "E4"], label: "tercja wielka (2 całe tony)" },
            { notes: ["C4", "F4"], label: "kwarta czysta (2 całe tony + pół tonu)" },
            { notes: ["C4", "F#4"], label: "tryton (3 całe tony)" },
            { notes: ["C4", "G4"], label: "kwinta czysta (3 całe tony + pół tonu)" },
            { notes: ["C4", "Ab4"], label: "seksta mała (4 całe tony)" },
            { notes: ["C4", "A4"], label: "seksta wielka (4 całe tony + pół tonu)" },
            { notes: ["C4", "Bb4"], label: "septyma mała (5 całych tonów)" },
            { notes: ["C4", "B4"], label: "septyma wielka (5 całych tonów + pół tonu)" },
            { notes: ["C4", "C5"], label: "oktawa czysta (6 całych tonów)" },
          ],
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy (3+3>)" },
            { notes: ["C4", "Eb4", "G4"], label: "molowy (3>+3)" },
            { notes: ["C4", "Eb4", "Gb4"], label: "zmniejszony (3>+3>)" },
            { notes: ["C4", "E4", "G#4"], label: "zwiększony (3+3)" },
          ],
        },
      ],
      exercises: [
        { id: "fb-l11-e1", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l11-e2", type: "triad-build-staff-choice", difficulty: 3, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"] } },
        { id: "fb-l11-e3", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l11-e4", type: "triad-build-staff-choice", difficulty: 3, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"] } },
        { id: "fb-l11-e5", type: "interval-build-staff-choice", difficulty: 3, spec: { type: "interval-build-staff-choice", noteRange: ["C4", "C5"], allowedSemitones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
        { id: "fb-l11-e6", type: "triad-build-staff-choice", difficulty: 3, spec: { type: "triad-build-staff-choice", noteRange: ["C4", "C5"] } },
      ],
    },
  ],
};
