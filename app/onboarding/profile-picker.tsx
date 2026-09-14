import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ProfilePickerCard } from "@/components/profile/ProfilePickerCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useProfile } from "@/context/ProfileContext";
import { STORAGE_KEYS, writeJson } from "@/lib/storage";
import { t } from "@/lib/i18n/translate";
import { useTheme } from "@/theme/ThemeProvider";
import type { ProfileMode } from "@/types/content";

/** The one-time dual-mode choice — see ARCHITECTURE.md section 2.1. Also
 * reachable again from Settings for a later re-choice, which reuses this
 * exact screen (see app/(main)/settings/index.tsx's own "Zmień profil"
 * entry point), just without the onboarding-completion side effect below. */
export default function ProfilePickerScreen() {
  const theme = useTheme();
  const { setMode } = useProfile();

  async function handlePick(mode: ProfileMode) {
    setMode(mode);
    await writeJson(STORAGE_KEYS.hasCompletedOnboarding, true);
    router.replace("/(main)/map");
  }

  // Reachable two ways: fresh onboarding (a new stack, nothing to go back
  // to — the header would be a dead button) or a re-choice from Settings
  // (pushed on top of an existing stack, where "changed my mind" needs a
  // real way out). router.canGoBack() tells them apart without a separate
  // route/param for the same screen.
  const canGoBack = router.canGoBack();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.cream }}>
      {canGoBack && <ScreenHeader title={t("profile.picker.title")} />}
      <View style={styles.content}>
        {!canGoBack && (
          <Text style={[styles.title, { fontSize: theme.fontSize.heading, color: theme.colors.ink }]}>
            {t("profile.picker.title")}
          </Text>
        )}
        <View style={styles.cards}>
          <ProfilePickerCard
            mode="young-explorer"
            title={t("profile.picker.youngExplorer.title")}
            subtitle={t("profile.picker.youngExplorer.subtitle")}
            onPress={handlePick}
          />
          <ProfilePickerCard
            mode="hobbyist"
            title={t("profile.picker.hobbyist.title")}
            subtitle={t("profile.picker.hobbyist.subtitle")}
            onPress={handlePick}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
  },
  cards: {
    width: "100%",
    gap: 16,
  },
});
