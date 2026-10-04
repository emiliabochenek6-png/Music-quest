# Poprawki po testach E2E i przeglądzie gry

## Cel
Zamienić to, co pokazały testy i automatyczny przegląd gry, w konkretne poprawki: uruchomić oba testy na prawdziwym koncie, znaleźć i usunąć błąd #418 na ekranach głównych, uodpornić testy na okno awansu, skrócić okna powitalne nowego gracza i dołożyć szybki test „czy wszystkie ekrany się otwierają”.

## Dlaczego
Przegląd (208 lekcji i 13 ekranów) nie znalazł niczego, co by blokowało grę. Zostały trzy konkretne sprawy: błąd w konsoli na ekranach głównych, testy, które po kilkunastu biegach mogą się wywrócić (okno awansu), i zbyt wiele okien na wejściu. To tanie poprawki, a chronią główną ścieżkę gracza.

## Założenia
- **Błąd #418** to komunikat Reacta: „strona wczytana z serwera wygląda inaczej niż ta, którą składa przeglądarka” (inaczej: gra na chwilę składa się dwa razy). Widziałem go na wszystkich ekranach z logowaniem, ale w **mojej testowej wersji z obejściem logowania**, więc nie wiem jeszcze, czy występuje na prawdziwej stronie. Krok 2 to sprawdza.
- Przy 208 lekcjach „zatrzymanie” automatu na ćwiczeniach z rytmem, śpiewem czy budowaniem interwałów to **ograniczenie bota, nie błąd gry**, więc tego nie naprawiamy.
- Konto testowe uruchamia Emilia (ja nie loguję się do Supabase). Hasło zostaje w `.env.test`.
- Zmiany w wyglądzie lub zachowaniu gry (krok 4) wprowadzam dopiero po akceptacji Emilii; nic nie wdrażam bez „wdróż”.
- `lib/progression/resolveNodeState.ts` zostaje nietknięty.

## Kroki

Każdy krok i każdy warunek „Gotowe, gdy” ma pole do odhaczenia (`- [ ]`).

### Krok 1. Uruchomić oba testy na prawdziwym koncie (robi Emilia)
- [x] `cd ~/Desktop/Claude/master-quest-mobile && npm run test:e2e`.
- [x] Wkleić mi wynik (bez hasła). Test zakupu w sklepie nie był jeszcze uruchomiony z prawdziwym logowaniem, więc może wymagać poprawek.

Gotowe, gdy:
- [x] Wynik pokazuje `2 passed`, albo znam dokładny komunikat błędu każdego testu, który się wywrócił.

Jak sprawdzić:
- Wynik polecenia w terminalu.

### Krok 2. Sprawdzić, czy błąd #418 jest na prawdziwej stronie
- [x] Dopisać do obu testów zbieranie błędów strony (`pageerror`) i wypisywanie ich w wyniku.
- [x] Uruchomić (Emilia) i zobaczyć, czy po zalogowaniu na mapie, w sklepie i na ekranie lekcji pojawia się #418. (Wynik: błąd jest, raz na test, z ekranu startowego „/”.)
- [x] Jeśli tak: odczytać pełną treść błędu (wersja nieskompresowana), znaleźć element, który inaczej wygląda na serwerze i w przeglądarce (podejrzani: ekran ładowania zależny od rozmiaru okna, daty „dzisiaj” liczone przy budowaniu strony, dane z pamięci przeglądarki), i naprawić.

Gotowe, gdy:
- [x] Wiem, czy #418 występuje na prawdziwej stronie, a jeśli tak, to znika po poprawce (testy wypisują zero błędów strony).
- [ ] `npx tsc --noEmit` i `npx jest` bez błędów.

Jak sprawdzić:
- Wynik testów E2E (sekcja błędów strony) i lokalny podgląd mapy w konsoli przeglądarki.

