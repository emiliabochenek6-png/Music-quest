import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { readJson, STORAGE_KEYS } from "@/lib/storage";
import { useProfile } from "@/context/ProfileContext";

/** Routes past onboarding once, then always straight to the map — the
 * profile picker only ever appears again from Settings (a deliberate
 * re-choice), never re-triggered by this redirect. Waits on ProfileContext
 * finishing its own async read too, so a returning "hobbyist" user never
 * flashes the default young-explorer theme for a frame before this
 * redirect fires. */
export default function Index() {
  const { isLoading: isProfileLoading } = useProfile();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    readJson<boolean>(STORAGE_KEYS.hasCompletedOnboarding).then((value) => {
      setHasCompletedOnboarding(value ?? false);
    });
  }, []);

  if (isProfileLoading || hasCompletedOnboarding === null) {
    return <LoadingScreen />;
  }

  return <Redirect href={hasCompletedOnboarding ? "/(main)/map" : "/onboarding/welcome"} />;
}
