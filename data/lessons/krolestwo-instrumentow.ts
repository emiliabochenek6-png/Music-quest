import type { ExerciseDefinition, WorldContent } from "@/types/exercises";

/**
 * "Królestwo Instrumentów" — a new world (4th on the map, between Przystań
 * Taktów and Pasmo Interwałów) about the instruments of an orchestra: the
 * families (strings, woodwinds, brass, percussion, keyboards/plucked), how
 * each is played, which sound high and which low, and how an orchestra is
 * laid out. See plany/2026-10-02-krolestwo-instrumentow.md for the whole
 * ~100-exercise plan; this file grows lesson by lesson.
 *
 * Every exercise is a plain `key-fact-choice` (authored prompt, 2-3 options,
 * explanation shown after checking) — no new exercise engine. Options keep
 * their authored order, so the correct answer's position is varied BY HAND
 * from question to question (a test checks each lesson uses more than one
 * position). Illustrations come from components/icons/icons.ts's
 * `instrument_*` set (via `imageId` above the prompt, `optionImageIds` inside
 * the answer buttons). Questions ask only for facts a child can reason out
 * from the lesson's own intro (big = low, blown = wind, struck = percussion).
 *
 * Authoring helper: `fact` just builds the literal key-fact-choice
 * ExerciseDefinition so each question below stays one readable call.
 */
interface FactExtras {
  hint?: string;
  imageId?: string;
  optionImageIds?: (string | undefined)[];
  referenceAudioSource?: number;
}

function fact(
  id: string,
  difficulty: number,
  prompt: string,
  options: string[],
  correctOptionIndex: number,
  explanation: string,
  extras: FactExtras = {}
): ExerciseDefinition {
  return {
    id,
    type: "key-fact-choice",
    difficulty,
    spec: { type: "key-fact-choice", prompt, options, correctOptionIndex, explanation, ...extras },
  };
}

