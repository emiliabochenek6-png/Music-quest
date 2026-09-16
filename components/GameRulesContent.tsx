import { ScrollView, Text, View, StyleSheet } from "react-native";
import { POWER_UP_COSTS } from "@/lib/gamification/powerups";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { HEART_REGEN_MS, MAX_HEARTS, MIN_STARS_TO_ADVANCE_WORLD } from "@/types/gamification";

interface Rule {
  icon: string;
  title: string;
  body: string;
}

const HEART_REGEN_HOURS = HEART_REGEN_MS / (60 * 60 * 1000);

const RULES: Rule[] = [
  {
    icon: "❤️",
    title: "Serca",
    body: `Masz ${MAX_HEARTS} serc. Błędna odpowiedź kosztuje 1 serce. Gdy zabraknie serc, nie możesz ćwiczyć dalej, dopóki jedno się nie odnowi (1 serce co ${HEART_REGEN_HOURS} godziny) — albo masz Premium, gdzie serca są bez limitu. Serca możesz też uzupełnić od razu za nutki w Sklepie Soltka.`,
  },
  {
    icon: "⭐",
    title: "XP i ranga",
    body: "Za każdą poprawną odpowiedź dostajesz punkty doświadczenia (XP). Za ukończenie lekcji bez ani jednego błędu — dodatkowy bonus. Im więcej XP zbierzesz, tym wyższa Twoja ranga — a Soltek ogłasza każdy awans osobiście.",
  },
  {
    icon: "🔥",
    title: "Passa",
    body: "Licznik dni z rzędu, w które ukończyłaś/eś choć jedną lekcję albo wyzwanie dnia. Ćwicz codziennie, żeby jej nie stracić — jeden pominięty dzień i passa zwykle wraca do 1. Jeśli masz banknięte zamrożenie passy (kupione za nutki), ono samo ochroni Cię przy jednym ominiętym dniu.",
  },
  {
    icon: "🌟",
    title: "Gwiazdki i Perfekcyjna Kraina",
    body: `Po ukończeniu lekcji dostajesz od 1 do 3 gwiazdek, zależnie od liczby błędów — 0 błędów to zawsze 3 gwiazdki. Możesz wrócić do lekcji jeszcze raz po lepszy wynik. Żeby przejść do następnej krainy, KAŻDA lekcja poprzedniej musi mieć minimum ${MIN_STARS_TO_ADVANCE_WORLD} gwiazdki. A jeśli dociągniesz WSZYSTKIE lekcje danej krainy do 3 gwiazdek — to Perfekcyjna Kraina, specjalna odznaka i bonus w nutkach.`,
  },
  {
    icon: "🎵",
    title: "Nutki i Sklep Soltka",
    body: `Nutki to Twoja własna waluta — zdobywasz je za wyzwanie dnia, perfekcyjną lekcję, ukończenie krainy i co tydzień passy. Nigdy nie da się ich kupić za prawdziwe pieniądze. W Sklepie Soltka (ikonka 🎵 przy mapie) wymieniasz je na zamrożenie passy (${POWER_UP_COSTS.streakFreeze} nutek) albo uzupełnienie serc (${POWER_UP_COSTS.heartRefill} nutek). Podczas lekcji za ${POWER_UP_COSTS.hint} nutek możesz też poprosić Soltka o podpowiedź.`,
  },
  {
    icon: "🎯",
    title: "Wyzwanie dnia",
    body: "Jedno dodatkowe ćwiczenie dziennie z tego, czego już się nauczyłaś/eś w odblokowanych krainach — inne niż te z lekcji, ale tego samego rodzaju. Częściej trafiają się rzeczy z lekcji, które już skończyłaś/eś — to Twoje powtórki. Błędna odpowiedź nic nie kosztuje — od razu dostajesz kolejne zadanie do spróbowania, aż trafisz dobrze i zdobędziesz punkty.",
  },
  {
    icon: "🏅",
    title: "Odznaki",
    body: "Za kamienie milowe — punkty doświadczenia, długość passy, liczbę ukończonych lekcji i perfekcyjne krainy — odblokowujesz odznaki. Zobaczysz je w Kalendarzu aktywności, razem z tym, ile jeszcze brakuje do kolejnej.",
  },
  {
    icon: "📅",
    title: "Kalendarz aktywności",
    body: "Pokazuje, w które dni ćwiczyłaś/eś, ile to zajęło czasu i ile lekcji ukończyłaś/eś — podsumowanie Twojej passy, odznak i postępów.",
  },
];

/** Static, presentational rules explainer for the side menu's own
 * "Zasady gry" view — plain text, no context reads, so it can't drift
 * out of sync with actual GAMEPLAY state (it explains MECHANICS, not
 * "here's your current XP"; GamificationHeaderBar/CalendarActivityView
 * already show the live numbers elsewhere). Pulls MAX_HEARTS/
 * HEART_REGEN_MS from types/gamification.ts rather than hardcoding "5"
 * and "4" so this text can't quietly go stale if those constants ever
 * change. */
export function GameRulesContent() {
  return (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
      {RULES.map((rule) => (
        <View key={rule.title} style={styles.row}>
          <Text style={styles.icon}>{rule.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{rule.title}</Text>
            <Text style={styles.body}>{rule.body}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.ink,
    marginBottom: 3,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
  },
});
