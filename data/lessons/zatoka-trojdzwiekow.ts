import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/zatoka-trojdzwiekow.json —
 * same 5 lessons, same 28 exercises, same ids/specs, restructured only to
 * fit this app's own WorldContent/LessonDefinition/ExerciseDefinition
 * shape (types/exercises.ts). All four exercise types (triad-fact-choice,
 * triad-quality-choice, triad-notes-choice, triad-role-choice) are new to
 * this port — see components/exercises/Triad{FactChoice,QualityChoice,
 * NotesChoice,RoleChoice}Exercise.tsx, lib/music/triads.ts (triad
 * construction/naming, ported near-verbatim from the web app), and
 * lib/music/keys.ts (a circle-of-fifths subset — just the fifths→tonic
 * lookup triad-notes-choice/triad-role-choice need, not the full wheel
 * machinery a Labirynt Tonacji port would eventually want). Audio is
 * TRUE simultaneous chord playback (lib/audio/player.ts's new playChord/
 * playChordSequence) — a first for this app, every earlier world's
 * "interval"/"melody" playback was sequential. Every lesson's introSlides
 * is ported (3 of 5 carry a triadExamples row, lessons 3 and 5 are
 * body-only). Lekcje 6-7 extend this same content, authored fresh (not
 * ported from the web app): lekcja 6 narrows triad-quality-choice's own
 * `allowedQualities` to the two genuinely confusable neighbor pairs
 * (minor/diminished share their lower minor third, major/augmented share
 * their lower major third) instead of picking from all four every time;
 * lekcja 7 widens triad-notes-choice/triad-role-choice's `fifthsRange`
 * from lekcje 3-4's [-3,3] to this app's own full [-5,5] (lib/music/
 * keys.ts's MIN_FIFTHS/MAX_FIFTHS), the same "narrow → full range"
 * difficulty ladder already used elsewhere in this app (e.g. Pasmo
 * Interwałów's lekcje 11→12). Lekcje 8-15 extend it further: lekcja 8 is
 * a structural (not ear) look at the same adjacent-quality insight,
 * lekcja 9 widens triad-quality-choice's own noteRange (register
 * generalization, mirroring Pasmo Interwałów's own wide-register lesson),
 * lekcja 10 adds `arpeggiated: true` (playArpeggiatedTriad in
 * lib/audio/player.ts) — the triad's own broken-chord/"rozłożony" mode,
 * playing one note after another instead of together. Lekcje 11-14 add
 * the new `triad-quality-sequence-choice` type (types/exercises.ts) —
 * this world's own version of Pasmo Interwałów's interval-sequence-
 * choice: 2 or 3 fresh triads play back to back (still each one a normal
 * simultaneous chord via playChordSequence), one IntervalOptionPicker
 * "okienko" per position, narrow (dur/moll only) then full-quality
 * variants exactly mirroring Pasmo Interwałów's own 11→12/13→14 ladder.
 * Lekcja 15 is this world's own boss ("Pokonaj Smoka Trójgłosa") — same
 * reused-content pattern as Miasto Rytmu's Arytmik, Przystań Taktów's
 * Ośmiotakt, and Pasmo Interwałów's Oktawiusz.
 */
export const ZATOKA_TROJDZWIEKOW_CONTENT: WorldContent = {
  worldId: "zatoka-trojdzwiekow",
  lessons: [
    {
      id: "zt-poziom-1-rodzaje-trojdzwiekow",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Trójdźwięk to trzy dźwięki ułożone jeden nad drugim w tercjach. To, jak dokładnie ułożone są te dwie tercje (mała = 3>, wielka = 3), decyduje o rodzaju trójdźwięku: durowy (3+3>) brzmi jasno i radośnie, molowy (3>+3) smutno i refleksyjnie, zmniejszony (3>+3>) tajemniczo i wąsko, a zwiększony (3+3) niepokojąco i rozmyto. Posłuchaj i zobacz wszystkie cztery zbudowane na tym samym dźwięku C — różni je tylko tercja.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "durowy (3+3>)" },
            { notes: ["C4", "Eb4", "G4"], label: "molowy (3>+3)" },
            { notes: ["C4", "Eb4", "Gb4"], label: "zmniejszony (3>+3>)" },
            { notes: ["C4", "E4", "G#4"], label: "zwiększony (3+3)" },
          ],
        },
      ],
      exercises: [
        {
          id: "zt-l1-e1",
          type: "triad-fact-choice",
          difficulty: 1,
          spec: {
            type: "triad-fact-choice",
            prompt: "Słyszysz trójdźwięk o bardzo jasnym i radosnym brzmieniu. Zbudowano go z 4 półtonów (tercja wielka) i kolejnych 3 półtonów (tercja mała). Jaki to rodzaj trójdźwięku?",
            hint: "Układ 4 + 3 półtony daje najpopularniejszy akord o „wesołym” brzmieniu.",
            options: ["durowy (dur)", "molowy (moll)", "zmniejszony", "zwiększony"],
            correctOptionIndex: 0,
            explanation: "Trójdźwięk durowy składa się z 4 półtonów u dołu i 3 półtonów u góry.",
          },
        },
        {
          id: "zt-l1-e2",
          type: "triad-fact-choice",
          difficulty: 1,
          spec: {
            type: "triad-fact-choice",
            prompt: "Akord brzmi tajemniczo i wąsko, a jego układ to 3 półtony (tercja mała) + kolejne 3 półtony (tercja mała). Co to za trójdźwięk?",
            hint: "Układ 3 + 3 półtony składa się z dwóch jednakowych, mniejszych tercji.",
            options: ["zmniejszony", "molowy (moll)", "durowy (dur)", "zwiększony"],
            correctOptionIndex: 0,
            explanation: "Dwie tercje małe (3 + 3 półtony) tworzą trójdźwięk zmniejszony.",
          },
        },
        {
          id: "zt-l1-e3",
          type: "triad-fact-choice",
          difficulty: 1,
          spec: {
            type: "triad-fact-choice",
            prompt: "Słuchasz akordu, który brzmi smutno i refleksyjnie. Jego skład to 3 półtony + 4 półtony. Jaki to typ?",
            hint: "Pierwsza tercja ma 3 półtony (jest mała).",
            options: ["molowy (moll)", "durowy (dur)", "zwiększony", "zmniejszony"],
            correctOptionIndex: 0,
            explanation: "Układ 3 + 4 półtony (tercja mała + tercja wielka) daje trójdźwięk molowy.",
          },
        },
      ],
    },
    {
      id: "zt-poziom-2-rozpoznawanie-akordow",
      order: 2,
      difficulty: 2,
      introSlides: [
        {
          body: "Teraz rozpoznasz trójdźwięki po konkretnych nazwach dźwięków, a nie po samej liczbie półtonów. Policz odległość między kolejnymi dźwiękami (3 lub 4 półtony), żeby ustalić rodzaj trójdźwięku — a nazwę tonacji odczytaj z najniższego dźwięku (prymy). Zobacz cztery przykłady i posłuchaj, jak brzmią.",
          triadExamples: [
            { notes: ["G4", "B4", "D5"], label: "G-dur (G-H-D) — jasno i radośnie" },
            { notes: ["C4", "Eb4", "G4"], label: "c-moll (c-es-g) — smutno i refleksyjnie" },
            { notes: ["B4", "D5", "F5"], label: "h-zmniejszony (h-d-f) — tajemniczo i wąsko" },
            { notes: ["F4", "A4", "C#5"], label: "F-zwiększony (F-A-Cis) — niepokojąco i rozmyto" },
          ],
        },
      ],
      exercises: [
        {
          id: "zt-l2-e1",
          type: "triad-fact-choice",
          difficulty: 2,
          spec: {
            type: "triad-fact-choice",
            prompt: "Rozpoznaj trójdźwięk o dźwiękach: G – H – D. Jaki to akord?",
            hint: "Odległość G-H to 4 półtony (tercja wielka), a H-D to 3 półtony (tercja mała).",
            options: ["G-dur", "g-moll", "g-zmniejszony", "G-zwiększony"],
            correctOptionIndex: 0,
            explanation: "G-H (tercja wielka) + H-D (tercja mała) tworzy trójdźwięk G-dur.",
            notationNotes: ["G4", "B4", "D5"],
          },
        },
        {
          id: "zt-l2-e2",
          type: "triad-fact-choice",
          difficulty: 2,
          spec: {
            type: "triad-fact-choice",
            prompt: "Z jakiego trójdźwięku pochodzą dźwięki c – es – g?",
            hint: "Dźwięk es obniża środkowy składnik akordu C-dur o pół tonu.",
            options: ["c-moll", "C-dur", "c-zmniejszony", "C-zwiększony"],
            correctOptionIndex: 0,
            explanation: "c-es (tercja mała) + es-g (tercja wielka) tworzą trójdźwięk c-moll.",
            notationNotes: ["C4", "Eb4", "G4"],
          },
        },
        {
          id: "zt-l2-e3",
          type: "triad-fact-choice",
          difficulty: 2,
          spec: {
            type: "triad-fact-choice",
            prompt: "Przeanalizuj dźwięki: F – A – Cis. Odległość F-A to tercja wielka (4 półtony), a A-Cis to kolejna tercja wielka (4 półtony). Co to za trójdźwięk?",
            hint: "Dwie tercje wielkie z rzędu tworzą nietypowe, rozszerzone brzmienie.",
            options: ["F-zwiększony", "F-dur", "f-moll", "f-zmniejszony"],
            correctOptionIndex: 0,
            explanation: "Układ dwóch tercji wielkich (F-A oraz A-Cis) tworzy trójdźwięk F-zwiększony.",
          },
        },
        { id: "zt-l2-e4", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
        { id: "zt-l2-e5", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
        {
          id: "zt-l2-e6",
          type: "triad-quality-choice",
          difficulty: 2,
          spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], hideNotation: true },
        },
        {
          id: "zt-l2-e7",
          type: "triad-quality-choice",
          difficulty: 2,
          spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], hideNotation: true },
        },
      ],
    },
    {
      id: "zt-poziom-3-t-s-d",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Trójdźwięk główny to trzy dźwięki ułożone w tercjach na wybranym stopniu gamy: tonika (T) na I stopniu, subdominanta (S) na IV stopniu, dominanta (D) na V stopniu. W gamie durowej wszystkie trzy są trójdźwiękami durowymi — np. w C-dur: T to C, E, G; S to F, A, C; D to G, H, D.",
        },
      ],
      exercises: [
        { id: "zt-l3-e1", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e2", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e3", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e4", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e5", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e6", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e7", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l3-e8", type: "triad-notes-choice", difficulty: 1, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
      ],
    },
    {
      id: "zt-poziom-4-t-s-d-ze-sluchu",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Poprzedni poziom nauczył Cię, z jakich dźwięków składają się tonika (T), subdominanta (S) i dominanta (D). Teraz rozpoznasz je ze słuchu! Same w sobie brzmią bardzo podobnie — w gamie durowej wszystkie trzy są trójdźwiękami durowymi, więc sama ich barwa nic nie mówi o funkcji. Liczy się dopiero odniesienie do toniki: dlatego w każdym ćwiczeniu najpierw usłyszysz tonikę, a zaraz potem trójdźwięk do rozpoznania. Posłuchaj poniżej wszystkich trzech w C-dur, żeby oswoić się z ich brzmieniem względem toniki.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "T — tonika, C-dur" },
            { notes: ["F4", "A4", "C5"], label: "S — subdominanta, C-dur" },
            { notes: ["G4", "B4", "D5"], label: "D — dominanta, C-dur" },
          ],
        },
      ],
      exercises: [
        { id: "zt-l4-e1", type: "triad-role-choice", difficulty: 2, spec: { type: "triad-role-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l4-e2", type: "triad-role-choice", difficulty: 2, spec: { type: "triad-role-choice", fifthsRange: [-3, 3] } },
        {
          id: "zt-l4-e3",
          type: "triad-role-choice",
          difficulty: 2,
          spec: { type: "triad-role-choice", fifthsRange: [-3, 3], hideNotation: true },
        },
        {
          id: "zt-l4-e4",
          type: "triad-role-choice",
          difficulty: 2,
          spec: { type: "triad-role-choice", fifthsRange: [-3, 3], hideNotation: true },
        },
      ],
    },
    {
      id: "zt-poziom-5-podsumowanie",
      order: 5,
      difficulty: 3,
      introSlides: [
        {
          body: "To poziom podsumowujący — sprawdzian tego, czego nauczyłeś się w czterech poprzednich poziomach. Znajdziesz tu mieszankę wszystkich rodzajów zadań: rozpoznawanie rodzaju trójdźwięku ze słuchu, nazywanie dźwięków trójdźwięków głównych (T/S/D) w danej tonacji i rozpoznawanie ich funkcji ze słuchu. Tak jak w poprzednich poziomach, część zadań pokazuje zapis nutowy, a część opiera się już wyłącznie na słuchu.",
        },
      ],
      exercises: [
        { id: "zt-l5-e1", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
        { id: "zt-l5-e2", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        { id: "zt-l5-e3", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-3, 3] } },
        {
          id: "zt-l5-e4",
          type: "triad-quality-choice",
          difficulty: 3,
          spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], hideNotation: true },
        },
        { id: "zt-l5-e5", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-3, 3] } },
        {
          id: "zt-l5-e6",
          type: "triad-role-choice",
          difficulty: 3,
          spec: { type: "triad-role-choice", fifthsRange: [-3, 3], hideNotation: true },
        },
      ],
    },
    {
      // Lekcja 2 already lets you pick from all four qualities at once,
      // which a lot of kids solve by elimination ("brzmi wesoło, na pewno
      // nie moll ani zmniejszony") rather than really telling two similar
      // ones apart. This lesson narrows allowedQualities to the two pairs
      // that share their LOWER third and differ only in the upper one —
      // minor/diminished (both 3>+... ) and major/augmented (both 3+...)
      // — so guessing by elimination stops working and the ear has to do
      // the actual work.
      id: "zt-poziom-6-blizniacze-akordy",
      order: 6,
      difficulty: 3,
      introSlides: [
        {
          body: "Niektóre rodzaje trójdźwięków są do siebie bardzo podobne — mają tę samą dolną tercję, różni je tylko górna. Molowy i zmniejszony zaczynają się tak samo (tercja mała u dołu), a durowy i zwiększony też (tercja wielka u dołu). W tej lekcji usłyszysz tylko takie bliźniacze pary — musisz naprawdę wsłuchać się w górną tercję, żeby je rozróżnić.",
          triadExamples: [
            { notes: ["C4", "Eb4", "G4"], label: "molowy (3>+3) — górna tercja wielka" },
            { notes: ["C4", "Eb4", "Gb4"], label: "zmniejszony (3>+3>) — górna tercja mała" },
            { notes: ["C4", "E4", "G4"], label: "durowy (3+3>) — górna tercja mała" },
            { notes: ["C4", "E4", "G#4"], label: "zwiększony (3+3) — górna tercja wielka" },
          ],
        },
      ],
      exercises: [
        { id: "zt-l6-e1", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor", "diminished"] } },
        { id: "zt-l6-e2", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor", "diminished"] } },
        { id: "zt-l6-e3", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor", "diminished"], hideNotation: true } },
        { id: "zt-l6-e4", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "augmented"] } },
        { id: "zt-l6-e5", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "augmented"] } },
        { id: "zt-l6-e6", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["major", "augmented"], hideNotation: true } },
        { id: "zt-l6-e7", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], allowedQualities: ["minor", "diminished", "major", "augmented"], hideNotation: true } },
      ],
    },
    {
      // Lekcje 3-4's own T/S/D ladder, widened from fifthsRange [-3,3]
      // (up to 3 sharps/flats) to this app's full [-5,5] (MIN_FIFTHS/
      // MAX_FIFTHS in lib/music/keys.ts) — same triad-notes-choice/
      // triad-role-choice types, just drawing from a bigger pool of
      // (rarer, harder) keys instead of a new kind of question.
      id: "zt-poziom-7-trudniejsze-tonacje",
      order: 7,
      difficulty: 3,
      introSlides: [
        {
          body: "Do tej pory tonika, subdominanta i dominanta pojawiały się w tonacjach do trzech znaków przy kluczu. Teraz dojdą też te rzadziej spotykane, aż do pięciu znaków — jak Des-dur czy H-dur. Zasada budowania T, S i D jest dokładnie taka sama, zmienia się tylko sama tonacja.",
        },
      ],
      exercises: [
        { id: "zt-l7-e1", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e2", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e3", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e4", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e5", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e6", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l7-e7", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-5, 5], hideNotation: true } },
        { id: "zt-l7-e8", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-5, 5], hideNotation: true } },
      ],
    },
    {
      // A structural, not ear-training, angle on the same "adjacent
      // quality" insight lekcja 6 teaches by ear: dur↔moll differ only in
      // the THIRD, moll↔zmniejszony and dur↔zwiększony differ only in the
      // FIFTH — every other quality pair needs TWO notes to change, so
      // this lesson only ever asks about these three adjacent pairs, one
      // exercise per direction.
      id: "zt-poziom-8-z-dur-na-moll",
      order: 8,
      difficulty: 2,
      introSlides: [
        {
          body: "Niektóre rodzaje trójdźwięków różnią się tylko JEDNYM dźwiękiem. Durowy i molowy różnią się środkowym dźwiękiem (tercją) — obniżenie go o pół tonu zamienia dur w moll. Molowy i zmniejszony różnią się górnym dźwiękiem (kwintą) — tak samo dur i zwiększony. W tej lekcji zobaczysz konkretny trójdźwięk i będziesz szukać, który dźwięk trzeba zmienić.",
        },
      ],
      exercises: [
        {
          id: "zt-l8-e1",
          type: "triad-fact-choice",
          difficulty: 2,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk C-dur (C-E-G). Żeby zamienić go w c-moll, trzeba obniżyć jeden dźwięk o pół tonu. Który?",
            hint: "Zmienia się środkowy dźwięk — tercja.",
            options: ["C", "E", "G"],
            correctOptionIndex: 1,
            explanation: "Obniżenie E do Es (tercja wielka → tercja mała) daje c-moll (C-Es-G).",
            notationNotes: ["C4", "E4", "G4"],
          },
        },
        {
          id: "zt-l8-e2",
          type: "triad-fact-choice",
          difficulty: 2,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk d-moll (D-F-A). Żeby zamienić go w D-dur, trzeba podwyższyć jeden dźwięk o pół tonu. Który?",
            hint: "Zmienia się środkowy dźwięk — tercja.",
            options: ["D", "F", "A"],
            correctOptionIndex: 1,
            explanation: "Podwyższenie F do Fis (tercja mała → tercja wielka) daje D-dur (D-Fis-A).",
            notationNotes: ["D4", "F4", "A4"],
          },
        },
        {
          id: "zt-l8-e3",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk e-moll (E-G-H). Żeby zamienić go w e-zmniejszony, trzeba obniżyć jeden dźwięk o pół tonu. Który?",
            hint: "Tym razem zmienia się górny dźwięk — kwinta, nie tercja.",
            options: ["E", "G", "H"],
            correctOptionIndex: 2,
            explanation: "Obniżenie H do B (kwinta czysta → kwinta zmniejszona) daje e-zmniejszony (E-G-B).",
            notationNotes: ["E4", "G4", "B4"],
          },
        },
        {
          id: "zt-l8-e4",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk h-zmniejszony (H-D-F). Żeby zamienić go w h-moll, trzeba podwyższyć jeden dźwięk o pół tonu. Który?",
            hint: "Zmienia się górny dźwięk — kwinta.",
            options: ["H", "D", "F"],
            correctOptionIndex: 2,
            explanation: "Podwyższenie F do Fis (kwinta zmniejszona → kwinta czysta) daje h-moll (H-D-Fis).",
            notationNotes: ["B4", "D5", "F5"],
          },
        },
        {
          id: "zt-l8-e5",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk F-dur (F-A-C). Żeby zamienić go w F-zwiększony, trzeba podwyższyć jeden dźwięk o pół tonu. Który?",
            hint: "Zmienia się górny dźwięk — kwinta.",
            options: ["F", "A", "C"],
            correctOptionIndex: 2,
            explanation: "Podwyższenie C do Cis (kwinta czysta → kwinta zwiększona) daje F-zwiększony (F-A-Cis).",
            notationNotes: ["F4", "A4", "C5"],
          },
        },
        {
          id: "zt-l8-e6",
          type: "triad-fact-choice",
          difficulty: 3,
          spec: {
            type: "triad-fact-choice",
            prompt: "Masz trójdźwięk G-zwiększony (G-H-Dis). Żeby zamienić go w G-dur, trzeba obniżyć jeden dźwięk o pół tonu. Który?",
            hint: "Zmienia się górny dźwięk — kwinta.",
            options: ["G", "H", "Dis"],
            correctOptionIndex: 2,
            explanation: "Obniżenie Dis do D (kwinta zwiększona → kwinta czysta) daje G-dur (G-H-D).",
            notationNotes: ["G4", "B4", "D#5"],
          },
        },
      ],
    },
    {
      // Same triad-quality-choice recognition task as lekcje 2/6, but in a
      // much wider register (C3-C6) instead of the fixed C4-C5 every
      // earlier lesson uses — the same idea Pasmo Interwałów's own "wide
      // register" lesson applies to intervals.
      id: "zt-poziom-9-szerszy-rejestr",
      order: 9,
      difficulty: 3,
      introSlides: [
        {
          body: "Ten sam trening co wcześniej, ale w dużo szerszym rejestrze — od C3 do C6. Ten sam rodzaj trójdźwięku brzmi inaczej nisko niż wysoko, ale to wciąż ten sam rodzaj. Ucho musi go rozpoznać niezależnie od tego, gdzie w skali akurat gra.",
        },
      ],
      exercises: [
        { id: "zt-l9-e1", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e2", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e3", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e4", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e5", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e6", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l9-e7", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
      ],
    },
    {
      // The "trójdźwięk rozłożony" (broken/arpeggiated chord) turn — every
      // lekcja until now played all three notes at once (playChord). Here
      // they play one after another (arpeggiated: true → playArpeggiated
      // Triad, see player.ts) — the same triad, but recognized as a
      // spread-out shape instead of one combined sound.
      id: "zt-poziom-10-trojdzwiek-rozlozony",
      order: 10,
      difficulty: 3,
      introSlides: [
        {
          body: "Do tej pory trójdźwięk zawsze brzmiał jako trzy dźwięki naraz. Teraz zabrzmi jako trójdźwięk ROZŁOŻONY — dźwięki jeden po drugim, tak jak na gitarze czy harfie. To nadal ten sam trójdźwięk, tylko rozłożony w czasie — Twoje ucho musi rozpoznać jego rodzaj także w tej formie.",
        },
      ],
      exercises: [
        { id: "zt-l10-e1", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true } },
        { id: "zt-l10-e2", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true } },
        { id: "zt-l10-e3", type: "triad-quality-choice", difficulty: 2, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true } },
        { id: "zt-l10-e4", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true, hideNotation: true } },
        { id: "zt-l10-e5", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true, hideNotation: true } },
        { id: "zt-l10-e6", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true, hideNotation: true } },
        { id: "zt-l10-e7", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true, hideNotation: true } },
      ],
    },
    {
      // The triad world's own "two in a row" idea — same shape as Pasmo
      // Interwałów's interval-sequence-choice lekcje 11-12, applied to
      // triad qualities instead of interval names. Narrow pool (dur/moll
      // only, the two most common qualities) here on purpose: holding two
      // full chords in memory at once is the new difficulty, not also
      // facing all four qualities.
      id: "zt-poziom-11-dwa-trojdzwieki",
      order: 11,
      difficulty: 3,
      introSlides: [
        {
          body: "Teraz usłyszysz dwa trójdźwięki pod rząd, jeden zaraz po drugim — każdy z nich brzmi normalnie, jako trzy dźwięki naraz. Twoje zadanie to nazwać rodzaj OBU, każdy osobno, w swoim okienku.",
        },
      ],
      exercises: [
        { id: "zt-l11-e1", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l11-e2", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l11-e3", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l11-e4", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l11-e5", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l11-e6", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
      ],
    },
    {
      // Lekcja 11, all four qualities instead of just dur/moll — same
      // "narrow → full" step Pasmo Interwałów's own lekcja 12 takes after
      // its own lekcja 11.
      id: "zt-poziom-12-dwa-trojdzwieki-pelny-zakres",
      order: 12,
      difficulty: 3,
      introSlides: [
        {
          body: "Ten sam pomysł co w poprzedniej lekcji, ale teraz mogą pojawić się WSZYSTKIE rodzaje trójdźwięków — nie tylko dur i moll, ale też zmniejszony i zwiększony.",
        },
      ],
      exercises: [
        { id: "zt-l12-e1", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l12-e2", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l12-e3", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l12-e4", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l12-e5", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l12-e6", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
      ],
    },
    {
      // Three in a row instead of two — back to the narrow dur/moll pool
      // (like lekcja 11), since adding a third position is already a
      // meaningfully bigger memory load on its own.
      id: "zt-poziom-13-trzy-trojdzwieki",
      order: 13,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy trójdźwięki pod rząd zamiast dwóch — jeszcze więcej do zapamiętania, zanim zdążysz odpowiedzieć na pierwsze pytanie.",
        },
      ],
      exercises: [
        { id: "zt-l13-e1", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l13-e2", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l13-e3", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l13-e4", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l13-e5", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
        { id: "zt-l13-e6", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"], allowedQualities: ["major", "minor"] } },
      ],
    },
    {
      // The capstone of this whole "sequence" idea — three in a row, all
      // four qualities. Same step as lekcja 12 took after lekcja 11.
      id: "zt-poziom-14-trzy-trojdzwieki-pelny-zakres",
      order: 14,
      difficulty: 3,
      introSlides: [
        {
          body: "Trzy trójdźwięki, wszystkie rodzaje — najtrudniejsza wersja tego ćwiczenia. Wszystko, czego się nauczyłeś o rozpoznawaniu trójdźwięków, naraz.",
        },
      ],
      exercises: [
        { id: "zt-l14-e1", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l14-e2", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l14-e3", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l14-e4", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l14-e5", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l14-e6", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
      ],
    },
    {
      // Boss lekcja — Smok Trójgłos. Jak Arytmik/Ośmiotakt/Oktawiusz: mix
      // ćwiczeń REUSED z wcześniejszych lekcji tej krainy (te same specs,
      // skopiowane) zamiast świeżo pisanej treści — rozpoznawanie rodzaju
      // (zwykłe i rozłożone), T/S/D, i sekwencje dwóch/trzech trójdźwięków.
      id: "zt-poziom-15-boss-trojglos",
      order: 15,
      difficulty: 3,
      isBoss: true,
      bossName: "Trójgłos",
      introSlides: [
        {
          body: "Trójgłowy Smok Trójgłos wynurza się z zatoki — każda jego głowa śpiewa inny dźwięk trójdźwięku, ale zamiast współbrzmieć, kłócą się ze sobą. Żeby go pokonać, pokaż, że rozpoznajesz trójdźwięki w każdej formie: zwykłej, rozłożonej, jako T/S/D i w sekwencjach.",
          bossPortrait: true,
        },
      ],
      exercises: [
        { id: "zt-l15-e1", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C3", "C6"], hideNotation: true } },
        { id: "zt-l15-e2", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"], arpeggiated: true, hideNotation: true } },
        { id: "zt-l15-e3", type: "triad-notes-choice", difficulty: 3, spec: { type: "triad-notes-choice", fifthsRange: [-5, 5] } },
        { id: "zt-l15-e4", type: "triad-role-choice", difficulty: 3, spec: { type: "triad-role-choice", fifthsRange: [-5, 5], hideNotation: true } },
        { id: "zt-l15-e5", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 2, noteRange: ["C4", "C5"] } },
        { id: "zt-l15-e6", type: "triad-quality-sequence-choice", difficulty: 3, spec: { type: "triad-quality-sequence-choice", sequenceLength: 3, noteRange: ["C4", "C5"] } },
        { id: "zt-l15-e7", type: "triad-fact-choice", difficulty: 2, spec: { type: "triad-fact-choice", prompt: "Masz trójdźwięk C-dur (C-E-G). Żeby zamienić go w c-moll, trzeba obniżyć jeden dźwięk o pół tonu. Który?", hint: "Zmienia się środkowy dźwięk — tercja.", options: ["C", "E", "G"], correctOptionIndex: 1, explanation: "Obniżenie E do Es (tercja wielka → tercja mała) daje c-moll (C-Es-G).", notationNotes: ["C4", "E4", "G4"] } },
        { id: "zt-l15-e8", type: "triad-quality-choice", difficulty: 3, spec: { type: "triad-quality-choice", noteRange: ["C4", "C5"] } },
      ],
    },
  ],
};
