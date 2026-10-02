import type { WorldContent } from "@/types/exercises";

/**
 * "Zaczarowany Solfeż" — a new world (not ported from the web app), the
 * LAST in the whole curriculum. Teaches sight-singing: reading a note off
 * the staff and singing it back, named by its solmization (solfège)
 * syllable — do/re/mi/fa/sol/la/si — rather than the C/D/E/F/G/A/H letter
 * names every earlier world teaches (see lib/music/solfege.ts's own doc
 * on why that's a genuinely different naming system, introduced here for
 * the first time on purpose). This is also the only world whose exercises
 * read the MICROPHONE rather than just playing sound back — except its
 * first four lessons (zs-sluch-1..4), which are listening-only and need
 * no microphone: the player hears a short C–F–G–C cadence (so "do" is
 * heard as home), then one note or a few in a row, and names each by its
 * syllable from buttons (solfege-syllable-choice — see components/
 * exercises/SolfegeSyllableChoiceExercise.tsx). The button set widens
 * lesson by lesson (do/sol → do/re/mi → do…sol → the full scale), and
 * the lessons' own `order` is 1-4, ahead of the singing lessons' 5-11
 * (their ids are unchanged, so saved progress still applies).
 *
 * The last five lessons (zs-melodie-1..5, orders 12-16), followed by the world's boss lesson zs-boss-mirefa (order 17: a mix — four listening exercises, then six metronome melodies covering triads, intervals, the dominant seventh and inversions) are short real
 * melodies and solfèges in "nagranie, potem metronom" form
 * (solfege-phrase-singing with `withMetronome`): 🔊 plays the phrase with
 * its written rhythm (synthesized piano, or a real recording if a
 * `referenceAudioSource` is ever supplied), then "Nagraj" plays only a
 * count-in + metronome click while the player sings — no recording at
 * all (`metronomeOnly`, "Sprawdź siebie": nothing is graded). Pitch-only grading,
 * C major, quarter/half/whole/eighth values only (no dotted notes — those
 * belong to Gaj Grupowania/Szczyt Dyktand), tempo <= 72 bpm. The tunes
 * (Panie Janie, Hot cross buns, Mary had a little lamb, Au clair de la
 * lune, Oda do radości) are traditional/public-domain, set in C major.
 *
 * The singing lessons use two exercise types, both graded the same underlying way (record via
 * expo-audio's useAudioRecorder, analyze with lib/audio/pitchDetection.ts's
 * autocorrelation estimator, compare octave-folded — see lib/music/
 * notes.ts's octaveFoldedCentsDifference):
 *
 *   - solfege-note-singing (level 1's own first 5 exercises only): ONE
 *     held note per exercise, with an "odsłuchaj siebie" step to hear your
 *     own take before checking — see components/exercises/
 *     SolfegeNoteSingingExercise.tsx's own doc.
 *   - solfege-phrase-singing (every other exercise in the world, levels
 *     1's trailing one through 7): a FIXED, authored sequence sung as one
 *     continuous take, ALWAYS free-tempo — no self-playback step, sung at
 *     the player's own pace, with the same live per-note highlight/coaching
 *     while recording — see components/exercises/
 *     SolfegePhraseSingingExercise.tsx's own doc. Grading is PITCH ONLY
 *     throughout this whole world — `gradeRhythm`/`bpm` (see ExerciseSpec's
 *     own doc) are never set anywhere here; a metronome-graded level 4 was
 *     built and then deliberately replaced with this world's own singing
 *     curriculum (intervals → triads → inversions → the dominant seventh)
 *     instead, so there is no rhythm-grading content in this world at all.
 *
 * Singing levels (ids zs-poziom-1..7, which the rest of this doc calls
 * "level 1"-"level 7"), level-by-level content, all sung as ordered sequences via
 * solfege-phrase-singing (never simultaneously — this app's mic pipeline
 * is single-voice, so a "chord" here always means "sing its notes one
 * after another," i.e. arpeggiated):
 *   1. The plain scale: 5 single-note warm-up exercises (do-re-mi-fa-sol,
 *      solfege-note-singing) then the whole octave scale in one take.
 *   2. Short melodic fragments within do-sol, real rhythm notation shown/
 *      heard but NOT graded (pitch only) — simplest (four quarter notes)
 *      to most complex (the full do-sol-do run).
 *   3. The same idea harder: the FULL octave (do-do'), genuine skips
 *      (thirds), runs of eighth notes.
 *   4. Interwały (intervals): every interval FROM "do" (C4), in ascending
 *      size order — sekunda, tercja, kwarta, kwinta, seksta, septyma,
 *      oktawa (2nd through octave) — 2 notes each, "po kolei" (in order)
 *      by size, one exercise per interval.
 *   5. Trójdźwięki (triads), in the spirit of "Zatoka Trójdźwięków"'s own
 *      T-S-D lesson: the diatonic triads of C major sung as ascending
 *      arpeggios (root-third-fifth), scale degrees I, ii, IV, V, vi —
 *      covers both durowy (major: I, IV, V) and molowy (minor: ii, vi)
 *      quality by ear, the two "stable" triad qualities Zatoka's own
 *      world teaches, without needing any accidental (see the note on
 *      natural-notes-only below for why zmniejszony/zwiększony — which
 *      Zatoka's OWN C-rooted demo needs Eb/Gb/G# for — aren't used here).
 *   6. Przewroty (inversions), in the spirit of "Jaskinia Akordów": C
 *      major's own three positions (postać zasadnicza, sekstakord,
 *      kwartsekstakord — root/1st/2nd inversion), plus two already-
 *      learned triads from level 5 (S, D) sung again for reinforcement
 *      ("poznanych trójdźwięków").
 *   7. Dominanta krok po kroku (the dominant seventh, in the spirit of
 *      "Cytadela Dominant"): C major's own dominant seventh chord — G-B-
 *      D-F, ALL natural notes since it's built on the 5th degree of the
 *      diatonic scale itself, not chromatically on C the way Cytadela's
 *      own C-E-G-Bb demo is — built up ONE NOTE AT A TIME across
 *      exercises (root+third → +fifth, the "D" triad already known from
 *      level 5 → +seventh, the full D⁷), then the complete chord once
 *      more ascending and once more descending for reinforcement.
 *
 * Levels 4-7's chord/interval content is deliberately constrained to
 * NATURAL NOTES ONLY, same as every earlier level — this world's own
 * solfège naming (lib/music/solfege.ts) has no chromatic forms (no "do
 * dièse"), so content that would need one (Zatoka's zmniejszony/
 * zwiększony triads, Jaskinia's C-minor examples, Cytadela's C-rooted
 * dominant seventh) is reframed onto C MAJOR'S OWN diatonic degrees
 * instead, which happens to cover the same concepts (a minor triad, a
 * dominant seventh) using only the white keys this world has taught from
 * day one. Levels 5-7 also sing a bit higher than levels 1-4's own C4-C5
 * ceiling (up to E5 for triads/inversions, F5 for the complete dominant
 * seventh) — each of those lessons widens its own pianoKeyboardReference
 * to match, rather than stretching the whole world's range from level 1.
 *
 * Levels 4-7's intro slides use LessonTheorySlide's own intervalExamples/
 * triadExamples fields (IntroSlideCards.tsx's own render branches) for
 * their playable "co można odtworzyć" examples — the SAME mechanism (and
 * the exact same note choices, adapted for the natural-notes constraint
 * above) Pasmo Interwałów/Zatoka Trójdźwięków/Jaskinia Akordów/Cytadela
 * Dominant already use for their own (non-singing, multiple-choice)
 * intro slides, so tapping 🔊 on an example here plays the SAME kind of
 * instrument reference tone those worlds' own intro slides already do —
 * not a genuinely new mechanism, just this world's first use of it.
 *
 * One deliberate substitution worth flagging: the brief asked for an
 * example "performed by voice" before the student sings — this app has no
 * recorded solfège-singing audio to demonstrate with (and no on-device
 * singing-voice synthesis exists), so "🔊 posłuchaj przykładu" plays this
 * app's existing reference piano tone (the exact same NOTE_SAMPLES/
 * MELODY_NOTE_SAMPLES set every other world's "listen" buttons already
 * use) instead — a real, in-tune reference to match, just an instrument
 * rather than a fabricated voice.
 *
 * Every lesson here sets LessonDefinition's own pianoKeyboardReference —
 * a "Zapoznaj się (pianino)" toggle shown above every exercise (see
 * components/exercises/PianoKeyboardRecap.tsx), collapsed by default, so
 * the player can tap around a real keyboard for a quick reminder of what
 * a note sounds like before singing it. Since every exercise here is
 * graded entirely by ear, this is useful at every single one — unlike
 * ExerciseIntroRecap's own "Zapoznaj się" (theory text), which most other
 * worlds also carry, this is its own separate toggle so the keyboard is
 * one tap away rather than nested inside that recap's cards.
 *
 * NO EXERCISE MAY REPEAT within one lesson attempt (explicit requirement)
 * — lib/questions/generate.ts's own "solfege-note-singing" case enforces
 * this DETERMINISTICALLY (filters the candidate pool down to notes not yet
 * used this attempt, rather than the probabilistic retry-and-hope-for-no-
 * collision generateWithoutRepeat every other randomized exercise type
 * uses), which only actually guarantees zero repeats when a lesson's own
 * solfege-note-singing count never exceeds its noteRange's distinct-
 * natural-note count — level 1's first 5 exercises set their count to
 * EXACTLY its noteRange's own count (C4-G4 has 5 natural notes, do-sol).
 * Every solfege-phrase-singing exercise everywhere in this world (level
 * 1's trailing one through all of 2-7) is fixed, authored content (not
 * randomly generated), so this concern doesn't apply to them.
 */
