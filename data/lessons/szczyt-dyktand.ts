import type { WorldContent } from "@/types/exercises";

/**
 * "Szczyt Dyktand" — the capstone/final world: melodic-rhythmic dictation
 * combining pitch AND rhythm, the culmination of everything taught in
 * every earlier world. Levels 1-5 are `rhythm-value-dictation` (hear a
 * pure rhythm, no pitch, and write it back by clicking through note/rest
 * values); levels 6-9 are `melodic-rhythmic-dictation` (hear a full
 * phrase and write it on a growing staff, picking both pitch and rhythm
 * value per note). Both types are fully authored, non-randomized content
 * — generate.ts only derives display/timing data from the literal spec.
 * Content transcribed verbatim from the web app's
 * data/worlds/szczyt-dyktand.json.
 */
export const SZCZYT_DYKTAND_CONTENT: WorldContent = {
  worldId: "szczyt-dyktand",
  lessons: [
    {
      id: "sd-poziom-1-oboz-bazowy",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Zaczynamy wspinaczkę od podstaw: usłysz krótki rytm złożony tylko z ćwierćnut, półnut i ćwierćpauz (możesz odsłuchać dowolną liczbę razy), a potem zapisz go samodzielnie, klikając kolejne wartości rytmiczne.",
        },
        {
          body: 'Metrum i takt widać od razu, zanim jeszcze cokolwiek zapiszesz — Twoja notacja rośnie w miarę dodawania kolejnych wartości. Pomyliłeś się? "Cofnij ostatnią wartość" usuwa ostatni krok.',
        },
        {
          body: "Uwaga: jedno pojedyncze usłyszane uderzenie może być zarówno ćwierćnutą, jak i ósemką — o tym, jaka to naprawdę wartość, decyduje tempo i odstęp do następnego dźwięku, nie samo \"jedno stuknięcie\".",
        },
        {
          body: 'Gdy w Twojej odpowiedzi pojawią się sąsiadujące ósemki lub szesnastki, użyj przycisku "Grupuj": klikasz dwie sąsiednie takie nuty, żeby połączyć je belką (tak jak w prawdziwej notacji) — kliknięcie tej samej pary ponownie je rozdziela. To też część oceny, obok samego rytmu.',
        },
      ],
      exercises: [
        { id: "sd-l1-e1", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 70, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["quarter", "quarter", "quarter", "quarter"] } },
        { id: "sd-l1-e2", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 71, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["half", "quarter", "quarter"] } },
        { id: "sd-l1-e3", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 72, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["quarter", "half", "quarter"] } },
        { id: "sd-l1-e4", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 72, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["quarter", "quarterRest", "quarter", "quarter"] } },
        { id: "sd-l1-e5", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 73, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["half", "half"] } },
        { id: "sd-l1-e6", type: "rhythm-value-dictation", difficulty: 1, spec: { type: "rhythm-value-dictation", bpm: 74, meter: "4/4", allowedValues: ["quarter", "half", "quarterRest"], sequence: ["quarterRest", "quarter", "half"] } },
      ],
    },
    {
      id: "sd-poziom-2-pierwsze-podejscie",
      order: 2,
      difficulty: 2,
      introSlides: [
        { body: "Wchodzimy wyżej: dochodzą pary ósemek, a takt zmienia się na 3/4 — trzy uderzenia ćwierćnutowe w każdym takcie zamiast czterech." },
      ],
      exercises: [
        { id: "sd-l2-e1", type: "rhythm-value-dictation", difficulty: 2, spec: { type: "rhythm-value-dictation", bpm: 78, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["quarter", "eighth", "eighth", "quarter"] } },
        { id: "sd-l2-e2", type: "rhythm-value-dictation", difficulty: 2, spec: { type: "rhythm-value-dictation", bpm: 79, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["eighth", "eighth", "quarter", "quarter"] } },
        { id: "sd-l2-e3", type: "rhythm-value-dictation", difficulty: 2, spec: { type: "rhythm-value-dictation", bpm: 80, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["quarter", "quarter", "eighth", "eighth"] } },
        { id: "sd-l2-e4", type: "rhythm-value-dictation", difficulty: 2, spec: { type: "rhythm-value-dictation", bpm: 81, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["half", "eighth", "eighth"] } },
        { id: "sd-l2-e5", type: "rhythm-value-dictation", difficulty: 3, spec: { type: "rhythm-value-dictation", bpm: 82, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["eighth", "eighth", "eighth", "eighth", "quarter"] } },
        { id: "sd-l2-e6", type: "rhythm-value-dictation", difficulty: 3, spec: { type: "rhythm-value-dictation", bpm: 84, meter: "3/4", allowedValues: ["quarter", "half", "eighth", "quarterRest"], sequence: ["quarterRest", "eighth", "eighth", "quarter"] } },
      ],
    },
    {
      id: "sd-poziom-3-skalna-sciezka",
      order: 3,
      difficulty: 3,
      introSlides: [
        { body: "Ścieżka robi się bardziej techniczna: dochodzi ćwiartka z kropką i pary szesnastek, a takt zmienia się na 6/8 — dwa pulsy w takcie, każdy o długości ćwiartki z kropką (trzy ósemki)." },
      ],
      exercises: [
        { id: "sd-l3-e1", type: "rhythm-value-dictation", difficulty: 3, spec: { type: "rhythm-value-dictation", bpm: 86, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["dottedQuarter", "dottedQuarter"] } },
        { id: "sd-l3-e2", type: "rhythm-value-dictation", difficulty: 3, spec: { type: "rhythm-value-dictation", bpm: 87, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["dottedQuarter", "eighth", "eighth", "eighth"] } },
        { id: "sd-l3-e3", type: "rhythm-value-dictation", difficulty: 3, spec: { type: "rhythm-value-dictation", bpm: 88, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "dottedQuarter"] } },
        { id: "sd-l3-e4", type: "rhythm-value-dictation", difficulty: 4, spec: { type: "rhythm-value-dictation", bpm: 89, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["dottedQuarter", "sixteenth", "sixteenth", "eighth", "eighth"] } },
        { id: "sd-l3-e5", type: "rhythm-value-dictation", difficulty: 4, spec: { type: "rhythm-value-dictation", bpm: 90, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["eighth", "sixteenth", "sixteenth", "eighth", "dottedQuarter"] } },
        { id: "sd-l3-e6", type: "rhythm-value-dictation", difficulty: 4, spec: { type: "rhythm-value-dictation", bpm: 92, meter: "6/8", allowedValues: ["dottedQuarter", "eighth", "sixteenth"], sequence: ["sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "dottedQuarter"] } },
      ],
    },
    {
      id: "sd-poziom-4-gran",
      order: 4,
      difficulty: 4,
      introSlides: [
        { body: "Grań: pełne słownictwo rytmiczne (włącznie z pauzami), dłuższe dwutaktowe frazy i zmienne metrum — 4/4, 3/4 i 6/8 na przemian między ćwiczeniami." },
      ],
      exercises: [
        { id: "sd-l4-e1", type: "rhythm-value-dictation", difficulty: 4, spec: { type: "rhythm-value-dictation", bpm: 92, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["quarter", "quarter", "quarter", "quarter", "dottedQuarter", "eighth", "quarterRest", "quarter"] } },
        { id: "sd-l4-e2", type: "rhythm-value-dictation", difficulty: 4, spec: { type: "rhythm-value-dictation", bpm: 93, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "dottedHalf", "quarterRest"] } },
        { id: "sd-l4-e3", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 94, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["quarter", "eighth", "eighth", "quarter", "sixteenth", "sixteenth", "eighth", "quarterRest", "quarter"] } },
        { id: "sd-l4-e4", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 95, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["dottedQuarter", "eighth", "quarter", "quarter", "half", "quarterRest", "quarter"] } },
        { id: "sd-l4-e5", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 97, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["quarter", "quarterRest", "eighth", "eighth", "quarter", "dottedEighth", "sixteenth", "quarter", "half"] } },
        { id: "sd-l4-e6", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 100, meter: "6/8", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest"], sequence: ["dottedQuarter", "dottedQuarter", "sixteenth", "sixteenth", "eighth", "eighth", "dottedQuarter"] } },
      ],
    },
    {
      id: "sd-poziom-5-przelecz",
      order: 5,
      difficulty: 5,
      introSlides: [
        { body: "Przełęcz przed pierwszym szczytem: dłuższe, 3-4-taktowe frazy — dłuższe niż wszystko dotąd. Dochodzi też nowa pauza: ósemkowa (krótsza od znanej już ćwierćpauzy)." },
      ],
      exercises: [
        { id: "sd-l5-e1", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 100, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["quarter", "quarter", "eighth", "eighth", "quarter", "dottedQuarter", "eighth", "quarter", "quarterRest", "eighth", "eighth", "eighth", "eighth", "half"] } },
        { id: "sd-l5-e2", type: "rhythm-value-dictation", difficulty: 5, spec: { type: "rhythm-value-dictation", bpm: 101, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["quarter", "eighthRest", "eighth", "quarter", "quarter", "half", "eighth", "eighth", "quarter", "dottedQuarter", "eighth", "dottedQuarter", "eighth"] } },
        { id: "sd-l5-e3", type: "rhythm-value-dictation", difficulty: 6, spec: { type: "rhythm-value-dictation", bpm: 102, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["quarter", "quarter", "quarter", "dottedQuarter", "eighth", "eighth", "eighth", "dottedHalf", "eighth", "eighth", "eighth", "eighth", "quarter"] } },
        { id: "sd-l5-e4", type: "rhythm-value-dictation", difficulty: 6, spec: { type: "rhythm-value-dictation", bpm: 103, meter: "6/8", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["dottedQuarter", "dottedQuarter", "eighth", "eighth", "eighth", "dottedQuarter", "sixteenth", "sixteenth", "eighth", "eighth", "dottedQuarter"] } },
        { id: "sd-l5-e5", type: "rhythm-value-dictation", difficulty: 7, spec: { type: "rhythm-value-dictation", bpm: 105, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "quarter", "eighth", "quarter", "dottedEighth", "sixteenth", "quarter", "eighthRest", "eighth", "quarter", "half", "quarter", "eighthRest", "eighth"] } },
        { id: "sd-l5-e6", type: "rhythm-value-dictation", difficulty: 7, spec: { type: "rhythm-value-dictation", bpm: 108, meter: "6/8", allowedValues: ["quarter", "half", "dottedHalf", "dottedQuarter", "eighth", "dottedEighth", "sixteenth", "quarterRest", "eighthRest"], sequence: ["dottedQuarter", "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "dottedQuarter", "dottedQuarter", "dottedQuarter", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"] } },
      ],
    },
    {
      id: "sd-poziom-6-pierwszy-szczyt",
      order: 6,
      difficulty: 5,
      introSlides: [
        {
          body: "Zdobywamy pierwszy szczyt: teraz fraza ma i wysokość, i rytm. Odsłuchaj ją dowolną liczbę razy, a potem zapisz samodzielnie na pustej pięciolinii — dla każdej nuty wybierz najpierw pozycję (wysokość), potem wartość rytmiczną, i kliknij 'Dodaj nutę'.",
        },
        { body: "Na tym poziomie tylko ćwierćnuty i półnuty, a wysokości mieszczą się między dolną linią (E4) a czwartą linią (H4) — żadnych znaków chromatycznych, zawsze w metrum 4/4." },
      ],
      exercises: [
        { id: "sd-l6-e1", type: "melodic-rhythmic-dictation", difficulty: 5, spec: { type: "melodic-rhythmic-dictation", bpm: 72, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "E4", value: "quarter" }, { pitch: "G4", value: "quarter" }, { pitch: "B4", value: "half" }] } },
        { id: "sd-l6-e2", type: "melodic-rhythmic-dictation", difficulty: 5, spec: { type: "melodic-rhythmic-dictation", bpm: 72, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "B4", value: "half" }, { pitch: "A4", value: "quarter" }, { pitch: "G4", value: "quarter" }] } },
        { id: "sd-l6-e3", type: "melodic-rhythmic-dictation", difficulty: 5, spec: { type: "melodic-rhythmic-dictation", bpm: 73, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "E4", value: "quarter" }, { pitch: "F4", value: "quarter" }, { pitch: "G4", value: "quarter" }, { pitch: "A4", value: "quarter" }] } },
        { id: "sd-l6-e4", type: "melodic-rhythmic-dictation", difficulty: 5, spec: { type: "melodic-rhythmic-dictation", bpm: 73, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "G4", value: "half" }, { pitch: "E4", value: "quarter" }, { pitch: "B4", value: "quarter" }] } },
        { id: "sd-l6-e5", type: "melodic-rhythmic-dictation", difficulty: 6, spec: { type: "melodic-rhythmic-dictation", bpm: 74, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "A4", value: "quarter" }, { pitch: "G4", value: "quarter" }, { pitch: "F4", value: "quarter" }, { pitch: "E4", value: "quarter" }] } },
        { id: "sd-l6-e6", type: "melodic-rhythmic-dictation", difficulty: 6, spec: { type: "melodic-rhythmic-dictation", bpm: 74, key: 0, meter: "4/4", allowedValues: ["quarter", "half"], notes: [{ pitch: "E4", value: "half" }, { pitch: "G4", value: "half" }] } },
      ],
    },
    {
      id: "sd-poziom-7-strome-zbocze",
      order: 7,
      difficulty: 6,
      introSlides: [
        {
          body: 'Zbocze robi się strome: dochodzi półnuta z kropką i ósemka, a zakres wysokości rozciąga się aż do D5 (szósta linia licząc od dołu, jedna nad pięciolinią... a właściwie szósty stopień: D nad czwartą linią). Czasem pojawi się też krzyżyk (♯) albo bemol (♭), a metrum bywa teraz 3/4 zamiast 4/4. Sąsiednie ósemki możesz połączyć belką przyciskiem "Grupuj" — tak jak w dyktandzie rytmicznym.',
        },
      ],
      exercises: [
        { id: "sd-l7-e1", type: "melodic-rhythmic-dictation", difficulty: 6, spec: { type: "melodic-rhythmic-dictation", bpm: 78, key: 1, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "E4", value: "quarter" }, { pitch: "F#4", value: "quarter" }, { pitch: "G4", value: "quarter" }, { pitch: "A4", value: "half" }, { pitch: "D5", value: "dottedHalf" }] } },
        { id: "sd-l7-e2", type: "melodic-rhythmic-dictation", difficulty: 6, spec: { type: "melodic-rhythmic-dictation", bpm: 79, key: -1, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "D5", value: "half" }, { pitch: "C5", value: "half" }, { pitch: "Bb4", value: "quarter" }, { pitch: "G4", value: "dottedHalf" }] } },
        { id: "sd-l7-e3", type: "melodic-rhythmic-dictation", difficulty: 6, spec: { type: "melodic-rhythmic-dictation", bpm: 80, key: 0, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "E4", value: "eighth" }, { pitch: "F4", value: "eighth" }, { pitch: "G4", value: "quarter" }, { pitch: "A4", value: "half" }, { pitch: "D5", value: "half" }] } },
        { id: "sd-l7-e4", type: "melodic-rhythmic-dictation", difficulty: 7, spec: { type: "melodic-rhythmic-dictation", bpm: 80, key: 1, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "G4", value: "quarter" }, { pitch: "F#4", value: "eighth" }, { pitch: "G4", value: "eighth" }, { pitch: "A4", value: "quarter" }, { pitch: "B4", value: "dottedHalf" }] } },
        { id: "sd-l7-e5", type: "melodic-rhythmic-dictation", difficulty: 7, spec: { type: "melodic-rhythmic-dictation", bpm: 81, key: -1, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "C5", value: "quarter" }, { pitch: "Bb4", value: "eighth" }, { pitch: "A4", value: "eighth" }, { pitch: "G4", value: "half" }] } },
        { id: "sd-l7-e6", type: "melodic-rhythmic-dictation", difficulty: 7, spec: { type: "melodic-rhythmic-dictation", bpm: 82, key: 0, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth"], notes: [{ pitch: "E4", value: "eighth" }, { pitch: "G4", value: "eighth" }, { pitch: "B4", value: "half" }, { pitch: "D5", value: "dottedHalf" }] } },
      ],
    },
    {
      id: "sd-poziom-8-ostatni-odcinek",
      order: 8,
      difficulty: 7,
      introSlides: [
        {
          body: "Ostatni odcinek przed szczytem: dochodzą ćwiartka z kropką, ósemka z kropką i szesnastka, a wysokości sięgają teraz od dolnej linii (E4) aż po górną linię pięciolinii (F5) — pełen zakres, jaki oferuje ta pięciolinia.",
        },
      ],
      exercises: [
        { id: "sd-l8-e1", type: "melodic-rhythmic-dictation", difficulty: 7, spec: { type: "melodic-rhythmic-dictation", bpm: 84, key: 0, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "E4", value: "dottedEighth" }, { pitch: "F4", value: "sixteenth" }, { pitch: "G4", value: "quarter" }, { pitch: "C5", value: "quarter" }, { pitch: "F5", value: "dottedHalf" }] } },
        { id: "sd-l8-e2", type: "melodic-rhythmic-dictation", difficulty: 7, spec: { type: "melodic-rhythmic-dictation", bpm: 85, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "F5", value: "quarter" }, { pitch: "D5", value: "eighth" }, { pitch: "C5", value: "eighth" }, { pitch: "A4", value: "dottedQuarter" }, { pitch: "E4", value: "eighth" }] } },
        { id: "sd-l8-e3", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 85, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "G4", value: "sixteenth" }, { pitch: "F#4", value: "sixteenth" }, { pitch: "G4", value: "eighth" }, { pitch: "B4", value: "dottedQuarter" }, { pitch: "D5", value: "dottedQuarter" }, { pitch: "F5", value: "half" }, { pitch: "F5", value: "half" }] } },
        { id: "sd-l8-e4", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 86, key: -1, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "E4", value: "quarter" }, { pitch: "Bb4", value: "dottedQuarter" }, { pitch: "A4", value: "eighth" }, { pitch: "F5", value: "quarter" }, { pitch: "C5", value: "half" }] } },
        { id: "sd-l8-e5", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 87, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "C5", value: "dottedEighth" }, { pitch: "D5", value: "sixteenth" }, { pitch: "E5", value: "quarter" }, { pitch: "F5", value: "dottedQuarter" }, { pitch: "C5", value: "eighth" }] } },
        { id: "sd-l8-e6", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 88, key: 0, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth"], notes: [{ pitch: "E4", value: "eighth" }, { pitch: "G4", value: "eighth" }, { pitch: "B4", value: "dottedQuarter" }, { pitch: "D5", value: "dottedQuarter" }, { pitch: "F5", value: "half" }] } },
      ],
    },
    {
      id: "sd-poziom-9-szczyt-dyktand",
      order: 9,
      difficulty: 8,
      introSlides: [
        {
          body: "Szczyt! Ostatni poziom łączy wszystko: pełny zakres pięciolinii, mieszane znaki chromatyczne, całe słownictwo rytmiczne (włącznie z całą nutą), zmienne metrum (4/4, 3/4, a nawet 6/8 i 9/8) i dłuższe, 6-7-nutowe frazy. Odsłuchaj tyle razy, ile potrzebujesz.",
        },
      ],
      exercises: [
        { id: "sd-l9-e1", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 92, key: 0, meter: "6/8", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "E4", value: "sixteenth" }, { pitch: "F#4", value: "sixteenth" }, { pitch: "G4", value: "eighth" }, { pitch: "Bb4", value: "dottedQuarter" }, { pitch: "D5", value: "eighth" }, { pitch: "F5", value: "dottedHalf" }] } },
        { id: "sd-l9-e2", type: "melodic-rhythmic-dictation", difficulty: 8, spec: { type: "melodic-rhythmic-dictation", bpm: 93, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "F5", value: "dottedQuarter" }, { pitch: "D5", value: "eighth" }, { pitch: "C5", value: "quarter" }, { pitch: "A4", value: "eighth" }, { pitch: "F#4", value: "eighth" }, { pitch: "E4", value: "whole" }] } },
        { id: "sd-l9-e3", type: "melodic-rhythmic-dictation", difficulty: 9, spec: { type: "melodic-rhythmic-dictation", bpm: 94, key: 0, meter: "3/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "E4", value: "eighth" }, { pitch: "G4", value: "eighth" }, { pitch: "Bb4", value: "quarter" }, { pitch: "D5", value: "dottedEighth" }, { pitch: "E5", value: "sixteenth" }, { pitch: "F5", value: "dottedHalf" }] } },
        { id: "sd-l9-e4", type: "melodic-rhythmic-dictation", difficulty: 9, spec: { type: "melodic-rhythmic-dictation", bpm: 94, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "C5", value: "whole" }, { pitch: "A4", value: "half" }, { pitch: "F#4", value: "quarter" }, { pitch: "G4", value: "eighth" }, { pitch: "F4", value: "eighth" }] } },
        { id: "sd-l9-e5", type: "melodic-rhythmic-dictation", difficulty: 9, spec: { type: "melodic-rhythmic-dictation", bpm: 95, key: 0, meter: "4/4", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "E4", value: "dottedEighth" }, { pitch: "F4", value: "sixteenth" }, { pitch: "G4", value: "dottedEighth" }, { pitch: "A4", value: "sixteenth" }, { pitch: "B4", value: "quarter" }, { pitch: "D5", value: "quarter" }, { pitch: "F5", value: "whole" }] } },
        { id: "sd-l9-e6", type: "melodic-rhythmic-dictation", difficulty: 9, spec: { type: "melodic-rhythmic-dictation", bpm: 96, key: 0, meter: "9/8", allowedValues: ["quarter", "half", "dottedHalf", "eighth", "dottedQuarter", "dottedEighth", "sixteenth", "whole"], notes: [{ pitch: "F5", value: "half" }, { pitch: "D5", value: "dottedQuarter" }, { pitch: "Bb4", value: "eighth" }, { pitch: "G4", value: "eighth" }, { pitch: "F#4", value: "eighth" }, { pitch: "E4", value: "whole" }] } },
      ],
    },
  ],
};
