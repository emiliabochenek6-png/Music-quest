# Audyt merytoryczny treści (2026-10-03)

Siedmiu niezależnych recenzentów (rola: profesor akademii muzycznej) przeczytało wszystkie lekcje, ćwiczenia, slajdy i podpowiedzi we wszystkich 13 krainach (ok. 1 500 ćwiczeń) oraz logikę generowania i sprawdzania odpowiedzi. Sumy wartości w każdym takcie sprawdzono skryptami: **wszystkie takty się zgadzają, żadna nuta nie przekracza kreski taktowej**. Klucze odpowiedzi, budowa akordów, tonacje, interwały, nazwy dźwięków i solmizacja są poprawne (poza punktami niżej).

## Zasady potwierdzone przez Emilię
- Oznaczenia septym zostają: **7 = septyma mała, 7< = septyma wielka**. Recenzenci zgłaszali to jako błąd, ale to Twoja konwencja i jest poprawna.
- **Bossy zawsze są mieszanką poprzednich poziomów** krainy. Sprawdzone: wszystkie 13 bossów używa wyłącznie typów ćwiczeń z wcześniejszych poziomów, test `data/lessons/bosses.test.ts` pilnuje tego na przyszłość.

## Co poprawiono od razu (tekst, bez zmiany nut i nagrań)
- **Koło kwintowe:** polecenie „w prawo = więcej krzyżyków" było nieprawdziwe po drugiej stronie koła. Teraz: „o kwintę w prawo (zgodnie z ruchem wskazówek zegara)". Poprawiono też slajd lekcji 10 i podpowiedzi.
- **Tonacje równoległe:** polecenie „Kliknij tonację równoległą do…" zamiast „sektor odpowiadający tonacji".
- **Przewroty trójdźwięków i D7:** polecenia i odmiana („trójdźwięk durowy w postaci: sekstakord") oraz ćwiczenia budowania przewrotów losują już tylko dur i moll (zmniejszony i zwiększony nie były jeszcze poznane, a etykiety interwałów w ich przewrotach mogły mylić).
- **Pisownia B♭ → B** w Cytadeli i Fabryce (zgodnie z polskim nazewnictwem).
- **Pasmo Interwałów:** slajd o nazwie i rodzaju interwału (stopnie vs półtony) oraz objaśnienie znaków > i <; tryton jako kwarta zwiększona (4<) = kwinta zmniejszona; poprawione zdania („jest pełen napięcia"), „wszystkie interwały od prymy do oktawy".
- **Zatoka Trójdźwięków:** „nazwę trójdźwięku", a w 6 ćwiczeniach poprawna odpowiedź nie jest już zawsze pierwsza.
- **Gaj Grupowania:** slajd o łuku przez kreskę taktową (to nie synkopa), poprawiony przykład ćwierćnuty z kropką w 2/2, „pauza wypełniająca cały puls", pauza ósemkowa i belka; polecenie sumy w 2/2.
- **Szczyt Dyktand:** H4 leży na trzeciej linii (nie czwartej), D5 na czwartej; spójna rada „najpierw odsłuchaj całość, potem pisz"; „5–7-nutowe frazy"; G5 „najwyższy dźwięk w dyktandach".
- **Zaczarowany Solfeż:** opisy melodii „Hot cross buns" i „Lightly Row" nie obiecują „całej melodii"; „Ostatni poziom…" tam, gdzie były jeszcze kolejne; „skoki o tercję"; „wybrane stopnie".
- **Królestwo Instrumentów:** partyturę czyta dyrygent, a muzyk ma swój głos; rozróżnienie rogu i tuby (dłoń w czarze), obój/klarnet (ustnik), gitara i fortepian bez dystraktora „harfa", flet „z tych czterech", smyczki „najbliżej dyrygenta".
- **Przystań Taktów:** poprawiony opis 2/2 (długość taktu, a nie „ciche i, którego 2/4 nie ma"), 2/4 („mocne jest tylko RAZ"), „siedem metrów".
- **Wioska Nut:** w ćwiczeniu l3-e14 dwa przyciski „C" (C4 i C5) — dystraktor C4 zamieniony na E4.
- **Język:** „ćwiartka" → „ćwierćnuta" w całej treści, „0 znaków" zamiast „brak znaków", formy męskie zamienione na neutralne, cudzysłowy, odmiana po liczebnikach („3 trójdźwięków", „2 dominant septymowych").

## Punkty „do decyzji": zrobione na Twoje polecenie („zmień też te")
**Nagrania i grafiki (Królestwo Instrumentów)**
1. Trąbka (nagranie E3) jest niżej niż róg (C4) — **jeszcze nie naprawione**: wymaga pobrania wyższej nuty z tej samej darmowej biblioteki Uniwersytetu Iowa (plik `Trumpet.novib.mf.C5B5.aiff`). Czeka na Twoją zgodę na pobranie. Pytania o „najwyżej grającą trąbkę" są poprawne teoretycznie.
2. Flet/obój/klarnet/fagot: usunięty podpis „najwyżej" przy flecie; slajd mówi teraz „fagot ma rurę ok. 2,5 m, więc gra najniżej; flet i obój grają wysoko, klarnet niżej".
3. Talerze: podpis „tu: jeden talerz uderzony pałeczką", pytanie „metalowe krążki, w które uderzamy (o siebie albo pałeczką)".

**Wioska Nut:** dodana nuta A5 (pierwsza na linii dodanej) w lekcji 6; slajd o kroku i skoku w lekcji 5; słowa z nut: DACH, FACH, ACH (zamiast CAH, DAG, CAGED, FADE, FACE; „FED" w basie zostaje); „wysoki/niski" z wyraźniejszą granicą (G3 niski, C5 wysoki, A3 niski); lekcja 14 pokazuje te same cztery dźwięki w obu kluczach; bemol (B♭4) w bossie.

**Miasto Rytmu:** lekcja 4 nie obiecuje już synkop (prawdziwe są w lekcjach 7 i 9), pauza szesnastkowa wprowadzona w lekcji 9, lekcja 11 bez obietnicy różnych temp, opisy dyktand i stukania na „raz", usunięte „echo" z opisu bossa; wzory echa wyrównane do jednego pulsu.

**Przystań Taktów:** ćwiczenie pt-l10-e1 zostaje (to poprawna synkopa w 6/8), poprawiony opis.

**Gaj Grupowania:** gg-l7-e4 ma jednoznacznie błędny wariant; slajdy mówią, że w lekcjach 11 i 3 belkujemy całą grupę; „nigdy" zamienione na „zwykle"/„w tej grze". **Nie zmienione:** 17 ćwiczeń, które powtarzają przykład ze slajdu (wymaga ułożenia nowych sekwencji rytmicznych — do zrobienia osobno i za Twoją zgodą), poziom trudności bossa.

**Szczyt Dyktand:** 7/8 w podziale 2+2+3, 9/8 w grupach po trzy, skok E4→B♭4 zamieniony na F4→B♭4, notatka o synkopie, slajd „Grupuj" przeniesiony do poziomu 2, komentarz bossa („mieszanka z poprzednich poziomów"); **kod grupowania nut zna teraz 3/8, 5/8 i 7/8** (+ testy).

**Zaczarowany Solfeż:** tolerancja 60 centów w poziomie 7 (było 45), podpowiedź „możesz śpiewać oktawę niżej", poprawiony slajd o dwóch dźwiękach.

**Interwały, tonacje, akordy:** losowe interwały, trójdźwięki i D7 unikają zapisów E♯, B♯, C♭, F♭ i podwójnych znaków, gdy istnieje prostszy (+ testy); „tercekwartakord" → „tercjakwartakord" wszędzie; tryton na pięciolinii przyjmuje obie pisownie (kwarta zwiększona i kwinta zmniejszona, + testy); klawiatura referencyjna podpisuje czarne klawisze też bemolami (cis i des); objaśnienie „(3+3>)" w Jaskini; dwa pytania w Królestwie uproszczone.

**Nie do sprawdzenia w kodzie:** skojarzenia piosenkowe interwałów („Czerwone jabłuszko", „Stary niedźwiedź", „Take on me"…) — warto, żeby muzyk sprawdził kierunek interwału.
