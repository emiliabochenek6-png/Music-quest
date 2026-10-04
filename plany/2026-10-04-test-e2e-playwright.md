# Test E2E w Playwright: logowanie, pierwsza lekcja, +10 XP

## Cel
Jeden automatyczny test „jak prawdziwy gracz” w przeglądarce: loguje się kontem testowym do Solfka, wchodzi w pierwszą lekcję, klika poprawną odpowiedź i sprawdza, że XP wzrosło o 10. Uruchamia się jednym poleceniem.

## Dlaczego
Dziś sprawdzamy aplikację ręcznie w podglądzie. Taki test w 30 sekund pokaże, czy po zmianie nic nie zepsuło głównej ścieżki gracza (logowanie → lekcja → punkty).

## Założenia
- **Konto testowe zakłada Emilia**, w panelu Supabase (Authentication → Users → Add user, z zaznaczonym „Auto Confirm User”). Nie zakładam go ani nie loguję się nim sam, bo to prawdziwa usługa w internecie; pierwszy bieg testu też robi Emilia u siebie.
- **Hasło nigdy nie trafia do repozytorium.** Dane konta (`TEST_EMAIL`, `TEST_PASSWORD`) leżą w lokalnym pliku `.env.test`, który dopisuję do `.gitignore` (dziś ignorowane są tylko `.env` i `.env.local`).
- **Pierwsze ćwiczenie pierwszej lekcji jest zawsze to samo:** „Wioska Nut → poziom 1”, ćwiczenie `l1-e0a` (dźwięk C6, poprawna odpowiedź to „Wysoki”). Dzięki temu test zna poprawną odpowiedź bez zgadywania.
- **XP konta testowego rośnie przy każdym biegu**, więc test nie sprawdza „XP = 10”, tylko „XP po = XP przed + 10” (czyta wartość z paska na mapie przed lekcją i po niej).
- **Test działa na zbudowanej stronie** (`npm run build:web`, potem lokalny serwer plików), tak jak na musicquest.pl / solfek.pl. Lokalny serwer nie ma przekierowań dla adresów lekcji, więc test wchodzi w lekcję klikając (mapa → kraina → poziom), a nie wpisując adres.
- **Baza:** test loguje się do tej samej bazy Supabase co prawdziwa strona (z `.env`). Konto testowe doda tam kilka punktów XP przy każdym biegu; to nieszkodliwe, ale jeśli wolisz, można później założyć osobny projekt Supabase tylko do testów (patrz „Nie teraz”).
- Okna powitalne nowego gracza (powitanie Solfka, pytanie „Jak chcesz zacząć?”, przewodnik) test pomija, ustawiając przed startem te same flagi w pamięci przeglądarki, które ustawia prawdziwy gracz po ich zamknięciu.
- Nazwa gry w tekstach testu: **Solfek**.

## Kroki

Każdy krok i każdy warunek „Gotowe, gdy” ma pole do odhaczenia (`- [ ]`).

### Krok 1. Przygotować konto testowe i plik z danymi (robi Emilia)
- [ ] W panelu Supabase dodać użytkownika (np. `solfek-test@…`) z hasłem, z zaznaczonym „Auto Confirm User”.
- [ ] Zalogować się tym kontem ręcznie na stronie raz, żeby upewnić się, że działa (po zalogowaniu widać mapę).
- [ ] Utworzyć lokalny plik `.env.test` z dwiema liniami: `TEST_EMAIL=…` i `TEST_PASSWORD=…`.
- [ ] Ja dopisuję `.env.test` do `.gitignore` i sprawdzam `git status`, że plik nie jest widoczny dla gita.

Gotowe, gdy:
- [ ] Ręczne logowanie kontem testowym kończy się widokiem mapy.
- [ ] `git status` nie pokazuje `.env.test`.

Jak sprawdzić:
- Otworzyć stronę w przeglądarce, zalogować się; `git status` w terminalu.

