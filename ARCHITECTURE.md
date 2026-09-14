# Music Quest Mobile — Architektura i specyfikacja UI/UX

Wieloplatformowa aplikacja mobilna (iOS/Android, Expo/React Native) do nauki
teorii muzyki, family-friendly, freemium. Ten dokument jest specyfikacją
referencyjną dla działu produktu i inżynierii — towarzyszy mu realny szkielet
kodu w tym samym repozytorium (patrz `README.md` po strukturę katalogów).

Zakładam, że to osobny projekt mobilny (Expo/React Native), a nie część
istniejącej aplikacji webowej `master-quest` (Next.js) — dzieli z nią jedynie
koncepcję programową (te same 9 krain, ta sama numeracja poziomów), ale ma
własny stack, własne repozytorium i własny cykl wydawniczy. Jeśli intencja
była inna (np. wspólny monorepo z web-em), to założenie do zweryfikowania
przed startem implementacji.

---

## 1. Grupa docelowa i założenia produktowe

| Segment | Wiek | Tryb nadzoru | Motywacja |
|---|---|---|---|
| Dziecko | ~7-12 lat | Pod nadzorem rodzica (zakup, płatności) | Zabawa, kolekcjonowanie, pochwały |
| Nastolatek | ~13-17 lat | Częściowo samodzielny | Postęp, streak, rywalizacja ze sobą |
| Dorosły hobbysta | 18+ | Samodzielny, sam kupuje | Efektywność, dokładność, brak infantylizmu |

**Model biznesowy:** freemium — 3 pierwsze krainy zawsze darmowe (hak
akwizycyjny), 6 kolejnych za subskrypcją miesięczną lub roczną (z rabatem).
Płatność wyłącznie przez In-App Purchase (Apple/Google) — wymóg sklepowy dla
treści cyfrowych konsumowanych w aplikacji.

**Styl wizualny:** flat design, wektorowe ilustracje w duchu Pixar/Duolingo —
ciepłe, zaokrąglone kształty, nasycone ale nie krzykliwe kolory. Jeden spójny
system wizualny obsługuje DWA tryby prezentacji (patrz sekcja 2) przez
**warianty tego samego komponentu**, nie przez dwie osobne aplikacje —
kluczowe dla utrzymania jednego kodu i jednej krzywej rozwoju produktu.

---

## 2. Dual-Mode UX: przełączanie profilu

### 2.1 Model danych

```ts
type ProfileMode = "young-explorer" | "hobbyist";

interface ProfileState {
  mode: ProfileMode;
  displayName: string | null;   // opcjonalne, wpisywane tylko w onboardingu dziecka
  narratorEnabled: boolean;     // lektor czytający polecenia — domyślnie true w young-explorer
  soundEffectsEnabled: boolean;
}
```

Wybór trybu pojawia się:
- **Przy pierwszym uruchomieniu** — ekran `ProfilePickerScreen`, dwie duże
  karty ("Jestem Młodym Odkrywcą" / "Jestem Hobbystą"), bez domyślnego
  wyboru (świadoma decyzja, nie zgadywanie na podstawie wieku).
- **W ustawieniach** — przełącznik w każdej chwili (np. rodzic zmienia na
  "Hobbysta" gdy dziecko dorasta, albo odwrotnie dla młodszego rodzeństwa).

Zmiana profilu **nie resetuje postępu** — postęp w krainach jest własnością
konta/urządzenia, nie profilu wizualnego. To wyłącznie warstwa prezentacji +
kilka przełączników zachowania (patrz niżej).

### 2.2 Co się różni między trybami

