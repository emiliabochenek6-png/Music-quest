import type { IconName } from "@/components/icons/icons";
import { MAX_STREAK_FREEZES, POWER_UP_COSTS } from "@/lib/gamification/powerups";
import { MIN_STARS_TO_ADVANCE_WORLD } from "@/types/gamification";
import { MAX_LEVEL } from "@/lib/gamification/rank";

export interface Rule {
  /** Stable key for looking a rule up from somewhere other than the full
   * "Zasady gry" list — see getRuleById's own doc. Only the rules that
   * actually have another entry point (the HUD pills so far) need one;
   * the rest are plain undefined and only ever reached by scrolling the
   * full list. */
  id?: string;
  icon: { name: IconName } | { emoji: string };
  title: string;
  body: string;
}

/** Every "Zasady gry" entry — GameRulesContent.tsx's own full scrolling
 * list, AND (for the few with an `id`) the single-rule popup
 * GamificationHeaderBar's tappable HUD pills open via RuleInfoModal.
 * Kept as plain data here (no React) so it can be imported from either
 * without pulling a component into a component. */
export const RULES: Rule[] = [
  {
    id: "rank",
    icon: { name: "hud_ranga_gwiazda" },
    title: "XP i levele",
    body: `Błąd nic nie kosztuje — w aplikacji nie ma serc ani blokad. Za każdą poprawną odpowiedź dostajesz punkty doświadczenia (XP) i 2 nutki. Za ukończenie lekcji bez ani jednego błędu — dodatkowy bonus. XP zamieniają się w levele: jest ich ${MAX_LEVEL}, a każdy kolejny trudniej zdobyć niż poprzedni — pierwsze wpadają po kilku dobrych odpowiedziach, ostatnie wymagają prawdziwej wytrwałości. Za każdy 5. level Solfek urządza świętowanie, a co kilkanaście levelów dostajesz nowy tytuł.`,
  },
  {
    id: "streak",
    icon: { name: "hud_seria_ogien" },
    title: "Passa",
    body: "Licznik dni z rzędu, w które ukończyłaś/eś choć jedną lekcję albo wyzwanie dnia. Ćwicz codziennie, żeby jej nie stracić — jeden pominięty dzień i passa zwykle wraca do 1. Jeśli masz banknięte zamrożenie passy (kupione za nutki), ono samo ochroni Cię przy jednym ominiętym dniu.",
  },
  {
    id: "stars",
    icon: { emoji: "🌟" },
    title: "Gwiazdki i Perfekcyjna Kraina",
    body: `Po ukończeniu lekcji dostajesz od 1 do 3 gwiazdek, zależnie od liczby błędów — 0 błędów to zawsze 3 gwiazdki. Możesz wrócić do lekcji jeszcze raz po lepszy wynik. Żeby przejść do następnej krainy, KAŻDA lekcja poprzedniej musi mieć minimum ${MIN_STARS_TO_ADVANCE_WORLD} gwiazdki. A jeśli dociągniesz WSZYSTKIE lekcje danej krainy do 3 gwiazdek — to Perfekcyjna Kraina, specjalna odznaka i bonus w nutkach.`,
  },
  {
    id: "nutki",
    icon: { name: "hud_nutki_waluta" },
    title: "Nutki i Sklep Solfka",
    body: `Nutki to Twoja własna waluta — zdobywasz je za każdą dobrą odpowiedź (2 nutki), nowe levele, wyzwanie dnia, perfekcyjną lekcję, ukończenie krainy i co tydzień passy. Nigdy nie da się ich kupić za prawdziwe pieniądze. W Sklepie Solfka (kliknij nutki przy mapie) kupujesz ubiory dla Solfka (różne kolory i stroje) oraz tła, a wszystko, co masz, znajdziesz w zakładce „Zakupione”. Każdy ubiór pasuje do każdego tła. Możesz tam też kupić zamrożenie passy (${POWER_UP_COSTS.streakFreeze} nutek, naraz najwyżej ${MAX_STREAK_FREEZES}). Nutki wydane w sklepie znikają z konta, więc oszczędzaj na to, na czym Ci zależy.`,
  },
  {
    id: "daily-challenge",
    icon: { name: "nav_misje" },
    title: "Wyzwanie dnia",
    body: "Jedno dodatkowe ćwiczenie dziennie z tego, czego już się nauczyłaś/eś w odblokowanych krainach — inne niż te z lekcji, ale tego samego rodzaju. Częściej trafiają się rzeczy z lekcji, które już skończyłaś/eś — to Twoje powtórki. Błędna odpowiedź nic nie kosztuje — od razu dostajesz kolejne zadanie do spróbowania, aż trafisz dobrze i zdobędziesz punkty.",
  },
  {
    id: "badges",
    icon: { emoji: "🏅" },
    title: "Odznaki",
    body: "Za kamienie milowe — punkty doświadczenia, długość passy, liczbę ukończonych lekcji i perfekcyjne krainy — odblokowujesz odznaki. Zobaczysz je w Kalendarzu aktywności, razem z tym, ile jeszcze brakuje do kolejnej.",
  },
  {
    id: "calendar",
    icon: { name: "nav_kalendarz" },
    title: "Kalendarz aktywności",
    body: "Pokazuje, w które dni ćwiczyłaś/eś, ile to zajęło czasu i ile lekcji ukończyłaś/eś — podsumowanie Twojej passy, odznak i postępów.",
  },
];

export function getRuleById(id: string): Rule | undefined {
  return RULES.find((rule) => rule.id === id);
}
