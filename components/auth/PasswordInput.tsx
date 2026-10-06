import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { DARK_EXERCISE_THEME as theme } from "@/theme/darkExerciseTheme";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry" | "style"> {
  /** The look of the field itself (the eye button is added on its right). */
  style?: StyleProp<TextStyle>;
}

/** A password field with an eye button on the right: tap it to see what you typed (and again to hide it). */
export function PasswordInput({ style, accessibilityLabel, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const color = visible ? "#C2570A" : theme.colors.muted;
  return (
    <View style={styles.wrap}>
      <TextInput {...rest} secureTextEntry={!visible} accessibilityLabel={accessibilityLabel} style={[style, styles.field]} autoCapitalize="none" autoCorrect={false} />
      <Pressable
        onPress={() => setVisible((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Ukryj hasło" : "Pokaż hasło"}
        accessibilityState={{ selected: visible }}
        hitSlop={8}
        style={styles.eye}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <Circle cx={12} cy={12} r={3} />
          {visible ? null : <Path d="M4 4l16 16" />}
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", justifyContent: "center" },
  // room for the eye on the right
  field: { paddingRight: 48 },
  eye: { position: "absolute", right: 12, top: 0, bottom: 0, width: 32, alignItems: "center", justifyContent: "center" },
});