| Element | Młody Odkrywca | Hobbysta / Uczeń |
|---|---|---|
| Mapa krain | Duże ilustrowane stworki/krajobrazy, animacje idle | Czyste kafle z ikoną + nazwą, statyczne |
| Nagroda za poprawną odpowiedź | Animacja stworka + dźwięk + confetti + kryształek do kolekcji | Subtelny checkmark + krótki dźwięk (wyłączalny) |
| Błędna odpowiedź | Miękki, zachęcający komunikat głosowy | Neutralny tekst + poprawna odpowiedź, bez narracji |
| Nagłówek ekranu ćwiczenia | Maskotka + duża czcionka + polecenie czytane na głos | Kompaktowy pasek postępu + polecenie tekstowe |
| Statystyki | Ukryte / uproszczone ("Zebrałeś 12 kryształków!") | Panel: streak dni, % poprawnych, czas/sesja, wykres postępu |
| Tryb szybki (bez animacji, do powtórek) | Niedostępny | Dostępny — "Tryb testowy": brak audio-czekania, natychmiastowe przejście |
| Lektor (narrator) | Domyślnie WŁ. — czyta polecenia i feedback | Domyślnie WYŁ. |
| Paleta / gęstość UI | Duże tapnięcia (min. 56×56pt), dużo białej przestrzeni, zaokrąglenia 24px | Zwarty layout, zaokrąglenia 12px, więcej informacji na ekranie |

**Zasada projektowa:** to NIE są dwa różne drzewa komponentów. Każdy
komponent na mapie/ekranie ćwiczenia czyta `ProfileContext` i renderuje
wariant przez propsy/theme tokens — jeden `WorldNode.tsx`, nie
`WorldNodeKid.tsx` + `WorldNodeAdult.tsx`. Utrzymuje to jedno źródło prawdy
dla logiki (odblokowanie, nawigacja, stan) i zapobiega rozjazdowi zachowania
między trybami.

---

## 3. Mapa krain i progresja

### 3.1 Struktura

```
Strefa darmowa (zawsze odblokowana):
  1. Wioska Nut        — czytanie nut na pięciolinii
  2. Miasto Rytmu       — wartości rytmiczne, tapowanie rytmu
  3. Przystań Taktów    — metrum, takty, kreski taktowe

Strefa premium (wymaga aktywnej subskrypcji):
  4. Pasmo Interwałów   — rozpoznawanie i budowanie interwałów
  5. Zatoka Trójdźwięków — akordy, jakości trójdźwięków
  6. Labirynt Tonacji    — koło kwintowe, tonacje, znaki przykluczowe
  7. Fabryka Budowania   — budowanie akordów/interwałów na klawiaturze/pięciolinii
  8. Gaj Grupowania      — grupowanie (belkowanie) wartości rytmicznych
  9. Szczyt Dyktand      — dyktando melodyczno-rytmiczne (synteza wszystkiego)
```

Krainy 1-9 są **liniowo zależne** (jak w istniejącej apce webowej) — kraina N
odblokowuje się dopiero po ukończeniu N-1, NIEZALEŻNIE od statusu
subskrypcji. Subskrypcja odblokowuje *dostęp do wejścia*, nie pomija
kolejności nauki. Innymi słowy: dostęp do treści = `isSubscribed &&
isPreviousWorldComplete`, nigdy `isSubscribed` samo w sobie.

### 3.2 Model danych krainy

```ts
interface WorldDefinition {
  id: string;                // np. "wioska-nut" — stabilny identyfikator
  order: number;             // 1-9, kolejność na mapie
  nameKey: TranslationKey;   // i18n, nie hardkodowany string
  isPremium: boolean;        // true dla krain 4-9
  accentColor: string;       // token motywu tej krainy (mapa + nagłówek)
  mapIllustrationId: string; // referencja do ilustracji (young-explorer)
  mapIconId: string;         // referencja do ikony (hobbyist)
}
```

`data/worlds.ts` eksportuje `WORLDS: WorldDefinition[]` — jedno źródło
prawdy dla mapy, paywalla i nawigacji. Realna treść lekcji (ćwiczenia w
środku krainy) żyje osobno, per świat — poza zakresem tej specyfikacji
(odpowiednik `data/worlds/*.json` w wersji webowej).

### 3.3 Stan odblokowania węzła na mapie

Dla każdego węzła na mapie liczony jest jeden z czterech stanów wizualnych:

