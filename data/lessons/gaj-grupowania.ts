import type { WorldContent } from "@/types/exercises";

/**
 * "Gaj Grupowania" — teaches beaming/grouping of rhythmic note values (how
 * eighth/sixteenth notes get beamed together within a beat, per time
 * signature). Only two exercise types: `beam-grouping-choice` (pick which
 * of several beamings of the same note sequence is correct — every option
 * is hand-authored, never derived, since real beaming convention isn't
 * encoded as rules anywhere in this app) and `rhythm-math-choice` (pick
 * which combination of note values sums to exactly one 4/4 measure — this
 * one IS computed at generation time, see lib/questions/generate.ts).
 * Lekcje 1-7 transcribed verbatim from the web app's
 * data/worlds/gaj-grupowania.json. Lekcje 8-14 (pauza ósemkowa, triole
 * obok prostych wartości, długie wartości, nieparzyste metra ćwierćnutowe
 * — 5/4 i 7/4, nowe to this world — granica taktu, przegląd, i lekcja-
 * boss z Wiewiórem Pęczkiem) added later, same two exercise types
 * throughout. Every `options[].groups` partition here was checked by
 * script against two rules: (1) every measure's note/rest values sum to
 * exactly its meter's own beat count (lib/rhythm/valueBeats.ts's own
 * table), and (2) the CORRECT option and every WRONG option actually
 * render as visually different beamings — BeamedNotation only draws a
 * beam between 2+ "beamable" values (eighth/dottedEighth/sixteenth/
 * eighthTriplet) sharing a group, so a wrong option that only
 * rearranges non-beamable neighbors (a rest, a quarter-or-longer note)
 * around an already-settled beam is indistinguishable on screen from the
 * correct one — an unfair, unanswerable question. 5/4 and 7/4 (added to
 * `Meter` in types/exercises.ts for this world) follow the same 3+2 /
 * 2+2+3 felt-pulse shape this world's own 5/8 and 7/8 already use, just
 * in quarters instead of eighths.
 */
