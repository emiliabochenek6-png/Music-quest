import { INSTRUMENT_SAMPLES as SOUND } from "@/lib/audio/instrumentSamples";
import { NOTE_SAMPLES } from "@/lib/audio/samples";
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
 * Some questions are "Quiz ABCD" (`abcd: true`: four options lettered A-D),
 * and some play a real recording (`referenceAudioSource`, from
 * lib/audio/instrumentSamples.ts) for "Który instrument słyszysz?". Every
 * intro slide carries instrumentExamples — an illustrated card per
 * instrument, with a 🔊 recording where one exists — so the child has met
 * every instrument a question names before being asked about it.
 *
 * Authoring helper: `fact` just builds the literal key-fact-choice
 * ExerciseDefinition so each question below stays one readable call.
 */
interface FactExtras {
  hint?: string;
  imageId?: string;
  optionImageIds?: (string | undefined)[];
  referenceAudioSource?: number;
  /** "Quiz ABCD" — needs exactly four options (see key-fact-choice's own doc). */
  abcd?: boolean;
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

/** A piano tone for the "wysoki czy niski?" exercise (pitch-height-choice —
 * the world's one non-key-fact-choice type). */
function height(id: string, difficulty: number, targetNote: string, correctSide: "high" | "low"): ExerciseDefinition {
  return { id, type: "pitch-height-choice", difficulty, spec: { type: "pitch-height-choice", targetNote, correctSide } };
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
          instrumentExamples: [{ imageId: "instrument_dyrygent", label: "Dyrygent", caption: "macha pałeczką" }],
        },
        {
          body: "Instrumenty orkiestry dzielimy na rodziny. Smyczkowe (skrzypce, wiolonczela) — grają na nich smyczkiem. Drewniane dęte (flet, klarnet) — dmuchamy w nie. Blaszane dęte (trąbka, puzon) — też dmuchamy, ale są z metalu. I perkusja (werbel, kotły) — w nią uderzamy. Posłuchaj po jednym instrumencie z każdej rodziny.",
          instrumentExamples: [
            { imageId: "instrument_skrzypce", label: "Skrzypce", caption: "smyczkowe", audioSource: SOUND.skrzypce },
            { imageId: "instrument_flet", label: "Flet", caption: "drewniane dęte", audioSource: SOUND.flet },
            { imageId: "instrument_trabka", label: "Trąbka", caption: "blaszane dęte", audioSource: SOUND.trabka },
            { imageId: "instrument_werbel", label: "Werbel", caption: "perkusja", audioSource: SOUND.werbel },
          ],
        },
      ],
      exercises: [
        fact("ki-l1-e1", 1, "Co to jest orkiestra?", ["Rodzaj tańca", "Duży zespół muzyków grających razem", "Jeden bardzo duży instrument"], 1, "Orkiestra to duży zespół muzyków, którzy grają razem jedną muzykę."),
        fact("ki-l1-e2", 1, "Kto macha pałeczką i pokazuje muzykom, kiedy zacząć grać?", ["Dyrygent", "Solista", "Kompozytor"], 0, "To dyrygent — pilnuje, żeby wszyscy grali razem i w tym samym tempie.", { imageId: "instrument_dyrygent" }),
        fact("ki-l1-e3", 1, "Kto wymyśla (komponuje) muzykę, którą gra orkiestra?", ["Dyrygent", "Kompozytor", "Słuchacz"], 1, "Muzykę wymyśla kompozytor. Dyrygent pomaga ją zagrać."),
        fact("ki-l1-e4", 1, "W orkiestrze są cztery główne rodziny instrumentów: smyczkowe, drewniane dęte, blaszane dęte i perkusja. Ile ich jest?", ["Dwie", "Trzy", "Cztery", "Pięć"], 2, "Cztery: smyczkowe, drewniane dęte, blaszane dęte i perkusja.", { abcd: true }),
        fact("ki-l1-e5", 1, "Na skrzypcach gra się smyczkiem. Do jakiej rodziny należą skrzypce?", ["Smyczkowe", "Blaszane dęte", "Perkusja"], 0, "Skrzypce są instrumentem smyczkowym — gra się na nich smyczkiem.", { imageId: "instrument_skrzypce" }),
        fact("ki-l1-e6", 1, "Trąbka jest z błyszczącego metalu i dmuchamy w nią. Do jakiej rodziny należy?", ["Smyczkowe", "Perkusja", "Blaszane dęte"], 2, "Trąbka to instrument blaszany dęty: jest z metalu i gra się na niej dmuchając.", { imageId: "instrument_trabka" }),
        fact("ki-l1-e7", 1, "Na werblu gra się pałeczkami — uderzamy w niego. To instrument…", ["Perkusyjny", "Smyczkowy"], 0, "Instrumenty, w które uderzamy, należą do perkusji.", { imageId: "instrument_werbel" }),
        fact("ki-l1-e8", 1, "Flet jest dziś zwykle metalowy, ale zaliczamy go do innej rodziny niż trąbkę. Do której?", ["Blaszane dęte", "Drewniane dęte", "Smyczkowe"], 1, "Flet należy do drewnianych dętych — dawniej robiono go z drewna.", { imageId: "instrument_flet" }),
        fact("ki-l1-e9", 1, "Co oznacza nazwa „instrument dęty”?", ["Gra się na nim uderzając", "Gra się na nim dmuchając", "Gra się na nim szarpiąc struny", "Gra się na nim smyczkiem"], 1, "Dęty znaczy: dmuchamy w niego. Tak gra się na flecie, klarnecie, trąbce czy puzonie.", { abcd: true }),
        fact("ki-l1-e10", 1, "Która para to instrumenty smyczkowe?", ["Skrzypce i wiolonczela", "Trąbka i puzon", "Flet i klarnet"], 0, "Skrzypce i wiolonczela to smyczkowe. Trąbka i puzon są blaszane, a flet i klarnet drewniane.", { optionImageIds: ["instrument_skrzypce", "instrument_trabka", "instrument_flet"] }),
      ],
    },
    {
      id: "ki-poziom-2-smyczki",
      order: 2,
      difficulty: 1,
      introSlides: [
        {
          body: "Rodzina smyczkowa to największa grupa w orkiestrze. Najmniejsze są skrzypce, trochę większa altówka, potem wiolonczela, a największy jest kontrabas. Każdy z nich ma cztery struny. Posłuchaj, jak brzmią — od najwyższego do najniższego.",
          instrumentExamples: [
            { imageId: "instrument_skrzypce", label: "Skrzypce", caption: "najwyżej", audioSource: SOUND.skrzypce },
            { imageId: "instrument_wiolonczela", label: "Wiolonczela", caption: "niżej", audioSource: SOUND.wiolonczela },
            { imageId: "instrument_kontrabas", label: "Kontrabas", caption: "najniżej", audioSource: SOUND.kontrabas },
          ],
        },
        {
          body: "Zasada jest prosta: im większy instrument i dłuższe struny, tym niższy dźwięk. Skrzypce brzmią wysoko, wiolonczela niżej, a kontrabas najniżej ze wszystkich.",
        },
        {
          body: "Na instrumentach smyczkowych gra się smyczkiem (pałeczką z naciągniętym włosiem), który przesuwamy po strunach. Można też szarpać struny palcami — to pizzicato. Podobnie gra się na harfie, która ma kilkadziesiąt strun.",
          instrumentExamples: [{ imageId: "instrument_harfa", label: "Harfa", caption: "struny szarpane palcami", audioSource: SOUND.harfa }],
        },
      ],
      exercises: [
        fact("ki-l2-e1", 1, "To skrzypce. Ile mają strun?", ["Dwie", "Cztery", "Sześć"], 1, "Skrzypce mają cztery struny. Tyle samo mają altówka, wiolonczela i kontrabas.", { imageId: "instrument_skrzypce" }),
        fact("ki-l2-e2", 1, "Który to instrument?", ["Skrzypce", "Wiolonczela", "Kontrabas"], 1, "To wiolonczela. Jest większa od skrzypiec, więc gra się na niej siedząc, a instrument stoi na kolcu na podłodze.", { imageId: "instrument_wiolonczela" }),
        fact("ki-l2-e3", 1, "Ten największy instrument smyczkowy gra najniżej. Jak się nazywa?", ["Kontrabas", "Altówka", "Skrzypce"], 0, "To kontrabas. Jest tak duży, że muzyk gra na nim stojąc albo siedząc na wysokim stołku.", { imageId: "instrument_kontrabas" }),
        fact("ki-l2-e4", 1, "Który z tych instrumentów gra najwyżej?", ["Kontrabas", "Wiolonczela", "Skrzypce"], 2, "Najwyżej gra najmniejszy: skrzypce. Im mniejszy instrument, tym wyższy dźwięk.", { optionImageIds: ["instrument_kontrabas", "instrument_wiolonczela", "instrument_skrzypce"] }),
        fact("ki-l2-e5", 1, "Czym gra się na skrzypcach i wiolonczeli?", ["Smyczkiem", "Pałeczkami", "Ustnikiem"], 0, "Smyczkiem — przesuwamy go po strunach."),
        fact("ki-l2-e6", 1, "Jak nazywa się szarpanie strun palcami zamiast grania smyczkiem?", ["Crescendo", "Legato", "Allegro", "Pizzicato"], 3, "To pizzicato. Crescendo znaczy „coraz głośniej”, legato „płynnie, bez przerw”, a allegro „szybko”.", { abcd: true }),
        fact("ki-l2-e7", 1, "Dlaczego kontrabas brzmi tak nisko?", ["Bo jest czerwony", "Bo jest duży i ma długie struny", "Bo gra się na nim bardzo szybko"], 1, "Duży instrument z długimi, grubymi strunami brzmi nisko.", { imageId: "instrument_kontrabas" }),
        fact("ki-l2-e8", 1, "Ten instrument ma kilkadziesiąt strun, a gra się na nim szarpiąc je palcami. To…", ["Harfa", "Kontrabas", "Skrzypce"], 0, "To harfa. Mimo że gra się na niej palcami, zaliczamy ją do instrumentów strunowych.", { imageId: "instrument_harfa" }),
        fact("ki-l2-e9", 1, "Altówka wygląda prawie jak skrzypce, ale jest odrobinę większa. Jak brzmi?", ["Odrobinę niżej niż skrzypce", "Dużo wyżej niż skrzypce", "Tak nisko jak kontrabas"], 0, "Jest większa, więc brzmi odrobinę niżej niż skrzypce."),
        fact("ki-l2-e10", 1, "Kwartet smyczkowy to czworo muzyków: dwoje skrzypiec, altówka i…", ["flet", "wiolonczela", "trąbka", "fagot"], 1, "Dwoje skrzypiec, altówka i wiolonczela — cztery instrumenty smyczkowe.", { abcd: true }),
        fact("ki-l2-e12", 1, "Posłuchaj i wskaż: który instrument gra?", ["Skrzypce", "Wiolonczela", "Kontrabas"], 1, "To wiolonczela — brzmi niżej niż skrzypce, ale wyżej niż kontrabas.", { referenceAudioSource: SOUND.wiolonczela }),
        fact("ki-l2-e13", 1, "Ten dźwięk jest bardzo niski. Który instrument smyczkowy gra?", ["Skrzypce", "Wiolonczela", "Kontrabas"], 2, "To kontrabas — największy i najniżej grający instrument smyczkowy.", { referenceAudioSource: SOUND.kontrabas }),
        fact("ki-l2-e14", 1, "Posłuchaj: dźwięk jak z wielu delikatnie szarpanych strun. Który instrument gra?", ["Kontrabas", "Skrzypce", "Harfa"], 2, "To harfa — jej struny szarpie się palcami, a dźwięk brzmi jak perlista fala.", { referenceAudioSource: SOUND.harfa }),
        fact("ki-l2-e11", 1, "Które z tych instrumentów NIE jest smyczkowe?", ["Skrzypce", "Trąbka", "Kontrabas"], 1, "Trąbka jest z metalu i gra się na niej dmuchając — to blaszany instrument dęty.", { optionImageIds: ["instrument_skrzypce", "instrument_trabka", "instrument_kontrabas"] }),
      ],
    },
    {
      id: "ki-poziom-3-drewniane-dete",
      order: 3,
      difficulty: 2,
      introSlides: [
        {
          body: "Drewniane dęte to instrumenty, w które dmuchamy: flet, obój, klarnet i fagot. Dawniej wszystkie robiono z drewna — stąd nazwa, choć dziś część jest z metalu. Posłuchaj ich po kolei.",
          instrumentExamples: [
            { imageId: "instrument_flet", label: "Flet", caption: "najwyżej", audioSource: SOUND.flet },
            { imageId: "instrument_oboj", label: "Obój", audioSource: SOUND.oboj },
            { imageId: "instrument_klarnet", label: "Klarnet", audioSource: SOUND.klarnet },
            { imageId: "instrument_fagot", label: "Fagot", caption: "najniżej", audioSource: SOUND.fagot },
          ],
        },
        {
          body: "Większość z nich ma stroik — cienką płytkę z trzciny, która drga, kiedy dmuchamy, i tworzy dźwięk. Tylko flet nie ma stroika: dmuchamy w otwór z boku, trochę jak w butelkę.",
        },
        {
          body: "Pamiętaj: im dłuższa rura, tym niższy dźwięk. Flet brzmi najwyżej, obój i klarnet niżej, a najdłuższy fagot — najniżej. Jest też saksofon: z metalu, ale z jednym stroikiem, więc też należy do drewnianych dętych.",
          instrumentExamples: [{ imageId: "instrument_saksofon", label: "Saksofon", caption: "z metalu, ale ze stroikiem", audioSource: SOUND.saksofon }],
        },
      ],
      exercises: [
        fact("ki-l3-e1", 1, "Ten długi, srebrny instrument trzymamy poziomo i dmuchamy w otwór z boku. To…", ["Flet poprzeczny", "Klarnet", "Trąbka", "Obój"], 0, "To flet poprzeczny. Jest jedynym z drewnianych dętych bez stroika.", { imageId: "instrument_flet", abcd: true }),
        fact("ki-l3-e2", 1, "Czarna rura z klapkami i szerokim lejkiem na końcu. Który to instrument?", ["Obój", "Klarnet", "Fagot"], 1, "To klarnet. Ma pojedynczy stroik, który drga w ustniku.", { imageId: "instrument_klarnet" }),
        fact("ki-l3-e3", 1, "Cienki, ciemny instrument z podwójnym stroikiem. Gra dźwięk „a”, według którego stroi się cała orkiestra. To…", ["Fagot", "Flet", "Obój"], 2, "To obój — jego dźwięk „a” słychać na początku koncertu, kiedy orkiestra stroi instrumenty.", { imageId: "instrument_oboj" }),
        fact("ki-l3-e4", 1, "Największy z drewnianych dętych: rura jest tak długa, że złożono ją na pół. Gra najniżej. To…", ["Klarnet", "Fagot", "Saksofon"], 1, "To fagot. Długa rura daje niski dźwięk.", { imageId: "instrument_fagot" }),
        fact("ki-l3-e5", 2, "Saksofon jest z metalu, a mimo to należy do drewnianych dętych. Dlaczego?", ["Bo gra się na nim smyczkiem", "Bo ma stroik", "Bo uderzamy w niego pałeczkami", "Bo ma struny"], 1, "Saksofon ma stroik, tak jak klarnet — dlatego zaliczamy go do drewnianych dętych.", { imageId: "instrument_saksofon", abcd: true }),
        fact("ki-l3-e6", 1, "Co to jest stroik?", ["Rodzaj smyczka", "Cienka płytka, która drga, kiedy dmuchamy", "Pałeczka dyrygenta"], 1, "Stroik to cienka płytka z trzciny. Drga, kiedy dmuchamy, i dzięki temu słychać dźwięk."),
        fact("ki-l3-e7", 1, "Który z tych drewnianych dętych gra najwyżej?", ["Fagot", "Klarnet", "Flet"], 2, "Najwyżej gra flet. Fagot ma najdłuższą rurę, więc gra najniżej.", { optionImageIds: ["instrument_fagot", "instrument_klarnet", "instrument_flet"] }),
        fact("ki-l3-e8", 1, "Który z drewnianych dętych gra najniżej?", ["Flet", "Fagot", "Klarnet"], 1, "Fagot — ma najdłuższą rurę.", { optionImageIds: ["instrument_flet", "instrument_fagot", "instrument_klarnet"] }),
        fact("ki-l3-e9", 1, "Dlaczego mówimy na nie „drewniane”?", ["Bo grają cicho jak las", "Bo dawniej robiono je z drewna", "Bo gra się na nich drewnianym patyczkiem"], 1, "Dawniej robiono je z drewna. Dziś niektóre, jak flet czy saksofon, są z metalu, ale nazwa została."),
        fact("ki-l3-e10", 2, "Na którym z nich nie ma stroika — dmuchamy w otwór z boku?", ["Flet", "Obój", "Klarnet"], 0, "Na flecie — dźwięk powstaje, kiedy dmuchamy w krawędź otworu, bez stroika.", { optionImageIds: ["instrument_flet", "instrument_oboj", "instrument_klarnet"] }),
        fact("ki-l3-e12", 1, "Posłuchaj: który z drewnianych dętych gra?", ["Fagot", "Flet", "Klarnet"], 1, "To flet — brzmi wysoko i lekko, jak dmuchanie w butelkę.", { referenceAudioSource: SOUND.flet }),
        fact("ki-l3-e13", 1, "Ten dźwięk jest niski i ciepły. Który instrument gra?", ["Flet", "Obój", "Fagot"], 2, "To fagot — najniżej grający z drewnianych dętych.", { referenceAudioSource: SOUND.fagot }),
        fact("ki-l3-e11", 1, "Które z tych instrumentów NIE jest drewniane dęte?", ["Obój", "Flet", "Trąbka"], 2, "Trąbka to blaszany instrument dęty — nie ma stroika, tylko metalowy ustnik.", { optionImageIds: ["instrument_oboj", "instrument_flet", "instrument_trabka"] }),
      ],
    },
    {
      id: "ki-poziom-4-blaszane-dete",
      order: 4,
      difficulty: 2,
      introSlides: [
        {
          body: "Blaszane dęte to błyszczące instrumenty z metalu: trąbka, róg, puzon i tuba. Gra się na nich dmuchając w ustnik i drgając wargami — dźwięk jest mocny i donośny. Posłuchaj ich po kolei.",
          instrumentExamples: [
            { imageId: "instrument_trabka", label: "Trąbka", caption: "najwyżej", audioSource: SOUND.trabka },
            { imageId: "instrument_rog", label: "Róg", audioSource: SOUND.rog },
            { imageId: "instrument_puzon", label: "Puzon", audioSource: SOUND.puzon },
            { imageId: "instrument_tuba", label: "Tuba", caption: "najniżej", audioSource: SOUND.tuba },
          ],
        },
        {
          body: "Jak zmieniać dźwięki? Na trąbce naciska się wentyle, a na puzonie wysuwa i wsuwa suwak — dzięki temu rura robi się dłuższa lub krótsza. Róg ma rurę zwiniętą w kółko, a tuba jest największa i brzmi najniżej.",
        },
      ],
      exercises: [
        fact("ki-l4-e1", 1, "Ten błyszczący instrument ma trzy wentyle i gra najwyżej z blaszanych. To…", ["Puzon", "Trąbka", "Tuba"], 1, "To trąbka — najmniejsza i najwyżej grająca z instrumentów blaszanych.", { imageId: "instrument_trabka" }),
        fact("ki-l4-e2", 1, "Który blaszany instrument ma suwak, który się wysuwa i wsuwa?", ["Trąbka", "Róg", "Puzon"], 2, "To puzon. Suwak zmienia długość rury, a więc i wysokość dźwięku.", { imageId: "instrument_puzon" }),
        fact("ki-l4-e3", 1, "Największy blaszany instrument, który gra najniżej. To…", ["Tuba", "Trąbka", "Róg", "Puzon"], 0, "To tuba. Im dłuższa rura, tym niższy dźwięk.", { imageId: "instrument_tuba", abcd: true }),
        fact("ki-l4-e4", 1, "Rura tego instrumentu jest zwinięta w kółko. To…", ["Trąbka", "Róg", "Tuba"], 1, "To róg (nazywany też francuskim). Zwinięta rura jest bardzo długa.", { imageId: "instrument_rog" }),
        fact("ki-l4-e5", 1, "Z czego robi się instrumenty blaszane?", ["Z drewna", "Z metalu", "Ze szkła"], 1, "Z metalu — mosiądzu — stąd nazwa „blaszane”."),
        fact("ki-l4-e6", 1, "Jak powstaje dźwięk w instrumentach blaszanych?", ["Dmuchamy w ustnik i drgają nasze wargi", "Szarpiemy struny", "Uderzamy pałeczkami", "Naciskamy klawisze"], 0, "Dmuchamy w ustnik, a wargi drgają i wprawiają w drganie powietrze w rurze.", { abcd: true }),
        fact("ki-l4-e7", 1, "Który z blaszanych instrumentów gra najwyżej?", ["Tuba", "Puzon", "Trąbka"], 2, "Najwyżej gra trąbka — ma najkrótszą rurę.", { optionImageIds: ["instrument_tuba", "instrument_puzon", "instrument_trabka"] }),
        fact("ki-l4-e8", 1, "Który z blaszanych instrumentów gra najniżej?", ["Trąbka", "Tuba", "Puzon"], 1, "Najniżej gra tuba.", { optionImageIds: ["instrument_trabka", "instrument_tuba", "instrument_puzon"] }),
        fact("ki-l4-e9", 2, "Do czego służą wentyle w trąbce?", ["Do zmiany wysokości dźwięku", "Do zmiany koloru instrumentu", "Do strojenia strun"], 0, "Po naciśnięciu wentyla dźwięk idzie dłuższą drogą w rurze, więc robi się niższy."),
        fact("ki-l4-e10", 1, "Które z tych instrumentów NIE jest blaszane?", ["Puzon", "Tuba", "Flet"], 2, "Flet jest drewniany dęty — nie ma metalowego ustnika, tylko otwór z boku.", { optionImageIds: ["instrument_puzon", "instrument_tuba", "instrument_flet"] }),
        fact("ki-l4-e11", 1, "Posłuchaj: który z blaszanych gra?", ["Tuba", "Trąbka", "Puzon"], 1, "To trąbka — jasny, błyszczący dźwięk.", { referenceAudioSource: SOUND.trabka }),
        fact("ki-l4-e12", 1, "Ten dźwięk jest bardzo niski i głęboki. Który instrument gra?", ["Trąbka", "Róg", "Tuba"], 2, "To tuba — najniższy instrument blaszany.", { referenceAudioSource: SOUND.tuba }),
        fact("ki-l4-e13", 2, "Posłuchaj: miękki, okrągły dźwięk. Który instrument gra?", ["Róg", "Puzon", "Trąbka"], 0, "To róg — ma łagodne, ciepłe brzmienie.", { referenceAudioSource: SOUND.rog }),
      ],
    },
    {
      id: "ki-poziom-5-perkusja",
      order: 5,
      difficulty: 2,
      introSlides: [
        {
          body: "Perkusja to instrumenty, w które uderzamy: pałeczkami, pałkami albo rękami. Są wśród nich bębny — kotły i werbel, metalowe talerze i trójkąt oraz ksylofon z drewnianymi płytkami.",
          instrumentExamples: [
            { imageId: "instrument_kotly", label: "Kotły", audioSource: SOUND.kotly },
            { imageId: "instrument_werbel", label: "Werbel", audioSource: SOUND.werbel },
            { imageId: "instrument_talerze", label: "Talerze", audioSource: SOUND.talerze },
            { imageId: "instrument_trojkat", label: "Trójkąt", audioSource: SOUND.trojkat },
            { imageId: "instrument_ksylofon", label: "Ksylofon", audioSource: SOUND.ksylofon },
          ],
        },
        {
          body: "Niektóre instrumenty perkusyjne mają konkretną wysokość dźwięku i można na nich zagrać melodię — to kotły (stroi się je) i ksylofon. Werbel, talerze i trójkąt brzmią bez określonej wysokości, za to świetnie podkreślają rytm.",
        },
      ],
      exercises: [
        fact("ki-l5-e1", 1, "Te duże miedziane bębny, w które uderzamy pałkami, to…", ["Kotły", "Werbel", "Talerze"], 0, "To kotły. Można je stroić, żeby grały określone dźwięki.", { imageId: "instrument_kotly" }),
        fact("ki-l5-e2", 1, "Mały bęben, na którym gra się pałeczkami i który ma trzeszczący dźwięk, to…", ["Kotły", "Werbel", "Trójkąt"], 1, "To werbel.", { imageId: "instrument_werbel" }),
        fact("ki-l5-e3", 1, "Dwa metalowe krążki, które uderzamy o siebie, to…", ["Trójkąt", "Ksylofon", "Talerze"], 2, "To talerze — dają głośny, błyszczący dźwięk.", { imageId: "instrument_talerze" }),
        fact("ki-l5-e4", 1, "Mały metalowy instrument, w który uderzamy metalową pałeczką, brzmi…", ["Głucho jak duży bęben", "Cienko i dźwięcznie", "Nisko jak tuba"], 1, "Trójkąt brzmi cienko i dźwięcznie, a dźwięk długo wybrzmiewa.", { imageId: "instrument_trojkat" }),
        fact("ki-l5-e5", 1, "Ten instrument ma drewniane płytki, w które uderzamy pałeczkami. To…", ["Ksylofon", "Harfa", "Fortepian", "Werbel"], 0, "To ksylofon — każda płytka ma inną wysokość dźwięku.", { imageId: "instrument_ksylofon", abcd: true }),
        fact("ki-l5-e6", 2, "Który z tych instrumentów perkusyjnych potrafi zagrać melodię?", ["Werbel", "Ksylofon", "Talerze"], 1, "Ksylofon — ma płytki o różnych wysokościach. Werbel i talerze nie mają określonej wysokości.", { optionImageIds: ["instrument_werbel", "instrument_ksylofon", "instrument_talerze"] }),
        fact("ki-l5-e7", 1, "Czym gra się na instrumentach perkusyjnych?", ["Smyczkiem", "Pałeczkami lub uderzając rękami", "Dmuchając"], 1, "Na perkusji gra się uderzając."),
        fact("ki-l5-e8", 2, "Który z tych instrumentów stroi się, żeby grał określone dźwięki?", ["Kotły", "Werbel", "Trójkąt"], 0, "Kotły — zmienia się napięcie skóry, żeby zagrały właściwy dźwięk.", { optionImageIds: ["instrument_kotly", "instrument_werbel", "instrument_trojkat"] }),
        fact("ki-l5-e9", 1, "Czy perkusja to tylko bębny?", ["Tak, tylko bębny", "Nie — to też ksylofon, talerze i trójkąt", "Nie — to też skrzypce"], 1, "Perkusja to wszystkie instrumenty, w które uderzamy: bębny, talerze, trójkąt, ksylofon i wiele innych."),
        fact("ki-l5-e10", 1, "Posłuchaj: krótki, drewniany, dźwięczny dźwięk. Który to instrument?", ["Ksylofon", "Fagot", "Kotły"], 0, "To ksylofon — drewniane płytki dają krótki, stukający dźwięk.", { referenceAudioSource: SOUND.ksylofon }),
        fact("ki-l5-e12", 1, "Posłuchaj: suchy, rytmiczny dźwięk jak w marszu. Który to instrument?", ["Ksylofon", "Werbel", "Trójkąt"], 1, "To werbel — mały bęben ze „struną” pod spodem, która nadaje mu trzeszczące brzmienie.", { referenceAudioSource: SOUND.werbel }),
        fact("ki-l5-e13", 1, "Posłuchaj: głęboki, dudniący dźwięk bębna. Który to instrument?", ["Talerze", "Kotły", "Trójkąt"], 1, "To kotły — duże bębny o niskim, dudniącym dźwięku.", { referenceAudioSource: SOUND.kotly }),
        fact("ki-l5-e14", 1, "Posłuchaj: błyszczący szum metalu, który długo wybrzmiewa. Który instrument gra?", ["Talerze", "Werbel", "Ksylofon"], 0, "To talerze (tu: talerz zawieszony, uderzony pałeczką).", { referenceAudioSource: SOUND.talerze }),
        fact("ki-l5-e11", 1, "Posłuchaj: cienki, wysoki dźwięk, który długo wybrzmiewa. Który to instrument?", ["Werbel", "Trójkąt", "Tuba"], 1, "To trójkąt.", { referenceAudioSource: SOUND.trojkat }),
      ],
    },
    {
      id: "ki-poziom-6-klawisze-i-struny-szarpane",
      order: 6,
      difficulty: 2,
      introSlides: [
        {
          body: "Instrumenty klawiszowe mają klawisze, które naciskamy: fortepian, organy i akordeon. W fortepianie klawisz porusza młoteczek, który uderza w strunę. W organach dźwięk robi powietrze w rurach, a w akordeonie — powietrze z miecha, który się rozciąga i ściska.",
          instrumentExamples: [
            { imageId: "instrument_fortepian", label: "Fortepian", audioSource: NOTE_SAMPLES.C4 },
            { imageId: "instrument_organy", label: "Organy", audioSource: SOUND.organy },
            { imageId: "instrument_akordeon", label: "Akordeon", audioSource: SOUND.akordeon },
          ],
        },
        {
          body: "Są też instrumenty ze strunami, które szarpiemy palcami: harfa (kilkadziesiąt strun) i gitara (zwykle sześć strun). Nie gra się na nich smyczkiem, tylko dotykając strun.",
          instrumentExamples: [
            { imageId: "instrument_harfa", label: "Harfa", audioSource: SOUND.harfa },
            { imageId: "instrument_gitara", label: "Gitara", audioSource: SOUND.gitara },
          ],
        },
      ],
      exercises: [
        fact("ki-l6-e1", 1, "Na tym instrumencie gra się, naciskając białe i czarne klawisze. To…", ["Fortepian", "Harfa", "Gitara"], 0, "To fortepian.", { imageId: "instrument_fortepian" }),
        fact("ki-l6-e2", 1, "W fortepianie dźwięk powstaje, gdy młoteczki uderzają w…", ["Rury", "Struny", "Płytki"], 1, "W struny — fortepian to instrument klawiszowy ze strunami."),
        fact("ki-l6-e3", 1, "Ten wielki instrument ma setki rur i klawiatury. Gra się na nim w kościołach i filharmoniach. To…", ["Organy", "Akordeon", "Fagot"], 0, "To organy — największy instrument muzyczny.", { imageId: "instrument_organy" }),
        fact("ki-l6-e4", 1, "Dźwięk w organach powstaje, gdy przez rury przepływa…", ["Powietrze", "Woda", "Światło"], 0, "Powietrze — każda rura ma swój dźwięk."),
        fact("ki-l6-e5", 1, "Ten instrument rozciąga się i ściska, a dźwięk robi powietrze z miecha. To…", ["Harfa", "Akordeon", "Gitara"], 1, "To akordeon.", { imageId: "instrument_akordeon" }),
        fact("ki-l6-e6", 1, "Ten instrument ma zwykle sześć strun, na których gra się palcami lub kostką. To…", ["Skrzypce", "Fortepian", "Gitara"], 2, "To gitara.", { imageId: "instrument_gitara" }),
        fact("ki-l6-e7", 1, "Co mają wspólnego gitara i harfa?", ["Gra się na nich smyczkiem", "Mają struny, które szarpiemy palcami", "Są z metalu i dmuchamy w nie"], 1, "Na obu gra się, szarpiąc struny palcami."),
        fact("ki-l6-e8", 1, "Który z tych instrumentów ma klawisze?", ["Gitara", "Harfa", "Fortepian", "Trąbka"], 2, "Fortepian ma klawisze. Gitara i harfa mają struny, a trąbka wentyle.", { abcd: true }),
        fact("ki-l6-e9", 1, "Dlaczego fortepian nazywamy instrumentem klawiszowym?", ["Bo ma klawisze, które naciskamy", "Bo gra się na nim smyczkiem", "Bo ma suwak"], 0, "Bo gra się na nim, naciskając klawisze."),
        fact("ki-l6-e10", 1, "Który z tych instrumentów NIE ma klawiszy?", ["Akordeon", "Organy", "Gitara"], 2, "Gitara — gra się na niej, szarpiąc struny.", { optionImageIds: ["instrument_akordeon", "instrument_organy", "instrument_gitara"] }),
        fact("ki-l6-e11", 1, "Posłuchaj: długi, uroczysty dźwięk jak w kościele. Który instrument gra?", ["Akordeon", "Organy", "Gitara"], 1, "To organy — dźwięk robi powietrze w piszczałkach.", { referenceAudioSource: SOUND.organy }),
        fact("ki-l6-e12", 1, "Posłuchaj: ciepły dźwięk z „oddychaniem” miecha. Który to instrument?", ["Organy", "Fortepian", "Akordeon"], 2, "To akordeon — dźwięk powstaje, gdy powietrze z miecha wprawia w drganie metalowe języczki.", { referenceAudioSource: SOUND.akordeon }),
        fact("ki-l6-e14", 1, "Posłuchaj: szarpnięta struna o ciepłym, drewnianym brzmieniu. Który instrument gra?", ["Harfa", "Gitara", "Skrzypce"], 1, "To gitara — struny szarpie się palcami, a pudło z drewna nadaje dźwiękowi ciepło.", { referenceAudioSource: SOUND.gitara }),
        fact("ki-l6-e13", 1, "Posłuchaj: krótki dźwięk, który zaraz cichnie. Który instrument gra?", ["Fortepian", "Harfa", "Organy"], 0, "To fortepian — młoteczek uderza w strunę, więc dźwięk jest wyraźny i zaraz cichnie.", { referenceAudioSource: NOTE_SAMPLES.C4 }),
      ],
    },
    {
      id: "ki-poziom-7-wysoko-czy-nisko",
      order: 7,
      difficulty: 2,
      introSlides: [
        {
          body: "Pamiętaj zasadę: im mniejszy instrument i krótsze struny albo rury, tym wyższy dźwięk. Im większy instrument — tym niższy. Dlatego skrzypce i flet brzmią wysoko, a kontrabas i tuba bardzo nisko.",
          instrumentExamples: [
            { imageId: "instrument_flet", label: "Flet", caption: "wysoko", audioSource: SOUND.flet },
            { imageId: "instrument_skrzypce", label: "Skrzypce", caption: "wysoko", audioSource: SOUND.skrzypce },
            { imageId: "instrument_kontrabas", label: "Kontrabas", caption: "nisko", audioSource: SOUND.kontrabas },
            { imageId: "instrument_tuba", label: "Tuba", caption: "nisko", audioSource: SOUND.tuba },
          ],
        },
        {
          body: "Wskazówka do zadań: gdy masz wybrać dwa instrumenty, zapytaj siebie — który jest większy? Większy zagra niżej. Przy dźwięku z nagrania posłuchaj, czy brzmi jak cienki pisk (wysoko), czy jak głębokie buczenie (nisko).",
        },
      ],
      exercises: [
        fact("ki-l7-e1", 1, "Który instrument gra niżej: skrzypce czy kontrabas?", ["Skrzypce", "Kontrabas"], 1, "Kontrabas — jest znacznie większy od skrzypiec.", { optionImageIds: ["instrument_skrzypce", "instrument_kontrabas"] }),
        fact("ki-l7-e2", 1, "Który instrument zagra wyżej: tuba czy trąbka?", ["Tuba", "Trąbka"], 1, "Trąbka — jest dużo mniejsza od tuby.", { optionImageIds: ["instrument_tuba", "instrument_trabka"] }),
        fact("ki-l7-e3", 1, "Który instrument zagra niżej: fagot czy flet?", ["Fagot", "Flet"], 0, "Fagot — ma znacznie dłuższą rurę niż flet.", { optionImageIds: ["instrument_fagot", "instrument_flet"] }),
        fact("ki-l7-e4", 1, "Który instrument zagra wyżej: wiolonczela czy skrzypce?", ["Wiolonczela", "Skrzypce"], 1, "Skrzypce — są mniejsze od wiolonczeli.", { optionImageIds: ["instrument_wiolonczela", "instrument_skrzypce"] }),
        height("ki-l7-e5", 1, "C3", "low"),
        height("ki-l7-e6", 1, "C6", "high"),
        fact("ki-l7-e7", 2, "Który z tych czterech instrumentów gra najniżej?", ["Skrzypce", "Flet", "Kontrabas", "Wiolonczela"], 2, "Kontrabas — największy z nich, więc najniższy.", { abcd: true }),
        fact("ki-l7-e8", 1, "Zasada: im większy instrument, tym…", ["Wyższy dźwięk", "Niższy dźwięk", "Szybszy dźwięk"], 1, "Im większy instrument, tym niższy dźwięk."),
        fact("ki-l7-e9", 1, "Posłuchaj: czy ten dźwięk jest wysoki, czy niski?", ["Wysoki", "Niski"], 1, "To tuba — bardzo niski dźwięk.", { referenceAudioSource: SOUND.tuba }),
        fact("ki-l7-e10", 1, "Posłuchaj ponownie: czy ten dźwięk jest wysoki, czy niski?", ["Wysoki", "Niski"], 0, "To flet — wysoki, lekki dźwięk.", { referenceAudioSource: SOUND.flet }),
      ],
    },
    {
      id: "ki-poziom-8-jak-sie-na-tym-gra",
      order: 8,
      difficulty: 2,
      introSlides: [
        {
          body: "Instrumenty różnią się też tym, JAK się na nich gra. Smyczkiem przesuwamy po strunach, dmuchamy w instrumenty dęte, uderzamy w perkusję, szarpiemy struny palcami, a na fortepianie naciskamy klawisze.",
          instrumentExamples: [
            { imageId: "instrument_skrzypce", label: "Smyczek", caption: "po strunach", audioSource: SOUND.skrzypce },
            { imageId: "instrument_flet", label: "Dmuchanie", caption: "flet", audioSource: SOUND.flet },
            { imageId: "instrument_kotly", label: "Uderzanie", caption: "kotły", audioSource: SOUND.kotly },
            { imageId: "instrument_harfa", label: "Szarpanie", caption: "harfa", audioSource: SOUND.harfa },
            { imageId: "instrument_fortepian", label: "Klawisze", caption: "fortepian", audioSource: NOTE_SAMPLES.C4 },
          ],
        },
        {
          body: "Zapamiętaj trzy słowa: smyczkowe — smyczek, dęte — dmuchanie, perkusja — uderzanie. Kiedy w zadaniu zobaczysz instrument, zapytaj siebie, do której z tych grup należy.",
        },
      ],
      exercises: [
        fact("ki-l8-e1", 1, "Jak gra się na skrzypcach?", ["Dmuchając", "Przesuwając smyczek po strunach", "Uderzając pałeczkami"], 1, "Smyczkiem, który przesuwamy po strunach.", { imageId: "instrument_skrzypce" }),
        fact("ki-l8-e2", 1, "Jak gra się na trąbce?", ["Dmuchając w ustnik i naciskając wentyle", "Uderzając w nią", "Szarpiąc struny"], 0, "Dmuchamy w ustnik, a wentylami zmieniamy dźwięk.", { imageId: "instrument_trabka" }),
        fact("ki-l8-e3", 1, "Jak powstaje dźwięk we flecie poprzecznym?", ["Dmuchamy w otwór z boku", "Naciskamy klawisze", "Uderzamy w niego pałeczką"], 0, "Dmuchamy w otwór z boku — bez stroika.", { imageId: "instrument_flet" }),
        fact("ki-l8-e4", 1, "Jak gra się na kotłach?", ["Smyczkiem", "Dmuchając", "Uderzając pałkami"], 2, "Uderzamy pałkami w skórę, naciągniętą na miedziany kocioł.", { imageId: "instrument_kotly" }),
        fact("ki-l8-e5", 1, "Jak gra się na harfie?", ["Dmuchając", "Szarpiąc struny palcami", "Uderzając w klawisze"], 1, "Szarpiemy struny palcami.", { imageId: "instrument_harfa" }),
        fact("ki-l8-e6", 1, "Jak gra się na fortepianie?", ["Naciskając klawisze", "Dmuchając", "Szarpiąc struny", "Smyczkiem"], 0, "Naciskamy klawisze, które poruszają młoteczki.", { imageId: "instrument_fortepian", abcd: true }),
        fact("ki-l8-e7", 1, "Na którym instrumencie wysuwa się i wsuwa suwak?", ["Róg", "Trąbka", "Puzon"], 2, "Na puzonie.", { optionImageIds: ["instrument_rog", "instrument_trabka", "instrument_puzon"] }),
        fact("ki-l8-e8", 1, "Co to jest ustnik?", ["Część instrumentu, w którą dmuchamy", "Część, po której przesuwamy smyczek", "Pałeczka do bębna"], 0, "Ustnik to końcówka, do której przykładamy usta i dmuchamy."),
        fact("ki-l8-e9", 2, "Na którym z tych instrumentów NIE gra się dmuchając?", ["Flet", "Trąbka", "Fagot", "Skrzypce"], 3, "Na skrzypcach gra się smyczkiem.", { abcd: true, optionImageIds: ["instrument_flet", "instrument_trabka", "instrument_fagot", "instrument_skrzypce"] }),
        fact("ki-l8-e10", 2, "Smyczek jest dla skrzypiec tym, czym pałeczki dla…", ["Werbla", "Fletu", "Harfy"], 0, "Pałeczkami uderzamy w werbel — tak jak smyczkiem gramy na skrzypcach.", { optionImageIds: ["instrument_werbel", "instrument_flet", "instrument_harfa"] }),
      ],
    },
    {
      id: "ki-poziom-9-orkiestra-na-scenie",
      order: 9,
      difficulty: 2,
      introSlides: [
        {
          body: "Orkiestra symfoniczna siedzi na scenie w ustalonym porządku. Z przodu, tuż przed dyrygentem, są smyczki — jest ich najwięcej. Za nimi siedzą drewniane dęte, a jeszcze dalej blaszane dęte i perkusja, bo są najgłośniejsze.",
          instrumentExamples: [
            { imageId: "instrument_dyrygent", label: "Dyrygent", caption: "z przodu" },
            { imageId: "instrument_skrzypce", label: "Smyczki", caption: "z przodu" },
            { imageId: "instrument_flet", label: "Drewniane", caption: "w środku" },
            { imageId: "instrument_trabka", label: "Blaszane", caption: "z tyłu" },
            { imageId: "instrument_kotly", label: "Perkusja", caption: "z tyłu" },
          ],
        },
        {
          body: "Muzycy czytają nuty z partytury — to zapis wszystkich instrumentów razem. Mniejsze zespoły mają swoje nazwy: duet to dwie osoby, trio trzy, kwartet cztery. Solista gra sam, a orkiestra mu akompaniuje. Zespół, który śpiewa razem, to chór.",
        },
      ],
      exercises: [
        fact("ki-l9-e1", 1, "Gdzie zwykle stoi dyrygent?", ["Z tyłu sceny", "Z przodu orkiestry, twarzą do muzyków", "W widowni"], 1, "Dyrygent stoi przed orkiestrą, żeby wszyscy go widzieli.", { imageId: "instrument_dyrygent" }),
        fact("ki-l9-e2", 1, "Co to jest partytura?", ["Zapis nut wszystkich instrumentów razem", "Rodzaj instrumentu", "Pałeczka dyrygenta"], 0, "Partytura to zapis, z którego dyrygent widzi, co gra każdy instrument."),
        fact("ki-l9-e3", 1, "Kim jest solista?", ["Muzykiem, który gra sam, a orkiestra mu akompaniuje", "Dyrygentem", "Kompozytorem"], 0, "Solista gra sam, a orkiestra gra razem z nim."),
        fact("ki-l9-e4", 1, "Ilu muzyków gra w duecie?", ["Jeden", "Dwóch", "Czterech"], 1, "Duet to dwie osoby."),
        fact("ki-l9-e5", 1, "Ilu muzyków gra w kwartecie?", ["Dwóch", "Czterech", "Ośmiu", "Stu"], 1, "Kwartet to cztery osoby, np. kwartet smyczkowy.", { abcd: true }),
        fact("ki-l9-e6", 1, "Która rodzina instrumentów siedzi zwykle z przodu orkiestry?", ["Smyczkowe", "Perkusja", "Blaszane dęte"], 0, "Smyczkowe — jest ich najwięcej i siedzą najbliżej dyrygenta."),
        fact("ki-l9-e7", 1, "Gdzie zwykle siedzi perkusja?", ["Z tyłu orkiestry", "Przy dyrygencie", "Na samym przodzie"], 0, "Z tyłu — perkusja i blaszane są głośne, więc siedzą dalej od widowni."),
        fact("ki-l9-e8", 1, "Jak nazywa się zespół, który śpiewa razem?", ["Chór", "Kwartet", "Dyrygent"], 0, "Zespół śpiewaków to chór."),
        fact("ki-l9-e9", 1, "Kto decyduje, jak szybko i jak głośno orkiestra zagra utwór?", ["Dyrygent", "Widz", "Perkusista"], 0, "Dyrygent.", { imageId: "instrument_dyrygent" }),
        fact("ki-l9-e10", 2, "Co to jest orkiestra symfoniczna?", ["Czterech muzyków z gitarami", "Duży zespół ze smyczkami, dętymi i perkusją", "Jeden pianista", "Zespół śpiewaków"], 1, "To duży zespół, w którym grają smyczki, drewniane i blaszane dęte oraz perkusja.", { abcd: true }),
      ],
    },
    {
      id: "ki-poziom-10-boss-trabalski",
      order: 10,
      difficulty: 3,
      isBoss: true,
      bossName: "Trąbalski",
      introSlides: [
        {
          body: "Słoń Trąbalski rządzi Królestwem Instrumentów! Zamiast końca trąby ma mosiężną czarę jak w trąbce i udaje brzmienie każdego instrumentu, więc nie wiadomo, co naprawdę gra. Pokonaj go: rozpoznaj instrumenty po wyglądzie i po dźwięku, pamiętaj rodziny i zasadę wysoko-nisko.",
          bossPortrait: true,
        },
        {
          body: "Czeka na Ciebie mieszanka z całego królestwa: cztery zadania na słuch, kilka quizów ABCD i pytania o rodziny instrumentów. Przypomnij sobie: smyczkowe — smyczek, dęte — dmuchanie, perkusja — uderzanie, a im większy instrument, tym niższy dźwięk. Powodzenia!",
          instrumentExamples: [
            { imageId: "instrument_klarnet", label: "Klarnet", audioSource: SOUND.klarnet },
            { imageId: "instrument_puzon", label: "Puzon", audioSource: SOUND.puzon },
            { imageId: "instrument_saksofon", label: "Saksofon", audioSource: SOUND.saksofon },
            { imageId: "instrument_oboj", label: "Obój", audioSource: SOUND.oboj },
          ],
        },
      ],
      exercises: [
        fact("ki-l10-e1", 2, "Posłuchaj: który to instrument?", ["Obój", "Klarnet", "Flet", "Fagot"], 1, "To klarnet — okrągły, ciepły dźwięk z jednym stroikiem.", { referenceAudioSource: SOUND.klarnet, abcd: true }),
        fact("ki-l10-e2", 2, "Posłuchaj: który instrument blaszany zagrał teraz?", ["Puzon", "Tuba", "Trąbka"], 0, "To puzon.", { referenceAudioSource: SOUND.puzon }),
        fact("ki-l10-e3", 2, "Posłuchaj: który instrument z metalu, ale ze stroikiem, gra?", ["Flet", "Obój", "Saksofon"], 2, "To saksofon.", { referenceAudioSource: SOUND.saksofon }),
        fact("ki-l10-e4", 2, "Posłuchaj: cienki, nosowy dźwięk. Który to instrument?", ["Fagot", "Obój", "Klarnet"], 1, "To obój — ma podwójny stroik i cienki, nosowy dźwięk.", { referenceAudioSource: SOUND.oboj }),
        fact("ki-l10-e5", 2, "Do jakiej rodziny należy kontrabas?", ["Blaszane dęte", "Perkusja", "Smyczkowe", "Drewniane dęte"], 2, "Kontrabas jest największym instrumentem smyczkowym.", { imageId: "instrument_kontrabas", abcd: true }),
        fact("ki-l10-e6", 2, "Który instrument blaszany ma suwak?", ["Trąbka", "Puzon", "Tuba", "Róg"], 1, "Puzon — suwak zmienia długość rury.", { abcd: true }),
        fact("ki-l10-e7", 2, "Na którym z tych instrumentów nie ma stroika — dmuchamy w otwór z boku?", ["Klarnet", "Flet", "Obój", "Fagot"], 1, "Flet poprzeczny nie ma stroika.", { abcd: true }),
        fact("ki-l10-e8", 2, "Który z tych trzech instrumentów gra najniżej?", ["Flet", "Trąbka", "Tuba"], 2, "Tuba — największy z nich.", { optionImageIds: ["instrument_flet", "instrument_trabka", "instrument_tuba"] }),
        fact("ki-l10-e9", 2, "Czym różni się flet od klarnetu?", ["Flet nie ma stroika, klarnet ma", "Flet jest smyczkowy", "Klarnet jest z blachy"], 0, "Flet nie ma stroika, klarnet ma jeden stroik w ustniku."),
        fact("ki-l10-e10", 3, "Którą grupę tworzą wyłącznie instrumenty smyczkowe?", ["Flet, obój, trąbka", "Skrzypce, wiolonczela, kontrabas", "Kotły, werbel, tuba", "Harfa, róg, fagot"], 1, "Skrzypce, wiolonczela i kontrabas to smyczkowe.", { abcd: true }),
      ],
    },
  ],
};
