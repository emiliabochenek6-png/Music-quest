# Przebudowa Zaczarowanego Solfeżu (nauka solfeżu bez przymusu mikrofonu)

## Cel
Kraina **Zaczarowany Solfeż** (świat 12 na mapie) zostaje tam, gdzie jest, bez
żadnej nowej zakładki w menu. W środku dostaje nowe lekcje „na słuch", które
da się przejść **bez mikrofonu**, a śpiewanie do przewijanych nut i mikrofon
stają się dodatkowymi przełącznikami, nie warunkiem przejścia.

## Dlaczego
Dziś Solfeż to 7 poziomów, w których każde ćwiczenie wymaga mikrofonu, a nie
każdy śpiewa czysto i mikrofon bywa kapryśny. Wzorem jest aplikacja ze zrzutu
ekranu: ćwiczenie to konkretna fraza na pięciolinii, a pomoce (odsłuch, wolne
tempo, podkład, mikrofon) włącza się i wyłącza osobno.

## Założenia
- Zostajemy przy solfeżu **stałego „do"** (do = C) i **samych białych klawiszach**
  (tak jak dziś, patrz `lib/music/solfege.ts`). Bez krzyżyków i bemoli.
- **Żadnych zmian w dolnym menu ani w mapie.** Dostęp do krainy (płatna, po
  ukończeniu krainy 11) zostaje taki, jak dziś, więc nie dotykam
  `lib/progression/resolveNodeState.ts`.
- Obecne 7 poziomów zostaje z tymi samymi id, więc zapisane postępy się nie psują.
  Nowe lekcje „na słuch" wchodzą **przed** nimi.
- Nowa treść spełnia zasadę „dla młodszych": mało przycisków na początek
  (2, potem 3, potem 5, potem 7), nieograniczone powtarzanie dźwięku, małe skoki trudności.

## Kroki

### Krok 1. Nowy typ ćwiczenia „usłysz i wskaż sylabę" (bez mikrofonu) ✅ zrobione 2026-10-02
- [x] Dopisać typ `solfege-syllable-choice` w 4 miejscach wzorca:
      `types/exercises.ts`, `lib/questions/generate.ts`, `lib/questions/validate.ts`,
      `components/exercises/ExerciseRenderer.tsx` + nowy komponent
      `SolfegeSyllableChoiceExercise.tsx`
- [x] Przebieg: gra się krótkie tło tonalne (akordy C–F–G–C przez `playChordSequence`),
      potem **jedna nuta** (w późniejszych lekcjach 2-3 nuty po kolei); gracz wybiera
      sylabę z przycisków do/re/mi/fa/sol/la/si
- [x] „Posłuchaj jeszcze raz" bez limitu; podpowiedź: pianino (istniejące `PianoKeyboardRecap`)
- [x] Nuty tylko w zakresie C4–C5 (mieszczą się w próbkach audio C3–C6)

Gotowe, gdy:
- [x] Ćwiczenie generuje się z zakresu nut i nie powtarza nuty w obrębie jednego podejścia
- [x] Poprawna/błędna odpowiedź jest oceniana (testy w `lib/questions`)
- [x] Na ekranie nie ma żadnego pytania o mikrofon

Jak sprawdzić:
- `npx jest` (nowe testy), `npx tsc --noEmit`, ręcznie w lokalnym podglądzie jedno ćwiczenie od początku do końca

### Krok 2. Cztery nowe lekcje „na słuch" na początku krainy ✅ zrobione 2026-10-02 (24 ćwiczenia: 6+6+6+6, nie 23)
- [x] Wstawić na początek `data/lessons/zaczarowany-solfez.ts` cztery lekcje
      (id zaczynają się od `zs-sluch-…`):
  1. **Dom: dźwięk „do"** — 5 ćw., wybór z 2 sylab (do / sol)
  2. **do–re–mi** — 6 ćw., wybór z 3 sylab
  3. **Pięć pierwszych: do–sol** — 6 ćw., wybór z 5 sylab
  4. **Cała gama** — 6 ćw., 7 sylab, na końcu dwie krótkie frazy z 2-3 nut
