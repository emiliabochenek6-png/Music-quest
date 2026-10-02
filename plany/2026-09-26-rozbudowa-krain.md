# Rozbudowa obecnych krain, żeby gra starczyła na minimum 6 miesięcy

## Cel
Ustalić, ile treści jest teraz w każdej z 12 krain, dodać wyraźnie więcej
lekcji/ćwiczeń w jednej krainie jako pilotaż, i spisać powtarzalną
"przepis" (checklistę), po której dało się rozbudować pozostałe 11 krain
bez planowania każdej z osobna od zera.

## Dlaczego
Z 7 pomysłów zgłoszonych na start, ten wybrałeś jako pierwszy: żeby gra nie
kończyła się za szybko, tylko dawała wrażenie niekończącej się zabawy przez
co najmniej pół roku. Reszta pomysłów (tryb zabawy, ubrania dla Soltka,
boss krainy, nowy wygląd, testy-robot) czeka jako osobne plany — patrz
sekcja "Mapa na później" na dole.

## Założenia
- Nowe lekcje używają WYŁĄCZNIE istniejących typów ćwiczeń (jest ich już
  ok. 38 gotowych w `components/exercises/`) — nie tworzymy nowych typów
  ćwiczeń w tym planie, tylko nową treść (nowe pytania/melodie/rytmy) do
  istniejących typów. To dużo szybsze i bezpieczniejsze niż budowanie
  nowego mechanizmu.
- Dodawanie lekcji do krainy NIE dotyka pliku `lib/progression/resolveNodeState.ts`
  (on pilnuje odblokowania całych krain, nie lekcji w środku) — więc zasada
  "nie ruszać tego pliku bez zgody" nie jest tu problemem.
- Szacunek "ile to wystarczy czasu" (patrz Krok 1) opiera się na ZAŁOŻENIU,
  że dziecko gra średnio ok. 15 minut dziennie, mniej więcej 6 dni w
  tygodniu — to typowy wzorzec dla apek edukacyjnych w stylu Duolingo, ale
  to nadal założenie, nie fakt o Twoim dziecku. Jeśli gra więcej lub mniej,
  cel liczbowy w Kroku 1 trzeba przeskalować.

## Kroki

### Krok 1. Zmierz, ile treści jest teraz w każdej krainie ✅ zrobione 2026-09-26
- [x] Policz liczbę lekcji i ćwiczeń w każdym z 12 plików `data/lessons/*.ts`
- [x] Zapisz to w jednej tabelce (kraina → liczba lekcji → liczba ćwiczeń)
- [x] Zaznacz 2-3 krainy z najmniejszą liczbą treści — to naturalni
      kandydaci do rozbudowy w pierwszej kolejności

Gotowe, gdy:
- [x] Masz jedną tabelkę ze wszystkimi 12 krainami i widać, które są
      najuboższe

Jak sprawdzić:
- To tylko liczenie/czytanie plików — nic się nie uruchamia, wynik to
  tabelka do przejrzenia razem z Tobą

**Wynik:**

| # | Kraina | Dostęp | Lekcji | Ćwiczeń |
|---|---|---|---|---|
| 1 | Wioska Nut | darmowa | 5 | 56 |
| 2 | Miasto Rytmu | darmowa | 5 | **27 ★ najuboższa** |
| 3 | Przystań Taktów | darmowa | 8 | 47 |
| 4 | Pasmo Interwałów | premium | 8 | 47 |
| 5 | Zatoka Trójdźwięków | premium | 5 | **28 ★ najuboższa** |
| 6 | Jaskinia Akordów | premium | 6 | 40 |
| 7 | Cytadela Dominant | premium | 6 | 40 |
| 8 | Labirynt Tonacji | premium | 4 | 50 |
| 9 | Fabryka Budowania | premium | 11 | 68 (najbogatsza) |
| 10 | Gaj Grupowania | premium | 7 | 45 |
| 11 | Szczyt Dyktand | premium | 9 | 54 |
| 12 | Zaczarowany Solfeż | premium | 7 | **38 ★ najuboższa** |
| | **Razem** | | **81** | **540** |

