# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Music Quest — an Expo/React Native (+ react-native-web) app that teaches music
theory and ear training to kids through a Duolingo-style map of 13
curriculum "worlds" (`data/worlds.ts`), each broken into lessons
(`data/lessons/*.ts`), each lesson a sequence of typed exercises. Worlds 1-3
are free; 4-13 require an active subscription on top of finishing the
previous world (progression is never skipped by paying — see
`lib/progression/resolveNodeState.ts`). Ships to iOS/Android via EAS and to
web via a static export auto-deployed to **musicquest.pl** (Vercel) on every
push to `main`.

`README.md` and `ARCHITECTURE.md` are an early pre-implementation spec —
useful for product intent, but stale on specifics: the "dual-mode
young-explorer/hobbyist profile" in `ARCHITECTURE.md` §2 was never built
(there's one unified kid-friendly presentation instead), and login
(Supabase) is now a hard gate before the map, not the "optional, add later"
item §6 lists. Trust the actual code over either doc.

## Ground rules

- Before committing anything, run `npx tsc --noEmit` and `npx jest` — both must be clean.
- Never `git push` unless the user explicitly asks for it in that message. Commit and stop; wait for a separate go-ahead before pushing (each push needs its own explicit request, not a standing approval).
- Never edit `lib/progression/resolveNodeState.ts` without the user's explicit, specific permission — ask first, even if a fix seems to belong there.
- Reply to the user in Polish, in plain language, without jargon.

## Commands

```bash
npm install --legacy-peer-deps   # needed until @testing-library/react-native syncs with the installed React/RN version
npx tsc --noEmit                 # typecheck — the real source of truth; `npm run lint` exists in package.json but eslint isn't actually installed/configured, don't rely on it
npx jest                         # full test suite
npx jest path/to/file.test.ts    # single file
npx jest -t "test name substring"
npx expo start                   # dev server (Expo Go / simulator)
npx expo export --platform web --clear   # static web build into dist/ (same as `npm run build:web`)
npx expo export --platform ios --clear   # sanity-checks the native bundle still compiles without a full EAS build
```

There is no test watch mode configured beyond Jest's own `--watch` flag.

## Web preview workflow (no simulator/device needed)

`app/index.tsx` and `app/(main)/_layout.tsx` gate everything behind
Supabase auth, so a plain `expo export --platform web` + static file server
just redirects to `/auth/login`. To actually see a screen locally:

1. Temporarily bypass the gate: in `app/(main)/_layout.tsx` change
   `if (!user)` to `if (!user && false)`, and in `app/index.tsx` hardcode
   the redirect to `/(main)/map`.
2. `npx expo export --platform web --clear`, then serve `dist/` (e.g.
   `python3 -m http.server 8765` from inside `dist/`).
3. The static export has no server-side rewrites for dynamic routes
   locally (those only exist in `vercel.json`, applied by Vercel in
   production) — direct navigation to e.g. `/lesson/zs-poziom-1-cala-gama`
   404s. Load `/` first, then in the browser console:
   `history.pushState({}, '', '/lesson/<id>?worldId=<worldId>'); window.dispatchEvent(new PopStateEvent('popstate'));`
4. **Revert step 1 before committing** — this bypass must never ship.

Microphone-gated screens (Zaczarowany Solfeż) can be exercised in an
automated browser by shimming `navigator.mediaDevices.getUserMedia` to
return an oscillator-driven `MediaStreamAudioDestinationNode` instead of a
real mic — see recent commits touching `SolfegePhraseSingingExercise.tsx`
for the pattern. A pure sine tone's autocorrelation clarity is lower than a
real voice's, especially for low notes — sing it an octave up from the
target; `classifyPitchMatch` folds octaves, so it still grades as correct.

## Deploy

Push to `main` → Vercel builds `npm run build:web` and deploys to
musicquest.pl automatically, usually within ~4-5 minutes. To confirm a
deploy landed: `curl -s -A "Mozilla/5.0" https://musicquest.pl | grep -o '_expo/static/js/web/entry-[a-f0-9]*\.js'` and compare the hash before/after
push.

## Test E2E (Playwright)

Jeden test „jak prawdziwy gracz” w przeglądarce (`e2e/first-lesson.spec.ts`): logowanie kontem testowym → Wioska Nut → poziom 1 → „Wysoki” → „Sprawdź” → XP rośnie o 10.

- **Konto testowe:** użytkownik założony w panelu Supabase (Authentication → Users → Add user, z „Auto Confirm User”). Jego e-mail i hasło trzymamy w lokalnym pliku `.env.test` (poza gitem): `TEST_EMAIL=…` i `TEST_PASSWORD=…`. Bez tego pliku test się pomija.
- **Uruchomienie:** `npm run test:e2e` (najpierw buduje stronę, potem uruchamia test; ~3-4 min). `npm run test:e2e:fast` pomija budowanie i używa istniejącego `dist/`: tylko jeśli `dist/` jest zwykłym buildem, nie podglądem z obejściem logowania.
- **Co test sprawdza:** XP czyta z etykiety paska poziomu (`components/LevelBar.tsx`, `testID="level-bar"`) i porównuje „po” z „przed” + 10, bo konto testowe zbiera XP przy każdym biegu. Okna powitalne nowego gracza zamyka po kolei (bez ustawiania flag), bo pierwsze logowanie świeżego konta zeruje dane lokalne.
- **Szybki przegląd:** `e2e/smoke.spec.ts` po zalogowaniu otwiera 11 ekranów i pierwszą lekcję każdej z 13 krain (sprawdza brak błędów strony, pustych ekranów i poziomego przewijania; ~25 s). Lista pierwszych lekcji jest wpisana w pliku, bo dane lekcji ładują pliki audio, których Node nie wczyta.
- **Wejście nowego gracza:** jedno okno („Cześć, jestem Solfek!” z wyborem trybu); przewodnik po grze pokazuje się dopiero po pierwszej ukończonej lekcji (`app/(main)/map.tsx`).
- **Okna awansu:** `e2e/first-lesson.spec.ts` ma trzy przypadki: zwykły, awans na level 2 (mały baner) i awans na level 5 (pełny ekran „Nowy level!”). Dwa ostatnie ustawiają XP konta testowego tuż przed progiem (`setTestAccountXp` w `e2e/helpers.ts`), a test sam zamyka okno „Lecimy dalej!” (animacja trwa ok. 5 s, przycisk działa po niej). Każdy błąd strony (np. React #418) wywraca test; `STRICT_PAGE_ERRORS=0` tylko je wypisuje.
- **Czego nie pokrywa:** tylko ta jedna ścieżka. Test loguje się do tej samej bazy Supabase co produkcja (z `.env`), więc konto testowe rośnie w XP; po wielu biegach pojawią się okna awansu na kolejny level.
- `e2e/serve-dist.mjs` to mały serwer plików dla `dist/` (odtwarza adresy bez `.html` i przekierowania z `vercel.json`); zwykłe testy (`npx jest`) pomijają folder `e2e/`.

## Tryb własny (trzeci tryb na mapie)

Trening bez końca: gracz wybiera tematy, trudność i sposób gry (spokojny trening 10/20/bez końca, „Seria” do 3 błędów, „Na czas” 60 s). Kategorie „z zaznaczaniem” (rozpoznawanie i budowanie interwałów, trójdźwięków, dominant) generują zadania na bieżąco z szablonów (`lib/training/generated.ts`, losowanie robi `generateExercise`), kategorie „z gotowych zadań” (nuty, rytm, tonacje, dyktanda, solfeż) biorą je z istniejących lekcji (`lib/training/topics.ts` przypisuje typy ćwiczeń do kategorii, `pool.ts` buduje pulę); dodatkowe piosenki do solfeżu są w `data/training/solfegeSongs.ts` (do sprawdzenia przez muzyka), ekrany to `components/training/TrainingHome.tsx`, `app/(main)/training.tsx` i `app/(main)/training-stats.tsx` („Twój słuch”). Statystyki i rekordy leżą w `GamificationState.training` (ta sama kolumna `gamification` w Supabase, scalane w `mergeTraining`). Tryb własny nie zmienia postępu w grze ani w planie; nagroda to 5 XP + 1 nutka za poprawną odpowiedź, tylko za pierwsze 30 dziennie (`lib/training/rewards.ts`). Tematy płatnych krain zamykałyby się bez subskrypcji tylko wtedy, gdy włączone jest `TRAINING_REQUIRES_SUBSCRIPTION` (lustro `ENFORCE_SUBSCRIPTION_GATE`, dziś wyłączone).

## Architecture

### Provider stack (`app/_layout.tsx`)

Nesting order is load-bearing, not incidental — read the doc comment there
before reordering: `ThemeProvider` must sit inside `ProfileProvider` (reads
it), `GamificationProvider` inside `SubscriptionProvider` (hearts' unlimited
behavior), and `AuthProvider` above both `ProgressProvider` and
`GamificationProvider` (their opt-in Supabase cloud sync needs `useAuth()`).

### Exercise engine — the 4-file pattern

Every exercise type is wired in exactly four places; adding a new one means
touching all four:

1. `types/exercises.ts` — add the discriminated-union member to both
   `ExerciseSpec`/`GeneratedExercise` (authored vs. generated shape) and
   `AnswerInput`.
2. `lib/questions/generate.ts` — `generateExercise(definition, locale, exclude?)`
   turns an authored `ExerciseDefinition` (from `data/lessons/*.ts`) into a
   concrete `GeneratedExercise` (resolves randomization, picks distractors,
   etc.).
3. `lib/questions/validate.ts` — `isAnswerCorrect(exercise, answer)` grades it.
4. `components/exercises/ExerciseRenderer.tsx` — a switch on `exercise.type`
   dispatching to one dedicated component per type in
   `components/exercises/` (currently ~38 types, one file each).

`app/(main)/lesson/[lessonId].tsx` drives one lesson's exercise sequence,
looks up `getWorldById`/`getWorldContent` by the `worldId`/`lessonId` query
params (not a `[worldId]` route segment — see the web preview workflow
above), and awards XP/hearts/stars through `GamificationContext` on check.

Content authoring lives entirely in `data/lessons/*.ts` (one file per
world, matching `data/worlds.ts`'s 13 ids) as literal, non-randomized-at-
the-data-level specs — `generate.ts` only derives display/timing data from
them. **Rhythm-bearing content is a recurring source of authoring bugs**:
any `notes`/`rhythm`/`sequence` array must sum to a whole-number multiple of
its `meter`'s beats (`lib/rhythm/valueBeats.ts`'s `beatsOf`/`NOTE_VALUE_BEATS`),
and no single note's own span may cross a measure boundary — check both,
not just the total, when editing one (a Python one-off script per lesson
file, matching `beatsOf`'s table, is the fastest way to audit an entire
world at once).

### Gamification (`context/GamificationContext.tsx`, `lib/gamification/`)

Hearts (lose on wrong answer, regen over time or from correct answers),
XP/rank (`rank.ts`), streak + daily missions (`dailyMissions.ts`,
`activity.ts`), lesson stars (`stars.ts`), badges, and a "nutki" currency
spent in `power-ups.tsx`. `RankUpCelebration` lives at the root shell
(`app/_layout.tsx`) so a rank-up can surface from any screen.

### Auth + cross-device sync (`context/AuthContext.tsx`, `lib/supabase/`, `lib/sync/`)

Supabase (`lib/supabase/client.ts`) gates the whole `(main)` route group —
see `app/index.tsx` / `app/(main)/_layout.tsx`. `lib/sync/useCloudSync.ts` +
`mergeState.ts` opt `ProgressContext`/`GamificationContext` into syncing
with a Supabase row on login, merging local and remote non-destructively
(union of completed lessons, max of stars/XP per key, never a plain
overwrite) — see `supabase/schema.sql` for the table/RLS policies.
`EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` live in the
gitignored `.env`; `lib/supabase/client.ts` falls back to syntactically-valid
placeholders so a missing `.env` degrades to "auth doesn't work" instead of
crashing the whole app (including the static export's server-side
prerender, which has no `window`/`localStorage` at all — see that file's
own doc for why).

### Audio (`lib/audio/`)

Two independent concerns:

- **Playback** (`player.ts`, `rhythmPlayer.ts`) — on web, scheduled/looping
  sounds (metronome, melody, clapping) go through one shared, self-healing
  `AudioContext` singleton (`getWebAudioLoopContext` in `player.ts`) rather
  than `expo-audio`'s own web player, which is HTMLAudioElement-based and
  was the source of past audible glitches. Native platforms use
  `expo-audio` directly.
- **Microphone input** (`pitchDetection.ts`, Zaczarowany Solfeż only) — pure-JS
  autocorrelation pitch detection over recorded PCM. Two web-only gotchas
  already worked around, don't reintroduce them: `expo-file-system` doesn't
  work on web at all (falls through to `decodeAudioFileToPcm`'s own
  `fetch`+`decodeAudioData` path); `expo-audio`'s web recorder never exposes
  any audio before `.stop()`, so live mid-recording feedback
  (`SolfegePhraseSingingExercise.tsx`'s note-by-note highlight) uses
  `webLiveRecorder.ts` — a raw `MediaRecorder` with a `timeslice`, web-only,
  native keeps using `expo-audio`'s recorder unchanged.

### i18n

`lib/i18n/translate.ts`'s `t(key, locale, vars?)` reads `data/i18n/pl.json`;
`TranslationKey` is `keyof typeof pl` (auto-derived, not hand-maintained) —
adding a string is just adding the JSON key.
