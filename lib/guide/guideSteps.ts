import type { IconName } from "@/components/icons/icons";
import type { SoltekExpression } from "@/components/SoltekMascot";

export interface GuideStep {
  id: string;
  icon: IconName;
  title: string;
  /** What Solfek says: short, in plain words, written for a child. */
  message: string;
  expression: SoltekExpression;
  /** The spot on screen to highlight (see lib/guide/tourTargets.ts); no target = a card in the middle of the screen. */
  target?: "modeSwitch" | "firstWorld" | "headerBar" | "shop" | "tabMisje" | "tabKalendarz" | "menu";
}

/** The tour of the whole game for a new player: Solfek points at the real
 * places on screen ("Kliknij tutaj…"). Shown once after the first finished lesson
 * and again from the side menu's "Przewodnik po grze". A step whose spot
 * isn't on screen (e.g. the world map while "Tryb nauki" is showing) falls back to a card in the middle. */
export const GUIDE_STEPS: readonly GuideStep[] = [
  {
    id: "witaj",
    icon: "kraina_wioska_nut",
    title: "Witaj w Solfku!",
    message: "Pokażę Ci na ekranie, gdzie co jest. Klikaj w podświetlone miejsca albo naciskaj „Dalej”. To zajmie tylko minutę!",
    expression: "glowny",
  },
  {
    id: "tryby",
    icon: "tryb_zabawy",
    title: "Trzy tryby",
    message: "Kliknij tutaj, żeby przełączać tryby. „Zabawa” to gra: mapa krain i bossowie. „Nauka” to Twój plan z powtórkami. „Własny” to trening bez końca: sam wybierasz, co ćwiczysz.",
    expression: "radosny",
    target: "modeSwitch",
  },
  {
    id: "krainy",
    icon: "kraina_klodka",
    title: "Krainy i poziomy",
    message: "Kliknij krainę, żeby wejść do jej poziomów. Zaczynasz od poziomu 1. Następny otworzy się, gdy zdobędziesz minimum 2 gwiazdki (od 1 do 3, im mniej błędów, tym więcej). Pomyłki nic nie kosztują!",
    expression: "zachecajacy",
    target: "firstWorld",
  },
  {
    id: "pasek",
    icon: "hud_ranga_gwiazda",
    title: "Passa, nutki i level",
    message: "Tutaj widzisz passę (dni ćwiczeń z rzędu), nutki i swój level. Za dobre odpowiedzi dostajesz XP i nutki. Kliknij level, żeby zobaczyć nagrody!",
    expression: "radosny",
    target: "headerBar",
  },
  {
    id: "sklep",
    icon: "hud_nutki_waluta",
    title: "Sklep Solfka",
    message: "Kliknij nutki, żeby wejść do sklepu. Co dzień czeka tam prezent od Solfka, a za nutki kupisz ubiory i tła. Co masz, znajdziesz w zakładce „Zakupione”.",
    expression: "radosny",
    target: "shop",
  },
  {
    id: "misje",
    icon: "nav_misje",
    title: "Misje dnia",
    message: "Kliknij tutaj po codzienne misje i wyzwanie dnia. Każdego dnia czekają 3 misje, a wyzwanie to pytanie z lekcji, które już zrobione.",
    expression: "zachecajacy",
    target: "tabMisje",
  },
  {
    id: "kalendarz",
    icon: "nav_kalendarz",
    title: "Kalendarz i odznaki",
    message: "Tutaj sprawdzisz, ile dni ćwiczysz z rzędu, swoje odznaki i kalendarz. Wracaj codziennie, żeby passa rosła!",
    expression: "radosny",
    target: "tabKalendarz",
  },
  {
    id: "menu",
    icon: "hud_menu",
    title: "Zasady i przewodnik",
    message: "Kliknij tutaj, żeby przeczytać zasady gry albo obejrzeć ten przewodnik jeszcze raz.",
    expression: "zachecajacy",
    target: "menu",
  },
  {
    id: "start",
    icon: "tryb_nauki",
    title: "Do dzieła!",
    message: "To już wszystko! Graj, zbieraj nutki i wracaj codziennie, a passa i levele same będą rosnąć. Przewodnik obejrzysz jeszcze raz w menu. Powodzenia!",
    expression: "glowny",
  },
];