1. **`completed`** — ukończona, dostępna do powtórki (checkmark/gwiazdki)
2. **`available`** — następna do zrobienia, wizualnie wyróżniona (puls/glow)
3. **`locked-progression`** — zablokowana bo poprzednia nieukończona (wyszarzona, kłódka "ukończ poprzednią")
4. **`locked-subscription`** — poprzednia ukończona, ale brak subskrypcji (wyszarzona, kłódka premium + tap otwiera paywall)

```ts
function resolveNodeState(
  world: WorldDefinition,
  progress: ProgressState,
  subscription: SubscriptionStatus
): WorldNodeState {
  if (progress.completedWorldIds.has(world.id)) return "completed";
  const previous = WORLDS.find((w) => w.order === world.order - 1);
  const previousDone = !previous || progress.completedWorldIds.has(previous.id);
  if (!previousDone) return "locked-progression";
  if (world.isPremium && !subscription.isActive) return "locked-subscription";
  return "available";
}
```

### 3.4 Animacje przejścia między krainami

- Mapa to jeden przewijalny `ScrollView`/`Animated.FlatList` (pionowa ścieżka,
  krainy jako przystanki wzdłuż wijącej się drogi — konwencja Duolingo).
  Nie osobne ekrany per kraina na poziomie mapy.
- Tap na dostępny węzeł → `Modal`/`Screen` z podglądem krainy (nazwa,
  ilustracja, "Rozpocznij") wjeżdżający od dołu (`slide_from_bottom`,
  ~280ms, easing `ease-out`) — nie natychmiastowe przejście, daje moment
  antycypacji.
- Tap na `locked-subscription` → od razu `PaywallScreen` jako modal
  (`slide_from_bottom`), pomijając podgląd krainy.
- Ukończenie krainy → powrót na mapę z animacją "odblokowania" następnego
  węzła (scale-in + confetti w young-explorer; subtelny fade w hobbyist).

---

## 4. Ekran płatności i paywall

### 4.1 Kiedy się pojawia

Wyłącznie przy próbie wejścia do krainy 4 (Pasmo Interwałów) lub dowolnej
kolejnej `locked-subscription` — nigdy jako interstitial narzucony w
trakcie nauki w darmowej strefie. Darmowa strefa musi zostać w pełni
doświadczona bez przerywania płatnością — to jest "hak" produktowy.

### 4.2 Bramka rodzicielska (Parental Gate)

Zanim `PaywallScreen` pokaże cokolwiek związanego z płatnością, wymagane
jest przejście prostej bramki matematycznej — standard branżowy (Apple/
Google App Store Review Guidelines wymagają tego dla treści kierowanych do
dzieci przy akcjach typu zakup/link zewnętrzny/dane rodzica).

```ts
// components/paywall/MathGateModal.tsx
interface MathChallenge {
  a: number;
  b: number;
  operator: "+" | "-" | "×";
  answer: number;
}

function generateMathChallenge(): MathChallenge {
  // Dwucyfrowe dodawanie/odejmowanie — trywialne dla dorosłego,
  // nietrywialne (i nienudne) dla 7-latka bez kalkulatora w ręku.
  const a = 10 + Math.floor(Math.random() * 40);
  const b = 5 + Math.floor(Math.random() * 20);
  return { a, b, operator: "+", answer: a + b };
}
```

- Trzy próby, potem 30s odstępu przed kolejną (miękkie spowolnienie, nie
  twarda blokada — unikamy frustrowania dorosłego, który się pomylił).
- Bramka pojawia się RAZ na sesję (nie przy każdym ekranie subskrypcji w
  ramach tej samej sesji aplikacji) — stan `parentalGatePassedAt` w pamięci
  (nie trwały storage — każde ponowne uruchomienie aplikacji wymaga
  przejścia ponownie).

### 4.3 Zawartość `PaywallScreen`

Struktura (od góry):

1. **Nagłówek korzyści** — 3-4 punkty z ikoną, konkretne, nie marketingowe
   ogólniki: "Wszystkie 9 krain", "Dyktanda ze słuchu", "Bez reklam",
   "Postęp synchronizowany na wszystkich urządzeniach".
