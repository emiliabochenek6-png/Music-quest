import { useEffect } from "react";
import { Stack } from "expo-router";
import { setAudioModeAsync } from "expo-audio";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RankUpCelebration } from "@/components/RankUpCelebration";
import { AuthProvider } from "@/context/AuthContext";
import { GamificationProvider, useGamification } from "@/context/GamificationContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { configurePurchases } from "@/lib/subscriptions/purchases";

/**
 * Root provider stack — order matters: ThemeProvider must sit INSIDE
 * ProfileProvider (it reads ProfileContext, see theme/ThemeProvider.tsx),
 * and GamificationProvider must sit INSIDE SubscriptionProvider (it reads
 * SubscriptionContext for hearts' own premium-unlimited behavior — see
 * GamificationContext.tsx's own doc); everything else is independent of
 * ordering. AuthProvider must sit ABOVE both ProgressProvider and
 * GamificationProvider (both read useAuth() for their own opt-in cloud
 * sync — see lib/sync/useCloudSync.ts's own doc). Purchases SDK is
 * configured once here, before SubscriptionProvider mounts and calls
 * `Purchases.getCustomerInfo()` for the first time.
 */
/** Everything that needs to read GamificationContext at the ROOT of the
 * app — just RankUpCelebration today — has to live BELOW
 * GamificationProvider in the tree, so it's pulled into its own small
 * component rather than called directly inside RootLayout (which sits
 * above the provider). Renders the actual navigation Stack alongside the
 * celebration overlay so a rank-up can appear regardless of which screen
 * (a lesson step, the daily challenge) is what actually called awardXp —
 * see RankUpCelebration's own doc. */
function AppShell() {
  const { pendingRankUp, clearPendingRankUp } = useGamification();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="auth" options={{ presentation: "modal" }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
      </Stack>
      <RankUpCelebration
        visible={pendingRankUp !== null}
        rank={pendingRankUp?.rank ?? null}
        rankName={pendingRankUp?.name ?? null}
        onClose={clearPendingRankUp}
      />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // react-native-purchases wraps StoreKit/Play Billing — there's no web
    // implementation to configure, and SubscriptionContext's own web
    // guard already skips every OTHER call into the SDK (see its own
    // doc), so this is the one remaining native-only call left to skip
    // here rather than risk it throwing before the app even renders.
    if (Platform.OS !== "web") {
      // Real deployment pulls this from EAS build config / app secrets, never
      // hardcoded — a placeholder here since this scaffold has no CI wiring.
      void configurePurchases(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? "");
    }
    // Without this, iOS mutes ALL app audio whenever the physical silent
    // switch is on — the 🔊 replay buttons and every exercise's note/
    // melody playback would silently do nothing, which reads as "broken"
    // rather than "muted". This makes lesson audio play regardless of
    // that switch, same as how a real piano app or a music-learning app
    // is expected to behave.
    //
    // allowsRecording: true is set here too, once and for the whole app
    // session, rather than toggled on/off around "Zaczarowany Solfeż"'s
    // own microphone use — iOS defaults this to false, and Zaczarowany
    // Solfeż's own microphone use forcing the session into a recording-
    // capable category behind this app's back (since it has to, to
    // capture anything at all) risked exactly the flakiness reported
    // there. On iOS, allowsRecording:true switches the audio session
    // category to .playAndRecord — and THAT category, unlike plain
    // playback, can route audio out through the tiny earpiece speaker
    // instead of the main loudspeaker (quiet enough to read as "not
    // playing at all", not just "playing wrong"). shouldRouteThroughEarpiece
    // is documented to default to false or (route through the speaker),
    // but is set explicitly here anyway — this app has already been bitten
    // once by trusting an unstated default around this exact recording/
    // playback interaction, and an explicit false costs nothing.
    void setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true, shouldRouteThroughEarpiece: false });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProfileProvider>
          <ThemeProvider>
            <AuthProvider>
              <SubscriptionProvider>
                <ProgressProvider>
                  <GamificationProvider>
                    <AppShell />
                  </GamificationProvider>
                </ProgressProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </ThemeProvider>
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