### Krok 3. Uodpornić test na okno awansu
- [ ] Sprawdzić, jak wygląda okno awansu na wyższy level (pełnoekranowe co 5. level i mały baner w pozostałych) i jak je zamknąć.
- [ ] Dołożyć do testów zamykanie tego okna (jeśli się pojawi), żeby test nie wywracał się, gdy konto testowe przejdzie na kolejny level.
- [ ] Zasymulować: ustawić na koncie testowym XP tuż przed progiem awansu (tak jak resetuje sklep) i uruchomić test.

Gotowe, gdy:
- [ ] Test pierwszej lekcji przechodzi także wtedy, gdy +10 XP wywołuje awans na level.

Jak sprawdzić:
- Uruchomić test z przygotowanym kontem tuż przed awansem.

### Krok 4. Skrócić okna powitalne nowego gracza (zmiana w grze, po akceptacji)
- [ ] Zaproponować Emilii prostszy wariant: jedno okno powitalne z wyborem „Zrób test” / „Zacznij od gry”, a przewodnik po grze pokazywany dopiero po pierwszej ukończonej lekcji.
- [ ] Po akceptacji zmienić kolejność okien (powitanie Solfka, wybór trybu, przewodnik), zaktualizować testy (`closeIntroWindows`) i test przewodnika (`guideSteps.test.ts`).
- [ ] Sprawdzić w podglądzie na telefonie, że nowy gracz widzi najwyżej jedno okno przed pierwszą lekcją.

Gotowe, gdy:
- [ ] Nowy gracz (czyste konto) zaczyna lekcję po jednym oknie, a przewodnik pojawia się po pierwszej lekcji.
- [ ] Testy E2E, `npx jest` i `npx tsc --noEmit` bez błędów.

Jak sprawdzić:
- Przejście jako nowy gracz w podglądzie (telefon) i uruchomienie testów.

### Krok 5. Dołożyć szybki test „wszystkie ekrany i lekcje otwierają się”
- [ ] Zamienić jednorazowy przegląd na stały test `e2e/smoke.spec.ts`: po zalogowaniu otwiera 13 głównych ekranów i po jednej lekcji z każdej krainy; sprawdza brak błędów strony i poziomego przewijania (na telefonie).
- [ ] Dopisać opis w `CLAUDE.md` (co sprawdza, ile trwa).

Gotowe, gdy:
- [ ] `npm run test:e2e` przechodzi w całości (trzy testy) w mniej niż kilka minut.
- [ ] Opis w `CLAUDE.md` jest aktualny.

Jak sprawdzić:
- Uruchomić `npm run test:e2e` i przeczytać opis.

### Krok 6. Zapisać, sprawdzić i (po „wdróż”) wdrożyć
- [ ] `npx tsc --noEmit`, `npx jest`, komplet testów E2E.
- [ ] Commit; wdrożenie dopiero po wyraźnym „wdróż”, z potwierdzeniem, że `musicquest.pl` i `solfek.pl` pokazują nową wersję.

Gotowe, gdy:
- [ ] Wszystkie testy zielone; zmiany na GitHubie; obie domeny działają.

Jak sprawdzić:
- Wynik poleceń i sprawdzenie nowego pliku aplikacji na obu adresach.

## Nie teraz
- Dalsze testy ścieżek (Tryb nauki, płatności, test poziomujący).
- Automatyczne uruchamianie testów na GitHubie po każdym wdrożeniu (potrzebuje bezpiecznego miejsca na hasło).
- Odchudzanie głównego pliku aplikacji (4 MB): osobny, techniczny plan (podział kodu).
- Nowe funkcje z recenzji gry (Tryb własny, statystyki słuchu, mini-gry, ubiór Solfka poza sklepem).
- Pełne ręczne przejście wszystkich 1417 ćwiczeń (rytm, śpiew, budowanie interwałów).

## Najmniejszy sensowny efekt
Kroki 1–2: wiemy, że oba testy działają na prawdziwym koncie i czy błąd #418 jest na prawdziwej stronie. To rozstrzyga, czy cała reszta jest potrzebna.