2. **Wybór planu** — dwie karty side-by-side:
   - Miesięczny — cena bazowa
   - Roczny — cena/miesiąc niższa, badge "Oszczędzasz X%" (obliczane z
     realnych cen sklepowych, nigdy hardkodowane %), domyślnie zaznaczony
     (wyższa wartość życiowa klienta, standard branżowy).
3. **CTA** — jeden duży przycisk, tekst dynamiczny z ceną wybranego planu
   ("Rozpocznij — 29,99 zł/rok"), nie generyczne "Subskrybuj".
4. **Drobny druk** — auto-odnawianie, link do warunków, "Przywróć zakupy".
5. **Link "Nie teraz"** — zawsze widoczny, nie ukryty/zminiaturyzowany —
   presja sprzedażowa obniża zaufanie rodzica, co szkodzi retencji bardziej
   niż jedna niekonwertująca wizyta.

### 4.4 Panel statusu subskrypcji (w Ustawieniach)

Osobny widok (`SubscriptionStatusScreen`, dostępny z Ustawień, za tą samą
bramką matematyczną) pokazuje:
- Aktywny plan i data następnego odnowienia / wygaśnięcia
- Przycisk zarządzania subskrypcją (deep link do App Store/Play Store
  subscription management — appka NIGDY nie obsługuje anulowania
  bezpośrednio, to zawsze przez sklep)
- Historia = tylko status bieżący, bez faktur (te są po stronie sklepu)

### 4.5 Model stanu subskrypcji

```ts
type SubscriptionPlan = "monthly" | "yearly";

interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiresAt: string | null;      // ISO date, null jeśli nigdy nie kupował
  isInGracePeriod: boolean;      // płatność nieudana, Apple/Google daje bufor
  isTrialActive: boolean;
}
```

Źródło prawdy: RevenueCat (albo `expo-in-app-purchases` bezpośrednio, jeśli
zespół świadomie rezygnuje z warstwy pośredniej) — **nigdy** własny backend
jako jedyne źródło prawdy o subskrypcji; webhook Apple/Google → backend
tylko jako kopia do analityki/synchronizacji cross-device, walidacja
uprawnień zawsze przez SDK sklepu przy starcie aplikacji.

---

## 5. Stack techniczny i struktura projektu

### 5.1 Wybory technologiczne

| Warstwa | Wybór | Uzasadnienie |
|---|---|---|
| Framework | Expo (managed workflow) + React Native | Jeden codebase iOS/Android, EAS Build/Submit, OTA update dla treści niekodowych |
| Routing | Expo Router (file-based) | Ten sam mental model co Next.js App Router w wersji web — łatwiejszy transfer wiedzy w zespole |
| Język | TypeScript, strict | Spójne z resztą stacku projektu |
| Stan globalny | React Context + `useReducer` per domena (Profile, Subscription, Progress) | Skala aplikacji nie uzasadnia Redux/Zustand na starcie; łatwo dodać później per-domenowo bez przepisywania wszystkiego |
| Trwały storage lokalny | `expo-secure-store` (dane wrażliwe: token sesji) + `@react-native-async-storage/async-storage` (preferencje: profil, dźwięk) | Rozdział wg wrażliwości danych |
| Płatności | RevenueCat SDK | Ujednolica Apple/Google IAP, obsługuje grace period/trial bez własnej logiki |
| Animacje | `react-native-reanimated` + `lottie-react-native` (maskotki/nagrody w young-explorer) | Reanimated dla przejść UI (60fps na UI thread), Lottie dla bogatych ilustrowanych animacji nagród |
| i18n | Własny lekki `t()` (mirror wzorca z wersji web: `data/i18n/pl.json` + `lib/i18n/translate.ts`) | Spójność wzorca między web i mobile, brak potrzeby pełnego i18next na start (jeden język na start: polski) |
| Testy | Jest + `@testing-library/react-native` | Standard w ekosystemie Expo |

### 5.2 Struktura folderów

