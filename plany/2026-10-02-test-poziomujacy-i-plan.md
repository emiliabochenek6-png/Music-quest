# Test poziomujący i spersonalizowany plan nauki (ok. 3 miesiące, z powtórkami)

## Cel
Na starcie gracz wybiera: **test poziomujący** (ułoży mu własną ścieżkę) albo
**„zacznij od początku"** (dostaje pierwotną, pełną ścieżkę). Na tej ścieżce
dostaje plan na ok. 3 miesiące, codzienne misje i system powtórek w rosnących
odstępach.

## Co jest zrobione (stan: localhost, 2026-10-02)
- [x] Okno wyboru na mapie (po powitaniu Soltka, tylko raz): „Zrób test poziomujący" / „Chcę zacząć od początku".
- [x] Ekran testu poziomującego (`/placement`): pytania z wszystkich krain, wynik, wybór tempa, start planu.
- [x] Ekran „Twój plan" (`/plan`): postęp, plan na dziś, opis działania, wynik testu, harmonogram tygodni.
- [x] „Plan na dziś" w zakładce Misje oraz nowe misje: „Plan: przerób zaplanowane lekcje" i „Powtórka".
- [x] Ekran powtórki (`/review`): 5 pytań z ukończonej lekcji.
- [x] Wiersz „Twój plan" w Ustawieniach (zmiana decyzji, ponowny test, powrót do pełnej ścieżki).
- [x] Lekcje pominięte w ścieżce nie blokują następnych na liście lekcji krainy.
- [x] Testy jednostkowe (`lib/plan/plan.test.ts`).
- [ ] Wdrożenie na musicquest.pl (dopiero po Twoim sprawdzeniu).

## Dwa tryby na mapie (przełącznik u góry)
- **🎮 Tryb zabawy** — gra: mapa krain, lekcje w dowolnej kolejności, bossowie. To pierwotna ścieżka, zawsze dostępna.
- **📚 Tryb nauki — „Twój plan"** — osobna ścieżka zadań dopasowana testem: najpierw karta z Soltkiem, kółkiem postępu i statystykami (lekcje, minuty dziennie, passa, meta), potem „Powtórki na dziś", a niżej kręta ścieżka dni: każdy dzień to baner (Dziś / dzień tygodnia, data, ok. X min), a lekcje to duże kółka w kolorze krainy (boss ma portret i koronę). Najbliższa lekcja pulsuje i ma napis START, ukończone są zielone z ptaszkiem.
- Postępy z obu trybów liczą się razem (te same ukończone lekcje i gwiazdki).
- Wybór „Zacznij od gry" w oknie startowym ustawia tryb zabawy; wynik testu ustawia tryb nauki. Tryb zapamiętuje się na urządzeniu.
- Po ukończeniu lekcji z planu: przycisk **„Przejdź do następnej lekcji dnia"** (z nazwą lekcji), a po ostatniej zaplanowanej lekcji: **„Gratulacje! Wykonałeś wszystkie zaplanowane lekcje na dziś."** Wyjście z takiej lekcji prowadzi z powrotem do planu.

## Nagrody i levele (tryb nauki)
- **Bez serc.** W trybie nauki (lekcje z planu i powtórki) błąd nic nie kosztuje i niczego nie blokuje. Pasek na mapie chowa wtedy serca. W trybie zabawy serca zostają jak były.
- **Za każdą poprawną odpowiedź:** +10 XP i **+2 nutki** (w powtórkach +5 XP i +2 nutki). Passa (dni z rzędu) liczy się jak dotąd.
- **100 leveli** zamiast 11 rang. Każdy kolejny kosztuje więcej XP niż poprzedni: level 2 po 40 XP (4 dobre odpowiedzi), level 10 po 510 XP, level 50 po ok. 6 800 XP, level 100 po ok. 24 000 XP. To mniej więcej tyle, ile daje ukończenie wszystkich lekcji, wyzwań i powtórek z planu na 3 miesiące, więc najwyższy level da się zdobyć, ale trzeba naprawdę ukończyć całą aplikację.
- Tytuły (Nutka → … → Legenda Muzyki) zmieniają się co kilkanaście leveli. Pełnoekranowe świętowanie jest co 5. level, żeby szybkie początkowe levele nie męczyły.
- Zmiana na 200 leveli: jedna stała `MAX_LEVEL` w `lib/gamification/rank.ts` (krzywa przelicza się sama).

