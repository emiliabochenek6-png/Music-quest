/** Soltek's comments on the player's streak ("passa"): 100 different lines,
 * one shown at a time and swapped for the next one every 3 days.
 *
 * Every line is written to be true for ANY running streak (1 day or 200),
 * so the pool never needs to be filtered by length; `{dni}` is replaced
 * with the real count ("1 dzień", "5 dni"). Which line is shown depends only
 * on the date, so it is the same all day, on every screen, and needs no
 * saved state. */
export const STREAK_COMMENTS: readonly string[] = [
  "Masz już {dni} passy — tak trzymaj!",
  "Każdy dzień ćwiczeń to jedna nutka więcej w Twojej melodii.",
  "Passa trwa! Wróć jutro, a będzie jeszcze dłuższa.",
  "Mózg uwielbia regularność. Krótko, ale codziennie — to działa najlepiej.",
  "{dni} z rzędu! Jestem z Ciebie bardzo dumny.",
  "Muzycy mówią: lepiej 10 minut codziennie niż godzina raz w tygodniu.",
  "Twoja passa gra jak dobry metronom: dzień po dniu, równo.",
  "Pamiętaj: nie chodzi o to, żeby być idealnym, tylko żeby wracać.",
  "Jeszcze jeden dzień i kolejna nutka wpada do kolekcji!",
  "Ogień się pali! Dorzuć dziś jedną lekcję.",
  "Masz już {dni} ćwiczeń z rzędu, to naprawdę dużo! Brawo!",
  "Passa to Twój cichy superbohater — pilnuje, żebyś nie zapomniał o muzyce.",
  "Małymi krokami też da się dojść na sam szczyt.",
  "Soltek kibicuje: jeszcze jedno ćwiczenie i dzień zaliczony!",
  "Najtrudniejszy jest początek dnia. Potem już samo leci.",
  "Dobra passa to dobry nawyk. A dobry nawyk to połowa sukcesu.",
  "Czy wiesz, że słuch muzyczny też się trenuje jak mięśnie? Ćwicz regularnie!",
  "Jeśli kiedyś zabraknie Ci czasu, zrób choć jedno ćwiczenie — passa przetrwa.",
  "Piękna sprawa: {dni} bez ani jednej przerwy!",
  "Metronom nie robi sobie wolnego. Zrób dziś tak jak on i ćwicz!",
  "Każda lekcja przybliża Cię do grania ze słuchu.",
  "Z dnia na dzień idzie Ci coraz lepiej. Naprawdę to widać!",
  "Passa to jak refren: im częściej wraca, tym lepiej zostaje w głowie.",
  "Dzisiaj mała dawka muzyki, jutro wielka umiejętność.",
  "Tu nie ma wyścigu. Ważne, żeby być na bieżąco.",
  "Moja ulubiona liczba to Twoja passa: {dni}. Niech rośnie!",
  "Cisza przed koncertem, a Ty w międzyczasie ćwiczysz. Tak się robi karierę!",
  "Pamiętaj o przerwie na wodę. Mistrzowie też piją wodę!",
  "Dobre rzeczy dzieją się po cichu, dzień po dniu. Tak jak Twoja passa.",
  "Hej, nuto! Nie zgub rytmu — wróć jutro.",
  "Kto ćwiczy codziennie, ten po miesiącu słyszy muzykę zupełnie inaczej.",
  "Najlepszy moment na ćwiczenie? Ten, który masz dzisiaj.",
  "Jedna lekcja to ledwie kilka minut, a passa rośnie. Opłaca się!",
  "Każdy dzień ćwiczeń to jeden klawisz na Twojej własnej klawiaturze. Zagraj dziś kolejny!",
  "Brawo! Nawet gdy nie chce się ćwiczyć, Ty ćwiczysz. To jest siła.",
  "Dyrygent byłby zadowolony: wchodzisz równo, we właściwym momencie!",
  "Słyszę, że robisz postępy. Nie wiem, jak to robię, ale słyszę!",
  "Passa nie lubi nudy. Zrób dziś coś nowego: może inną krainę?",
  "Chwalę Cię za każdy dzień. A dziś chwalę podwójnie!",
  "{dni} to nie przypadek. To Twoja decyzja, powtarzana każdego dnia.",
  "Cały tydzień i więcej bez przerwy: {dni}. Brawo za wytrwałość!",
  "Brakuje Ci sił? Zrób jedną krótką lekcję. Więcej nie trzeba!",
  "Jak w orkiestrze: każdy dzień ma swoją partię do zagrania.",
  "Dziś będzie dobry dzień na dobre nuty.",
  "Twoje uszy już się rozgrzewają. Słuchaj uważnie!",
  "Wiesz, co jest lepsze niż talent? Systematyczność. A Ty właśnie ją budujesz!",
  "Hop, hop! Jeszcze krok i kolejny dzień passy gotowy.",
  "Każdy mistrz kiedyś zaczynał od pierwszego dnia. A Ty masz już za sobą {dni}!",
  "Dasz radę! W końcu to Ty trzymasz passę, a nie ona Ciebie.",
  "Pssst... wszyscy kibicujemy Twojej passie: ja, nutki i metronom.",
  "Dziś posłuchaj jednej piosenki i spróbuj usłyszeć w niej rytm. To też trening!",
  "Dwa kroki do przodu, jeden do tyłu to też postęp. Najważniejsze, że idziesz.",
  "Twoja passa jest jak wąż z nutek: z każdym dniem jeden kawałek dłuższa.",
  "Nie liczą się wielkie skoki, tylko małe kroki, które robisz każdego dnia.",
  "Poznajesz coraz więcej nut. Dziś będzie ich jeszcze więcej!",
  "Dziś pierwsza lekcja, jutro druga, a za chwilę gotowy koncert.",
  "Im częściej ćwiczysz, tym łatwiej nuty wpadają do głowy.",
  "Ogień nie gaśnie, gdy co dzień dorzucisz do niego patyczek. Dziś jedna lekcja!",
  "Lubię, kiedy wracasz. Naprawdę. Dziękuję, że jesteś tu już {dni} z rzędu!",
  "Wiesz, jak się robi wielką muzykę? Jedna nuta po drugiej, każdego dnia.",
  "Jesteś w świetnej formie. {dni} passy to potwierdza!",
  "Dzisiaj łap rytm! A jutro znowu.",
  "Nie spiesz się. Ważne, że codziennie coś dokładasz.",
  "Twoja cierpliwość ma piękne brzmienie.",
  "Pamiętaj, że najlepsze melodie powstają z powtórek.",
  "Chcesz dłuższej passy? Wróć jutro. Oto cała tajemnica!",
  "Prawdziwa moc to nie siła, tylko regularność. I właśnie ją budujesz!",
  "Wiem, że bywa trudno. Ale Ty i tak ćwiczysz. Dla mnie to jest bohaterstwo.",
  "{dni} z rzędu, a ja nadal czekam na więcej!",
  "Mała lekcja dziś, wielka radość jutro.",
  "Nie ma lepszego sposobu na naukę muzyki niż robić to codziennie po trochu.",
  "Ciekawostka: orkiestra potrzebuje wielu prób, żeby zagrać jeden koncert. Ty też próbujesz każdego dnia!",
  "Hura! Kolejny dzień i znowu jesteś na właściwej drodze.",
  "Nie wiem, kto ćwiczy lepiej, Ty czy metronom. Chyba remis!",
  "Passa to Twoja mała tajemna broń. Używaj jej mądrze: codziennie.",
  "Dziś Twoje palce, uszy i głowa zrobią mały trening.",
  "Wiesz co? Słychać, że masz w sobie muzyka!",
  "Szczególnie lubię te dni, w których wracasz bez przypominania.",
  "Jeszcze troszkę i będziesz mistrzem w rozpoznawaniu dźwięków!",
  "Kropla drąży skałę, a Twoja passa drąży drogę do mistrzostwa.",
  "Dziś zrób jedną rzecz, która wczoraj była jeszcze nowa.",
  "Moje nutki tańczą z radości, kiedy Ci się udaje!",
  "Trzymaj tempo: nie za szybko, nie za wolno, w sam raz.",
  "Jeśli czujesz, że to nudne, wybierz inną krainę. Muzyka ma ich wiele!",
  "Dla muzyka najważniejszy jest dzień dzisiejszy. Dziś już ćwiczysz?",
  "Mówi się, że praktyka czyni mistrza. A Ty praktykujesz codziennie!",
  "Jak w dobrej piosence: po każdej zwrotce wraca refren. Czyli kolejny dzień passy!",
  "Gdybym miał medale, dałbym Ci jeden za każdy dzień. Czekałaby na Ciebie cała kolekcja!",
  "Dwa tygodnie i więcej, czyli {dni}! To już prawdziwy nawyk muzyka.",
  "Ćwiczysz dla siebie, a ja jestem Twoim widzem nr 1.",
  "Super, że nie rezygnujesz! Jutro znów się spotkamy.",
  "Rytm masz we krwi, a passę w kalendarzu.",
  "Jeden dzień przerwy to nie koniec świata, ale po co ryzykować? Wpadnij jutro!",
  "Dziś zrób coś dla przyszłego siebie: jedną krótką lekcję.",
  "Masz już za sobą kawał drogi: {dni} bez przerwy. Obejrzyj się za siebie!",
  "{dni} bez przerwy, to już prawie miesiąc! Jestem pod wielkim wrażeniem.",
  "I co, czujesz tę moc? To moc regularnych powtórek!",
  "Każda nowa lekcja to nowa umiejętność. A ich już trochę masz!",
  "Finał zawsze jest wielki, bo przed nim były setki małych prób. Tak jak Twoje!",
  "Dziękuję, że ćwiczysz ze mną. Z Tobą jest najlepiej!",
];

