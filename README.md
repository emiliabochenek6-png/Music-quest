# Music Quest Mobile

Szkielet aplikacji mobilnej (Expo/React Native) — patrz
[`ARCHITECTURE.md`](./ARCHITECTURE.md) po pełną specyfikację architektury,
dual-mode UX (Młody Odkrywca / Hobbysta), mapę 9 krain i paywall.

## Status tego szkieletu

Zweryfikowane (`npx tsc --noEmit` i `npx jest` przechodzą czysto):

- Providery stanu: `ProfileContext`, `SubscriptionContext`, `ProgressContext`
- Logika odblokowania mapy: `lib/progression/resolveNodeState.ts` (+ testy)
- Bramka matematyczna: `lib/paywall/mathChallenge.ts` (+ testy),
  `components/paywall/MathGateModal.tsx`
- Dual-mode theme tokens: `theme/tokens.ts`, `theme/ThemeProvider.tsx`
- Dual-mode komponent mapy: `components/map/WorldNode.tsx`,
  `components/map/WorldMap.tsx`
- Nawigacja (Expo Router): onboarding → wybór profilu → mapa → lekcja/paywall
- Wrapper na RevenueCat: `lib/subscriptions/purchases.ts`

**Nieuruchamiane na żywo w tej sesji** — brak symulatora/urządzenia w tym
środowisku, brak kluczy RevenueCat/App Store Connect. `npx tsc --noEmit`
potwierdza poprawność typów całego szkieletu, ale to NIE to samo co
sprawdzenie działania UI na ekranie — przed pierwszym realnym użyciem
uruchom `npx expo start` i przejdź cały flow na symulatorze/urządzeniu.

**Świadomie poza zakresem** (patrz `ARCHITECTURE.md`, sekcja 6):

- Silnik ćwiczeń wewnątrz krainy (`app/(main)/lesson/[worldId].tsx` to
  zaślepka z przyciskiem "oznacz jako ukończone")
- Prawdziwe ilustracje/ikony/animacje Lottie (referencje przez `id`,
  assety same w sobie nie istnieją)
- Konto/logowanie i synchronizacja postępu cross-device
- Realne klucze RevenueCat / identyfikatory produktów w App Store Connect
  i Play Console

## Uruchomienie

```bash
npm install --legacy-peer-deps
npx expo start
```

(`--legacy-peer-deps` potrzebne dopóki `@testing-library/react-native`
i zainstalowana wersja React/React Native nie zostaną zsynchronizowane —
patrz ostrzeżenie npm przy pierwszym `npm install`.)

## Testy i typy

```bash
npx tsc --noEmit
npx jest
```