## Jak działa test poziomujący
- Test obejmuje **12 z 13 krain** (Szczyt Dyktand dopasowuje się sam z wyników innych krain — patrz niżej).
- W każdej krainie **najwyżej 2 pytania**, razem 24, ok. 8–10 minut. Nic się nie traci: bez serc, punktów i informacji, czy odpowiedź była dobra. Jest przycisk „Nie wiem", żeby nie zgadywać.
- Pytania są **adaptacyjne**:
  1. pytanie średnie (z połowy krainy),
  2. dobra odpowiedź → pytanie trudne (z końca krainy); zła → pytanie łatwe (z początku krainy).
- Wynik krainy:
  | Przebieg | Poziom |
  |---|---|
  | średnie dobrze + trudne dobrze | **2 — Opanowane** |
  | średnie dobrze + trudne źle, albo średnie źle + łatwe dobrze | **1 — Częściowo** |
  | średnie źle + łatwe źle | **0 — Do nauki** |
- Używane są tylko pytania z wyborem odpowiedzi (także budowanie na pięciolinii). Nie ma pytań na czas, stukania, śpiewu ani dyktand, bo test ma mierzyć wiedzę, a nie szybkość telefonu czy mikrofon.
- **Szczyt Dyktand** (zapisywanie dyktand) nie ma pytania z wyborem, więc dostaje poziom z innych krain, od których zależy (Wioska Nut, Przystań Taktów, Gaj Grupowania): najniższy z nich, ale **nigdy wyżej niż „Częściowo"**.

## Jak z wyniku powstaje ścieżka
Krainy zostają w tej samej kolejności, a w każdej zostają lekcje zależne od poziomu:
| Poziom | Które lekcje krainy |
|---|---|
| Do nauki | wszystkie |
| Częściowo | pomijasz pierwsze 40% (podstawy), robisz resztę |
| Opanowane | krótki przegląd: co 4. lekcja i ostatnia (zwykle boss) |

Dla krainy opanowanej zostawiamy krótki przegląd, żeby szczęśliwe trafienie dwóch pytań nie pominęło całej krainy bez żadnej lekcji.

Przykładowe długości (15 min dziennie, 6 dni w tygodniu):
| Wynik testu | Lekcji | Godzin | Nowa nauka |
|---|---|---|---|
| wszystko dobrze | 62 z 208 | ok. 6 | ok. 4 tygodnie |
| połowa dobrze | 130 z 208 | ok. 12 | ok. 8 tygodni |
| wszystko źle / start od początku | 208 | ok. 20 | ok. 13 tygodni (≈ 3 miesiące) |

## Plan działania po teście (to widzi gracz)
1. **Wynik i tempo.** Lista krain z poziomami, wybór tempa: 10 / 15 / 20 / 30 minut dziennie (domyślnie 15) i informacja: ile lekcji z ilu, ile godzin, do kiedy nowa nauka.
2. **Codzienna nowa nauka.** Każdego dnia dostajesz następne nieukończone lekcje ze ścieżki, tyle, ile mieści się w dziennym czasie (lekcja trwa ok. 0,85 min na ćwiczenie). Dzień nauki: pon–sob. Niedziela to dzień odpoczynku: bez nowych lekcji, tylko powtórki. Jeśli opuścisz dzień, plan się nie rozsypuje: następnego dnia dostajesz po prostu następne lekcje.
3. **Powtórki w rosnących odstępach.** Po ukończeniu lekcji wracamy do niej po **1, 3, 7, 14, 30 i 60 dniach**. Powtórka to 5 pytań (ok. 3 min). Jeśli co najmniej 60% poszło dobrze, następny odstęp jest dłuższy; jeśli nie, lekcja cofa się o jeden stopień i wraca za 2 dni. Dziennie najwyżej 3 powtórki, a lekcje ukończone jeszcze przed planem dostają pierwszą powtórkę rozłożoną na 10 dni, żeby nie zasypać gracza.
4. **Dzienne misje** (zakładka Misje): „Plan: przerób zaplanowane lekcje", „Powtórka: N lekcji" (obie tylko gdy plan ma coś na dziś), plus dotychczasowe: ukończ lekcję, wyzwanie dnia, ćwicz 10 minut.
5. **Utrwalanie.** Gdy ścieżka się skończy (albo najpóźniej od ok. 13. tygodnia), plan trwa dalej bez nowych lekcji: powtórki w rosnących odstępach i wyzwanie dnia, żeby wiedza została na długo.
6. **Zmiana decyzji.** W Ustawieniach → Twój plan: zmiana tempa, ponowny test (nowa ścieżka, historia powtórek zostaje) albo powrót do pełnej ścieżki od początku.