3 najuboższe krainy: **Miasto Rytmu** (27), **Zatoka Trójdźwięków** (28),
**Zaczarowany Solfeż** (38). Miasto Rytmu jest dodatkowo darmowa — tam
trafia każdy nowy gracz, więc to naturalny kandydat na krainę pilotażową
(Krok 2).

**Ile to wystarczy czasu — szacunek, nie dokładny pomiar:**

Założenia (do skorygowania, jeśli nie pasują):
- ok. 30 sekund aktywnego działania na jedno ćwiczenie (dziecko, nie
  dorosły) — szybciej przy prostych wyborach, wolniej przy śpiewaniu/
  słuchaniu
- ×1,75 na "realia sesji" — czytanie wstępu do lekcji, animacje,
  pomyłki/powtórki po utracie serca, nawigacja między ekranami
- dziecko gra ok. 15 minut dziennie, ok. 6 dni w tygodniu

Rachunek: 540 ćwiczeń × 30s × 1,75 ≈ 7,9 godziny realnego grania, żeby
przejść WSZYSTKO raz, od początku do końca. Przy 15 min/dzień × 6 dni w
tygodniu (90 min/tydzień) to ok. **5-6 tygodni** — nie 6 miesięcy.

Część typów ćwiczeń (np. wybór interwału, trójdźwięku, tonacji) losuje
konkretną treść za każdym razem, więc powtórka lekcji nie zawsze wygląda
identycznie — to trochę wydłuża realną "żywotność" ponad ten pierwszy
przelot, ale dyktanda i śpiewanie (Szczyt Dyktand, Zaczarowany Solfeż) są w
pełni ustalone i się nie zmieniają. Ostrożny szacunek całości: obecna
treść starcza raczej na **2-3 miesiące** codziennego grania, nie 6.

**Cel na 6 miesięcy:** żeby dobić do ok. 26 tygodni przy tym samym tempie,
potrzeba z grubsza **3-4× więcej treści niż teraz**.

**Ile ćwiczeń na krainę — konkretny cel:** zamiast rozkładać nierówno,
prostszy i uczciwszy cel to **jeden wspólny poziom dla każdej krainy: ok.
150 ćwiczeń**. Wtedy żadna kraina nie wygląda przy innych ubogo, a suma
(13 krain × 150, licząc też nową "Świat Instrumentów" — patrz niżej) daje
ok. 1950 ćwiczeń, czyli mieści się w wyliczonym wyżej celu 1600-2000.

| Kraina | Ma teraz | Cel | Do dodania |
|---|---|---|---|
| **Wioska Nut** | 119 (było 56, stan na 2026-09-26) | 150 | **+31** |
| Miasto Rytmu | 27 | 150 | +123 |
| Przystań Taktów | 47 | 150 | +103 |
| Pasmo Interwałów | 47 | 150 | +103 |
| Zatoka Trójdźwięków | 28 | 150 | +122 |
| Jaskinia Akordów | 40 | 150 | +110 |
| Cytadela Dominant | 40 | 150 | +110 |
| Labirynt Tonacji | 50 | 150 | +100 |
| Fabryka Budowania | 68 | 150 | +82 |
| Gaj Grupowania | 45 | 150 | +105 |
| Szczyt Dyktand | 54 | 150 | +96 |
| Zaczarowany Solfeż | 38 | 150 | +112 |
| **Świat Instrumentów** (nowa, patrz niżej) | 0 | 150 | +150 (od zera) |
| **Razem** | 540 | **1950** | **+1410** |

**Uwaga o "Świat Instrumentów"** — to INNY rodzaj pracy niż reszta tego
planu. Krainy 1-12 rozbudowujemy WYŁĄCZNIE nową treścią do już gotowych
~38 typów ćwiczeń (patrz "Założenia" wyżej). Świat Instrumentów by tego
nie mógł — nic w apce dziś nie rozpoznaje brzmienia/wyglądu instrumentu
("zgadnij jaki to instrument"), więc potrzebowałby co najmniej jednego
NOWEGO typu ćwiczenia (nowy dźwięk/obrazek do rozpoznania, nowy komponent,
nowa logika oceniania) — to osobna, większa praca inżynierska, nie tylko
dopisanie treści. Proponuję: traktować "stwórz Świat Instrumentów" jako
osobny, kolejny plan (dopisany do "Mapy na później" niżej), a liczbę 150 w
tabeli wyżej brać jako sam cel liczbowy do zaplanowania wtedy, nie coś do
zrobienia w Kroku 2-5 tego planu.

