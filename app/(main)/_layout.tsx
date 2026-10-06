import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";

/** Guards every screen in this group behind a real session — app/index.tsx's
 * own root redirect only covers the very first navigation, not a direct/
 * deep link straight to e.g. /map (very possible on web: a bookmark, a
 * shared URL, browser history), which would otherwise reach this Stack
 * with no session at all. Checked here, once, rather than in each child
 * screen individually. */
export default function MainLayout() {
  const { user, isLoading, isRecovering } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isRecovering) {
    return <Redirect href="/auth/reset-password" />;
  }
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="map" />
      <Stack.Screen name="world/[worldId]" options={{ presentation: "card" }} />
      <Stack.Screen name="lesson/[lessonId]" options={{ presentation: "card" }} />
      <Stack.Screen name="daily-challenge" options={{ presentation: "card" }} />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="levels" />
      <Stack.Screen name="placement" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="review" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/subscription-status" />
    </Stack>
  );
}