/** Lines that only make sense once the streak has reached a certain length
 * (they praise "a week", "a month", "so many days without a break"): they are
 * left out for shorter streaks, so day 1 never hears about a long road. */
const MIN_STREAK_DAYS: Readonly<Record<string, number>> = {
  "Masz już {dni} ćwiczeń z rzędu, to naprawdę dużo! Brawo!": 3,
  "{dni} to nie przypadek. To Twoja decyzja, powtarzana każdego dnia.": 3,
  "Piękna sprawa: {dni} bez ani jednej przerwy!": 2,
  "Lubię, kiedy wracasz. Naprawdę. Dziękuję, że jesteś tu już {dni} z rzędu!": 2,
  "{dni} z rzędu, a ja nadal czekam na więcej!": 2,
  "Masz już za sobą kawał drogi: {dni} bez przerwy. Obejrzyj się za siebie!": 3,
  "Jesteś w świetnej formie. {dni} passy to potwierdza!": 3,
  "Cały tydzień i więcej bez przerwy: {dni}. Brawo za wytrwałość!": 7,
  "Dwa tygodnie i więcej, czyli {dni}! To już prawdziwy nawyk muzyka.": 14,
  "{dni} bez przerwy, to już prawie miesiąc! Jestem pod wielkim wrażeniem.": 27,
};

