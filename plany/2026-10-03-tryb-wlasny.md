# Tryb własny: trening bez końca, statystyki słuchu i punkty

## Cel
Trzeci tryb obok Trybu zabawy i Trybu nauki: **Tryb własny**. Gracz sam wybiera, co ćwiczy (np. interwały, akordy, rytmy, dyktanda), jak trudno i jak długo, a zadania losują się same, więc się nie kończą. Do tego ekran „Twój słuch” (w czym jesteś dobry, w czym słaby) i gra na punkty (seria bez błędu, tryb na czas).

## Dlaczego
Dziś cała zawartość to ok. 20 godzin i po ok. 3 miesiącach nie ma po co wracać, a subskrypcja musi mieć powód, żeby trwać. Solfek ma być grą dla każdego, kto chce ćwiczyć słuch, nie tylko dla dzieci. Trening bez końca i statystyki to to, za co dorośli płacą w EarMaster i ToneGym.

## Założenia
- **Tryb własny ma własny postęp**, tak jak Tryb nauki: nie odblokowuje i nie kończy niczego w Trybie zabawy ani w Trybie nauki. Zapisujemy go w osobnym miejscu (nowy klucz w pamięci urządzenia) i dołączamy do synchronizacji z kontem.
- **Nie ruszamy** `lib/progression/resolveNodeState.ts`.
- **Zadania bierzemy z istniejących lekcji**, pogrupowane w tematy (np. „Interwały”, „Akordy”, „Rytm”). Część typów już losuje się przy każdym podejściu (dobór nut do interwałów i akordów, kolejność odpowiedzi), więc nie trzeba pisać nowej treści. Typy, które zawsze dają to samo zadanie (stałe sekwencje nut), będą w treningu tylko mieszane, a dopiero później można dopisać dla nich generator.
- **Poziomy trudności** korzystają z pola `difficulty`, które mają już wszystkie ćwiczenia.
- **Nagrody w treningu są ograniczone** (XP i nutki do dziennego limitu), żeby samym treningiem nie dało się przeskoczyć poziomów zdobywanych w grze. Wartość limitu ustalimy w kroku 5.
- **Dostęp:** tematy z krain 4–13 wymagają subskrypcji, tak jak dziś krainy. Tematy z krain 1–3 są darmowe.
- Tekst po polsku, prosty, bez „dziecięcego” tonu w menu treningu.

## Kroki

Każdy krok i każdy warunek „Gotowe, gdy” ma pole do odhaczenia (`- [ ]`).

### Krok 1. Dodać trzeci tryb: przełącznik i pusty ekran
- [ ] Rozszerzyć stan widoku w `context/PlanContext.tsx` z `"fun" | "plan"` o `"own"` (zapis i wczytanie starych zapisów nadal działają).
- [ ] Dodać trzeci segment „Tryb własny” w `components/plan/ModeSwitch.tsx` (z ikoną, zmieści się na telefonie przy 3 segmentach).
- [ ] Dodać w `app/(main)/map.tsx` ekran Trybu własnego z krótkim opisem i przyciskiem „Wybierz trening” (na razie nic nie robi).
- [ ] Dodać klucz w `lib/storage.ts` i nowy kontekst `context/TrainingContext.tsx` z własnym, pustym stanem (statystyki, rekordy), wpiętym w zerowanie danych przy nowym koncie (`lib/sync/localDataReset.ts`).

Gotowe, gdy:
- [ ] Na mapie są trzy przełączane tryby, wszystkie etykiety mieszczą się na telefonie (375 px).
- [ ] Stary zapis gracza (z `view: "fun"` lub `"plan"`) wczytuje się bez błędu.
- [ ] `npx tsc --noEmit` i `npx jest` bez błędów.

Jak sprawdzić:
- Uruchomić podgląd w przeglądarce (widok telefonu), przełączyć na wszystkie trzy tryby, odświeżyć stronę i zobaczyć, że wybrany tryb zostaje.

### Krok 2. Zrobić katalog tematów treningu i menu wyboru
- [ ] Nowy plik `lib/training/topics.ts`: lista tematów (np. „Wysokość i kierunek”, „Rytm i metrum”, „Interwały”, „Akordy”, „Tonacje”, „Dyktanda”, „Solfeż”) z zestawem ćwiczeń z istniejących lekcji, pogrupowanych po typie i `difficulty`.
- [ ] Test sprawdzający, że każdy temat ma ćwiczenia na co najmniej 3 poziomach trudności i że żaden temat nie jest pusty.
- [ ] Menu wyboru: temat (można zaznaczyć kilka), trudność (łatwo / średnio / trudno / mieszane), długość sesji (10 zadań / 20 zadań / bez końca).
- [ ] Oznaczyć tematy z krain 4–13 jako płatne (nieaktywne bez subskrypcji, z kłódką i odesłaniem do cennika).

Gotowe, gdy:
- [ ] Wybranie tematu, trudności i długości pokazuje podsumowanie „co będziesz ćwiczyć”.
- [ ] Test katalogu przechodzi, a nowy temat nie da się dodać bez ćwiczeń.

Jak sprawdzić:
- Test jednostkowy katalogu oraz kliknięcie przez menu w przeglądarce, także na koncie bez subskrypcji (płatne tematy mają kłódkę).

### Krok 3. Zrobić sesję treningową (zadania bez końca)
- [ ] Nowy ekran `app/(main)/training/[...]` (lub podobny), który losuje ćwiczenie z wybranych tematów i pokazuje je tym samym ekranem co lekcja (wydzielić wspólną część z `app/(main)/lesson/[lessonId].tsx`, bez zmiany zachowania lekcji).
- [ ] Unikać powtarzania tego samego zadania pod rząd (użyć istniejącego mechanizmu `exclude` z `generateExercise`).
- [ ] Przyciski: „Sprawdź”, „Dalej”, „Zakończ trening”. Po zakończeniu pokazać krótkie podsumowanie (ile poprawnych, które tematy najlepiej i najsłabiej).
- [ ] Wynik nie zapisuje niczego w postępie map ani planu.