export const GAJ_GRUPOWANIA_CONTENT: WorldContent = {
  worldId: "gaj-grupowania",
  lessons: [
    {
      id: "gg-poziom-1-metrum-cwierc",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "W metrum ćwierćnutowym (2/4, 3/4, 4/4) miarą jest ćwierćnuta. Dwie szesnastki + ósemka zawsze tworzą jedną miarę i zawsze są połączone wspólną belką.",
          groupingExamples: [
            {
              sequence: ["sixteenth", "sixteenth", "eighth", "quarter"],
              groups: [[0, 1, 2], [3]],
              meter: "2/4",
              label: "2 szesnastki + ósemka (miara 1) — zawsze jedna belka",
            },
          ],
        },
        {
          body: "Ćwierćnuta z kropką + ósemka: kropka wydłuża pierwszą miarę, a ósemka dopełnia drugą. Ósemka ma osobną chorągiewkę — ćwierćnuta z kropką nigdy nie ma belki ani chorągiewki.",
          groupingExamples: [
            {
              sequence: ["dottedQuarter", "eighth"],
              groups: [[0], [1]],
              meter: "2/4",
              label: "Ósemka zawsze osobno, z własną chorągiewką",
            },
          ],
        },
        {
          body: "Synkopa (ósemka + ćwierćnuta + ósemka) zapisywana jest jako spójna grupa — na dwa równoważne, tak samo brzmiące sposoby. Wprost: ósemka, ćwierćnuta, ósemka — ćwierćnuta nigdy nie ma belki ani chorągiewki, więc żadna z trzech nut nie jest belkowana. Albo z łukiem: środkowa 'ćwierćnuta' zapisana jako dwie ósemki związane łukiem, a wszystkie cztery ósemki pod jedną belką — tej wersji używa się, gdy zależy nam na pokazaniu podziału na ćwierćnuty. W 4/4 nie wolno łączyć belką 2. i 3. miary — środek taktu musi zostać widoczny.",
          groupingExamples: [
            {
              sequence: ["eighth", "quarter", "eighth", "quarter", "quarter"],
              groups: [[0], [1], [2], [3], [4]],
              meter: "4/4",
              label: "Wprost: ósemka-ćwierćnuta-ósemka (reszta taktu: dwie ćwierćnuty)",
            },
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter"],
              groups: [[0, 1, 2, 3], [4], [5]],
              ties: [[1, 2]],
              meter: "4/4",
              label: "To samo brzmienie, z łukiem: środkowe ósemki związane",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l1-e1",
          type: "beam-grouping-choice",
          difficulty: 1,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "quarter"],
            meter: "2/4",
            options: [{ groups: [[0, 1, 2], [3]] }, { groups: [[0], [1], [2], [3]] }, { groups: [[0, 1], [2], [3]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e2",
          type: "beam-grouping-choice",
          difficulty: 1,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "sixteenth", "sixteenth", "eighth", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0], [1, 2, 3], [4]] },
              { groups: [[0], [1], [2], [3], [4]] },
              { groups: [[0], [1, 2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e3",
          type: "beam-grouping-choice",
          difficulty: 1,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedQuarter", "eighth", "eighth", "eighth"],
            meter: "3/4",
            options: [{ groups: [[0], [1], [2, 3]] }, { groups: [[0], [1], [2], [3]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e4",
          type: "beam-grouping-choice",
          difficulty: 1,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "dottedQuarter", "eighth", "eighth", "eighth"],
            meter: "4/4",
            options: [{ groups: [[0], [1], [2], [3, 4]] }, { groups: [[0], [1], [2], [3], [4]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e5",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2, 3], [4], [5]], ties: [[1, 2]] },
              { groups: [[0, 1, 2, 3], [4], [5]], ties: [[0, 1]] },
              { groups: [[0, 1, 2, 3], [4], [5]], ties: [[2, 3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e6",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "eighth", "eighth"],
            meter: "3/4",
            options: [
              { groups: [[0], [1, 2, 3, 4]], ties: [[2, 3]] },
              { groups: [[0], [1, 2, 3, 4]], ties: [[1, 2]] },
              { groups: [[0], [1, 2, 3, 4]], ties: [[3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e7",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2, 3], [4, 5], [6, 7]] },
              { groups: [[0, 1], [2, 3, 4, 5], [6, 7]] },
              { groups: [[0, 1, 2], [3, 4], [5, 6, 7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l1-e8",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            meter: "4/4",
            options: [{ groups: [[0], [1, 2], [3, 4], [5]] }, { groups: [[0], [1, 2, 3, 4], [5]] }],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-2-metrum-osemk",
      order: 2,
      difficulty: 2,
      introSlides: [
        {
          body: "W metrum ósemkowym (6/8, 9/8, 12/8) miarą jest ćwierćnuta z kropką — trzy ósemki. Ósemki grupujemy belkami po trzy, jedna belka na jeden puls. W 3/8 jest tylko jeden taki puls, więc łączymy belką trzy ósemki całego taktu.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1, 2], [3, 4, 5]],
              meter: "6/8",
              label: "Trzy ósemki = jedna belka na jeden puls (tu: cały takt 6/8, dwa pulsy)",
            },
          ],
        },
        {
          body: "Dwie szesnastki + ósemka wchodzą w skład jednej grupy 3-ósemkowej i są połączone wspólną belką z pozostałą ósemką tej miary — cała czwórka pod jedną belką, z dodatkową belką tylko między dwiema szesnastkami.",
          groupingExamples: [
            {
              sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1, 2, 3], [4, 5, 6]],
              meter: "6/8",
              label: "Puls 1: cała czwórka pod jedną belką (druga belka nad szesnastkami); puls 2: zwykłe trzy ósemki",
            },
          ],
        },
        {
          body: "Nuta, która trwa przez granicę miary albo taktu, jest zapisana jako dwie nuty połączone łukiem — dzięki temu kreska taktowa i podział taktu na główne części zawsze zostają widoczne.",
          groupingExamples: [
            {
              sequence: [
                "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
                "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              ],
              groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]],
              ties: [[5, 6]],
              barBeforeIndex: 6,
              meter: "6/8",
              label: "Dwie ósemki na granicy taktów, związane łukiem",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l2-e1",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth"],
            meter: "3/8",
            options: [{ groups: [[0, 1, 2]] }, { groups: [[0], [1], [2]] }, { groups: [[0, 1], [2]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l2-e2",
          type: "beam-grouping-choice",
          difficulty: 2,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            meter: "12/8",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]] },
              { groups: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l2-e3",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "9/8",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]] },
              { groups: [[0, 1, 2], [3, 4, 5, 6], [7, 8, 9]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l2-e4",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "sixteenth", "sixteenth", "eighth", "eighth"],
            meter: "6/8",
            options: [{ groups: [[0, 1, 2], [3, 4, 5, 6]] }, { groups: [[0, 1, 2, 3], [4, 5, 6]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l2-e5",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            meter: "6/8",
            barBeforeIndex: 6,
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], ties: [[5, 6]] },
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], ties: [[4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l2-e6",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
              "eighth", "eighth", "eighth", "eighth", "eighth", "eighth",
            ],
            meter: "6/8",
            barBeforeIndex: 6,
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], ties: [[5, 6]] },
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], ties: [[1, 2]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-3-alla-breve",
      order: 3,
      difficulty: 3,
      introSlides: [
        {
          body: "W metrum 2/2 (alla breve) miarą jest półnuta. Odpowiednikiem 'dwóch szesnastek + ósemki' jest tu 'dwie ósemki + ćwierćnuta' — mieszczą się w wartości jednej półnuty. Ósemki łączy belka, ćwierćnuta stoi osobno — nie ma belki ani chorągiewki. W 2/2 w tej lekcji ósemki łączymy po cztery, na każdą półnutę.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "quarter", "eighth", "eighth", "quarter"],
              groups: [[0, 1], [2], [3, 4], [5]],
              meter: "2/2",
              label: "2 ósemki pod belką, ćwierćnuta osobno (ten sam wzór na oba pulsy taktu)",
            },
          ],
        },
        {
          body: "Ćwierćnuta z kropką + ósemka trwa tu jedną półnutę, czyli jedną miarę taktu 2/2. Cały takt 2/2 można wypełnić na przykład półnutą z kropką i ćwierćnutą.",
          groupingExamples: [
            {
              sequence: ["dottedHalf", "quarter"],
              groups: [[0], [1]],
              meter: "2/2",
              label: "Półnuta z kropką + ćwierćnuta — cały takt",
            },
          ],
        },
        {
          body: "Synkopa w 2/2 zapisywana jest jako ćwierćnuta + półnuta + ćwierćnuta. Żadna z tych trzech wartości nigdy nie ma belki ani chorągiewki — tu liczy się wybór właściwych wartości nut, nie belkowanie.",
        },
      ],
      exercises: [
        {
          id: "gg-l3-e1",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "quarter", "eighth", "eighth", "quarter"],
            meter: "2/2",
            options: [
              { groups: [[0, 1], [2], [3, 4], [5]] },
              { groups: [[0], [1], [2], [3], [4], [5]] },
              { groups: [[0], [1], [2], [3, 4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l3-e2",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "quarter", "eighth", "eighth"],
            meter: "2/2",
            options: [
              { groups: [[0], [1, 2], [3], [4, 5]] },
              { groups: [[0], [1], [2], [3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l3-e3",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedQuarter", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "2/2",
            options: [{ groups: [[0], [1], [2, 3, 4, 5]] }, { groups: [[0], [1], [2, 3], [4, 5]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l3-e4",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["half", "eighth", "eighth", "quarter"],
            meter: "2/2",
            options: [{ groups: [[0], [1, 2], [3]] }, { groups: [[0], [1], [2], [3]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l3-e5",
          type: "rhythm-math-choice",
          difficulty: 3,
          spec: {
            type: "rhythm-math-choice",
            combinations: [
              ["quarter", "half", "quarter"],
              ["quarter", "half"],
              ["quarter", "half", "quarter", "quarter"],
            ],
          },
        },
        {
          id: "gg-l3-e6",
          type: "rhythm-math-choice",
          difficulty: 3,
          spec: {
            type: "rhythm-math-choice",
            combinations: [
              ["quarter", "half", "quarter"],
              ["half", "quarter"],
              ["half", "half", "quarter"],
            ],
          },
        },
      ],
    },
    {
      id: "gg-poziom-4-zaawansowane-szesnastki",
      order: 4,
      difficulty: 4,
      introSlides: [
        {
          body: "Cztery szesnastki zawsze łączą się jedną belką główną i jedną ciągłą belką dodatkową na całej długości — wizualnie to jedna podwójna belka od pierwszej do ostatniej nuty.",
          groupingExamples: [
            {
              sequence: ["sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter"],
              groups: [[0, 1, 2, 3], [4]],
              meter: "2/4",
              label: "4 szesnastki = jedna podwójna belka na cały puls",
            },
          ],
        },
        {
          body: "Ósemka + dwie szesnastki to lustrzane odbicie już znanego wzoru (dwie szesnastki + ósemka) — cała trójka pod jedną belką, a belka dodatkowa łączy tylko dwie szesnastki.",
          groupingExamples: [
            {
              sequence: ["eighth", "sixteenth", "sixteenth", "quarter"],
              groups: [[0, 1, 2], [3]],
              meter: "2/4",
              label: "Ósemka + 2 szesnastki — ten sam wzór, odwrócona kolejność",
            },
            {
              sequence: ["quarter", "eighth", "sixteenth", "sixteenth", "quarter"],
              groups: [[0], [1, 2, 3], [4]],
              meter: "3/4",
              label: "To samo w innym metrum — cała trójka nadal pod jedną belką",
            },
          ],
        },
        {
          body: "Ósemka z kropką + szesnastka ('długa-krótka') łączy się jedną belką. Ponieważ szesnastka nie ma sąsiedniej szesnastki, zamiast pełnej belki dodatkowej dostaje krótki 'haczyk' skierowany w stronę ósemki z kropką — w obie strony, zależnie od kolejności.",
          groupingExamples: [
            {
              sequence: ["dottedEighth", "sixteenth", "quarter"],
              groups: [[0, 1], [2]],
              meter: "2/4",
              label: "Haczyk w lewo — szesnastka po ósemce z kropką",
            },
            {
              sequence: ["quarter", "sixteenth", "dottedEighth"],
              groups: [[0], [1, 2]],
              meter: "2/4",
              label: "Haczyk w prawo — szesnastka przed ósemką z kropką",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l4-e1",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedEighth", "sixteenth", "quarter", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2], [3], [4]] },
              { groups: [[0], [1], [2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e2",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "sixteenth", "dottedEighth", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0], [1, 2], [3], [4]] },
              { groups: [[0], [1], [2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e3",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0, 1, 2, 3], [4], [5]] },
              { groups: [[0, 1], [2, 3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "sixteenth", "sixteenth", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0], [1, 2, 3], [4]] },
              { groups: [[0], [1], [2, 3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e5",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedEighth", "sixteenth", "quarter"],
            meter: "2/4",
            options: [{ groups: [[0, 1], [2]] }, { groups: [[0], [1], [2]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e6",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "sixteenth", "sixteenth", "dottedEighth", "sixteenth", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5], [6], [7]] },
              { groups: [[0, 1], [2, 3], [4, 5], [6], [7]] },
              { groups: [[0, 1, 2, 3, 4, 5], [6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l4-e7",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "dottedEighth", "sixteenth", "eighth", "eighth", "eighth"],
            meter: "6/8",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5, 6]] },
              { groups: [[0, 1], [2, 3], [4, 5, 6]] },
              { groups: [[0], [1], [2, 3], [4, 5, 6]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-5-grupowanie-pauzy",
      order: 5,
      difficulty: 4,
      introSlides: [
        {
          body: "Pauza wewnątrz belkowanej grupy nie przerywa belki — belka nadal łączy prawdziwe nuty po obu jej stronach, tak jakby pauzy tam nie było.",
          groupingExamples: [
            {
              sequence: ["eighth", "sixteenthRest", "sixteenth", "quarter"],
              groups: [[0, 1, 2], [3]],
              meter: "2/4",
              label: "Pauza szesnastkowa w środku grupy — belka nadal łączy prawdziwe nuty",
            },
          ],
        },
        {
          body: "Pauza, która sama wypełnia cały puls, stoi osobno i nie wchodzi w belkę z sąsiednią grupą, tak jak pojedyncza nuta wypełniająca cały puls nie ma belki. Uwaga: w tej grze belka przechodzi nad pauzą wewnątrz grupy (w niektórych podręcznikach zapisuje się to inaczej).",
          groupingExamples: [
            {
              sequence: ["half", "quarterRest", "quarter"],
              groups: [[0], [1], [2]],
              meter: "4/4",
              label: "Pauza wypełniająca cały puls (tu ćwierćpauza) stoi osobno, nigdy nie wchodzi w belkę",
            },
          ],
        },
        {
          body: "Pauza nigdy nie usprawiedliwia przekroczenia granicy pulsu. Test jest identyczny jak dla nut: czy dana grupa (pauzy i prawdziwe nuty razem) mieści się w jednym pulsie. Jeśli tak — jedna belka przez pauzę. Jeśli nie — belka kończy się na granicy pulsu, pauza albo należy do poprzedniej grupy, albo stoi na początku następnej.",
        },
      ],
      exercises: [
        {
          id: "gg-l5-e1",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenthRest", "sixteenth", "sixteenth", "quarter"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2, 3], [4]] },
              { groups: [[0], [1], [2, 3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l5-e2",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "sixteenthRest", "sixteenth", "eighth", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1, 2, 3], [4]] },
              { groups: [[0], [1], [2], [3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l5-e3",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "quarterRest", "eighth", "eighth"],
            meter: "3/4",
            options: [
              { groups: [[0, 1], [2], [3, 4]] },
              { groups: [[0], [1, 2], [3, 4]] },
              { groups: [[0, 1], [2, 3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l5-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "sixteenth", "sixteenthRest", "sixteenth", "sixteenth",
              "sixteenth", "sixteenth", "sixteenthRest", "sixteenth",
              "quarter", "quarter",
            ],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5, 6, 7], [8], [9]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7], [8], [9]] },
              { groups: [[0, 1], [2, 3], [4, 5, 6, 7], [8], [9]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l5-e5",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "sixteenthRest", "sixteenth", "quarter", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2, 3], [4], [5], [6]] },
              { groups: [[0, 1], [2, 3], [4], [5], [6]] },
              { groups: [[0], [1, 2, 3], [4], [5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l5-e6",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "sixteenth", "sixteenth", "sixteenthRest", "sixteenth",
              "dottedEighth", "sixteenth", "quarter", "quarter",
            ],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5], [6], [7]] },
              { groups: [[0, 1], [2, 3], [4, 5], [6], [7]] },
              { groups: [[0, 1, 2, 3, 4, 5], [6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-6-triole-grupowanie",
      order: 6,
      difficulty: 5,
      introSlides: [
        {
          body: "Triola (3 w czasie 2) to zawsze jedna belka + jedna etykieta '3' nad środkową nutą — niezależnie od tego, jak (poprawnie albo błędnie) dany wariant ją pogrupuje, triola zawsze pokazuje swoją etykietę.",
          groupingExamples: [
            {
              sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter"],
              groups: [[0, 1, 2], [3]],
              meter: "2/4",
              label: "Triola = jedna belka + etykieta '3'",
            },
          ],
        },
        {
          body: "W tej lekcji dwie triole pod rząd mają dwie oddzielne belki, każda ze swoją własną '3' (jedna belka przez obie byłaby sekstolą). Zwykła belka też zwykle nie przekracza granicy pulsu.",
          groupingExamples: [
            {
              sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
              groups: [[0, 1, 2], [3, 4, 5]],
              meter: "2/4",
              label: "Dwie triole pod rząd = dwie oddzielne belki, dwie oddzielne '3'",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l6-e1",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2], [3]] },
              { groups: [[0, 1], [2], [3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l6-e2",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5]] },
              { groups: [[0, 1, 2, 3, 4, 5]] },
              { groups: [[0, 1], [2, 3], [4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l6-e3",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
            meter: "2/4",
            options: [{ groups: [[0], [1, 2, 3]] }, { groups: [[0], [1], [2, 3]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l6-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter", "quarter"],
            meter: "3/4",
            options: [{ groups: [[0, 1, 2], [3], [4]] }, { groups: [[0, 1], [2], [3], [4]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l6-e5",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: [
              "eighthTriplet", "eighthTriplet", "eighthTriplet",
              "eighthTriplet", "eighthTriplet", "eighthTriplet",
              "eighthTriplet", "eighthTriplet", "eighthTriplet",
            ],
            meter: "3/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8]] },
              { groups: [[0, 1, 2], [3, 4, 5, 6, 7, 8]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l6-e6",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2], [3], [4], [5]] },
              { groups: [[0, 1], [2], [3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-7-metra-nieparzyste",
      order: 7,
      difficulty: 6,
      introSlides: [
        {
          body: "5/8 najczęściej grupuje się jako 3+2 (trzy ósemki, potem dwie) — tej konwencji używamy w tej lekcji. Uwaga: 2+3 jest równie poprawne i używane gdzie indziej — to kwestia wyboru kompozytora, nie błędu notacji.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1, 2], [3, 4]],
              meter: "5/8",
              label: "5/8 jako 3+2 (2+3 też jest poprawne, ale nie w tej lekcji)",
            },
          ],
        },
        {
          body: "7/8 najczęściej grupuje się jako 2+2+3 — tej konwencji używamy w tej lekcji. Uwaga: 2+3+2 i 3+2+2 też są poprawne i używane gdzie indziej.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1], [2, 3], [4, 5, 6]],
              meter: "7/8",
              label: "7/8 jako 2+2+3",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l7-e1",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "5/8",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
              { groups: [[0], [1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l7-e2",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/8",
            options: [
              { groups: [[0, 1], [2, 3], [4, 5, 6]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6]] },
              { groups: [[0, 1, 2, 3], [4, 5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l7-e3",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "eighth"],
            meter: "5/8",
            options: [{ groups: [[0], [1], [2, 3]] }, { groups: [[0], [1, 2], [3]] }],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l7-e4",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/8",
            options: [
              { groups: [[0], [1, 2], [3, 4, 5]] },
              { groups: [[0], [1], [2], [3, 4, 5]] },
              { groups: [[0], [1], [2, 3, 4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l7-e5",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth"],
            meter: "5/8",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5]] },
              { groups: [[0, 1, 2, 3, 4, 5]] },
              { groups: [[0, 1], [2, 3], [4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l7-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "eighth", "eighth"],
            meter: "7/8",
            options: [
              { groups: [[0, 1], [2, 3], [4, 5, 6, 7]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7]] },
              { groups: [[0, 1], [2, 3], [4, 5], [6, 7]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-8-pauza-osemkowa",
      order: 8,
      difficulty: 4,
      introSlides: [
        {
          body: "Pauza ósemkowa wewnątrz grupy nut nie przerywa grupy — belka nadal łączy nuty, które w niej są, dokładnie jak pauza szesnastkowa, którą już znasz.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighthRest", "eighth", "eighth"],
              groups: [[0, 1, 2], [3, 4, 5]],
              meter: "6/8",
              label: "Pauza ósemkowa na początku grupy — belka nadal łączy ósemki po niej",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l8-e1",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighthRest", "eighth", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1], [2, 3]] },
              { groups: [[0, 1, 2, 3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e2",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthRest", "eighth", "eighth", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1], [2, 3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e3",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighthRest", "eighth", "eighth", "eighth"],
            meter: "3/4",
            options: [
              { groups: [[0, 1], [2, 3], [4, 5]] },
              { groups: [[0, 1], [2, 3, 4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e4",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "eighthRest", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1], [2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e5",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighthRest", "sixteenth", "sixteenth", "eighth", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2, 3, 4], [5], [6]] },
              { groups: [[0, 1, 2, 3, 4], [5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e6",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthRest", "eighth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2, 3, 4], [5, 6], [7]] },
              { groups: [[0, 1], [2, 3, 4, 5, 6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e7",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighthRest", "eighth", "eighth"],
            meter: "6/8",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5]] },
              { groups: [[0, 1, 2, 3, 4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l8-e8",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthRest", "eighth", "eighth", "eighth", "eighth", "eighthRest"],
            meter: "6/8",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5]] },
              { groups: [[0], [1], [2], [3, 4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-9-triole-i-proste-wartosci",
      order: 9,
      difficulty: 5,
      introSlides: [
        {
          body: "Triola obok zwykłych wartości: jej własna belka i etykieta '3' nigdy nie wychodzą poza jej własny puls — sąsiednie ósemki czy szesnastki w innym pulsie zawsze mają swoją osobną belkę.",
          groupingExamples: [
            {
              sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighth", "eighth"],
              groups: [[0, 1, 2], [3, 4]],
              meter: "2/4",
              label: "Triola w jednym pulsie, zwykłe ósemki w drugim — każdy pulsuje osobno",
            },
          ],
        },
        {
          body: "Triola zwykle nie łączy się belką z sąsiednią ćwierćnutą ani z żadną pojedynczą wartością spoza niej — zostaje własną, zamkniętą grupą trzech.",
          groupingExamples: [
            {
              sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
              groups: [[0], [1, 2, 3]],
              meter: "2/4",
              label: "Triola zwykle nie łączy się belką z sąsiednią ćwierćnutą",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l9-e1",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighth", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e2",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
            meter: "2/4",
            options: [
              { groups: [[0, 1], [2, 3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e3",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0], [1, 2, 3], [4]] },
              { groups: [[0], [1, 2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e4",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "sixteenth", "sixteenth", "eighth", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6]] },
              { groups: [[0, 1, 2, 3, 4, 5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e5",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6], [7]] },
              { groups: [[0, 1, 2, 3, 4, 5], [6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet", "sixteenth", "sixteenth", "eighth", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0], [1, 2, 3], [4, 5, 6], [7]] },
              { groups: [[0], [1, 2, 3, 4, 5, 6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e7",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
            meter: "3/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7, 8]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l9-e8",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]] },
              { groups: [[0, 1, 2], [3, 4, 5, 6, 7, 8], [9, 10, 11]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-10-dlugie-wartosci",
      order: 10,
      difficulty: 4,
      introSlides: [
        {
          body: "Półnuta, półnuta z kropką i cała nuta nigdy nie mają belki ani chorągiewki — stoją zawsze same, nawet w środku taktu, obok belkowanych grup ósemek czy szesnastek.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "half", "quarter"],
              groups: [[0, 1], [2], [3]],
              meter: "4/4",
              label: "Półnuta nigdy nie ma belki — stoi sama, nawet w środku taktu",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l10-e1",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "half", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2], [3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e2",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["half", "eighth", "eighth"],
            meter: "3/4",
            options: [
              { groups: [[0], [1, 2]] },
              { groups: [[0], [1], [2]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e3",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["half", "quarter", "eighth", "eighth"],
            meter: "4/4",
            options: [
              { groups: [[0], [1], [2, 3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "half", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2], [3], [4]] },
              { groups: [[0, 1], [2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e5",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "quarter", "half"],
            meter: "2/2",
            options: [
              { groups: [[0, 1], [2], [3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e6",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "half"],
            meter: "2/2",
            options: [
              { groups: [[0, 1, 2, 3], [4]] },
              { groups: [[0, 1], [2, 3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e7",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["whole", "eighth", "eighth", "quarter", "quarter", "quarter"],
            meter: "4/4",
            barBeforeIndex: 1,
            options: [
              { groups: [[0], [1, 2], [3], [4], [5]] },
              { groups: [[0], [1], [2], [3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l10-e8",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedHalf", "eighth", "eighth", "quarter", "quarter"],
            meter: "3/4",
            barBeforeIndex: 1,
            options: [
              { groups: [[0], [1, 2], [3], [4]] },
              { groups: [[0], [1], [2], [3], [4]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-11-nieparzyste-metra-cwiartkowe",
      order: 11,
      difficulty: 6,
      introSlides: [
        {
          body: "5/4 najczęściej grupuje się jako 3+2 (trzy ćwierćnuty, potem dwie) — ten sam podział, który już znasz z 5/8, tylko teraz jednostką jest ćwierćnuta, nie ósemka. W tej lekcji belkujemy całą grupę 3+2 (jedna belka na grupę).",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9]],
              meter: "5/4",
              label: "5/4 jako 3+2 (trzy ćwierćnuty + dwie ćwierćnuty)",
            },
          ],
        },
        {
          body: "7/4 najczęściej grupuje się jako 2+2+3 — dokładnie jak 7/8, tylko w ćwierćnutach zamiast w ósemkach. W tej lekcji belkujemy całą grupę 2+2+3 (jedna belka na grupę).",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13]],
              meter: "7/4",
              label: "7/4 jako 2+2+3",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l11-e1",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "5/4",
            options: [
              { groups: [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e2",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter"],
            meter: "5/4",
            options: [
              { groups: [[0], [1, 2, 3, 4], [5], [6]] },
              { groups: [[0], [1, 2], [3, 4], [5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e3",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/4",
            options: [
              { groups: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13]] },
              { groups: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e4",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/4",
            options: [
              { groups: [[0], [1], [2, 3, 4, 5], [6], [7, 8, 9, 10]] },
              { groups: [[0], [1], [2, 3], [4, 5], [6], [7, 8], [9, 10]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e5",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth", "quarter", "quarter"],
            meter: "5/4",
            options: [
              { groups: [[0, 1, 2, 3, 4, 5, 6], [7], [8]] },
              { groups: [[0, 1], [2, 3], [4, 5, 6], [7], [8]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth"],
            meter: "5/4",
            options: [
              { groups: [[0], [1], [2], [3, 4, 5, 6]] },
              { groups: [[0], [1], [2], [3, 4], [5, 6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e7",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "eighth", "eighth", "quarter"],
            meter: "7/4",
            options: [
              { groups: [[0, 1, 2, 3], [4], [5], [6, 7, 8, 9, 10, 11], [12]] },
              { groups: [[0, 1], [2, 3], [4], [5], [6, 7, 8, 9], [10, 11], [12]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l11-e8",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighth", "eighth", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter"],
            meter: "7/4",
            options: [
              { groups: [[0], [1, 2], [3], [4], [5, 6, 7, 8], [9]] },
              { groups: [[0], [1, 2], [3], [4], [5, 6], [7, 8], [9]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-12-granica-taktu",
      order: 12,
      difficulty: 5,
      introSlides: [
        {
          body: "Teraz dwa takty naraz — belka NIGDY nie przeskakuje przez kreskę taktową, choćby dwie sąsiednie grupy wyglądały tak samo. Każdy takt grupuje się całkiem osobno.",
          groupingExamples: [
            {
              sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
              groups: [[0, 1], [2, 3], [4, 5], [6, 7]],
              barBeforeIndex: 4,
              meter: "2/4",
              label: "Każdy takt grupowany osobno — belka nigdy nie przeskakuje przez kreskę taktową",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "gg-l12-e1",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "2/4",
            barBeforeIndex: 4,
            options: [
              { groups: [[0, 1], [2, 3], [4, 5], [6, 7]] },
              { groups: [[0, 1], [2, 3, 4, 5], [6, 7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e2",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "3/4",
            barBeforeIndex: 6,
            options: [
              { groups: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11]] },
              { groups: [[0, 1], [2, 3], [4, 5, 6, 7], [8, 9], [10, 11]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e3",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "quarter", "quarter", "sixteenth", "sixteenth", "eighth", "sixteenth", "sixteenth", "eighth", "quarter", "quarter", "quarter"],
            meter: "4/4",
            barBeforeIndex: 6,
            options: [
              { groups: [[0], [1], [2], [3, 4, 5], [6, 7, 8], [9], [10], [11]] },
              { groups: [[0], [1], [2], [3, 4, 5, 6, 7, 8], [9], [10], [11]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "6/8",
            barBeforeIndex: 6,
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]] },
              { groups: [[0, 1, 2], [3, 4, 5, 6, 7, 8], [9, 10, 11]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e5",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter"],
            meter: "2/4",
            barBeforeIndex: 5,
            options: [
              { groups: [[0], [1, 2, 3, 4], [5, 6, 7, 8], [9]] },
              { groups: [[0], [1, 2, 3, 4, 5, 6, 7, 8], [9]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "quarter", "eighth", "eighth", "eighth", "eighth", "quarter", "eighth", "eighth"],
            meter: "3/4",
            barBeforeIndex: 5,
            options: [
              { groups: [[0, 1], [2], [3, 4], [5, 6], [7], [8, 9]] },
              { groups: [[0, 1], [2], [3, 4, 5, 6], [7], [8, 9]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e7",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter"],
            meter: "2/4",
            barBeforeIndex: 4,
            options: [
              { groups: [[0], [1, 2, 3], [4, 5, 6], [7]] },
              { groups: [[0], [1, 2, 3, 4, 5, 6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l12-e8",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "6/8",
            barBeforeIndex: 6,
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6, 7, 8, 9], [10, 11, 12]] },
              { groups: [[0, 1, 2], [3, 4, 5, 6, 7, 8, 9], [10, 11, 12]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      id: "gg-poziom-13-mieszanka-przed-bossem",
      order: 13,
      difficulty: 6,
      introSlides: [
        {
          body: "Podsumowanie grupowania — metra proste, złożone i nieparzyste, pauzy, triole i długie wartości, wszystko wymieszane. Dokładnie to czeka Cię u bossa.",
        },
      ],
      exercises: [
        {
          id: "gg-l13-e1",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedEighth", "sixteenth", "eighth", "eighth", "eighth"],
            meter: "5/8",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e2",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "sixteenth", "sixteenth", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/8",
            options: [
              { groups: [[0, 1], [2, 3, 4], [5, 6, 7]] },
              { groups: [[0, 1, 2, 3, 4], [5, 6, 7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e3",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["dottedEighth", "sixteenth", "eighth", "eighth", "eighth", "eighth"],
            meter: "6/8",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5]] },
              { groups: [[0, 1, 2, 3, 4, 5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e4",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "eighthTriplet", "eighthTriplet", "eighthTriplet", "sixteenth", "sixteenth", "eighth", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0], [1, 2, 3], [4, 5, 6], [7]] },
              { groups: [[0], [1, 2, 3, 4, 5, 6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e5",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "half"],
            meter: "3/4",
            options: [
              { groups: [[0, 1], [2]] },
              { groups: [[0], [1], [2]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["quarter", "quarter", "eighth", "eighth", "quarter", "quarter"],
            meter: "5/4",
            options: [
              { groups: [[0], [1], [2, 3], [4], [5]] },
              { groups: [[0], [1], [2], [3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e7",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthRest", "eighth", "sixteenth", "sixteenth", "eighth"],
            meter: "2/4",
            options: [
              { groups: [[0, 1], [2, 3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e8",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "quarter", "quarter", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "7/4",
            options: [
              { groups: [[0, 1, 2, 3], [4], [5], [6, 7, 8, 9, 10, 11]] },
              { groups: [[0, 1], [2, 3], [4], [5], [6, 7, 8], [9, 10, 11]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l13-e9",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthRest", "eighth", "eighthTriplet", "eighthTriplet", "eighthTriplet", "dottedEighth", "sixteenth", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2, 3, 4], [5, 6], [7]] },
              { groups: [[0, 1, 2, 3, 4], [5, 6], [7]] },
            ],
            correctOptionIndex: 0,
          },
        },
      ],
    },
    {
      // Boss lekcja — Wiewiór Pęczek. Jak Arytmik/Ośmiotakt/.../Piętrus:
      // mix ćwiczeń z nowym, świeżym materiałem w stylu/trudności lekcji
      // 1-13, obejmujący wszystko, co ta kraina uczy grupować: pauzy,
      // triole, długie wartości, nieparzyste metra, granicę taktu.
      id: "gg-poziom-14-boss-peczek",
      order: 14,
      difficulty: 4,
      isBoss: true,
      bossName: "Pęczek",
      introSlides: [
        {
          body: "Wiewiór Pęczek strzeże wyjścia z Gaju Grupowania — wiąże żołędzie-nuty gałązkami, ale zawsze źle: zamiast porządnych grup robi krzywe pęczki. Pokaż, że Ty grupujesz bezbłędnie: pauzy, triole, długie wartości, nieparzyste metra i nigdy nie przekraczasz granicy taktu.",
          bossPortrait: true,
        },
      ],
      exercises: [
        {
          id: "gg-l14-e1",
          type: "beam-grouping-choice",
          difficulty: 3,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["sixteenth", "sixteenth", "eighth", "quarter", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1, 2], [3], [4], [5]] },
              { groups: [[0], [1], [2], [3], [4], [5]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e2",
          type: "beam-grouping-choice",
          difficulty: 4,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighthRest", "sixteenth", "sixteenth", "eighth", "quarter", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2, 3, 4], [5], [6]] },
              { groups: [[0, 1, 2, 3, 4], [5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e3",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "eighthTriplet", "quarter"],
            meter: "3/4",
            options: [
              { groups: [[0, 1, 2], [3, 4, 5], [6]] },
              { groups: [[0, 1, 2, 3, 4, 5], [6]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e4",
          type: "beam-grouping-choice",
          difficulty: 5,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "half", "quarter"],
            meter: "4/4",
            options: [
              { groups: [[0, 1], [2], [3]] },
              { groups: [[0], [1], [2], [3]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e5",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "5/8",
            options: [
              { groups: [[0, 1, 2], [3, 4]] },
              { groups: [[0, 1, 2, 3, 4]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e6",
          type: "beam-grouping-choice",
          difficulty: 6,
          spec: {
            type: "beam-grouping-choice",
            sequence: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"],
            meter: "2/4",
            barBeforeIndex: 4,
            options: [
              { groups: [[0, 1], [2, 3], [4, 5], [6, 7]] },
              { groups: [[0, 1], [2, 3, 4, 5], [6, 7]] },
            ],
            correctOptionIndex: 0,
          },
        },
        {
          id: "gg-l14-e7",
          type: "rhythm-math-choice",
          difficulty: 4,
          spec: {
            type: "rhythm-math-choice",
            combinations: [
              ["quarter", "quarter", "half"],
              ["quarter", "half"],
              ["half", "half", "quarter"],
            ],
          },
        },
      ],
    },
  ],
};