export const KROLESTWO_INSTRUMENTOW_CONTENT: WorldContent = {
  worldId: "krolestwo-instrumentow",
  lessons: [
    {
      id: "ki-poziom-1-witaj-w-orkiestrze",
      order: 1,
      difficulty: 1,
      introSlides: [
        {
          body: "Witaj w Królestwie Instrumentów! Orkiestra to duży zespół muzyków, którzy grają razem jedną muzykę — czasem jest ich nawet kilkudziesięciu. Każdy gra na swoim instrumencie, a razem brzmią wspaniale.",
        },
        {
          body: "Kto pilnuje, żeby wszyscy zaczęli razem i grali w tym samym tempie? Dyrygent. Macha pałeczką i pokazuje muzykom, kiedy zacząć, jak szybko i jak głośno grać. A muzykę, którą grają, wymyśla kompozytor.",
        },
        {
          body: "Instrumenty orkiestry dzielimy na rodziny. Smyczkowe (skrzypce, wiolonczela) — grają na nich smyczkiem. Drewniane dęte (flet, klarnet) — dmuchamy w nie. Blaszane dęte (trąbka, puzon) — też dmuchamy, ale są z metalu. I perkusja (werbel, kotły) — w nią uderzamy.",
        },
      ],
      exercises: [
        fact("ki-l1-e1", 1, "Co to jest orkiestra?", ["Rodzaj tańca", "Duży zespół muzyków grających razem", "Jeden bardzo duży instrument"], 1, "Orkiestra to duży zespół muzyków, którzy grają razem jedną muzykę."),
        fact("ki-l1-e2", 1, "Kto macha pałeczką i pokazuje muzykom, kiedy zacząć grać?", ["Dyrygent", "Solista", "Kompozytor"], 0, "To dyrygent — pilnuje, żeby wszyscy grali razem i w tym samym tempie.", { imageId: "instrument_dyrygent" }),
        fact("ki-l1-e3", 1, "Kto wymyśla (komponuje) muzykę, którą gra orkiestra?", ["Dyrygent", "Kompozytor", "Słuchacz"], 1, "Muzykę wymyśla kompozytor. Dyrygent pomaga ją zagrać."),
        fact("ki-l1-e4", 1, "W orkiestrze są cztery główne rodziny instrumentów: smyczkowe, drewniane dęte, blaszane dęte i perkusja. Ile ich jest?", ["Dwie", "Trzy", "Cztery"], 2, "Cztery: smyczkowe, drewniane dęte, blaszane dęte i perkusja."),
        fact("ki-l1-e5", 1, "Na skrzypcach gra się smyczkiem. Do jakiej rodziny należą skrzypce?", ["Smyczkowe", "Blaszane dęte", "Perkusja"], 0, "Skrzypce są instrumentem smyczkowym — gra się na nich smyczkiem.", { imageId: "instrument_skrzypce" }),
        fact("ki-l1-e6", 1, "Trąbka jest z błyszczącego metalu i dmuchamy w nią. Do jakiej rodziny należy?", ["Smyczkowe", "Perkusja", "Blaszane dęte"], 2, "Trąbka to instrument blaszany dęty: jest z metalu i gra się na niej dmuchając.", { imageId: "instrument_trabka" }),
        fact("ki-l1-e7", 1, "Na werblu gra się pałeczkami — uderzamy w niego. To instrument…", ["Perkusyjny", "Smyczkowy"], 0, "Instrumenty, w które uderzamy, należą do perkusji.", { imageId: "instrument_werbel" }),
        fact("ki-l1-e8", 1, "Flet jest dziś zwykle metalowy, ale zaliczamy go do innej rodziny niż trąbkę. Do której?", ["Blaszane dęte", "Drewniane dęte", "Smyczkowe"], 1, "Flet należy do drewnianych dętych — dawniej robiono go z drewna.", { imageId: "instrument_flet" }),
        fact("ki-l1-e9", 1, "Co oznacza nazwa „instrument dęty”?", ["Gra się na nim uderzając", "Gra się na nim dmuchając", "Gra się na nim szarpiąc struny"], 1, "Dęty znaczy: dmuchamy w niego. Tak gra się na flecie, klarnecie, trąbce czy puzonie."),
        fact("ki-l1-e10", 1, "Która para to instrumenty smyczkowe?", ["Skrzypce i wiolonczela", "Trąbka i puzon", "Flet i klarnet"], 0, "Skrzypce i wiolonczela to smyczkowe. Trąbka i puzon są blaszane, a flet i klarnet drewniane.", { optionImageIds: ["instrument_skrzypce", "instrument_trabka", "instrument_flet"] }),
      ],
    },
    {
      id: "ki-poziom-2-smyczki",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Rodzina smyczkowa to największa grupa w orkiestrze. Najmniejsze są skrzypce, trochę większa altówka, potem wiolonczela, a największy jest kontrabas. Każdy z nich ma cztery struny.",
        },
        {
          body: "Zasada jest prosta: im większy instrument i dłuższe struny, tym niższy dźwięk. Skrzypce brzmią wysoko, wiolonczela niżej, a kontrabas najniżej ze wszystkich.",
        },
        {
          body: "Na instrumentach smyczkowych gra się smyczkiem (pałeczką z naciągniętym włosiem), który przesuwamy po strunach. Można też szarpać struny palcami — to pizzicato. Podobnie gra się na harfie, która ma kilkadziesiąt strun.",
        },
      ],
      exercises: [
        fact("ki-l2-e1", 1, "To skrzypce. Ile mają strun?", ["Dwie", "Cztery", "Sześć"], 1, "Skrzypce mają cztery struny. Tyle samo mają altówka, wiolonczela i kontrabas.", { imageId: "instrument_skrzypce" }),
        fact("ki-l2-e2", 1, "Który to instrument?", ["Skrzypce", "Wiolonczela", "Kontrabas"], 1, "To wiolonczela. Jest większa od skrzypiec, więc gra się na niej siedząc, a instrument stoi na kolcu na podłodze.", { imageId: "instrument_wiolonczela" }),
        fact("ki-l2-e3", 1, "Ten największy instrument smyczkowy gra najniżej. Jak się nazywa?", ["Kontrabas", "Altówka", "Skrzypce"], 0, "To kontrabas. Jest tak duży, że muzyk gra na nim stojąc albo siedząc na wysokim stołku.", { imageId: "instrument_kontrabas" }),
        fact("ki-l2-e4", 1, "Który z tych instrumentów gra najwyżej?", ["Kontrabas", "Wiolonczela", "Skrzypce"], 2, "Najwyżej gra najmniejszy: skrzypce. Im mniejszy instrument, tym wyższy dźwięk.", { optionImageIds: ["instrument_kontrabas", "instrument_wiolonczela", "instrument_skrzypce"] }),
        fact("ki-l2-e5", 1, "Czym gra się na skrzypcach i wiolonczeli?", ["Smyczkiem", "Pałeczkami", "Ustnikiem"], 0, "Smyczkiem — przesuwamy go po strunach."),
        fact("ki-l2-e6", 1, "Jak nazywa się szarpanie strun palcami zamiast grania smyczkiem?", ["Crescendo", "Allegro", "Pizzicato"], 2, "To pizzicato. Crescendo znaczy „coraz głośniej”, a allegro „szybko”."),
        fact("ki-l2-e7", 1, "Dlaczego kontrabas brzmi tak nisko?", ["Bo jest czerwony", "Bo jest duży i ma długie struny", "Bo gra się na nim bardzo szybko"], 1, "Duży instrument z długimi, grubymi strunami brzmi nisko.", { imageId: "instrument_kontrabas" }),
        fact("ki-l2-e8", 1, "Ten instrument ma kilkadziesiąt strun, a gra się na nim szarpiąc je palcami. To…", ["Harfa", "Kontrabas", "Skrzypce"], 0, "To harfa. Mimo że gra się na niej palcami, zaliczamy ją do instrumentów strunowych.", { imageId: "instrument_harfa" }),
        fact("ki-l2-e9", 1, "Altówka wygląda prawie jak skrzypce, ale jest odrobinę większa. Jak brzmi?", ["Odrobinę niżej niż skrzypce", "Dużo wyżej niż skrzypce", "Tak nisko jak kontrabas"], 0, "Jest większa, więc brzmi odrobinę niżej niż skrzypce."),
        fact("ki-l2-e10", 1, "Kwartet smyczkowy to czworo muzyków: dwoje skrzypiec, altówka i…", ["flet", "wiolonczela", "trąbka"], 1, "Dwoje skrzypiec, altówka i wiolonczela — cztery instrumenty smyczkowe."),
        fact("ki-l2-e11", 1, "Które z tych instrumentów NIE jest smyczkowe?", ["Skrzypce", "Trąbka", "Kontrabas"], 1, "Trąbka jest z metalu i gra się na niej dmuchając — to blaszany instrument dęty.", { optionImageIds: ["instrument_skrzypce", "instrument_trabka", "instrument_kontrabas"] }),
      ],
    },
    {
      id: "ki-poziom-3-drewniane-dete",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Drewniane dęte to instrumenty, w które dmuchamy: flet, obój, klarnet i fagot. Dawniej wszystkie robiono z drewna — stąd nazwa, choć dziś część jest z metalu.",
        },
        {
          body: "Większość z nich ma stroik — cienką płytkę z trzciny, która drga, kiedy dmuchamy, i tworzy dźwięk. Tylko flet nie ma stroika: dmuchamy w otwór z boku, trochę jak w butelkę.",
        },
        {
          body: "Pamiętaj: im dłuższa rura, tym niższy dźwięk. Flet brzmi najwyżej, obój i klarnet niżej, a najdłuższy fagot — najniżej. Jest też saksofon: z metalu, ale z jednym stroikiem, więc też należy do drewnianych dętych.",
        },
      ],
      exercises: [
        fact("ki-l3-e1", 1, "Ten długi, srebrny instrument trzymamy poziomo i dmuchamy w otwór z boku. To…", ["Flet poprzeczny", "Klarnet", "Trąbka"], 0, "To flet poprzeczny. Jest jedynym z drewnianych dętych bez stroika.", { imageId: "instrument_flet" }),
        fact("ki-l3-e2", 1, "Czarna rura z klapkami i szerokim lejkiem na końcu. Który to instrument?", ["Obój", "Klarnet", "Fagot"], 1, "To klarnet. Ma pojedynczy stroik, który drga w ustniku.", { imageId: "instrument_klarnet" }),
        fact("ki-l3-e3", 1, "Cienki, ciemny instrument z podwójnym stroikiem. Gra dźwięk „a”, według którego stroi się cała orkiestra. To…", ["Fagot", "Flet", "Obój"], 2, "To obój — jego dźwięk „a” słychać na początku koncertu, kiedy orkiestra stroi instrumenty.", { imageId: "instrument_oboj" }),
        fact("ki-l3-e4", 1, "Największy z drewnianych dętych: rura jest tak długa, że złożono ją na pół. Gra najniżej. To…", ["Klarnet", "Fagot", "Saksofon"], 1, "To fagot. Długa rura daje niski dźwięk.", { imageId: "instrument_fagot" }),
        fact("ki-l3-e5", 2, "Saksofon jest z metalu, a mimo to należy do drewnianych dętych. Dlaczego?", ["Bo gra się na nim smyczkiem", "Bo ma stroik", "Bo uderzamy w niego pałeczkami"], 1, "Saksofon ma stroik, tak jak klarnet — dlatego zaliczamy go do drewnianych dętych.", { imageId: "instrument_saksofon" }),
        fact("ki-l3-e6", 1, "Co to jest stroik?", ["Rodzaj smyczka", "Cienka płytka, która drga, kiedy dmuchamy", "Pałeczka dyrygenta"], 1, "Stroik to cienka płytka z trzciny. Drga, kiedy dmuchamy, i dzięki temu słychać dźwięk."),
        fact("ki-l3-e7", 1, "Który z tych drewnianych dętych gra najwyżej?", ["Fagot", "Klarnet", "Flet"], 2, "Najwyżej gra flet. Fagot ma najdłuższą rurę, więc gra najniżej.", { optionImageIds: ["instrument_fagot", "instrument_klarnet", "instrument_flet"] }),
        fact("ki-l3-e8", 1, "Który z drewnianych dętych gra najniżej?", ["Flet", "Fagot", "Klarnet"], 1, "Fagot — ma najdłuższą rurę.", { optionImageIds: ["instrument_flet", "instrument_fagot", "instrument_klarnet"] }),
        fact("ki-l3-e9", 1, "Dlaczego mówimy na nie „drewniane”?", ["Bo grają cicho jak las", "Bo dawniej robiono je z drewna", "Bo gra się na nich drewnianym patyczkiem"], 1, "Dawniej robiono je z drewna. Dziś niektóre, jak flet czy saksofon, są z metalu, ale nazwa została."),
        fact("ki-l3-e10", 2, "Na którym z nich nie ma stroika — dmuchamy w otwór z boku?", ["Flet", "Obój", "Klarnet"], 0, "Na flecie — dźwięk powstaje, kiedy dmuchamy w krawędź otworu, bez stroika.", { optionImageIds: ["instrument_flet", "instrument_oboj", "instrument_klarnet"] }),
        fact("ki-l3-e11", 1, "Które z tych instrumentów NIE jest drewniane dęte?", ["Obój", "Flet", "Trąbka"], 2, "Trąbka to blaszany instrument dęty — nie ma stroika, tylko metalowy ustnik.", { optionImageIds: ["instrument_oboj", "instrument_flet", "instrument_trabka"] }),
      ],
    },
  ],
};