Gotowe, gdy:
- [ ] Można grać „bez końca” i przejść ponad 30 zadań z rzędu bez błędu aplikacji i bez dwóch identycznych zadań pod rząd.
- [ ] Po treningu lista ukończonych lekcji w Trybie zabawy i w Trybie nauki jest taka sama jak przed (sprawdzić w pamięci przeglądarki).
- [ ] Testy lekcji (`lesson`) nadal przechodzą bez zmian.

Jak sprawdzić:
- Przejść w podglądzie ok. 30 zadań z różnych tematów, potem porównać zapis postępu przed i po (`localStorage`).

### Krok 4. Ekran „Twój słuch”
- [ ] Po każdej odpowiedzi w treningu zapisać w `TrainingContext` wynik per temat i typ ćwiczenia (poprawne/wszystkie, ostatnie 7 dni oddzielnie).
- [ ] Nowy ekran „Twój słuch”: pasek skuteczności per temat (np. „Interwały 78%”), najsłabszy temat wyróżniony, krótki tekst „co poćwiczyć”.
- [ ] Przycisk „Ćwicz najsłabsze”, który uruchamia trening z 2–3 najsłabszymi tematami (minimum 10 odpowiedzi w temacie, żeby statystyka coś znaczyła).
- [ ] Dopisać scalanie statystyk do synchronizacji z kontem (suma poprawnych i wszystkich, najlepsze rekordy), z testem w `lib/sync/mergeState.test.ts`.

Gotowe, gdy:
- [ ] Po 20 odpowiedziach ekran pokazuje poprawne procenty (test jednostkowy z przykładowymi danymi).
- [ ] „Ćwicz najsłabsze” wybiera właściwe tematy.
- [ ] Zalogowanie na drugim urządzeniu scala statystyki i nic się nie gubi.

Jak sprawdzić:
- Testy jednostkowe dla liczenia i scalania, a w przeglądarce celowo pomylić się w jednym temacie i zobaczyć go jako najsłabszy.

### Krok 5. Dodać punkty: seria bez błędu i tryb na czas
- [ ] Dwa warianty sesji: „Seria” (liczy poprawne z rzędu, koniec po pierwszym błędzie lub przy 3 błędach) i „Na czas” (60 sekund, liczy poprawne).
- [ ] Rekordy per wariant zapisane w `TrainingContext` i pokazane na ekranie Trybu własnego.
- [ ] Nagrody za trening: XP i nutki z dziennym limitem (ustalić wartość limitu z użytkownikiem przed kodowaniem); w grze nie dać więcej niż ułamek tego, co daje lekcja z mapy.
- [ ] Mała misja dnia „Zrób trening” (używa istniejącego `dailyMissions.ts`), tak żeby wchodziła w rotację razem z innymi.

Gotowe, gdy:
- [ ] Rekord się zapisuje, tylko gdy jest lepszy od poprzedniego, i przeżywa odświeżenie strony.
- [ ] Dzienny limit nagród działa (po przekroczeniu XP i nutki się nie zwiększają, a komunikat to wyjaśnia).
- [ ] Testy misji dnia przechodzą (`dailyMissions.test.ts`), a nowa misja nie psuje reguł rotacji.

Jak sprawdzić:
- Testy jednostkowe limitu i rekordu oraz ręczna gra „Na czas” w przeglądarce (60 s, wynik zapisany, odświeżenie nie kasuje rekordu).

### Krok 6. Dopracować, wdrożyć i poinformować gracza
- [ ] Dodać Tryb własny do samouczka (`lib/guide/guideSteps.ts`, test w `guideSteps.test.ts`) i do opisu zasad (`rulesText.ts`).
- [ ] Zaktualizować opis w cenniku („Trening bez końca z własnymi ustawieniami i statystykami słuchu”).
- [ ] Przejść cały tryb w widoku telefonu i na komputerze, w jasnym i ciemnym motywie, na koncie bez subskrypcji i z subskrypcją.
- [ ] `npx tsc --noEmit`, `npx jest`, `npx expo export --platform web --clear`, dopiero potem commit (wdrożenie dopiero po wyraźnym „wdróż”).

Gotowe, gdy:
- [ ] Wszystkie testy i kontrola typów są czyste.
- [ ] Samouczek omawia trzy tryby, a cennik wspomina o treningu.
- [ ] Obejście logowania użyte do podglądu nie trafiło do commita.

Jak sprawdzić:
- Pełny przegląd w podglądzie lokalnym i `git diff` przed commitem (bez zmian w `app/index.tsx` i `app/(main)/_layout.tsx`).

## Nie teraz
- Nowe generatory zadań dla typów, które dziś mają stałą treść (to osobny, większy kawałek pracy).
- Ligi i tablica wyników między graczami (potrzebują serwera i osobnego planu).
- Melodie z prawdziwych piosenek i granie do mikrofonu poza solfeżem.
- Sklep Solfka (ubranka za nutki).
- Raport dla rodzica, plan rodzinny i tryb dla nauczyciela.
- Opcja „dorosłego” wyglądu aplikacji.

## Najmniejszy sensowny efekt
Kroki 1–3: trzeci tryb, menu wyboru tematów i sesja bez końca. Już to daje graczowi powód, żeby wracać po skończeniu lekcji, i nie wymaga nowej treści.
