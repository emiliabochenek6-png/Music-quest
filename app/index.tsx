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
export default function Index() {
  const { isLoading: isProfileLoading } = useProfile();
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isProfileLoading || isAuthLoading) {
    return <LoadingScreen />;
  }

  return <Redirect href={user ? "/(main)/map" : "/auth/login"} />;
}
