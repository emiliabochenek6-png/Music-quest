import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";

interface ScreenHeaderProps {
  title: string;
  /** Defaults to router.back() — override for a screen that needs to land
   * somewhere specific rather than wherever the nav stack happens to have
   * come from (e.g. the exercise screen always wants its own world's
   * levels screen, not just "back one"). */
  onBack?: () => void;
}

/** The one back-navigation affordance every screen past the map uses — see
 * the app's own "add back buttons everywhere so nothing is a dead end"
 * fix: map -> world levels -> lesson exercises -> lesson summary all need
 * an explicit way back, since a phone has no browser back button to fall
 * back on. Respects the top safe-area inset itself so callers never have
 * to remember to. */
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      <Pressable
        onPress={onBack ?? (() => router.back())}
        accessibilityRole="button"
        accessibilityLabel="Wstecz"
        hitSlop={12}
        style={{
          width: 40,
          height: 40,
          borderRadius: theme.radius.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text style={{ fontSize: 20, color: theme.colors.ink }}>‹</Text>
      </Pressable>
      <Text
        style={{ fontSize: theme.fontSize.body, fontWeight: "700", color: theme.colors.ink, flexShrink: 1 }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}
