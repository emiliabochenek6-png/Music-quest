import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

/** Login is now the app's own gate, not an opt-in — a signed-in `user`
 * (see AuthContext) routes straight to the map, anyone else lands on
 * the login screen (app/auth/login.tsx), which doubles as the app's
 * first-launch "start screen" (see its own doc). Waits on ProfileContext
 * too, so a returning player's stored narrator/sound preferences are in
 * place before this redirect fires. */
/** The loading screen with Solfek stays at least this long when the app opens, even if everything is ready sooner, so it is seen rather than flashing past. */
const MIN_LOADING_SCREEN_MS = 1800;

export default function Index() {
  const { isLoading: isProfileLoading } = useProfile();
  const { user, isLoading: isAuthLoading, isRecovering } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_SCREEN_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isProfileLoading || isAuthLoading || !minTimeElapsed) {
    return <LoadingScreen />;
  }

  // Someone who came from the "reset your password" e-mail sets the new password first.
  if (isRecovering) return <Redirect href="/auth/reset-password" />;
  return <Redirect href={user ? "/(main)/map" : "/auth/login"} />;
}
