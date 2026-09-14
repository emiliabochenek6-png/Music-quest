import type { WorldContent } from "@/types/exercises";

/**
 * Ported from master-quest (web)'s data/worlds/labirynt-tonacji.json —
 * same 4 lessons, same 50 exercises, same ids/specs, restructured only to
 * fit this app's own WorldContent/LessonDefinition/ExerciseDefinition
 * shape (types/exercises.ts). All 7 exercise types (circle-step-choice,
 * key-fact-choice, relative-key-choice, key-signature-names-choice,
 * circle-neighbor-key-choice, key-signature-staff-choice,
 * accidental-count-key-choice) are new to this port — see
 * components/exercises/{CircleStepChoice,KeyFactChoice,RelativeKeyChoice,
 * KeySignatureNamesChoice,CircleNeighborKeyChoice,KeySignatureStaffChoice,
 * AccidentalCountKeyChoice}Exercise.tsx, lib/music/keys.ts (extended well
 * beyond the fifths→tonic subset Zatoka Trójdźwięków needed — now carries
 * the full circle-of-fifths machinery: staff steps, accidental naming/
 * counting), and components/exercises/{CircleOfFifthsWheel,
 * KeySignatureStaffIcon}.tsx (both entirely new — the wheel is the
 * shared answer surface for circle-step-choice/relative-key-choice AND
 * the intro slides' own read-only reference visual). This world uses NO
 * audio at all — every exercise is visual/text only. Every lesson's
 * introSlides is ported (all 4 have exactly one, body + circleHighlight).
 */
