import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage";
import type { ProfileState } from "@/types/content";

const DEFAULT_PROFILE: ProfileState = {
  displayName: null,
  narratorEnabled: true,
  soundEffectsEnabled: true,
  hasSeenSoltekGreeting: false,
};

interface ProfileContextValue {
  profile: ProfileState;
  /** True while the persisted profile is still being read on launch — the
   * root layout gates rendering on this so the app never flashes default
   * settings before switching to the stored ones a beat later. */
  isLoading: boolean;
  setDisplayName: (name: string | null) => void;
  setNarratorEnabled: (enabled: boolean) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setHasSeenSoltekGreeting: (seen: boolean) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    readJson<ProfileState>(STORAGE_KEYS.profile).then((stored) => {
      if (cancelled) return;
      if (stored) {
        setProfile(stored);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function persist(next: ProfileState) {
    setProfile(next);
    void writeJson(STORAGE_KEYS.profile, next);
  }

  const value: ProfileContextValue = {
    profile,
    isLoading,
    setDisplayName: (displayName) => persist({ ...profile, displayName }),
    setNarratorEnabled: (narratorEnabled) => persist({ ...profile, narratorEnabled }),
    setSoundEffectsEnabled: (soundEffectsEnabled) => persist({ ...profile, soundEffectsEnabled }),
    setHasSeenSoltekGreeting: (hasSeenSoltekGreeting) => persist({ ...profile, hasSeenSoltekGreeting }),
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
