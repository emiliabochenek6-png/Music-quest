/** Solfek's own words under the green / red panel after "Sprawdź" (one of a few, so it never reads like a template). */
const CORRECT_LINES: { title: string; note: string }[] = [
  { title: "Świetnie!", note: "Solfek tańczy z radości!" },
  { title: "Brawo!", note: "Masz muzykalne ucho!" },
  { title: "Tak jest!", note: "Dokładnie tak brzmi muzyka." },
  { title: "Pięknie!", note: "Solfek jest z Ciebie dumny." },
  { title: "Super nuta!", note: "Tak trzymać, mistrzu!" },
  { title: "Trafione!", note: "Nawet Solfek lepiej by nie zagrał." },
];

const WRONG_LINES: { title: string; note: string }[] = [
  { title: "Prawie!", note: "Nic się nie stało, Solfek też kiedyś się mylił." },
  { title: "Ojej, nie tym razem", note: "Każda pomyłka to krok do mistrzostwa." },
  { title: "Spokojnie…", note: "Posłuchaj jeszcze raz, a następnym razem się uda." },
  { title: "Hmm, nie ta nuta", note: "Solfek wierzy, że za chwilę Ci się uda!" },
  { title: "Jeszcze nie to", note: "Najlepsi muzycy też ćwiczą w kółko." },
];

export function feedbackLine(correct: boolean, random: number = Math.random()): { title: string; note: string } {
  const lines = correct ? CORRECT_LINES : WRONG_LINES;
  return lines[Math.floor(random * lines.length) % lines.length];
}
