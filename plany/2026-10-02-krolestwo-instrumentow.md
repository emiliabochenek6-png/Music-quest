# Królestwo Instrumentów — nowa kraina (ok. 100 ćwiczeń)

## Cel
Nowa, 4. kraina na mapie, między Przystanią Taktów a Pasmem Interwałów:
**Królestwo Instrumentów**. Dziecko poznaje instrumenty orkiestry: rodziny
(smyczki, drewniane, blaszane, perkusja, klawiszowe i szarpane), jak się na
nich gra, które brzmią wysoko, a które nisko, i jak wygląda orkiestra.
Docelowo ok. 100 ćwiczeń w 10 lekcjach, w tym lekcja bossa.

## Dlaczego
Plan rozbudowy zakładał nową krainę o instrumentach (patrz
`plany/2026-09-26-rozbudowa-krain.md`, „Świat Instrumentów"). Dodaje ok. 100
ćwiczeń, czyli ok. 2 tygodnie grania, i jest lżejszą odmianą po
Przystani Taktów i przed Pasmem Interwałów.

## Co już jest zrobione (2026-10-02)
- [x] Kraina dodana do `data/worlds.ts` (id `krolestwo-instrumentow`, order 4,
      kolor koralowy `#E76F51`). Kolejne krainy przesunęły się o jedno miejsce
      (Pasmo Interwałów jest teraz 5., Zaczarowany Solfeż 13.).
- [x] Nazwa i opis po polsku w `data/i18n/pl.json`.
- [x] **Ikonka krainy:** skrzypce z koroną i smyczkiem w stylu reszty ikon
      (`kraina_krolestwo_instrumentow` w `components/icons/icons.ts`, podpięta
      w `components/map/WorldNode.tsx`).
- [ ] Bez lekcji: kraina pokazuje na razie ekran zastępczy „oznacz jako ukończoną".
      **Nie wypychać na stronę, dopóki nie ma przynajmniej pierwszych lekcji.**

## Założenia
- Ćwiczenia opierają się na **istniejącym typie `key-fact-choice`** (pytanie,
  podpowiedź, 2–4 odpowiedzi, wyjaśnienie po sprawdzeniu) — nie trzeba nowego
  mechanizmu. Dla „wysoko/nisko" używamy `pitch-height-choice` (dźwięki fortepianu).
- Treść jest **dla młodszych**: na początku 2–3 odpowiedzi, krótkie pytania,
  wyjaśnienie po każdej odpowiedzi, żadnych terminów bez objaśnienia.
- **Obrazki instrumentów:** emoji tam, gdzie istnieją (🎻 🎺 🎷 🥁 🎹 🪕 🪗 🪈 🎸),
  a przy pozostałych (wiolonczela, kontrabas, obój, klarnet, fagot, róg, puzon,
  tuba, harfa, kotły, ksylofon) pytanie opisuje instrument słowami. Narysowanie
  pełnego zestawu ilustracji to osobna, opcjonalna praca (Krok 6).
- **Brzmienie instrumentów:** aplikacja ma dziś tylko dźwięki fortepianu.
  Ćwiczenia „rozpoznaj po brzmieniu" wymagają nagrań i są w planie jako
  osobny, opcjonalny krok (Krok 7), więc 100 ćwiczeń nie zależy od nagrań.
- Dostęp do krainy: płatna, jak inne od 4. wzwyż (blokady są teraz wyłączone w
  `resolveNodeState.ts`, którego nie ruszam bez Twojej zgody).

## Spis lekcji (ok. 100 ćwiczeń)

| # | Lekcja | Ćwiczeń | O czym |
|---|---|---|---|
| 1 | Witaj w orkiestrze | 10 | co to orkiestra, dyrygent, cztery rodziny |
| 2 | Smyczki | 14 | skrzypce, altówka, wiolonczela, kontrabas, harfa |
| 3 | Drewniane dęte | 13 | flet, obój, klarnet, fagot, saksofon |
| 4 | Blaszane dęte | 13 | trąbka, róg, puzon, tuba |
| 5 | Perkusja | 14 | kotły, werbel, talerze, trójkąt, ksylofon |
| 6 | Klawisze i struny szarpane | 14 | fortepian, organy, akordeon, gitara |
| 7 | Wysoko czy nisko? | 10 | mały = wysoko, duży = nisko; kolejność instrumentów |
| 8 | Jak się na tym gra? | 10 | smyczek, dmuchanie, uderzanie, szarpanie, klawisze |
| 9 | Orkiestra na scenie | 10 | kto gdzie siedzi, partytura, kwartet, solista, chór |
| 10 | Boss krainy: mieszanka | 10 | pytania ze wszystkich lekcji |
| | **Razem (faktycznie)** | **119** | w tym 21 quizów ABCD i 23 ćwiczenia z nagraniem |

## Kroki

### Krok 1. Wspólne ustalenia przed pisaniem treści ✅ ustalone 2026-10-02
- [x] Boss: dostarcza Emilia (ilustracja bossa i tło, tak jak dla Szczytu Dyktand i Solfeża)
- [x] Rysujemy zestaw ilustracji instrumentów (Krok 6)
- [x] Dokładamy ćwiczenia z nagraniami (Krok 7)

Gotowe, gdy:
- [x] Znamy odpowiedzi na te trzy pytania

Jak sprawdzić:
- Wystarczy Twoja odpowiedź w rozmowie

### Krok 2. Lekcje 1–3 (32 ćwiczenia) — rodziny, smyczki, drewniane ✅ zrobione 2026-10-02
- [x] Nowy plik `data/lessons/krolestwo-instrumentow.ts` z lekcjami 1–3 i slajdami
      „Zapoznaj się" (krótkie, proste, z emoji)
- [x] Wpis krainy w `data/lessons/index.ts` (zniknie ekran zastępczy)
- [x] Test (wzór: `data/lessons/zaczarowany-solfez.test.ts`): numeracja lekcji bez
      dziur, w każdym pytaniu poprawny numer odpowiedzi, nie powtarzają się pytania

Gotowe, gdy:
- [x] Kraina otwiera się na mapie i da się przejść lekcje 1–3
- [x] Każde ćwiczenie ma wyjaśnienie po sprawdzeniu, a pytania mają 2–4 odpowiedzi
- [x] `npx tsc --noEmit` i `npx jest` bez błędów

Jak sprawdzić:
- Lokalny podgląd (workflow z `CLAUDE.md`): wejść w krainę i przejść jedną lekcję

### Krok 3. Lekcje 4–6 (30 ćwiczeń) — blaszane, perkusja, klawisze i szarpane ✅ zrobione 2026-10-02
- [x] Dopisać lekcje 4–6

Gotowe, gdy:
- [x] Kraina ma 6 lekcji, ok. 62 ćwiczeń, testy przechodzą

Jak sprawdzić:
- Testy plus podgląd lokalny

### Krok 4. Lekcje 7–9 (30 ćwiczeń) — wysoko/nisko, jak się gra, orkiestra ✅ zrobione 2026-10-02
- [x] Dopisać lekcje 7–9; w lekcji 7 użyć też `pitch-height-choice` (dźwięki fortepianu: dwa
      niskie i dwa wysokie dźwięki w zakresie C3–C6)

Gotowe, gdy:
- [x] Kraina ma 9 lekcji, ok. 92 ćwiczeń, testy przechodzą

Jak sprawdzić:
- Testy plus podgląd lokalny; w lekcji 7 sprawdzić, że dźwięki w ogóle grają

### Krok 5. Lekcja 10 — boss i wykończenie (10 ćwiczeń) ✅ zrobione 2026-10-02
- [x] Lekcja bossa (`isBoss`) z mieszanką pytań z lekcji 1–9, bez powtórzeń z poprzednich lekcji
- [x] Tło krainy i portret bossa po dostarczeniu ilustracji (rejestr `WORLD_BACKGROUNDS` i
      `bossPortraits.ts`, jak przy Solfeżu)

Gotowe, gdy:
- [x] Kraina ma ok. 102 ćwiczeń, na mapie widać bossa, wszystko przechodzi w podglądzie

Jak sprawdzić:
- Testy, podgląd lokalny, potem dopiero wdrożenie (tylko na Twoją prośbę)

### Krok 6. Ilustracje instrumentów ✅ zrobione 2026-10-02
- [x] Zestaw prostych ikon ok. 24 instrumentów (gotowe: skrzypce, wiolonczela, kontrabas, harfa, flet, obój,
      klarnet, fagot, saksofon, dyrygent, trąbka, werbel; do narysowania: róg, puzon, tuba, kotły, talerze,
      trójkąt, ksylofon, fortepian, organy, akordeon, gitara) (styl jak ikony krain), pokazywanych przy pytaniach
      zamiast samych emoji

Gotowe, gdy:
- [x] Pytania „co to za instrument?" pokazują obrazek

Jak sprawdzić:
- Podgląd lokalny, jedna lekcja ze zdjęciami instrumentów

### Krok 7. (opcjonalny) Ćwiczenia „rozpoznaj po brzmieniu" ✅ zrobione 2026-10-02
- [x] Nagrania (po jednym krótkim dźwięku i krótkiej frazie na instrument, ok. 12 instrumentów) —
      dostarczasz Ty albo ustalamy darmowe, wolne od praw źródło, a ja pytam o zgodę przed
      pobraniem czegokolwiek
- [x] Do `key-fact-choice` dochodzi opcjonalne pole z nagraniem (tak jak `referenceAudioSource`
      w ćwiczeniach rytmicznych), 🔊 odtwarza je w pytaniu
- [x] Ok. 10 nowych pytań „Który instrument słyszysz?" rozłożonych po lekcjach 2–6

Gotowe, gdy:
- [x] W lekcjach 2–6 są pytania z przyciskiem 🔊 i prawdziwym brzmieniem instrumentu

Jak sprawdzić:
- Podgląd lokalny, przycisk 🔊 gra właściwy instrument

## Przykładowe pytania (żeby było jasne, jaki to poziom)

- **L1:** „W orkiestrze gra wiele instrumentów. Kto pokazuje im, kiedy zacząć i jak szybko grać?" → dyrygent (dyrygent / solista / widz).
- **L2:** „Które z nich jest największe i brzmi najniżej?" → kontrabas (skrzypce / wiolonczela / kontrabas).
- **L2:** „Jak nazywa się szarpanie strun palcami zamiast grania smyczkiem?" → pizzicato.
- **L3:** „Flet i klarnet to instrumenty…" → drewniane dęte (smyczkowe / drewniane dęte / blaszane).
- **L3:** „Saksofon jest zrobiony z metalu. Do jakiej rodziny należy?" → do drewnianych dętych, bo gra się na nim przez stroik.
- **L4:** „Który z blaszanych instrumentów ma suwak?" → puzon (trąbka / puzon / tuba).
- **L5:** „Który z nich ma wysokość dźwięku i można zagrać na nim melodię?" → ksylofon (werbel / trójkąt / ksylofon).
- **L7:** „Który instrument zagra wyżej?" → skrzypce (skrzypce / kontrabas).
- **L8:** „Jak gra się na trąbce?" → dmuchając w ustnik i naciskając wentyle.
- **L9:** „Ile osób gra w kwartecie smyczkowym?" → cztery.

## Nie teraz
- Nowy typ ćwiczenia. Wszystko robimy istniejącymi typami (`key-fact-choice`, `pitch-height-choice`).
- Ćwiczenia z nutami instrumentów transponujących, kluczami altowym i basowym (osobny, trudniejszy temat).
- Zmiana zasad odblokowywania krain (`resolveNodeState.ts`) — wymaga Twojej zgody.
- Uzupełnianie pozostałych krain do 150 ćwiczeń — osobny plan.

## Najmniejszy sensowny efekt
Kroki 1–2: kraina na mapie z trzema pierwszymi lekcjami (ok. 32 ćwiczenia: rodziny,
smyczki, drewniane), które można przejść.

## Do ustalenia (nie blokuje Kroku 2)
- Kto jest bossem i czy dostarczysz ilustrację bossa oraz tło tak jak przy Solfeżu?
- Czy robimy ilustracje instrumentów i ćwiczenia z nagraniami (Kroki 6–7)?
