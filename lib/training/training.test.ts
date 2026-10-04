import { describe, expect, it } from "@jest/globals";
import { WORLDS } from "@/data/worlds";
import { getWorldContent } from "@/data/lessons";
import { mergeTraining } from "@/lib/sync/mergeState";
import { EXTRA_SOLFEGE_SONGS } from "@/data/training/solfegeSongs";
import { generateExercise } from "@/lib/questions/generate";
import { beatsOf } from "@/lib/rhythm/valueBeats";
import { meterQuarterNoteBeats } from "@/lib/rhythm/meter";
import { allTrainingItems, buildPool, pickNext, topicAvailable } from "@/lib/training/pool";
import { MIN_ANSWERS_FOR_STATS, TRAINING_REWARDED_ANSWERS_PER_DAY } from "@/lib/training/rewards";
import { EMPTY_TRAINING, lastWeek, percent, recordAnswer, rewardsLeftToday, weakestTopics } from "@/lib/training/stats";
import { DIFFICULTY_OPTIONS, EXCLUDED_TRAINING_TYPES, TRAINING_TOPICS, decodeSelection, encodeOptions, optionsOf, selectionIsValid, topicOfType } from "@/lib/training/topics";
import type { TrainingSelection } from "@/lib/training/topics";

const sel = (topicIds: string[], options: Record<string, string[]> = {}): TrainingSelection => ({ topicIds, options });

describe("Tryb własny: categories and pool", () => {
  it("every exercise type used in the lessons belongs to a pool category or is left out on purpose", () => {
    const unknown = new Set<string>();
    for (const world of WORLDS) {
      for (const lesson of getWorldContent(world.id)?.lessons ?? []) {
        for (const definition of lesson.exercises) {
          const type = definition.spec.type;
          if (!topicOfType(type) && !EXCLUDED_TRAINING_TYPES.includes(type)) unknown.add(type);
        }
      }
    }
    expect([...unknown]).toEqual([]);
  });

  it("no type is listed in two categories, and none is both used and excluded", () => {
    const seen = new Set<string>();
    for (const topic of TRAINING_TOPICS) {
      for (const type of topic.types) {
        expect(seen.has(type)).toBe(false);
        expect(EXCLUDED_TRAINING_TYPES.includes(type)).toBe(false);
        seen.add(type);
      }
    }
  });

  it("every category gives something to practise with its default options", () => {
    for (const topic of TRAINING_TOPICS) {
      expect(buildPool(sel([topic.id]), "mieszane", false).length).toBeGreaterThan(0);
      expect(topicAvailable(topic.id, false)).toBe(true);
      expect(selectionIsValid(sel([topic.id]))).toBe(true);
      for (const { id } of DIFFICULTY_OPTIONS) expect(buildPool(sel([topic.id]), id, false).length).toBeGreaterThan(0);
    }
    expect(allTrainingItems().length).toBeGreaterThan(800);
  });

  it("the picked categories and ticked options are what the pool is made of", () => {
    const rhythmic = buildPool(sel(["dyktanda"], { dyktanda: ["rytmiczne"] }), "mieszane", false);
    expect(rhythmic.length).toBeGreaterThan(0);
    expect(rhythmic.every((item) => item.definition.spec.type !== "melodic-rhythmic-dictation")).toBe(true);
    const melodic = buildPool(sel(["dyktanda"], { dyktanda: ["melodyczno-rytmiczne"] }), "mieszane", false);
    expect(melodic.every((item) => item.definition.spec.type === "melodic-rhythmic-dictation")).toBe(true);
    const both = buildPool(sel(["dyktanda"], { dyktanda: ["rytmiczne", "melodyczno-rytmiczne"] }), "mieszane", false);
    expect(both.length).toBe(rhythmic.length + melodic.length);
    const mixed = buildPool(sel(["rytm", "nuty"]), "mieszane", false);
    expect(new Set(mixed.map((item) => item.topicId))).toEqual(new Set(["rytm", "nuty"]));
  });

  it("a generated category needs enough ticked options", () => {
    expect(selectionIsValid(sel(["rozp-interwaly"], { "rozp-interwaly": ["3"] }))).toBe(false);
    expect(selectionIsValid(sel(["rozp-interwaly"], { "rozp-interwaly": ["3", "4"] }))).toBe(true);
    expect(selectionIsValid(sel(["bud-interwaly"], { "bud-interwaly": ["3"] }))).toBe(true);
    expect(selectionIsValid(sel(["bud-interwaly"], { "bud-interwaly": [] }))).toBe(false);
    expect(selectionIsValid(sel([]))).toBe(false);
    expect(buildPool(sel(["rozp-troj"], { "rozp-troj": ["major"] }), "mieszane", false)).toEqual([]);
  });

  it("the selection survives being put in an address and read back", () => {
    const selection = sel(["rozp-interwaly", "dyktanda", "nuty"], { "rozp-interwaly": ["3", "7", "12"], dyktanda: ["melodyczno-rytmiczne"] });
    const back = decodeSelection(selection.topicIds.join(","), encodeOptions(selection));
    expect(back.topicIds).toEqual(selection.topicIds);
    expect(optionsOf(back, "rozp-interwaly")).toEqual(["3", "7", "12"]);
    expect(optionsOf(back, "dyktanda")).toEqual(["melodyczno-rytmiczne"]);
    expect(optionsOf(back, "rozp-troj")).toEqual(["major", "minor"]);
    expect(decodeSelection("zle,nuty", "").topicIds).toEqual(["nuty"]);
  });

  it("does not repeat the last questions while there is something else", () => {
    const pool = buildPool(sel(["nuty"]), "mieszane", false);
    const recent = pool.slice(0, 5).map((item) => item.definition.id);
    for (let i = 0; i < 40; i++) expect(recent).not.toContain(pickNext(pool, recent)!.definition.id);
    expect(pickNext([], [])).toBeNull();
    expect(pickNext(pool.slice(0, 1), [pool[0].definition.id])).toBe(pool[0]);
  });
});

