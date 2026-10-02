import type { SoltekExpression } from "@/components/SoltekMascot";

export interface SoltekLine {
  message: string;
  expression: SoltekExpression;
}

const NEUTRAL_LINES = [
  "Zastanów się spokojnie. Jeśli nie wiesz — nic się nie stanie!",
  "Wybierz odpowiedź, która wydaje Ci się najlepsza.",
  "Tu nie ma złych odpowiedzi — sprawdzam tylko, od czego zacząć.",
  "Nie wiesz? Naciśnij „Nie wiem”. Zgadywanie niczego nie poprawia!",
];

/** What Soltek says above a placement question. Deliberately never says
 * whether the PREVIOUS answer was right — the test measures, it doesn't
 * grade — only where we are in it, plus a rotating friendly nudge. `answered`
 * is how many questions are already done, `total` the estimated total. */
export function placementQuestionLine(answered: number, total: number, worldName: string): SoltekLine {
  if (answered === 0) return { message: `Zaczynamy! Pierwsza kraina: ${worldName}. Powodzenia!`, expression: "radosny" };
  if (total > 0 && answered >= total - 2) return { message: `Już prawie koniec! Ostatnie pytania, kraina: ${worldName}.`, expression: "radosny" };
  if (total > 0 && answered === Math.floor(total / 2)) return { message: `Połowa za nami! Idziemy dalej — kraina: ${worldName}.`, expression: "zachecajacy" };
  return { message: `${worldName}. ${NEUTRAL_LINES[answered % NEUTRAL_LINES.length]}`, expression: "myslacy" };
}

/** Soltek's verdict on the finished test: how many worlds the player already
 * knows well and how long the personal path is. */
export function placementResultLine(masteredWorlds: number, testedWorlds: number, pathLessons: number, allLessons: number): SoltekLine {
  if (pathLessons >= allLessons) {
    return { message: `Gotowe! Zaczniemy od podstaw i przejdziemy całą ścieżkę razem — ${allLessons} lekcji. Dasz radę!`, expression: "zachecajacy" };
  }
  if (masteredWorlds >= Math.ceil(testedWorlds / 2)) {
    return { message: `Świetnie Ci poszło! W ${masteredWorlds} z ${testedWorlds} krain już dużo umiesz. Ułożyłem Ci krótszą ścieżkę: ${pathLessons} z ${allLessons} lekcji.`, expression: "radosny" };
  }
  return { message: `Dziękuję za test! Ułożyłem Ci ścieżkę: ${pathLessons} z ${allLessons} lekcji — pominąłem to, co już umiesz.`, expression: "radosny" };
}