### Krok 2. Dodaj nowe lekcje do jednej krainy pilotażowej
- [x] Potwierdź krainę pilotażową — propozycja z Kroku 1: **Miasto Rytmu**
      (najuboższa I darmowa, więc poprawa widoczna od razu dla nowych
      graczy)
- [ ] Dodaj tyle nowych lekcji, żeby dobić z 27 do ok. 100-120 ćwiczeń w
      tej krainie (patrz cel z Kroku 1) — w tym samym stylu co istniejące
      (te same typy ćwiczeń, trudność rosnąca stopniowo). To duża liczba,
      więc rób to partiami po 1-2 lekcje i sprawdzaj po każdej (Krok 3),
      zamiast pisać wszystko naraz
- [ ] Dla treści z rytmem: sumy wartości rytmicznych muszą się zgadzać z
      metrum w każdym takcie (patrz `CLAUDE.md`, sekcja o rytmie — to
      się już kilka razy psuło)

**Postęp partii (Miasto Rytmu):**

| Partia | Lekcje dodane | Ćwiczeń w krainie | Data |
|---|---|---|---|
| start | — | 27 | 2026-09-26 |
| 1 | lekcja 6 (tempo, pulse-tap), lekcja 7 (rytmy zaawansowane) | 40 | 2026-09-27 |
| 2 | lekcja 8 (puls kontra rytm), lekcja 9 (trudniejsze synkopy) | 54 | 2026-09-27 |
| 3 | lekcja 10 (rytmiczne układanki), lekcja 11 (wyczul metrum) | 77 | 2026-09-27 |
| 4 | lekcja 12 (dłuższe dyktanda), lekcja 13 (szybkie odczytanie) | 89 | 2026-09-27 |
| 5 | lekcja 14 (dłuższe echo), lekcja 15 (wielka powtórka) | **102** | 2026-09-27 |

Cel partii (100-120): osiągnięty ✅. Dalsza rozbudowa w kierunku
ostatecznego celu 150, w miarę potrzeb.

Gotowe, gdy:
- [ ] Nowe lekcje mają unikalne id i pojawiają się w danych krainy
- [ ] `npx tsc --noEmit` i `npx jest` przechodzą bez błędów