### Krok 2. Zainstalować Playwright i uruchomić pusty test (dopiero po Twojej zgodzie)
- [ ] `npm install --save-dev @playwright/test` (z `--legacy-peer-deps`, jak reszta projektu) i pobranie przeglądarki Chromium.
- [ ] Plik `playwright.config.ts`: test uruchamia `npm run build:web`, serwuje folder `dist` na lokalnym porcie, czeka aż strona odpowie, wczytuje `.env.test`.
- [ ] Skrypt w `package.json`: `npm run test:e2e`.
- [ ] Najprostszy test: strona się otwiera i widać ekran „Zaloguj się”.
- [ ] Zwykłe testy (`npx jest`) nie wpadają w pliki Playwrighta (osobny folder `e2e/`, wykluczony w konfiguracji Jesta).

Gotowe, gdy:
- [ ] `npm run test:e2e` przechodzi z jednym zielonym testem.
- [ ] `npx jest` i `npx tsc --noEmit` nadal bez błędów.

Jak sprawdzić:
- Uruchomić oba polecenia i zobaczyć wynik.

### Krok 3. Dodać stabilne „uchwyty” do klikania w aplikacji
- [ ] Dodać atrybuty `testID` (w przeglądarce stają się `data-testid`) tylko w kilku miejscach: pola e-mail i hasło oraz przycisk „Zaloguj się”, kafelek krainy Wioska Nut, kafelek poziomu 1, przycisk „OK” po wstępie do lekcji, przyciski odpowiedzi, „Sprawdź”, oraz pasek XP na mapie.
- [ ] Żadnych zmian wyglądu ani działania.

Gotowe, gdy:
- [ ] Aplikacja wygląda i działa tak samo (przegląd w podglądzie).
- [ ] `npx tsc --noEmit` i `npx jest` bez błędów.

Jak sprawdzić:
- Podgląd w przeglądarce i w narzędziach deweloperskich: elementy mają `data-testid`.

### Krok 4. Napisać test ścieżki: logowanie → lekcja → +10 XP
- [ ] Ustawić w pamięci przeglądarki flagi „okna powitalne już widziane” (powitanie, wybór trybu, przewodnik).
- [ ] Zalogować się danymi z `.env.test`.
- [ ] Odczytać XP z paska na mapie.
- [ ] Wejść: Wioska Nut → poziom 1 → „OK” po wstępie.
- [ ] Kliknąć „Wysoki”, kliknąć „Sprawdź”.
- [ ] Sprawdzić, że pojawia się „+10 XP”, wrócić do mapy i sprawdzić, że XP = XP przed + 10.

Gotowe, gdy:
- [ ] Test przechodzi 3 razy z rzędu na tym samym koncie (XP rośnie za każdym razem o 10, test się nie wywraca).
- [ ] Gdy celowo kliknę „Niski”, test się wywraca z czytelnym komunikatem (sprawdzamy, że test naprawdę coś sprawdza).

Jak sprawdzić:
- `npm run test:e2e` trzy razy; raz z błędną odpowiedzią.

### Krok 5. Uruchomić u Emilii, opisać w dokumentacji
- [ ] Emilia uruchamia `npm run test:e2e` u siebie (ja nie loguję się kontem testowym do zewnętrznej usługi).
- [ ] Dopisać do `CLAUDE.md` krótki akapit: jak założyć konto testowe, jak uruchomić test, czego test nie pokrywa.
- [ ] Zapisać commit (bez wdrożenia, dopóki nie napiszesz „wdróż”).

Gotowe, gdy:
- [ ] Test przechodzi na komputerze Emilii.
- [ ] `CLAUDE.md` opisuje uruchomienie w kilku zdaniach.

Jak sprawdzić:
- Wynik polecenia u Emilii; przeczytanie akapitu.

## Nie teraz
- Kolejne ścieżki (zakupy w sklepie, Tryb nauki, płatności, test poziomujący).
- Uruchamianie testu automatycznie na GitHubie przy każdym wdrożeniu (osobny plan: potrzebuje bezpiecznego miejsca na hasło konta testowego).
- Osobny projekt Supabase tylko do testów (czystsze, ale wymaga drugiej konfiguracji bazy).
- Testy na telefonach (iOS/Android); ten plan dotyczy wersji w przeglądarce.

## Najmniejszy sensowny efekt
Kroki 1–2: konto testowe i zielony test „strona się otwiera i widać logowanie”. Już to pokazuje, że cała instalacja i uruchamianie działają, zanim dojdzie logika lekcji.
