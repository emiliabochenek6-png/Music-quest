import type { ReactNode } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTourTarget } from "@/lib/guide/tourTargets";

/** A plain View the guide can highlight under `id` (a View with no `id` registers nothing). */
export function TourTarget({ id, style, children }: { id?: string; style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const ref = useTourTarget(id);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}
