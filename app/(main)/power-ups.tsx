import { useState } from "react";
import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DarkButton } from "@/components/exercises/DarkButton";
import { AppIcon } from "@/components/icons/AppIcon";
import { useGamification } from "@/context/GamificationContext";
import { SolfekAvatar } from "@/components/shop/SolfekAvatar";
import { MAX_STREAK_FREEZES, POWER_UP_COSTS } from "@/lib/gamification/powerups";
import { DEFAULT_BACKGROUND_ID, SHOP_SLOTS, itemsInSlot } from "@/lib/shop/catalog";
import type { ShopItem, ShopSlot } from "@/lib/shop/catalog";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";
import { GlyphText } from "@/components/icons/GlyphText";

type ShopTab = ShopSlot | "ulepszenia";

const TABS: readonly { id: ShopTab; label: string }[] = [
  ...SHOP_SLOTS.map(({ slot, label }) => ({ id: slot as ShopTab, label })),
  { id: "ulepszenia", label: "Ulepszenia" },
];

/**
 * Sklep Solfka: the one place nutki are spent. Reached by tapping the nutki pill in
 * GamificationHeaderBar (map.tsx's header). A preview of Solfek on top shows what he
 * wears; below, tabs for his glasses, neck things, effects and backgrounds, and
 * "Ulepszenia" (a banked streak freeze, consumed automatically later, see
 * lib/gamification/activity.ts).
 */
export default function PowerUpShopScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { state, buyStreakFreeze, buyShopItem, equipShopItem } = useGamification();
  const [tab, setTab] = useState<ShopTab>("okulary");
  const [feedback, setFeedback] = useState<string | null>(null);
  const previewSize = Math.min(width - 48, 200);

  function handleBuyStreakFreeze() {
    if (state.streakFreezes >= MAX_STREAK_FREEZES) {
      setFeedback(`Masz już maksimum zamrożeń (${MAX_STREAK_FREEZES}).`);
      return;
    }
    setFeedback(buyStreakFreeze() ? "Zamrożenie passy kupione! ❄️" : "Za mało nutek na zamrożenie passy.");
  }

  function handleItemPress(item: ShopItem) {
    const owned = state.shopOwned.includes(item.id) || item.price === 0;
    const worn = (state.shopEquipped[item.slot] ?? (item.slot === "tlo" ? DEFAULT_BACKGROUND_ID : undefined)) === item.id;
    if (owned) {
      // The background can't be taken off, only swapped: taking it off means going back to Solfek's own.
      equipShopItem(item.slot, worn ? (item.slot === "tlo" ? DEFAULT_BACKGROUND_ID : null) : item.id);
      setFeedback(null);
      return;
    }
    const result = buyShopItem(item.id);
    if (result === "ok") setFeedback(`${item.name}: kupione, Solfek już to ma na sobie!`);
    else if (result === "not-enough") setFeedback(`Brakuje Ci jeszcze ${item.price - state.nutki} nutek na „${item.name}”.`);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Header onBack={() => router.back()} />
      {/* The preview, tabs and message stay put; only the items below scroll, so you always see what you just bought. */}
      <View style={styles.top}>
        <View style={styles.balanceRow}>
          <AppIcon name="hud_nutki_waluta" size={22} />
          <Text style={styles.balanceValue}>{state.nutki}</Text>
          <Text style={styles.balanceLabel}>nutek</Text>
        </View>
        <View style={[styles.preview, { width: previewSize, height: previewSize }]}>
          <SolfekAvatar equipped={state.shopEquipped} size={previewSize} withBackground />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map(({ id, label }) => (
            <Pressable
              key={id}
              onPress={() => {
                setTab(id);
                setFeedback(null);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === id }}
              style={[styles.tab, tab === id && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {feedback && <Text style={styles.feedback}>{feedback}</Text>}
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {tab === "ulepszenia" ? (
          <ShopCard
            thumbnail={<GlyphText style={styles.cardIconText}>❄️</GlyphText>}
            title="Zamrożenie passy"
            description="Chroni Twoją passę, jeśli ominiesz jeden dzień ćwiczeń — zużywa się samo, kiedy będzie potrzebne."
            ownedLabel={`Masz: ${state.streakFreezes} z ${MAX_STREAK_FREEZES}`}
            buttonLabel={`Kup za ${POWER_UP_COSTS.streakFreeze}`}
            showCoin
            disabled={state.nutki < POWER_UP_COSTS.streakFreeze || state.streakFreezes >= MAX_STREAK_FREEZES}
            onPress={handleBuyStreakFreeze}
          />
        ) : (
          itemsInSlot(tab).map((item) => {
            const owned = state.shopOwned.includes(item.id) || item.price === 0;
            const worn = (state.shopEquipped[item.slot] ?? (item.slot === "tlo" ? DEFAULT_BACKGROUND_ID : undefined)) === item.id;
            return (
              <ShopCard
                key={item.id}
                thumbnail={
                  <View style={styles.thumb}>
                    <SolfekAvatar equipped={{ [item.slot]: item.id }} size={72} backgroundOnly={item.slot === "tlo"} />
                  </View>
                }
                title={item.name}
                description={item.description}
                ownedLabel={worn ? "Założone" : owned ? "Masz to" : undefined}
                buttonLabel={owned ? (worn && item.slot !== "tlo" ? "Zdejmij" : worn ? "Wybrane" : "Załóż") : `Kup za ${item.price}`}
                showCoin={!owned}
                variant={owned ? "secondary" : "primary"}
                disabled={owned && worn && item.slot === "tlo"}
                onPress={() => handleItemPress(item)}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function ShopCard({
  thumbnail,
  title,
  description,
  ownedLabel,
  buttonLabel,
  showCoin,
  variant = "primary",
  disabled,
  onPress,
}: {
  thumbnail: ReactNode;
  title: string;
  description: string;
  ownedLabel?: string;
  buttonLabel: string;
  showCoin?: boolean;
  variant?: "primary" | "secondary";
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        {thumbnail}
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {ownedLabel && <Text style={styles.cardOwned}>{ownedLabel}</Text>}
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
      <DarkButton label={buttonLabel} trailingIcon={showCoin ? "hud_nutki_waluta" : undefined} variant={variant} onPress={onPress} disabled={disabled} />
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.headerRow}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Wstecz" hitSlop={12} style={styles.backButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <AppIcon name="hud_nutki_waluta" size={22} />
      <Text style={styles.headerTitle}>Sklep Solfka</Text>
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
  top: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    gap: 10,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 4,
    gap: 14,
  },
  preview: {
    alignSelf: "center",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  tabs: { gap: 8, paddingVertical: 2 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  tabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tabText: { fontSize: 13, fontWeight: "800", color: theme.colors.ink },
  tabTextActive: { color: "#FFFFFF" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.cream,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
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
  cardIconText: {
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
});