Jak sprawdzić:
- `npx tsc --noEmit` oraz `npx jest`
- Otwórz krainę w przeglądarce (patrz `CLAUDE.md`, sekcja "Web preview
  workflow") i przejdź nową lekcję od początku do końca

### Krok 3. Sprawdź nowe lekcje "na żywo"
- [ ] Przejdź każdą nową lekcję w przeglądarce krok po kroku (jak
      prawdziwy gracz) — dźwięk, nuty, ocena odpowiedzi
- [ ] Sprawdź, że po ukończeniu nowej ostatniej lekcji krainy odblokowuje
      się właściwa kolejna kraina (jeśli to była ostatnia lekcja krainy)

Gotowe, gdy:
- [ ] Każda nowa lekcja daje się ukończyć bez błędów w konsoli
      przeglądarki i pokazuje poprawny wynik na końcu

Jak sprawdzić:
- Ręczne przejście w przeglądarce lokalnie (bez wysyłania na produkcję)

### Krok 4. Spisz powtarzalny przepis na rozbudowę kolejnej krainy
- [ ] Krótka checklista (pół strony): gdzie dopisać lekcję, jak dobrać
      trudność, jak sprawdzić rytm, jak przetestować, czego unikać
      (np. plik `resolveNodeState.ts`)
- [ ] Zapisz ją na końcu tego pliku planu, jako gotowy "przepis" do
      powtórzenia

Gotowe, gdy:
- [ ] Przepis mieści się na pół strony i ktoś inny (albo Ty sam za miesiąc)
      mógłby go użyć bez pytania mnie od nowa

Jak sprawdzić:
- Przeczytaj przepis raz jeszcze pod kątem "czy wystarczy mi tych 5-6
  punktów, żeby zacząć"

### Krok 5. Zaplanuj kolejność rozbudowy pozostałych krain
- [ ] Na podstawie Kroku 1 ustalcie kolejność: które krainy dostają nowe
      lekcje jako następne (np. od najuboższych w treść)
- [ ] Zapiszcie to jako prostą listę z priorytetem, bez dat na sztywno

Gotowe, gdy:
- [ ] Masz listę 11 pozostałych krain w kolejności, w jakiej będziemy je
      rozbudowywać

Jak sprawdzić:
- Przejrzyj listę razem ze mną — czy kolejność ma sens (np. darmowe
  krainy 1-3 na początku, bo tam gra najwięcej nowych graczy)

## Nie teraz
- Tworzenie NOWYCH typów ćwiczeń (tylko więcej treści w istniejących)
- Tryb zabawy (wolna praktyka), ubrania dla Soltka, boss krainy, redesign
  wyglądu, testy E2E — to osobne plany, patrz "Mapa na później" niżej
- Dokładne wyliczanie "ile minut = 6 miesięcy" — orientacyjny cel wystarczy

## Najmniejszy sensowny efekt
Jedna kraina ma wyraźnie więcej treści (Krok 2-3), a Ty masz gotowy,
powtarzalny przepis (Krok 4) i kolejkę pozostałych krain (Krok 5) — więc
nawet jeśli zatrzymamy się tu, wiadomo dokładnie co robić dalej i jak.

---

## Mapa na później

To, co zostaje z Twojej pierwotnej listy siedmiu pomysłów — każdy to osobny
plan, robiony osobnym podejściem tego samego skilla, kiedy dojdzie kolej:

1. **Tryb zabawy (wolna praktyka)** — nowy ekran/tryb: wybierasz dowolne
   ćwiczenie z dowolnej odblokowanej krainy, bez wpływu na postęp i serca.
   Wymaga: nowego ekranu nawigacji + sposobu na odpalenie pojedynczego
   ćwiczenia poza normalną sekwencją lekcji.
2. **Soltek — ubrania i dodatki** — system przebierania maskotki: szafa,
   sposób zdobywania/kupowania ubrań (być może za "nutki", które już
   istnieją), zapisywanie wybranego stroju, pokazywanie go wszędzie gdzie
   widać Soltka.
3. **Boss krainy** — bonusowy, trudniejszy poziom na koniec każdej krainy,
   mieszający kilka typów ćwiczeń naraz, ze specjalną nagrodą.
4. **Redesign wyglądu** — osobny plan wizualny: co dokładnie ma wyglądać
   inaczej (kolory? czcionki? maskotka? mapa?) — na starcie tego planu
   trzeba będzie doprecyzować zakres, bo "ładniejszy wygląd" samo w sobie
   jest zbyt ogólne na konkretne kroki.
5. **Testy E2E (robot przechodzący ćwiczenia)** — najlepiej zrobić PO
   ustabilizowaniu nowej treści/funkcji z punktów 1-4, żeby testy sprawdzały
   docelowy kształt apki, a nie coś co i tak się jeszcze zmieni.
6. **Świat Instrumentów (nowa kraina, 13.)** — dodanie zupełnie nowej
   krainy do mapy: nowy wpis w `data/worlds.ts`, nowy plik lekcji, i co
   najmniej jeden NOWY typ ćwiczenia (rozpoznawanie instrumentu po
   brzmieniu/obrazku — dziś nic takiego w apce nie istnieje). Cel liczbowy
   dla niej (ok. 150 ćwiczeń) jest już policzony w tabelce w Kroku 1 wyżej,
   żeby wliczał się do celu "6 miesięcy" — ale samo ZBUDOWANIE mechanizmu
   ćwiczeń to osobna decyzja projektowa (jak dokładnie ma wyglądać
   "zgadnij instrument"?), do doprecyzowania jak dojdzie kolej na ten plan.

Kolejność 1-6 to tylko propozycja — możesz ją swobodnie zmienić, jak dojdzie
czas na wybór kolejnego planu.
