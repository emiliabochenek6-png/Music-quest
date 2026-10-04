/** "zadanie / zadania / zadań" for a count. */
export function exercisesWord(count: number): string {
  if (count === 1) return "zadanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zadania";
  return "zadań";
}

/** A sad Solfek's comment when the player wants to leave (the X in a lesson): one of a few, depending on how much is left. */
export function leaveComment(remaining: number, random: number = Math.random()): string {
  const near = remaining <= 3;
  const lines = near
    ? [
        `Zostało już tylko ${remaining} ${exercisesWord(remaining)}! Szkoda byłoby przerywać tuż przed metą…`,
        `Jeszcze ${remaining} ${exercisesWord(remaining)} i lekcja zaliczona. Solfek trzyma kciuki, żeby Ci się udało!`,
        "Prawie koniec! Solfek zrobi smutną minkę, jeśli teraz wyjdziesz…",
      ]
    : [
        "Czy na pewno chcesz wyjść? Solfek będzie za Tobą tęsknić…",
        "Jeśli wyjdziesz, ta lekcja nie zostanie zaliczona. Solfek zrobi smutną minkę…",
        "Wychodzisz? Solfek zostanie sam z nutami i będzie mu bardzo smutno…",
        "Jeszcze chwilka i będzie po wszystkim. Zostaniesz z Solfkiem?",
      ];
  return lines[Math.floor(random * lines.length) % lines.length];
}