/** Said when there is no running streak — the very first day, or after a
 * break: a fresh start with no guilt. Also swapped every 3 days. */
export const STREAK_RESTART_COMMENTS: readonly string[] = [
  "Zaczynamy od nowa, a to znaczy: pierwsza nutka już dziś!",
  "Nowa passa zaczyna się od jednego dnia. Ten dzień jest dziś!",
  "Nic się nie stało! Każdy muzyk czasem robi pauzę. Teraz wracamy do gry.",
  "Pauza też jest częścią muzyki. A teraz czas na kolejny takt!",
  "Zaczynamy czystą kartkę: nowa passa, nowe nutki!",
  "Nie liczy się, ile razy zaczynasz, tylko że zaczynasz. Do dzieła!",
  "Pierwszy krok jest najważniejszy. Zrób dziś jedną lekcję i passa ruszy!",
  "Cieszę się, że jesteś! Zbudujmy nową, jeszcze dłuższą passę.",
  "Każda wielka passa miała swój dzień pierwszy. Ta zaczyna się dziś!",
  "Rozgrzewamy palce i uszy. Jedno ćwiczenie i już jest początek passy!",
  "Wracasz? Super! Zaczniemy spokojnie i krok po kroku.",
  "Zero wyrzutów, same nutki. Zaczynamy od nowa!",
  "Dzisiaj dzień pierwszy. Jutro dzień drugi. Tak się to zaczyna!",
  "Nowy start, nowy rytm. Dasz radę, a ja będę kibicować!",
  "Metronom już czeka. Zrób jedną lekcję i zacznij passę od nowa!",
  "Przerwa za nami, muzyka przed nami. Lecimy!",
  "Najlepszy moment na nową passę? Właśnie ten!",
  "Hej, nuto! Nie wstydź się wracać, tu zawsze jest dla Ciebie miejsce.",
  "Małe ćwiczenie dziś to początek wielkiej passy.",
  "Jeszcze nie ćwiczyliśmy dziś, więc zaczynajmy! Ja już jestem gotowy.",
];

const DAYS_PER_COMMENT = 3;
/** Coprime with 100, so successive 3-day slots jump around the list instead of walking it in order. */
const SLOT_STRIDE = 37;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dayNumber(dateISO: string): number {
  const [year, month, day] = dateISO.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

function daysLabel(count: number): string {
  return `${count} ${count === 1 ? "dzień" : "dni"}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** A step through the list that visits every line before repeating (coprime with its length) and jumps around instead of walking in order. */
function strideFor(length: number): number {
  return [37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].find((candidate) => gcd(candidate, length) === 1) ?? 1;
}

/** Soltek's streak comment for a given date: the same one for 3 days in a
 * row, then the next. `streakDays` fills in the `{dni}` placeholder and
 * leaves out lines that praise a longer streak than the player has; with no
 * streak (0) the comment is one of the "starting from the beginning" ones. */
export function streakComment(dateISO: string, streakDays: number): string {
  const slot = Math.floor(dayNumber(dateISO) / DAYS_PER_COMMENT);
  if (streakDays <= 0) return STREAK_RESTART_COMMENTS[(slot * 7) % STREAK_RESTART_COMMENTS.length];
  const eligible = STREAK_COMMENTS.filter((text) => streakDays >= (MIN_STREAK_DAYS[text] ?? 1));
  const text = eligible[(slot * strideFor(eligible.length)) % eligible.length];
  return text.replace("{dni}", daysLabel(Math.max(1, streakDays)));
}
