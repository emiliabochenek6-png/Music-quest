import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="map" />
      <Stack.Screen name="world/[worldId]" options={{ presentation: "card" }} />
      <Stack.Screen name="lesson/[lessonId]" options={{ presentation: "card" }} />
      <Stack.Screen name="daily-challenge" options={{ presentation: "card" }} />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/subscription-status" />
    </Stack>
  );
}
