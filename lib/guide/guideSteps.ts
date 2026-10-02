import type { IconName } from "@/components/icons/icons";
import type { SoltekExpression } from "@/components/SoltekMascot";
import { MAX_LEVEL } from "@/lib/gamification/rank";
import { POWER_UP_COSTS } from "@/lib/gamification/powerups";

export interface GuideStep {
  id: string;
  icon: IconName;
  title: string;
  /** What Soltek says: short, in plain words, written for a child. */
  message: string;
  expression: SoltekExpression;
}

/** The short tour of the whole game for a new player, in order. Shown once
 * after Soltek's welcome (and again from the side menu's "Przewodnik po grze"). */
export const GUIDE_STEPS: readonly GuideStep[] = [
  {
    id: "witaj",
    icon: "kraina_wioska_nut",
    title: "Witaj w Music Quest!",
    message: "Uczysz się tu muzyki krok po kroku: czytania nut, rytmu, słuchu i śpiewu. Ja będę Ci pomagać. Pokażę Ci w minutę, jak to działa!",
    expression: "glowny",
  },
  {
    id: "tryby",
    icon: "tryb_zabawy",
    title: "Dwa tryby",
    message: "„Tryb zabawy” to gra: mapa krain, poziomy i walki z bossami. „Tryb nauki” to Twój plan: lekcje dzień po dniu, z powtórkami. Przełączasz je u góry mapy.",
    expression: "radosny",
  },
  {
    id: "poziomy",
    icon: "kraina_klodka",
    title: "Krainy i poziomy",
    message: "Każda kraina zaczyna się od poziomu 1. Następny poziom otwiera się, gdy zdobędziesz w poprzednim minimum 2 gwiazdki. Na końcu krainy czeka boss!",
    expression: "zachecajacy",
  },
  {
    id: "gwiazdki",
    icon: "ui_odznaka",
    title: "Gwiazdki i błędy",
    message: "Za poziom dostajesz od 1 do 3 gwiazdek: im mniej błędów, tym więcej. Pomyłka nic nie kosztuje, więc próbuj śmiało i powtarzaj poziomy, jeśli chcesz lepszy wynik.",
    expression: "radosny",
  },
  {
    id: "nagrody",
    icon: "hud_ranga_gwiazda",
    title: "XP, levele i nutki",
    message: `Za dobre odpowiedzi zbierasz XP i nutki. XP zamieniają się w levele (jest ich ${MAX_LEVEL}), a za nowe levele dostajesz jeszcze więcej nutek. Za nutki kupisz w Sklepie Soltka zamrożenie passy (${POWER_UP_COSTS.streakFreeze} nutek).`,
    expression: "zachecajacy",
  },
  {
    id: "passa",
    icon: "hud_seria_ogien",
    title: "Passa i misje",
    message: "Ćwicz codziennie, a Twoja passa będzie rosła. Każdego dnia czekają na Ciebie 3 misje i wyzwanie dnia, czyli pytanie z lekcji, które już zrobiłaś albo zrobiłeś.",
    expression: "radosny",
  },
  {
    id: "start",
    icon: "tryb_nauki",
    title: "Zaczynamy!",
    message: "Na początek mogę zrobić z Tobą krótki test i ułożyć Twój własny plan nauki. Możesz też od razu zacząć grać. Gotowy?",
    expression: "glowny",
  },
];