describe("Tryb własny: generated exercises", () => {
  function draw(topicId: string, options: string[], count = 40) {
    const items = buildPool(sel([topicId], { [topicId]: options }), "mieszane", false);
    expect(items.length).toBeGreaterThan(0);
    return Array.from({ length: count }, (_, i) => generateExercise(items[i % items.length].definition, "pl"));
  }

  it("recognising intervals: listening only, in the okienko, and only the ticked intervals", () => {
    for (const exercise of draw("rozp-interwaly", ["3", "4", "7"])) {
      expect(exercise.type).toBe("interval-name-choice");
      if (exercise.type !== "interval-name-choice") return;
      expect(exercise.hideNotation).toBe(true);
      expect(["3", "4", "7"]).toContain(exercise.correctOptionId);
      expect(exercise.options.map((option) => option.id).sort()).toEqual(["3", "4", "7"]);
    }
  });

  it("recognising triads and dominants: only the ticked kinds, notation hidden", () => {
    for (const exercise of draw("rozp-troj", ["major", "diminished"])) {
      expect(exercise.type).toBe("triad-quality-choice");
      if (exercise.type !== "triad-quality-choice") return;
      expect(exercise.hideNotation).toBe(true);
      expect(["major", "diminished"]).toContain(exercise.correctOptionId);
    }
    for (const exercise of draw("rozp-dom", ["root", "second"])) {
      expect(exercise.type).toBe("dominant-seventh-inversion-choice");
      if (exercise.type !== "dominant-seventh-inversion-choice") return;
      expect(exercise.hideNotation).toBe(true);
      expect(["root", "second"]).toContain(exercise.inversion);
    }
  });

  it("building intervals, triads and dominants never throws and uses only what was ticked", () => {
    const interval = draw("bud-interwaly", ["5"]);
    expect(new Set(interval.map((exercise) => exercise.type))).toEqual(new Set(["interval-build-choice", "interval-build-staff-choice"]));
    expect(draw("bud-troj", ["minor"]).length).toBe(40);
    expect(draw("bud-dom", ["first", "third"]).length).toBe(40);
  });
});