## Założenia i ograniczenia
- Plan zapisuje się **na tym urządzeniu**; w odróżnieniu od postępów nie synchronizuje się jeszcze z kontem (do zrobienia razem z `useCloudSync`).
- Dostęp do krain jest taki jak dziś (blokady odblokowywania są wyłączone, `resolveNodeState.ts` nie był ruszany). Plan nie zamyka nikomu żadnej lekcji.
- Pominięte lekcje można zrobić z mapy w dowolnym momencie; nie blokują następnych.
- Czas lekcji to szacunek (0,85 min na ćwiczenie), nie pomiar.
- Dwa pytania na krainę to mało, więc wynik jest orientacyjny. Dlatego krainy „Opanowane" nie są pomijane w całości.
- Wynik testu mierzy wiedzę, nie śpiewanie: lekcje ze śpiewem (Solfeż) są w ścieżce zwykłą drogą, z możliwością wyłączenia mikrofonu.

## Do zrobienia później (osobno)
- Synchronizacja planu z kontem (Supabase).
- Powiadomienia z przypomnieniem o dziennym planie.
- Lepsza ocena poziomu (więcej niż 2 pytania, np. test uzupełniający po miesiącu).
- Statystyki: które krainy sprawiają najwięcej problemów w powtórkach.

## Levele: nagrody i świętowanie (tryb nauki i zabawy)
- **Nutki za każdy level:** +5 nutek za zwykły level, **+25 za każdy 5.** (5, 10, 15 …). Wypłacają się razem z XP, w obu trybach.
- **Pasek levelu w lekcji:** pod paskiem postępu jest „Lv N" z paskiem do następnego levelu. Każda dobra odpowiedź wypełnia go i unosi napis „+10 XP". Po przekroczeniu levelu pasek błyska.
- **Zwykły level:** mały baner „Level N!" zsuwa się z góry (z nagrodą w nutkach i ewentualnym nowym tytułem) i znika sam. Nie przerywa ćwiczenia.
- **Co 5. level:** pełny ekran z konfetti, iskrami, nagrodą w nutkach i Soltkiem.
- **Ekran „Twoje levele"** (klik w „Level N" na mapie): aktualny level z paskiem, ile XP brakuje do wielkiej nagrody, 12 najbliższych nagród i lista tytułów.

## Gratulacje po lekcji
- Podsumowanie lekcji pokazuje, ile XP i nutek zdobyłeś i jaki masz level.
- Po ostatniej lekcji z planu na dziś: konfetti i karta „Dzień zaliczony!" (liczba lekcji, passa, zachęta na jutro).
- Gdy ktoś wraca po przerwie (2 dni lub więcej): Soltek wita ciepło, bez wyrzutów, i plan zaczyna się od najbliższej lekcji.

## Misje dnia: 60 misji, po trzy dziennie
- Każdego dnia dokładnie **3 misje: jedna z planu, jedna z trybu zabawy, jedna z czasem**. Pule po 20 (razem 60); zestaw zależy od daty, więc zmienia się codziennie i żadna misja nie wypada dwa dni z rzędu.
- **Da się je zrobić:** misja z planu nigdy nie żąda więcej niż plan ma na dziś (lekcje, powtórki, liczba pytań); dwie najtrudniejsze nie trafiają razem na jeden dzień, a łączny wysiłek jest ograniczony.
- Bez planu: misja z planu to „ułóż swój plan z Soltkiem". W dzień odpoczynku (plan pusty): zastępuje ją „wykonaj wyzwanie dnia".
- Postęp liczy się osobno dla trybu nauki i zabawy (lekcje, poprawne odpowiedzi, 3 gwiazdki, lekcja bez błędu, boss, powtórki, minuty).

## Wyzwanie dnia
- Pytania pochodzą **tylko z lekcji, które gracz już ukończył**, w trybie zabawy albo nauki (oba zapisują się w tych samych postępach). Dopóki nic nie ukończył, dostaje pytanie z pierwszej lekcji.

## Własne ikonki
- Ikony trybów (pad do gry i otwarta książka) oraz ok. 20 nowych (głośnik, stop, ptaszek, konfetti, puchar, cel, powtórka, lekcja, meta, korona, kompas, płatek, złamane serce, odznaka, koperta, iskry, zamknij, start, zegar, otwarta kłódka) zastępują emoji wszędzie tam, gdzie pełniły rolę ikony. Emoji w zwykłym tekście (opisy, zdania) zostają.