- [x] Krótkie, proste slajdy wstępne („Najpierw słuchamy, potem śpiewamy") i
      `pianoKeyboardReference` jak w dzisiejszych lekcjach
- [x] Zaktualizować komentarz na górze pliku (opis krainy nie może twierdzić, że każde ćwiczenie czyta mikrofon)

Gotowe, gdy:
- [x] Kraina ma 11 lekcji (4 nowe + 7 obecnych), pierwsze 4 da się zrobić bez mikrofonu
- [x] Trudność rośnie stopniowo (2 → 3 → 5 → 7 przycisków), nic nie powtarza się w lekcji
- [x] Id obecnych 7 lekcji są niezmienione

Jak sprawdzić:
- `npx tsc --noEmit`, `npx jest`, przejście pierwszej lekcji w lokalnym podglądzie;
  liczenie ćwiczeń: `grep -o 'spec: {' data/lessons/zaczarowany-solfez.ts | wc -l`

### Krok 3. Pasek pomocy w ćwiczeniach śpiewania (jak na zrzucie) ✅ zrobione 2026-10-02 (bez przełącznika 🎹 i ⏮ — patrz notatka niżej)
- [x] Mały wspólny pasek: 🐌 wolne tempo, 🎤 mikrofon włącz/wyłącz, 🎹 podkład (dźwięki nut
      przy odtwarzaniu), ⏮ od początku — używany w `SolfegePhraseSingingExercise`
- [x] Wybór zapamiętany na urządzeniu (jak inne ustawienia dźwięku w `ProfileContext`)
- [x] **Mikrofon wyłączony albo brak zgody** → ćwiczenie nie blokuje: zamiast ślepej uliczki
      gracz widzi nuty, słucha frazy i może oznaczyć „zaśpiewałem/am" (bez oceny)

Gotowe, gdy:
- [x] Lekcje ze śpiewaniem (stare poziomy 1-7) da się ukończyć z wyłączonym mikrofonem
- [x] Ślimak faktycznie spowalnia odtwarzanie frazy (np. do 60% tempa)
- [x] Ustawienia pamiętają się po ponownym wejściu

Jak sprawdzić:
- Lokalny podgląd z odmówioną zgodą na mikrofon i z wyłączonym przełącznikiem; `npx jest`, `npx tsc --noEmit`

Uwaga: zrezygnowałem z przełącznika 🎹 „podkład" i przycisku ⏮ — podkład grający pod mikrofonem psułby wykrywanie głosu, a 🔊 i tak gra frazę od początku.

### Krok 4. Tryb „śpiewaj do przewijanych nut" (opcjonalny)
- [ ] W ćwiczeniach z rytmem (stare poziomy 2-3) dodać widok, w którym nuty przesuwają się
      w stronę stałej linii „teraz" w tempie frazy, po odliczeniu; korzysta z istniejących
      `webLiveRecorder.ts` i `pitchDetection.ts`
- [ ] **Łagodna ocena:** nuta liczy się, gdy trafisz w nią choćby przez część jej czasu
      (obecna tolerancja i składanie oktaw), bez odejmowania serc za rytm w tym trybie
- [ ] Włączany przełącznikiem z paska (Krok 3); domyślnie wyłączony

Gotowe, gdy:
- [ ] Z włączonym trybem nuty płynnie się przesuwają, bieżąca świeci
- [ ] Z wyłączonym mikrofonem tryb działa jako „słuchaj i śledź nuty"
- [ ] Ocena jest wyraźnie łagodniejsza niż w zwykłym trybie (test na przykładowym nagraniu)

Jak sprawdzić:
- Lokalny podgląd z oscylatorem zamiast mikrofonu (wzór z `CLAUDE.md`, nuta oktawę wyżej); `npx jest`

### Krok 5. Sprawdzenie całości
- [ ] `npx tsc --noEmit` i `npx jest` bez błędów; `npx expo export --platform web --clear` się buduje
- [ ] Przejście krainy: lekcja na słuch → lekcja ze śpiewaniem z mikrofonem i bez
- [ ] Commit (bez wypychania, dopóki nie poprosisz)

Gotowe, gdy:
- [ ] Wszystkie powyższe kroki odhaczone, zmiany są w commitach

Jak sprawdzić:
- Wynik testów i lokalny podgląd, link do podglądu na końcu odpowiedzi

## Nie teraz
- Nowa zakładka w dolnym menu (świadomie zrezygnowaliśmy).
- Nowe tonacje i półtony (krzyżyki/bemole, tryb molowy) — osobny, większy temat.
- Solfeż ruchomego „do" (movable-do).
- Prawdziwe nagrania głosu zamiast pianina i biblioteka znanych utworów jak w aplikacji ze zrzutu.
- Rozszerzanie krainy do 150 ćwiczeń — najpierw przebudowa, potem liczby.
- Zmiana zasad odblokowania krainy (wymaga zgody na ruszenie `resolveNodeState.ts`).

## Najmniejszy sensowny efekt
Kroki 1-2: cztery lekcje „na słuch" na początku krainy, które da się przejść bez mikrofonu.