describe("Tryb własny: the extra solfege songs", () => {
  it("every song fills whole measures, has one rhythm value per note and stays between C4 and C6", () => {
    expect(EXTRA_SOLFEGE_SONGS.length).toBeGreaterThanOrEqual(6);
    for (const song of EXTRA_SOLFEGE_SONGS) {
      expect(song.spec.type).toBe("solfege-phrase-singing");
      if (song.spec.type !== "solfege-phrase-singing") return;
      const { notes, rhythm, meter } = song.spec;
      expect(rhythm).toBeDefined();
      expect(rhythm!.length).toBe(notes.length);
      const measure = meterQuarterNoteBeats(meter!);
      let position = 0;
      for (const value of rhythm!) {
        const beats = beatsOf(value);
        // a note must not cross a barline
        expect(Math.floor(position / measure + 1e-6)).toBe(Math.floor((position + beats) / measure - 1e-6));
        position += beats;
      }
      expect(position % measure).toBeCloseTo(0, 6);
      for (const note of notes) expect(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]).toContain(note);
      expect(song.spec.sourceLabel).toMatch(/Fragment: „/);
    }
    expect(new Set(EXTRA_SOLFEGE_SONGS.map((song) => song.id)).size).toBe(EXTRA_SOLFEGE_SONGS.length);
  });

  it("the solfege category offers the songs", () => {
    const ids = buildPool(sel(["solfez"]), "mieszane", false).map((item) => item.definition.id);
    for (const song of EXTRA_SOLFEGE_SONGS) expect(ids).toContain(song.id);
  });
});

describe("Tryb własny: statistics and rewards", () => {
  it("counts answers per topic and day, and finds the weakest topics", () => {
    let state = EMPTY_TRAINING;
    for (let i = 0; i < 12; i++) state = recordAnswer(state, "rozp-interwaly", i < 9, "2026-10-04");
    for (let i = 0; i < 12; i++) state = recordAnswer(state, "bud-troj", i < 4, "2026-10-04");
    for (let i = 0; i < 3; i++) state = recordAnswer(state, "rytm", false, "2026-10-04"); // too few answers to count
    expect(percent(state.totals["rozp-interwaly"])).toBe(75);
    expect(percent(state.totals["bud-troj"])).toBe(33);
    expect(percent(undefined)).toBeNull();
    expect(weakestTopics(state, 2)).toEqual(["bud-troj", "rozp-interwaly"]);
    expect(MIN_ANSWERS_FOR_STATS).toBeGreaterThan(3);
    expect(lastWeek(state, "rozp-interwaly", "2026-10-06")).toEqual({ correct: 9, total: 12 });
    expect(lastWeek(state, "rozp-interwaly", "2026-10-20")).toEqual({ correct: 0, total: 0 });
  });

  it("forgets old days but keeps the totals", () => {
    let state = recordAnswer(EMPTY_TRAINING, "nuty", true, "2026-09-01");
    state = recordAnswer(state, "nuty", true, "2026-10-04");
    expect(Object.keys(state.days)).toEqual(["2026-10-04"]);
    expect(state.totals.nuty.total).toBe(2);
  });

  it("the reward cap resets every day", () => {
    const used = { ...EMPTY_TRAINING, rewardDateISO: "2026-10-04", rewardedToday: TRAINING_REWARDED_ANSWERS_PER_DAY };
    expect(rewardsLeftToday(used, "2026-10-04", TRAINING_REWARDED_ANSWERS_PER_DAY)).toBe(0);
    expect(rewardsLeftToday(used, "2026-10-05", TRAINING_REWARDED_ANSWERS_PER_DAY)).toBe(TRAINING_REWARDED_ANSWERS_PER_DAY);
    expect(rewardsLeftToday(EMPTY_TRAINING, "2026-10-05", 30)).toBe(30);
  });

  it("sync keeps the copy with more answers, the best records and the newer reward counter", () => {
    const a = recordAnswer(recordAnswer(EMPTY_TRAINING, "rytm", true, "2026-10-04"), "rytm", true, "2026-10-04");
    const b = { ...recordAnswer(EMPTY_TRAINING, "rytm", false, "2026-10-04"), bestStreak: 7, bestTimed: 3, rewardDateISO: "2026-10-04", rewardedToday: 5 };
    const merged = mergeTraining({ ...a, bestStreak: 4, bestTimed: 9, rewardDateISO: "2026-10-03", rewardedToday: 30 }, b);
    expect(merged.totals.rytm).toEqual({ correct: 2, total: 2 });
    expect(merged.bestStreak).toBe(7);
    expect(merged.bestTimed).toBe(9);
    expect(merged.rewardDateISO).toBe("2026-10-04");
    expect(merged.rewardedToday).toBe(5);
  });
});