```
master-quest-mobile/
├── app/                          # Expo Router — struktura = nawigacja
│   ├── _layout.tsx               # Root: providers (Profile, Subscription, Theme, Progress)
│   ├── index.tsx                 # Redirect: onboarding vs (main)/map wg stanu
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   └── profile-picker.tsx
│   ├── (main)/
│   │   ├── _layout.tsx           # Tab/stack layout dla głównego flow
│   │   ├── map.tsx               # Mapa krain
│   │   ├── lesson/[worldId].tsx  # Ekran ćwiczeń danej krainy
│   │   └── settings/
│   │       ├── index.tsx
│   │       └── subscription-status.tsx
│   └── paywall.tsx               # Modal, prezentowany z dowolnego miejsca
├── components/
│   ├── map/
│   │   ├── WorldMap.tsx
│   │   ├── WorldNode.tsx         # Dual-mode: czyta ProfileContext
│   │   └── WorldPreviewSheet.tsx
│   ├── paywall/
│   │   ├── MathGateModal.tsx
│   │   ├── SubscriptionPlanCard.tsx
│   │   └── PaywallBenefitsList.tsx
│   ├── profile/
│   │   ├── ProfilePickerCard.tsx
│   │   ├── RewardCelebration.tsx # Lottie — tylko young-explorer
│   │   └── AccuracyStatsPanel.tsx # tylko hobbyist
│   └── ui/                       # Prymitywy dual-mode: Button, Card, ScreenHeader
├── context/
│   ├── ProfileContext.tsx
│   ├── SubscriptionContext.tsx
│   └── ProgressContext.tsx
├── data/
│   └── worlds.ts
├── theme/
│   ├── tokens.ts                 # Paleta, typografia, spacing — per profil
│   └── ThemeProvider.tsx
├── lib/
│   ├── subscriptions/
│   │   └── purchases.ts          # Wrapper na RevenueCat SDK
│   ├── storage.ts                # AsyncStorage/SecureStore helpers
│   └── i18n/
│       └── translate.ts
├── data/i18n/
│   └── pl.json
├── types/
│   └── content.ts                # WorldDefinition, ProfileMode, SubscriptionStatus, ...
├── assets/
│   ├── illustrations/            # young-explorer: maskotki, krainy
│   ├── icons/                    # hobbyist: proste ikony SVG
│   └── lottie/                   # animacje nagród
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

### 5.3 Responsywność i różnorodność ekranów

- Wszystkie wymiary w jednostkach niezależnych od gęstości (`pt`/`dp` przez
  RN domyślnie), zero hardkodowanych pikseli poza `theme/tokens.ts`.
- `useWindowDimensions()` + progi (`isSmallScreen = width < 375`) tylko tam,
  gdzie layout musi się realnie przełączyć (np. dwie karty planu obok siebie
  → jedna pod drugą na wąskim ekranie) — nie masowe `Platform.select` w
  każdym komponencie.
- Bezpieczne obszary przez `react-native-safe-area-context` wszędzie, gdzie
  ekran dotyka krawędzi (mapa, paywall) — notch/dynamic island/gesture bar.
- Tekst skaluje się z systemowymi ustawieniami dostępności
  (`allowFontScaling`, z rozsądnym `maxFontSizeMultiplier` na przyciskach,
  żeby nie rozjechać layoutu przy maksymalnym powiększeniu systemowym).

---

## 6. Otwarte pytania do zespołu (przed startem implementacji)

1. Czy treść lekcji (silnik ćwiczeń) jest portowana 1:1 z wersji webowej,
   czy budowana od nowa pod mobile? Wpływa to mocno na `lesson/[worldId].tsx`.
2. Czy konto jest wymagane (logowanie) już od darmowej strefy, czy dopiero
   przy subskrypcji? Wpływa na moment synchronizacji postępu cross-device.
3. Czy jeden zakup obejmuje rodzinę (App Store Family Sharing) — wpływa na
   copy w paywallu i na testy QA.
4. Docelowy zakres językowy — jeśli tylko polski na start, i18n warstwa i
   tak zostaje przygotowana pod przyszłe rozszerzenie (nie hardkodować
   stringów w komponentach).
