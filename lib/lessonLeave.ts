/** "zadanie / zadania / zadań" for a count. */
export function exercisesWord(count: number): string {
  if (count === 1) return "zadanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zadania";
  return "zadań";
}

/** "2 dźwięki", "5 dźwięków" for a count. */
export function soundsPhrase(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  const few = last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14);
  return `${count} ${count === 1 ? "dźwięk" : few ? "dźwięki" : "dźwięków"}`;
}

/** "pytanie / pytania / pytań" for a count. */
export function questionsWord(count: number): string {
  if (count === 1) return "pytanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "pytania";
  return "pytań";
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

/** The same for the placement test: how many questions are probably left (an estimate, since the test adapts). */
export function leaveTestComment(remaining: number, random: number = Math.random()): string {
  const near = remaining <= 3;
  const lines = near
    ? [
        `Zostało tylko kilka pytań! Solfek już czeka z Twoim wynikiem…`,
        "Prawie koniec testu! Szkoda przerywać tuż przed metą…",
        `Jeszcze około ${Math.max(1, remaining)} ${questionsWord(Math.max(1, remaining))} i ułożymy Twoją ścieżkę. Zostaniesz?`,
      ]
    : [
        "Bez testu Solfek nie ułoży Ci ścieżki dopasowanej do Twoich umiejętności…",
        "Wychodzisz? Solfek tak się starał z tymi pytaniami… Będzie mu smutno.",
        "Test nic Cię nie kosztuje: bez punktów i ocen. Zostaniesz jeszcze chwilkę?",
        "Jeśli przerwiesz, test trzeba będzie zacząć od początku. Solfek zrobi smutną minkę…",
      ];
  return lines[Math.floor(random * lines.length) % lines.length];
}
