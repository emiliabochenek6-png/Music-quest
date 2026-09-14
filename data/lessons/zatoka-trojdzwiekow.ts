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
 * body-only).
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
  ],
};