export const ZACZAROWANY_SOLFEZ_CONTENT: WorldContent = {
  worldId: "zaczarowany-solfez",
  lessons: [
    {
      id: "zs-sluch-1-dom-do",
      order: 1,
      difficulty: 1,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Zanim zaczniesz śpiewać, nauczysz się SŁUCHAĆ. Solfeż to nazwy dźwięków: do, re, mi, fa, sol, la, si. Dźwięk „do” to taki dźwiękowy DOM — wszystkie inne dźwięki „kręcą się” wokół niego.",
          staffNote: "C4",
        },
        {
          body: "W tej lekcji poznasz dwa dźwięki: „do” (dom, spokojny) i „sol” (wyżej, jasny). Naciśnij 🔊 przy każdym z nich, tyle razy, ile chcesz.",
          noteExamples: [
            { note: "C4", label: "do" },
            { note: "G4", label: "sol" },
          ],
        },
        {
          body: "Przed każdym dźwiękiem usłyszysz cztery krótkie akordy — one pokazują, gdzie jest „dom”. Potem zagra dźwięk, a Ty wskażesz jego nazwę. Możesz słuchać bez końca: 🔊 gra wszystko od początku, a „Tylko dźwięk” — samą nutę.",
        },
      ],
      exercises: [
        { id: "zs-sluch-l1-e1", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"] } },
        { id: "zs-sluch-l1-e2", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"] } },
        { id: "zs-sluch-l1-e3", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"], length: 2 } },
        { id: "zs-sluch-l1-e4", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"], length: 2 } },
        { id: "zs-sluch-l1-e5", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"], length: 3 } },
        { id: "zs-sluch-l1-e6", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "G4"], length: 3 } },
      ],
    },
    {
      id: "zs-sluch-2-do-re-mi",
      order: 2,
      difficulty: 1,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Czas na trzy pierwsze schodki gamy: do, re, mi. Każdy kolejny jest odrobinę wyżej od poprzedniego. Posłuchaj ich po kolei.",
          noteExamples: [
            { note: "C4", label: "do" },
            { note: "D4", label: "re" },
            { note: "E4", label: "mi" },
          ],
        },
        {
          body: "Wskazówka: „do” brzmi jak miejsce, w którym można odpocząć. „Mi” jest od niego dość daleko, a „re” — tuż obok. Jeśli się pogubisz, kliknij „Tylko dźwięk” i posłuchaj jeszcze raz.",
        },
        {
          body: "Dwa dźwięki z rzędu znasz już z poprzedniej lekcji — tu zdarzają się częściej. Wskaż ich nazwy po kolei: kliknij pierwszą sylabę, potem drugą. Pomyłkę poprawisz, dotykając pola z sylabą.",
        },
      ],
      exercises: [
        { id: "zs-sluch-l2-e1", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"] } },
        { id: "zs-sluch-l2-e2", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"] } },
        { id: "zs-sluch-l2-e3", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"] } },
        { id: "zs-sluch-l2-e4", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"], length: 2 } },
        { id: "zs-sluch-l2-e5", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"], length: 2 } },
        { id: "zs-sluch-l2-e6", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4"], length: 2 } },
      ],
    },
    {
      id: "zs-sluch-3-pierwsza-piatka",
      order: 3,
      difficulty: 2,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Dokładamy dwa dźwięki: fa i sol. Teraz znasz już pierwsze pięć dźwięków gamy: do, re, mi, fa, sol. Posłuchaj ich.",
          noteExamples: [
            { note: "C4", label: "do" },
            { note: "D4", label: "re" },
            { note: "E4", label: "mi" },
            { note: "F4", label: "fa" },
            { note: "G4", label: "sol" },
          ],
        },
        {
          body: "Pięć dźwięków to sporo, więc słuchaj spokojnie. Dobry trik: zanim klikniesz odpowiedź, spróbuj zanucić dźwięk w myślach i zastanów się, czy jest blisko „domu” (do), czy daleko od niego.",
        },
      ],
      exercises: [
        { id: "zs-sluch-l3-e1", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"] } },
        { id: "zs-sluch-l3-e2", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"] } },
        { id: "zs-sluch-l3-e3", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"] } },
        { id: "zs-sluch-l3-e4", type: "solfege-syllable-choice", difficulty: 2, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"], length: 2 } },
        { id: "zs-sluch-l3-e5", type: "solfege-syllable-choice", difficulty: 2, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"], length: 2 } },
        { id: "zs-sluch-l3-e6", type: "solfege-syllable-choice", difficulty: 2, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4"], length: 3 } },
      ],
    },
    {
      id: "zs-sluch-4-cala-gama",
      order: 4,
      difficulty: 2,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Na koniec słuchania — cała gama: do, re, mi, fa, sol, la, si i znowu do, ale wyżej. Dwa „do” brzmią podobnie, bo to ten sam dźwięk, tylko jedno jest wyżej — dlatego oba nazywają się „do”.",
          noteExamples: [
            { note: "C4", label: "do" },
            { note: "D4", label: "re" },
            { note: "E4", label: "mi" },
            { note: "F4", label: "fa" },
            { note: "G4", label: "sol" },
            { note: "A4", label: "la" },
            { note: "B4", label: "si" },
            { note: "C5", label: "do" },
          ],
        },
        {
          body: "Siedem sylab to dużo przycisków, ale masz je ułożone od najniższej do najwyższej, tak jak w gamie. Słuchaj tyle razy, ile potrzebujesz. Po tej lekcji możesz zacząć śpiewać — z mikrofonem albo bez.",
        },
      ],
      exercises: [
        { id: "zs-sluch-l4-e1", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] } },
        { id: "zs-sluch-l4-e2", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] } },
        { id: "zs-sluch-l4-e3", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] } },
        { id: "zs-sluch-l4-e4", type: "solfege-syllable-choice", difficulty: 1, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] } },
        { id: "zs-sluch-l4-e5", type: "solfege-syllable-choice", difficulty: 2, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], length: 2 } },
        { id: "zs-sluch-l4-e6", type: "solfege-syllable-choice", difficulty: 2, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], length: 3 } },
      ],
    },
    {
      id: "zs-poziom-1-cala-gama",
      order: 5,
      difficulty: 1,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Solfeż to śpiewanie nut na specjalne sylaby, zamiast liter: do, re, mi, fa, sol, la, si. To dokładnie te same dźwięki, które już znasz jako C, D, E, F, G, A, H — tylko teraz będziesz je ŚPIEWAĆ, nie tylko rozpoznawać na pięciolinii.",
          staffNote: "C4",
        },
        {
          body: "Zanim spróbujesz, posłuchaj każdego dźwięku osobno — naciśnij 🔊 przy dowolnej nucie poniżej, tyle razy, ile chcesz.",
          noteExamples: [
            { note: "C4", label: "do" },
            { note: "D4", label: "re" },
            { note: "E4", label: "mi" },
            { note: "F4", label: "fa" },
            { note: "G4", label: "sol" },
            { note: "A4", label: "la" },
            { note: "B4", label: "si" },
            { note: "C5", label: "do" },
          ],
        },
        {
          body: "Najpierw poćwiczysz pojedyncze dźwięki, każdy z własnym nagraniem. Potem, w ostatnim zadaniu, zaśpiewasz całą gamę na raz: do re mi fa sol la si do — we własnym tempie, bez żadnych kliknięć. Naciśnij 'Nagraj' i śpiewaj kolejno, tak jak Ci wygodnie. Aplikacja od razu sprawdzi nagranie przez mikrofon.",
        },
      ],
      exercises: [
        { id: "zs-l1-e1", type: "solfege-note-singing", difficulty: 1, spec: { type: "solfege-note-singing", noteRange: ["C4", "G4"], toleranceCents: 70 } },
        { id: "zs-l1-e2", type: "solfege-note-singing", difficulty: 1, spec: { type: "solfege-note-singing", noteRange: ["C4", "G4"], toleranceCents: 70 } },
        { id: "zs-l1-e3", type: "solfege-note-singing", difficulty: 1, spec: { type: "solfege-note-singing", noteRange: ["C4", "G4"], toleranceCents: 70 } },
        { id: "zs-l1-e4", type: "solfege-note-singing", difficulty: 1, spec: { type: "solfege-note-singing", noteRange: ["C4", "G4"], toleranceCents: 70 } },
        { id: "zs-l1-e5", type: "solfege-note-singing", difficulty: 1, spec: { type: "solfege-note-singing", noteRange: ["C4", "G4"], toleranceCents: 70 } },
        {
          id: "zs-l1-e6",
          type: "solfege-phrase-singing",
          difficulty: 1,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], toleranceCents: 80 },
        },
      ],
    },
    {
      id: "zs-poziom-2-do-sol",
      order: 6,
      difficulty: 2,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Teraz zaśpiewasz małe fragmenty melodii, zapisane na pięciolinii tak jak prawdziwe utwory — z różnym rytmem: niektóre dźwięki trwają dłużej, inne krócej. Naciśnij 🔊, żeby usłyszeć melodię, a potem zaśpiewaj ją tak samo, we własnym tempie. Zaczynamy od najprostszych fragmentów.",
        },
        {
          body: "Uwaga: na razie liczy się tylko to, czy śpiewasz właściwe dźwięki — nie musisz trzymać dokładnego rytmu zapisanego na pięciolinii. Rytm zobaczysz i usłyszysz w melodii, ale oceniana jest wyłącznie wysokość dźwięku.",
        },
        {
          body: "Jeśli chcesz sobie przypomnieć, jak brzmi każdy dźwięk, przy każdym zadaniu znajdziesz przycisk 'Zapoznaj się (pianino)' — rozwiń go i pokliknij w klawisze.",
        },
      ],
      exercises: [
        {
          id: "zs-l2-e1",
          type: "solfege-phrase-singing",
          difficulty: 2,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "D4"], rhythm: ["quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, toleranceCents: 70 },
        },
        {
          id: "zs-l2-e2",
          type: "solfege-phrase-singing",
          difficulty: 2,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4"], rhythm: ["quarter", "quarter", "half"], meter: "4/4", isFragment: true, toleranceCents: 70 },
        },
        {
          id: "zs-l2-e3",
          type: "solfege-phrase-singing",
          difficulty: 2,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C4", "D4", "E4", "D4", "C4"],
            rhythm: ["quarter", "eighth", "eighth", "quarter", "quarter"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 70,
          },
        },
        {
          id: "zs-l2-e4",
          type: "solfege-phrase-singing",
          difficulty: 2,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4"],
            rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "whole"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 70,
          },
        },
        {
          id: "zs-l2-e5",
          type: "solfege-phrase-singing",
          difficulty: 2,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["G4", "E4", "F4", "D4", "E4", "C4"],
            rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "dottedHalf"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 70,
          },
        },
      ],
    },
    {
      id: "zs-poziom-3-cala-gama",
      order: 7,
      difficulty: 3,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Znowu fragmenty melodii, tak jak w poprzednim poziomie — ale teraz trudniejsze: całą oktawę (do-do'), ze skokami (nie tylko sąsiednie dźwięki) i szybszymi nutami. Wciąż liczy się tylko wysokość dźwięku, nie dokładny rytm. Naciśnij 🔊, żeby usłyszeć melodię przed zaśpiewaniem.",
          staffNote: "C5",
        },
      ],
      exercises: [
        {
          id: "zs-l3-e1",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4"],
            rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "dottedHalf"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 65,
          },
        },
        {
          id: "zs-l3-e2",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["G4", "A4", "B4", "C5"],
            rhythm: ["quarter", "quarter", "quarter", "quarter"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 65,
          },
        },
        {
          id: "zs-l3-e3",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C4", "E4", "G4", "E4", "C4"],
            rhythm: ["quarter", "quarter", "quarter", "quarter", "whole"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 65,
          },
        },
        {
          id: "zs-l3-e4",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
            rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "dottedHalf"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 65,
          },
        },
        {
          id: "zs-l3-e5",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: {
            type: "solfege-phrase-singing",
            notes: ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],
            rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "dottedHalf"],
            meter: "4/4",
            isFragment: true,
            toleranceCents: 65,
          },
        },
      ],
    },
    {
      id: "zs-poziom-4-interwaly",
      order: 8,
      difficulty: 3,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Interwał to odległość między dwoma dźwiękami. Teraz zaśpiewasz interwały zbudowane na 'do' (C4), jeden po drugim, od najmniejszego do największego — sekunda, tercja, kwarta, kwinta, seksta, septyma i na końcu cała oktawa. Posłuchaj każdego z nich osobno.",
          intervalExamples: [
            { notes: ["C4", "D4"], label: "sekunda wielka" },
            { notes: ["C4", "E4"], label: "tercja wielka" },
            { notes: ["C4", "F4"], label: "kwarta czysta" },
            { notes: ["C4", "G4"], label: "kwinta czysta" },
            { notes: ["C4", "A4"], label: "seksta wielka" },
            { notes: ["C4", "B4"], label: "septyma wielka" },
            { notes: ["C4", "C5"], label: "oktawa czysta" },
          ],
        },
        {
          body: "Śpiewasz tak samo jak wcześniej — we własnym tempie, nuta po nucie, z podświetlaniem i podpowiedziami wyżej/niżej. Liczy się tylko wysokość dźwięku: najpierw 'do', potem drugi dźwięk interwału.",
        },
      ],
      exercises: [
        {
          id: "zs-l4-e1",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e2",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e3",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "F4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e4",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "G4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e5",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "A4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e6",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "B4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l4-e7",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "C5"], isFragment: true, toleranceCents: 60 },
        },
      ],
    },
    {
      id: "zs-poziom-5-trojdzwieki",
      order: 9,
      difficulty: 4,
      pianoKeyboardReference: { range: ["C4", "E5"] },
      introSlides: [
        {
          body: "Trójdźwięk to trzy dźwięki ułożone jeden nad drugim w tercjach — zaśpiewasz je po kolei, od najniższego do najwyższego, jak małą melodię. Zaśpiewasz pięć trójdźwięków zbudowanych na wybranych stopniach gamy C-dur — niektóre brzmią jasno (durowe), inne smutniej (molowe). Jeśli dźwięki są dla Ciebie za wysokie, możesz śpiewać oktawę niżej — aplikacja to rozpozna.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "I stopień — C-dur (durowy)", degrees: [1, 3, 5] },
            { notes: ["D4", "F4", "A4"], label: "II stopień — d-moll (molowy)", degrees: [1, 3, 5] },
            { notes: ["F4", "A4", "C5"], label: "IV stopień — F-dur (durowy)", degrees: [1, 3, 5] },
            { notes: ["G4", "B4", "D5"], label: "V stopień — G-dur (durowy)", degrees: [1, 3, 5] },
            { notes: ["A4", "C5", "E5"], label: "VI stopień — a-moll (molowy)", degrees: [1, 3, 5] },
          ],
        },
        {
          body: "Trójdźwięki zbudowane na I, IV i V stopniu to tonika, subdominanta i dominanta (T-S-D) — najważniejsze akordy każdej tonacji. Śpiewasz je tak samo jak wcześniej: we własnym tempie, nuta po nucie, liczy się tylko wysokość dźwięku.",
        },
      ],
      exercises: [
        {
          id: "zs-l5-e1",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4"], isFragment: true, toleranceCents: 55 },
        },
        {
          id: "zs-l5-e2",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["D4", "F4", "A4"], isFragment: true, toleranceCents: 55 },
        },
        {
          id: "zs-l5-e3",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["F4", "A4", "C5"], isFragment: true, toleranceCents: 55 },
        },
        {
          id: "zs-l5-e4",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5"], isFragment: true, toleranceCents: 55 },
        },
        {
          id: "zs-l5-e5",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["A4", "C5", "E5"], isFragment: true, toleranceCents: 55 },
        },
      ],
    },
    {
      id: "zs-poziom-6-przewroty",
      order: 10,
      difficulty: 4,
      pianoKeyboardReference: { range: ["C4", "E5"] },
      introSlides: [
        {
          body: "Ten sam trójdźwięk można zaśpiewać od różnych dźwięków — to przewroty. Postać zasadnicza zaczyna się od prymy (do), sekstakord od tercji (mi), kwartsekstakord od kwinty (sol). To wciąż DOKŁADNIE te same trzy dźwięki, tylko w innej kolejności.",
          triadExamples: [
            { notes: ["C4", "E4", "G4"], label: "postać zasadnicza", degrees: [1, 3, 5] },
            { notes: ["E4", "G4", "C5"], label: "sekstakord — I przewrót", degrees: [3, 5, 1] },
            { notes: ["G4", "C5", "E5"], label: "kwartsekstakord — II przewrót", degrees: [5, 1, 3] },
          ],
        },
        {
          body: "Na koniec zaśpiewasz jeszcze raz dwa trójdźwięki, które już znasz z poprzedniego poziomu (S i D) — utrwalenie. Wciąż liczy się tylko wysokość dźwięku, we własnym tempie.",
        },
      ],
      exercises: [
        {
          id: "zs-l6-e1",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4"], isFragment: true, toleranceCents: 50 },
        },
        {
          id: "zs-l6-e2",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "G4", "C5"], isFragment: true, toleranceCents: 50 },
        },
        {
          id: "zs-l6-e3",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "C5", "E5"], isFragment: true, toleranceCents: 50 },
        },
        {
          id: "zs-l6-e4",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["F4", "A4", "C5"], isFragment: true, toleranceCents: 50 },
        },
        {
          id: "zs-l6-e5",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5"], isFragment: true, toleranceCents: 50 },
        },
      ],
    },
    {
      id: "zs-poziom-7-dominanta",
      order: 11,
      difficulty: 5,
      pianoKeyboardReference: { range: ["G4", "F5"] },
      introSlides: [
        {
          body: "Ostatni poziom śpiewania akordów: dominanta septymowa, krok po kroku. To trójdźwięk dominanty (który już znasz — sol-si-re), z dodatkowym, czwartym dźwiękiem na górze — septymą. Zbudujesz ten akord po kolei, dźwięk po dźwięku. Jeśli dźwięki są dla Ciebie za wysokie, możesz śpiewać oktawę niżej — aplikacja to rozpozna.",
          triadExamples: [
            { notes: ["G4", "B4"], label: "krok 1: pryma + tercja", degrees: [1, 3] },
            { notes: ["G4", "B4", "D5"], label: "krok 2: + kwinta (już znane D)", degrees: [1, 3, 5] },
            { notes: ["G4", "B4", "D5", "F5"], label: "krok 3: + septyma — cała dominanta septymowa", degrees: [1, 3, 5, 7] },
          ],
        },
        {
          body: "Ostatnie dwa zadania to ten sam akord w całości — raz w górę, raz w dół — dla utrwalenia. Gratulacje, że dotarłaś/eś tak daleko: to już prawdziwe śpiewanie akordów głosem!",
        },
      ],
      exercises: [
        {
          id: "zs-l7-e1",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l7-e2",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l7-e3",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5", "F5"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l7-e4",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5", "F5"], isFragment: true, toleranceCents: 60 },
        },
        {
          id: "zs-l7-e5",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["F5", "D5", "B4", "G4"], isFragment: true, toleranceCents: 60 },
        },
      ],
    },
    {
      id: "zs-melodie-1-kroki",
      order: 12,
      difficulty: 3,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Czas na prawdziwe melodie! W tym poziomie zaśpiewasz krótkie fragmenty znanych piosenek, zapisane w C-dur — używasz tylko dźwięków, które już znasz: do, re, mi, fa, sol.",
        },
        {
          body: "Każde zadanie ma dwa kroki. Najpierw posłuchaj nagrania — naciśnij 🔊 (tyle razy, ile chcesz) i śledź nuty na pięciolinii. Potem naciśnij „Śpiewaj z metronomem”: usłyszysz tylko metronom, czyli równe stuknięcia. Dwa pierwsze to odliczanie, a przy trzecim zaczynasz śpiewać razem z nim — zielona nuta pokazuje, którą śpiewasz teraz. Mikrofon nie jest tu potrzebny. To zadania „Sprawdź siebie”: nikt tu nie ocenia nagrania — decydujesz samodzielnie, czy się udało, i możesz próbować, aż Ci się spodoba.",
        },
        {
          body: "Za szybko? Włącz przełącznik „🐌 Wolno” — i nagranie, i metronom zwolnią. Kropka metronomu pozwala też najpierw sprawdzić samo tempo. Możesz powtarzać tyle razy, ile chcesz.",
        },
      ],
      exercises: [
        {
          id: "zs-m1-e1",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "C4", "C4", "D4", "E4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Panie Janie” — melodia ludowa (1. fraza)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m1-e2",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "F4", "G4", "E4", "F4", "G4"], rhythm: ["quarter", "quarter", "half", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Panie Janie” — melodia ludowa (2. fraza)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m1-e3",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "D4", "C4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "half", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Hot cross buns” — angielska rymowanka ludowa (początek)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m1-e4",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "C4", "C4", "C4", "D4", "D4", "D4", "D4", "E4", "D4", "C4"], rhythm: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Hot cross buns” — angielska rymowanka ludowa (dalszy ciąg i zakończenie)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m1-e5",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "D4", "C4", "D4", "E4", "E4", "E4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Mary had a little lamb” — amerykańska piosenka dziecięca (początek)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m1-e6",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "C4", "C4", "D4", "E4", "D4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "half", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Au clair de la lune” — francuska piosenka ludowa (początek)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
      ],
    },
    {
      id: "zs-melodie-2-dluzsze-frazy",
      order: 13,
      difficulty: 3,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Kolejne melodie są odrobinę dłuższe, a niektóre mają skoki o tercję (pomijasz jeden dźwięk) w górę lub w dół — za to wszystko nadal mieści się w C-dur. Ostatnie dwa zadania to krótkie solfeże ułożone specjalnie do ćwiczeń.",
        },
        {
          body: "Każde zadanie ma dwa kroki. Najpierw posłuchaj nagrania — naciśnij 🔊 (tyle razy, ile chcesz) i śledź nuty na pięciolinii. Potem naciśnij „Śpiewaj z metronomem”: usłyszysz tylko metronom, czyli równe stuknięcia. Dwa pierwsze to odliczanie, a przy trzecim zaczynasz śpiewać razem z nim — zielona nuta pokazuje, którą śpiewasz teraz. Mikrofon nie jest tu potrzebny. To zadania „Sprawdź siebie”: nikt tu nie ocenia nagrania — decydujesz samodzielnie, czy się udało, i możesz próbować, aż Ci się spodoba.",
        },
        {
          body: "Wskazówka: zanim zaśpiewasz, spróbuj „zanucić w myślach” całą frazę razem z nagraniem. Zauważ, gdzie melodia idzie w górę, a gdzie w dół — nuty na pięciolinii pokazują to dokładnie tak jak ona brzmi.",
        },
        {
          body: "Za szybko? Włącz przełącznik „🐌 Wolno” — i nagranie, i metronom zwolnią. Kropka metronomu pozwala też najpierw sprawdzić samo tempo. Możesz powtarzać tyle razy, ile chcesz.",
        },
      ],
      exercises: [
        {
          id: "zs-m2-e1",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "D4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "whole"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Au clair de la lune” — francuska piosenka ludowa (dalszy ciąg)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m2-e2",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Oda do radości” — L. van Beethoven, IX Symfonia (takty 1–2)", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 70 },
        },
        {
          id: "zs-m2-e3",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Oda do radości” — L. van Beethoven, IX Symfonia (takty 1–3)", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 70 },
        },
        {
          id: "zs-m2-e4",
          type: "solfege-phrase-singing",
          difficulty: 3,
          spec: { type: "solfege-phrase-singing", notes: ["D4", "D4", "D4", "E4", "G4", "G4"], rhythm: ["quarter", "quarter", "half", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Mary had a little lamb” — amerykańska piosenka dziecięca (dalszy ciąg)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m2-e5",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "E4", "G4", "E4", "C4", "D4", "E4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 70 },
        },
        {
          id: "zs-m2-e6",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "E4"], rhythm: ["half", "quarter", "half", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu), metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 70 },
        },
      ],
    },
    {
      id: "zs-melodie-3-cala-gama",
      order: 14,
      difficulty: 4,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Kolejny poziom z melodiami: teraz sięgasz po całą gamę, od do do do wyżej. Zobaczysz pary ósemek (dwa szybsze dźwięki w jednym uderzeniu metronomu), schodzenie w dół i na końcu — całą gamę w górę z metronomem.",
        },
        {
          body: "Każde zadanie ma dwa kroki. Najpierw posłuchaj nagrania — naciśnij 🔊 (tyle razy, ile chcesz) i śledź nuty na pięciolinii. Potem naciśnij „Śpiewaj z metronomem”: usłyszysz tylko metronom, czyli równe stuknięcia. Dwa pierwsze to odliczanie, a przy trzecim zaczynasz śpiewać razem z nim — zielona nuta pokazuje, którą śpiewasz teraz. Mikrofon nie jest tu potrzebny. To zadania „Sprawdź siebie”: nikt tu nie ocenia nagrania — decydujesz samodzielnie, czy się udało, i możesz próbować, aż Ci się spodoba.",
        },
        {
          body: "Para ósemek to dwa dźwięki w czasie jednego stuknięcia metronomu — śpiewasz je trochę szybciej niż ćwierćnuty. Jeśli to za szybko, włącz „🐌 Wolno” i ćwicz powoli.",
        },
        {
          body: "Za szybko? Włącz przełącznik „🐌 Wolno” — i nagranie, i metronom zwolnią. Kropka metronomu pozwala też najpierw sprawdzić samo tempo. Możesz powtarzać tyle razy, ile chcesz.",
        },
      ],
      exercises: [
        {
          id: "zs-m3-e1",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "G4", "G4", "E4", "D4", "C4"], rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m3-e2",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu): gama w dół", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m3-e3",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "D4", "C4"], rhythm: ["half", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu), metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m3-e4",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "A4", "G4", "E4", "F4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m3-e5",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "F4", "G4", "A4", "G4", "E4", "D4", "D4", "C4"], rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne krótkie solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m3-e6",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", sourceLabel: "Gama C-dur w górę, od „do” do „do”", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
      ],
    },
    {
      id: "zs-melodie-4-dluzsze-melodie",
      order: 15,
      difficulty: 4,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Teraz dłuższe melodie — nawet po kilkanaście nut! Najpierw znane piosenki (m.in. „Twinkle, twinkle, little star” i „Lightly Row”), na końcu dwa własne solfeże. Wszystko nadal w C-dur i w tempie, które zdążysz zaśpiewać.",
        },
        {
          body: "Każde zadanie ma dwa kroki. Najpierw posłuchaj nagrania — naciśnij 🔊 (tyle razy, ile chcesz) i śledź nuty na pięciolinii. Potem naciśnij „Śpiewaj z metronomem”: usłyszysz tylko metronom, czyli równe stuknięcia. Dwa pierwsze to odliczanie, a przy trzecim zaczynasz śpiewać razem z nim — zielona nuta pokazuje, którą śpiewasz teraz. Mikrofon nie jest tu potrzebny. To zadania „Sprawdź siebie”: nikt tu nie ocenia nagrania — decydujesz samodzielnie, czy się udało, i możesz próbować, aż Ci się spodoba.",
        },
        {
          body: "Wskazówka na dłuższe melodie: nie próbuj ogarnąć wszystkiego naraz. Podziel melodię na takty (oddzielone pionowymi kreskami) i śpiewaj takt po takcie — każdy takt to jedna mała frazka. Najpierw posłuchaj całości, potem poćwicz osobno pierwszy takt, potem dwa i tak dalej.",
        },
        {
          body: "Za szybko? Włącz przełącznik „🐌 Wolno” — i nagranie, i metronom zwolnią. Kropka metronomu pozwala też najpierw sprawdzić samo tempo. Możesz powtarzać tyle razy, ile chcesz.",
        },
      ],
      exercises: [
        {
          id: "zs-m4-e1",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Twinkle, twinkle, little star” — melodia ludowa (1.–2. linijka)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m4-e2",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "G4", "F4", "F4", "E4", "E4", "D4", "G4", "G4", "F4", "F4", "E4", "E4", "D4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Twinkle, twinkle, little star” — melodia ludowa (3.–4. linijka)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m4-e3",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "E4", "E4", "F4", "D4", "D4", "C4", "D4", "E4", "F4", "G4", "G4", "G4"], rhythm: ["quarter", "quarter", "half", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Lightly Row” — ludowa piosenka dziecięca (początek)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m4-e4",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "A4", "G4", "F4", "E4", "C4", "G4", "A4", "G4", "F4", "E4", "C4"], rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Fragment: „Panie Janie” — melodia ludowa (część z ósemkami)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m4-e5",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "E4", "F4", "A4", "G4", "E4", "G4", "C5", "G4", "F4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m4-e6",
          type: "solfege-phrase-singing",
          difficulty: 4,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "E4", "D4", "E4", "F4", "G4", "F4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu), metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
      ],
    },
    {
      id: "zs-melodie-5-najdluzsze",
      order: 16,
      difficulty: 5,
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Ostatni poziom z melodiami: własne solfeże, jeszcze dłuższe — do kilkunastu nut, w metrum 4/4 i 3/4, z parami ósemek. Tym razem żadna nie jest znaną piosenką, więc tym uważniej śledź nuty na pięciolinii.",
        },
        {
          body: "Każde zadanie ma dwa kroki. Najpierw posłuchaj nagrania — naciśnij 🔊 (tyle razy, ile chcesz) i śledź nuty na pięciolinii. Potem naciśnij „Śpiewaj z metronomem”: usłyszysz tylko metronom, czyli równe stuknięcia. Dwa pierwsze to odliczanie, a przy trzecim zaczynasz śpiewać razem z nim — zielona nuta pokazuje, którą śpiewasz teraz. Mikrofon nie jest tu potrzebny. To zadania „Sprawdź siebie”: nikt tu nie ocenia nagrania — decydujesz samodzielnie, czy się udało, i możesz próbować, aż Ci się spodoba.",
        },
        {
          body: "Przy dłuższych frazach pomaga oddech: nabierz powietrza na początku taktu i śpiewaj spokojnie, równo z metronomem. Jeśli się zgubisz — nic się nie stało, zacznij jeszcze raz. Dla pewności możesz najpierw zanucić całą melodię razem z nagraniem.",
        },
        {
          body: "Za szybko? Włącz przełącznik „🐌 Wolno” — i nagranie, i metronom zwolnią. Kropka metronomu pozwala też najpierw sprawdzić samo tempo. Możesz powtarzać tyle razy, ile chcesz.",
        },
      ],
      exercises: [
        {
          id: "zs-m5-e1",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "C4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "half", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m5-e2",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "A4", "G4", "F4", "E4", "D4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu), metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m5-e3",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "G4", "G4", "A4", "G4", "F4", "E4", "D4", "C4"], rhythm: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m5-e4",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["E4", "G4", "E4", "C4", "D4", "F4", "D4", "E4", "F4", "G4", "A4", "G4", "E4", "D4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu)", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-m5-e5",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "G4", "E4", "F4", "A4", "G4", "F4", "D4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu), metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-m5-e6",
          type: "solfege-phrase-singing",
          difficulty: 5,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "whole"], meter: "4/4", isFragment: true, sourceLabel: "Własne dłuższe solfeże (nie fragment utworu): gama w górę i w dół", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
      ],
    },
    {
      id: "zs-boss-mirefa",
      order: 17,
      difficulty: 6,
      isBoss: true,
      bossName: "Mirefa",
      pianoKeyboardReference: { range: ["C4", "C5"] },
      introSlides: [
        {
          body: "Kameleon Mirefa zmienia kolory i zaczarowuje sylaby: pokazuje jedną, a śpiewa inną — jego imię to „mi-re-fa” ułożone na opak! Pokonaj go: czeka na Ciebie mieszanka wszystkiego z tej krainy: słuchanie sylab, interwały, trójdźwięki, przewroty, dominanta i melodie.",
          bossPortrait: true,
        },
        {
          body: "Najpierw cztery zadania na słuch: posłuchaj akordów i dźwięków, a potem wskaż sylaby (do, re, mi…). Potem sześć krótkich melodii: posłuchaj nagrania i zaśpiewaj razem z metronomem — to zadania „Sprawdź siebie”, mikrofon nie jest potrzebny. Możesz słuchać i próbować tyle razy, ile chcesz, a przełącznik „🐌 Wolno” zwalnia tempo.",
        },
      ],
      exercises: [
        { id: "zs-boss-e1", type: "solfege-syllable-choice", difficulty: 6, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] } },
        { id: "zs-boss-e2", type: "solfege-syllable-choice", difficulty: 6, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], length: 2 } },
        { id: "zs-boss-e3", type: "solfege-syllable-choice", difficulty: 6, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], length: 3 } },
        { id: "zs-boss-e4", type: "solfege-syllable-choice", difficulty: 6, spec: { type: "solfege-syllable-choice", notePool: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"], length: 3 } },
        {
          id: "zs-boss-e5",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "C5", "C5", "G4", "E4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Mieszanka: trójdźwięk C-dur w górę i w dół", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-boss-e6",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "C4", "G4", "C4", "C5"], rhythm: ["quarter", "quarter", "quarter", "quarter", "half", "half"], meter: "4/4", isFragment: true, sourceLabel: "Mieszanka: interwały od „do” — tercja, kwinta, oktawa", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-boss-e7",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["G4", "B4", "D5", "F5", "F5", "D5", "B4", "G4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "4/4", isFragment: true, sourceLabel: "Mieszanka: dominanta septymowa (sol–si–re–fa) w górę i w dół", withMetronome: true, metronomeOnly: true, bpm: 60, toleranceCents: 65 },
        },
        {
          id: "zs-boss-e8",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "E4", "G4", "C5", "G4", "C5", "E5"], rhythm: ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Mieszanka: przewroty trójdźwięku C-dur", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-boss-e9",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "C5", "B4", "C5", "B4", "A4", "G4", "E4", "F4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "quarter", "quarter", "half"], meter: "4/4", isFragment: true, sourceLabel: "Mieszanka: własne solfeże z ósemkami", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
        {
          id: "zs-boss-e10",
          type: "solfege-phrase-singing",
          difficulty: 6,
          spec: { type: "solfege-phrase-singing", notes: ["C4", "E4", "G4", "C5", "G4", "A4", "F4", "D4", "E4", "D4", "C4"], rhythm: ["quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "quarter"], meter: "3/4", isFragment: true, sourceLabel: "Finał: własne solfeże w metrum 3/4", withMetronome: true, metronomeOnly: true, bpm: 66, toleranceCents: 65 },
        },
      ],
    },
  ],
};
