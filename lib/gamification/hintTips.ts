/** Generic, exercise-type-agnostic strategy tips for the "Podpowiedź
 * Soltka" power-up (POWER_UP_COSTS.hint) — deliberately NOT tied to any
 * one exercise's own correct answer. With 30+ structurally different
 * exercise types (types/exercises.ts), a hint that reveals or eliminates
 * an actual answer option would need bespoke logic per type; a shared
 * pool of general music-theory strategy reminders works everywhere
 * instead, at the cost of being less pointed. Shown via SoltekMascot the
 * same way his other in-lesson messages already are. */
const HINT_TIPS: readonly string[] = [
  "Policz półtony od dźwięku bazowego — to działa przy każdym interwale.",
  "Wzór gamy durowej: cały-cały-pół-cały-cały-cały-pół.",
  "Sprawdź znaki przy kluczu — mówią Ci, w jakiej jesteś tonacji.",
  "Akord molowy brzmi smutniej niż durowy — spróbuj to usłyszeć, nie tylko policzyć.",
  "Przewrót zmienia, który dźwięk jest na dole — sam akord zostaje ten sam.",
  "Koło kwintowe w prawo to krzyżyki, w lewo to bemole.",
  "Tonacja równoległa ma te same znaki, ale inny dźwięk centralny.",
  "Nie spiesz się — policz linie i przestrzenie od dołu pięciolinii.",
];

/** Picks one tip at random — no state to track which were already shown,
 * a repeat is fine since these are general reminders, not a sequence. */
export function pickHintTip(): string {
  return HINT_TIPS[Math.floor(Math.random() * HINT_TIPS.length)];
}
