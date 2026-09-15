import AsyncStorage from "@react-native-async-storage/async-storage";

/** Every persisted key in one place — avoids typo'd string literals
 * scattered across context providers, and makes it obvious at a glance
 * what this app keeps in local storage at all. */
export const STORAGE_KEYS = {
  profile: "master-quest.profile",
  gamification: "master-quest.gamification",
} as const;

export async function readJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Corrupted/incompatible stored value (e.g. left over from a previous
    // app version's differently-shaped state) — treat as absent rather
    // than crashing the app on launch.
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
