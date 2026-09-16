import { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { useGamification } from "@/context/GamificationContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { POWER_UP_COSTS } from "@/lib/gamification/powerups";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

/**
 * Nutki's own spend screen — reached by tapping the 🎵 pill in
 * GamificationHeaderBar (map.tsx's header), not a BottomTabBar slot,
 * since it's a secondary "spend what you earned" destination rather than
 * one of the app's five main sections. Only sells power-ups that make
 * sense to buy AHEAD of time — a banked streak freeze (consumed
 * automatically later, see lib/gamification/activity.ts's own doc) and
 * an instant heart refill. "Podpowiedź Soltka" (hint) is bought in the
 * moment it's needed, from inside a lesson itself, not stocked up here.
 */
export default function PowerUpShopScreen() {
  const insets = useSafeAreaInsets();
  const { state, buyStreakFreeze, buyHeartRefill } = useGamification();
  const { status: subscription } = useSubscription();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleBuyStreakFreeze() {
    setFeedback(buyStreakFreeze() ? "Zamrożenie passy kupione! ❄️" : "Za mało nutek na zamrożenie passy.");
  }

  function handleBuyHeartRefill() {
    setFeedback(buyHeartRefill() ? "Serca uzupełnione! ❤️" : "Za mało nutek na uzupełnienie serc.");
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Header onBack={() => router.back()} />
      <View style={styles.balanceRow}>
        <Text style={styles.balanceIcon}>🎵</Text>
        <Text style={styles.balanceValue}>{state.nutki}</Text>
        <Text style={styles.balanceLabel}>nutek</Text>
      </View>
      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
      <ScrollView contentContainerStyle={styles.list}>
        <ShopCard
          icon="❄️"
          title="Zamrożenie passy"
          description="Chroni Twoją passę, jeśli ominiesz jeden dzień ćwiczeń — zużywa się samo, kiedy będzie potrzebne."
          cost={POWER_UP_COSTS.streakFreeze}
          ownedLabel={`Masz: ${state.streakFreezes}`}
          disabled={state.nutki < POWER_UP_COSTS.streakFreeze}
          onBuy={handleBuyStreakFreeze}
        />
        <ShopCard
          icon="❤️"
          title="Uzupełnienie serc"
          description={subscription.isActive ? "Masz Premium — serca są już bez limitu." : "Od razu uzupełnia wszystkie serca."}
          cost={POWER_UP_COSTS.heartRefill}
          disabled={subscription.isActive || state.nutki < POWER_UP_COSTS.heartRefill}
          onBuy={handleBuyHeartRefill}
        />
        <View style={styles.hintNote}>
          <Text style={styles.hintNoteIcon}>💡</Text>
          <Text style={styles.hintNoteText}>
            Podpowiedź Soltka (-{POWER_UP_COSTS.hint} 🎵) kupujesz podczas lekcji, w chwili gdy jej potrzebujesz.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ShopCard({
  icon,
  title,
  description,
  cost,
  ownedLabel,
  disabled,
  onBuy,
}: {
  icon: string;
  title: string;
  description: string;
  cost: number;
  ownedLabel?: string;
  disabled: boolean;
  onBuy: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {ownedLabel && <Text style={styles.cardOwned}>{ownedLabel}</Text>}
        </View>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <DarkButton label={`Kup za ${cost} 🎵`} onPress={onBuy} disabled={disabled} />
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.headerRow}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>🎵 Sklep Soltka</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.ink,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  balanceIcon: {
    fontSize: 20,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  feedback: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  cardOwned: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.muted,
  },
  hintNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
  },
  hintNoteIcon: {
    fontSize: 18,
  },
  hintNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.muted,
  },
});