export const LABIRYNT_TONACJI_CONTENT: WorldContent = {
  worldId: "labirynt-tonacji",
  lessons: [
    {
      id: "lt-poziom-1-zegar-krzyzykow",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Koło kwintowe to zegar tonacji: C-dur na górze, a idąc w prawo (zgodnie z ruchem wskazówek zegara) o jedną kwintę, dodajemy jeden krzyżyk. C-dur → G-dur (1 krzyżyk) → D-dur (2) → A-dur (3) → E-dur (4) → H-dur (5). Kliknij, żeby usłyszeć zasadę — teraz przećwiczysz krok po kroku tę stronę krzyżykową. Każda tonacja durowa ma swoją gamę molową równoległą — leży o tercję małą niżej i ma ten sam znak przykluczowy (np. a-moll dla C-dur, e-moll dla G-dur).",
          circleHighlight: { fifths: 0 },
        },
      ],
      exercises: [
        { id: "lt-l1-e1", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        { id: "lt-l1-e2", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        { id: "lt-l1-e3", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        { id: "lt-l1-e4", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        { id: "lt-l1-e5", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        { id: "lt-l1-e6", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "clockwise", fifthsRange: [0, 4] } },
        {
          id: "lt-l1-e7",
          type: "key-fact-choice",
          difficulty: 1,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka jest gama równoległa (molowa) dla gamy C-dur?",
            hint: "Gama równoległa leży o tercję małą (3 półtony) w dół od gamy durowej i ma dokładnie te same znaki przykluczowe.",
            options: ["a-moll", "e-moll", "d-moll", "f-moll"],
            correctOptionIndex: 0,
            explanation: "C-dur i a-moll to gamy równoległe – obie nie posiadają żadnych znaków przykluczowych.",
          },
        },
        {
          id: "lt-l1-e8",
          type: "key-fact-choice",
          difficulty: 1,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka jest gama równoległa (molowa) dla gamy G-dur?",
            hint: "Policz 3 półtony w dół od dźwięku G (G -> Fis -> F -> E) lub przypomnij sobie, która gama molowa ma 1 krzyżyk (fis).",
            options: ["h-moll", "e-moll", "a-moll", "c-moll"],
            correctOptionIndex: 1,
            explanation: "Gama e-moll leży o tercję małą poniżej G-dur i dzieli z nią ten sam znak przykluczowy (1 krzyżyk).",
          },
        },
        {
          id: "lt-l1-e9",
          type: "key-fact-choice",
          difficulty: 1,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka jest gama równoległa (molowa) dla gamy F-dur?",
            hint: "Szukana gama ma 1 bemol (b). Policz tercję małą w dół od dźwięku F.",
            options: ["d-moll", "g-moll", "c-moll", "a-moll"],
            correctOptionIndex: 0,
            explanation: "Gama d-moll leży o tercję małą poniżej F-dur i ma 1 bemol.",
          },
        },
        {
          id: "lt-l1-e10",
          type: "key-fact-choice",
          difficulty: 2,
          spec: {
            type: "key-fact-choice",
            prompt: "Ile znaków przykluczowych i jakich mają gamy równoległe D-dur i h-moll?",
            hint: "Kolejność dodawania krzyżyków na kole kwintowym to: fis, cis, gis, dis, ais, eis, his.",
            options: ["1 krzyżyk", "2 krzyżyki", "3 krzyżyki", "2 bemole"],
            correctOptionIndex: 1,
            explanation: "D-dur i h-moll mają 2 krzyżyki (fis, cis).",
          },
        },
        {
          id: "lt-l1-e11",
          type: "key-fact-choice",
          difficulty: 2,
          spec: {
            type: "key-fact-choice",
            prompt: "Ile znaków przykluczowych mają gamy równoległe Es-dur i c-moll?",
            hint: "Kolejność bemoli to: b, es, as, des, ges, ces, fes.",
            options: ["2 bemole", "3 bemole", "4 bemole", "3 krzyżyki"],
            correctOptionIndex: 1,
            explanation: "Gamy Es-dur i c-moll posiadają 3 bemole (b, es, as).",
          },
        },
        {
          id: "lt-l1-e12",
          type: "key-fact-choice",
          difficulty: 2,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka gama molowa jest równoległa do A-dur i ile posiada znaków?",
            hint: "Od A w dół o 3 półtony to Fis. A-dur znajduje się na 3. miejscu po prawej stronie koła kwintowego.",
            options: ["fis-moll (3 krzyżyki)", "cis-moll (4 krzyżyki)", "fis-moll (2 krzyżyki)", "f-moll (3 bemole)"],
            correctOptionIndex: 0,
            explanation: "Gama A-dur oraz jej równoległa fis-moll mają 3 krzyżyki (fis, cis, gis).",
          },
        },
        {
          id: "lt-l1-e13",
          type: "key-fact-choice",
          difficulty: 3,
          spec: {
            type: "key-fact-choice",
            prompt: "Która para gam równoległych posiada 4 bemole (b, es, as, des)?",
            hint: "Czwarty bemol (des) wyznacza tonację durową o krok wcześniej na kole kwintowym (przedostatni bemol to nazwa gamy durowej).",
            options: ["As-dur i f-moll", "Des-dur i b-moll", "Es-dur i c-moll", "As-dur i c-moll"],
            correctOptionIndex: 0,
            explanation: "Przedostatni bemol z czterech (b, es, as, des) wskazuje na gamę As-dur. Jej równoległą jest f-moll.",
          },
        },
        {
          id: "lt-l1-e14",
          type: "key-fact-choice",
          difficulty: 3,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka gama równoległa odpowiada gamie H-dur i ile ma znaków przykluczowych?",
            hint: "H-dur ma aż 5 krzyżyków. Schodząc o tercję małą w dół od H, pamiętaj o podwyższonym dźwięku (gis, a nie g).",
            options: ["gis-moll, 5 krzyżyków", "a-moll, 5 krzyżyków", "dis-moll, 6 krzyżyków", "gis-moll, 4 krzyżyki"],
            correctOptionIndex: 0,
            explanation: "H-dur i gis-moll to gamy równoległe posiadające 5 krzyżyków (fis, cis, gis, dis, ais).",
          },
        },
        {
          id: "lt-l1-e15",
          type: "key-fact-choice",
          difficulty: 3,
          spec: {
            type: "key-fact-choice",
            prompt: "Gamy Des-dur oraz b-moll mają:",
            hint: "Des-dur leży po lewej stronie koła kwintowego (tonacja bemolowa) i ma o jeden bemol więcej niż As-dur (4 bemole).",
            options: ["5 bemoli", "4 bemole", "5 krzyżyków", "6 bemoli"],
            correctOptionIndex: 0,
            explanation: "Para równoległa Des-dur / b-moll posiada 5 bemoli (b, es, as, des, ges).",
          },
        },
      ],
    },
    {
      id: "lt-poziom-2-strona-bemolowa",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Idąc w lewo (przeciwnie do ruchu wskazówek zegara) po kole kwintowym, dodajemy kolejne bemole. C-dur → F-dur (1 bemol) → B-dur (2) → Es-dur (3) → As-dur (4) → Des-dur (5). To druga strona tego samego zegara — teraz przećwiczysz krok po kroku wędrówkę w stronę bemoli.",
          circleHighlight: { fifths: 0 },
        },
      ],
      exercises: [
        { id: "lt-l2-e1", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "counterclockwise", fifthsRange: [-4, 0] } },
        { id: "lt-l2-e2", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "counterclockwise", fifthsRange: [-4, 0] } },
        { id: "lt-l2-e3", type: "circle-step-choice", difficulty: 1, spec: { type: "circle-step-choice", direction: "counterclockwise", fifthsRange: [-4, 0] } },
        {
          id: "lt-l2-e4",
          type: "key-fact-choice",
          difficulty: 1,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka jest gama równoległa (molowa) dla gamy B-dur?",
            hint: "B-dur ma 2 bemole (b, es). Zejdź o tercję małą (3 półtony) w dół od dźwięku B.",
            options: ["g-moll", "d-moll", "es-moll", "c-moll"],
            correctOptionIndex: 0,
            explanation: "B-dur i g-moll to gamy równoległe – obie mają 2 bemole (b, es).",
          },
        },
        {
          id: "lt-l2-e5",
          type: "key-fact-choice",
          difficulty: 2,
          spec: {
            type: "key-fact-choice",
            prompt: "Ile znaków przykluczowych mają gamy równoległe E-dur i cis-moll?",
            hint: "Kolejność dodawania krzyżyków na kole kwintowym to: fis, cis, gis, dis. E-dur to czwarta tonacja durowa po stronie krzyżykowej.",
            options: ["3 krzyżyki", "4 krzyżyki", "5 krzyżyków", "4 bemole"],
            correctOptionIndex: 1,
            explanation: "E-dur i cis-moll mają 4 krzyżyki (fis, cis, gis, dis).",
          },
        },
        {
          id: "lt-l2-e6",
          type: "key-fact-choice",
          difficulty: 3,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka gama równoległa odpowiada gamie Ges-dur i ile ma znaków przykluczowych?",
            hint: "Ges-dur to najdalsza tonacja durowa po stronie bemolowej — ma aż 6 bemoli. Zejdź o tercję małą w dół od dźwięku Ges.",
            options: ["es-moll, 6 bemoli", "b-moll, 6 bemoli", "es-moll, 5 bemoli", "dis-moll, 6 krzyżyków"],
            correctOptionIndex: 0,
            explanation: "Ges-dur i es-moll to gamy równoległe posiadające 6 bemoli (b, es, as, des, ges, ces).",
          },
        },
        {
          id: "lt-l2-e7",
          type: "key-fact-choice",
          difficulty: 3,
          spec: {
            type: "key-fact-choice",
            prompt: "Jaka gama równoległa odpowiada gamie Fis-dur i ile ma znaków przykluczowych?",
            hint: "Fis-dur to najdalsza tonacja durowa po stronie krzyżykowej — ma aż 6 krzyżyków. Zejdź o tercję małą w dół od dźwięku Fis, pamiętając o podwyższonym dźwięku (dis, a nie d).",
            options: ["dis-moll, 6 krzyżyków", "d-moll, 6 krzyżyków", "dis-moll, 5 krzyżyków", "es-moll, 6 bemoli"],
            correctOptionIndex: 0,
            explanation: "Fis-dur i dis-moll to gamy równoległe posiadające 6 krzyżyków (fis, cis, gis, dis, ais, eis).",
          },
        },
      ],
    },
    {
      id: "lt-poziom-3-tonacje-pokrewne",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Każda tonacja durowa ma swoją tonację pokrewną (równoległą) molową — leżą na tym samym „promieniu” koła kwintowego, bo mają ten sam znak przykluczowy. C-dur i a-moll (0 znaków), G-dur i e-moll (1 krzyżyk), F-dur i d-moll (1 bemol). Zapamiętaj: tonacja molowa to tercja mała poniżej swojej durowej pary.",
          circleHighlight: { fifths: 0 },
        },
      ],
      exercises: [
        { id: "lt-l3-e1", type: "relative-key-choice", difficulty: 2, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e2", type: "relative-key-choice", difficulty: 2, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e3", type: "relative-key-choice", difficulty: 2, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e4", type: "relative-key-choice", difficulty: 2, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e5", type: "key-signature-names-choice", difficulty: 2, spec: { type: "key-signature-names-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e6", type: "key-signature-names-choice", difficulty: 2, spec: { type: "key-signature-names-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e7", type: "key-signature-names-choice", difficulty: 2, spec: { type: "key-signature-names-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e8", type: "circle-neighbor-key-choice", difficulty: 2, spec: { type: "circle-neighbor-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e9", type: "circle-neighbor-key-choice", difficulty: 2, spec: { type: "circle-neighbor-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e10", type: "circle-neighbor-key-choice", difficulty: 2, spec: { type: "circle-neighbor-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e11", type: "key-signature-staff-choice", difficulty: 2, spec: { type: "key-signature-staff-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e12", type: "key-signature-staff-choice", difficulty: 2, spec: { type: "key-signature-staff-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e13", type: "key-signature-staff-choice", difficulty: 2, spec: { type: "key-signature-staff-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e14", type: "accidental-count-key-choice", difficulty: 3, spec: { type: "accidental-count-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e15", type: "accidental-count-key-choice", difficulty: 3, spec: { type: "accidental-count-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l3-e16", type: "accidental-count-key-choice", difficulty: 3, spec: { type: "accidental-count-key-choice", fifthsRange: [-5, 5] } },
      ],
    },
    {
      id: "lt-poziom-4-szybkie-odczytywanie",
      order: 4,
      difficulty: 3,
      introSlides: [
        {
          body: "To poziom podsumowujący — sprawdzian tego, czego nauczyłeś się w trzech poprzednich poziomach. Znajdziesz tu mieszankę wszystkich rodzajów zadań: kroki po kole, tonacje równoległe, nazwy konkretnych znaków, sąsiadów na kole, rozpoznawanie po zapisie na pięciolinii i odwróconą logikę liczby znaków.",
          circleHighlight: { fifths: 0 },
        },
      ],
      exercises: [
        { id: "lt-l4-e1", type: "circle-step-choice", difficulty: 3, spec: { type: "circle-step-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e2", type: "circle-step-choice", difficulty: 3, spec: { type: "circle-step-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e3", type: "relative-key-choice", difficulty: 3, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e4", type: "relative-key-choice", difficulty: 3, spec: { type: "relative-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e5", type: "key-signature-names-choice", difficulty: 3, spec: { type: "key-signature-names-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e6", type: "key-signature-names-choice", difficulty: 3, spec: { type: "key-signature-names-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e7", type: "circle-neighbor-key-choice", difficulty: 3, spec: { type: "circle-neighbor-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e8", type: "circle-neighbor-key-choice", difficulty: 3, spec: { type: "circle-neighbor-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e9", type: "key-signature-staff-choice", difficulty: 3, spec: { type: "key-signature-staff-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e10", type: "key-signature-staff-choice", difficulty: 3, spec: { type: "key-signature-staff-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e11", type: "accidental-count-key-choice", difficulty: 3, spec: { type: "accidental-count-key-choice", fifthsRange: [-5, 5] } },
        { id: "lt-l4-e12", type: "accidental-count-key-choice", difficulty: 3, spec: { type: "accidental-count-key-choice", fifthsRange: [-5, 5] } },
      ],
    },
  ],
};
