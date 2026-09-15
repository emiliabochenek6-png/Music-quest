import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { readJson, STORAGE_KEYS } from "@/lib/storage";
import { useProfile } from "@/context/ProfileContext";

/** Routes past onboarding once, then always straight to the map. Waits on
 * ProfileContext finishing its own async read too, so a returning
 * player's stored narrator/sound preferences are in place before this
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
