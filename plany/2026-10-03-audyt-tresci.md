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

## Do Twojej decyzji (nie zmieniałam bez zgody)
Zmiana tych rzeczy dotyka zatwierdzonych ćwiczeń, nagrań albo zasad nauczania.

**Nagrania i grafiki (Królestwo Instrumentów)**
1. Trąbka jest nagrana niżej (E3) niż róg (C4), a slajd mówi „trąbka najwyżej". Wyciąć wyższy dźwięk trąbki z tego samego pliku albo zmienić podpisy i pytania o kolejność.
2. Flet i obój mają to samo nagranie (C5), a teza „im dłuższa rura, tym niższy dźwięk" nie pasuje do fletu, oboju i klarnetu (pasuje do fagotu).
3. Talerze: grafika i pytanie to talerze uderzane o siebie, a nagranie to jeden talerz uderzony pałeczką.

**Wioska Nut**
4. Lekcje 6–7: „linie dodane nad pięciolinią", a żadna nuta nie leży na linii dodanej (G5 jest w polu). Dodać A5, czy zmienić podtytuł?
5. Pytania o krok i skok są w lekcjach 5, 7 i 9, a pojęcie wprowadza dopiero lekcja 10.
6. Słowa z nut: „CAH" (C A H) i „DAG" nie są słowami; angielskie „CAGED", „FADE", „FED", „FACE" są trudne dla polskiego dziecka. Propozycja: DACH, FACH, GAD, ACH. (To zmiana zatwierdzonych sekwencji.)
7. „Wysoki czy niski": granica niejasna (D4 = niski, A4 = wysoki, C4 = niski). Propozycja: niski ≤ G3, wysoki ≥ C5.
8. Lekcja 14: „cała gama G3–C5" to nie gama; w kluczu basowym nuty wchodzą na linie dodane, których lekcja 12 nie uczyła. Lekcje 21–22 obiecują bemole, a nie ma żadnego bemola.

**Miasto Rytmu**
9. Lekcja 4 „pauzy i synkopy": żadne ćwiczenie nie zawiera prawdziwej synkopy, a lekcje 7 i 9 mówią „znasz synkopy z lekcji 4".
10. Pauza szesnastkowa jest w lekcji 9, ale nigdy nie została wprowadzona.
11. Lekcja 11 obiecuje różne tempa, ale wszystkie ćwiczenia mają nagranie, więc tempo jest ignorowane.
12. Boss: slajd wymienia „echo", którego nie ma; dwa dyktanda to powtórki z lekcji 12. Ćwiczenia „stukaj tylko na RAZ" nie mają objaśnienia, a dodatkowe stuknięcia nie są karane.
13. Wzory echa mają odstępy niezwiązane z jednym pulsem (np. 300/450 ms).

**Przystań Taktów**
14. Lekcja 10: slajd o „synkopie w metrum złożonym" opisuje przesunięcie akcentu; ćwiczenie pt-l10-e1 ma ćwierćnutę przecinającą granicę grup 3+3.

**Gaj Grupowania**
15. gg-l7-e4: grupowanie 2+3+2 jest „błędne", a slajd mówi, że 2+3+2 też jest poprawne.
16. Lekcja 11 (5/4, 7/4) i 2/2: „błędny" wariant (pary ósemek) bywa w praktyce poprawny — sprzeczne z 4/4.
17. Za mocne „nigdy" w zasadach (belka przez dwie triole, pauza przerywa belkę) — to konwencje, nie reguły bezwzględne. W wielu podręcznikach pauza przerywa belkę.
18. 17 ćwiczeń jest dokładną kopią przykładu ze slajdu (odpowiedź widać przed zadaniem). Boss ma difficulty 4 przy treści do poziomu 6.

**Szczyt Dyktand**
19. 7/8: dwa ćwiczenia mają podział 3+3+1 (nietypowy); 9/8 z półnutą i całą nutą nie pasuje do 3+3+3.
20. Ćwierćnuta z kropką na środku taktu (synkopa) w lekcjach 8 i 9 bez slajdu o synkopie.
21. sd-l8-e4: skok E4→B♭4 to tryton — za trudne dla dziecka (propozycja: F4).
22. Boss: 4 z 7 ćwiczeń to dokładne powtórki z wcześniejszych poziomów, a komentarz mówi o „świeżych" zadaniach (pasuje do zasady mieszanki, trzeba tylko poprawić komentarz).
23. Poziom 1: slajdy o ósemce i przycisku „Grupuj" dotyczą wartości, których tam jeszcze nie ma.
24. Kod grupowania nut w dyktandach (`lib/rhythm/beamGrouping.ts`) nie zna 3/8, 5/8, 7/8, a Gaj uczy 3, 3+2, 2+2+3; pauza zawsze przerywa belkę.

**Zaczarowany Solfeż**
25. Zakres głosu: E5–F5 w poziomach 5–7 i w bossie; tolerancja 45 centów w poziomie 7 jest ostra dla dziecięcego głosu. Slajd mógłby mówić „możesz śpiewać oktawę niżej".
26. Slajd lekcji słuchu 2 mówi „od teraz dwa dźwięki z rzędu", a lekcja 1 już ma takie ćwiczenia.

**Interwały, tonacje, akordy**
27. Losowe ćwiczenia z zapisem w lekcjach 1–7 Pasma mogą pokazać B♯, E♯, C♭ (poprawne, ale bardzo trudne). To samo przy trójdźwiękach (C♯-E♯-G♯) i D7 w C♯7. Propozycja: w pierwszych lekcjach losować pnie z białych klawiszy.
28. Terminologia: „tercekwartakord" (nasze) czy „tercjakwartakord" (częstsze w podręcznikach)? Występuje w wielu miejscach.
29. Tryton na pięciolinii: uznawana jest tylko kwarta zwiększona (F♯ od C), a nie kwinta zmniejszona (G♭). Przyjmować obie?
30. Klawiatura referencyjna (Fabryka, lekcja 1) podpisuje czarne klawisze tylko krzyżykami (cis, dis…), a zadania mają bemole (des, es, as, b).
31. Skojarzenia piosenkowe interwałów („Czerwone jabłuszko", „Stary niedźwiedź", „Take on me"…) nie są zweryfikowane co do kierunku interwału.
32. Slajdy Jaskini: oznaczenia „(3+3>)" nie są objaśnione (objaśnienie jest dopiero w Zatoce).
