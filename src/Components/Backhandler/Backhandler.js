import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { BackHandler } from "react-native";

export function ScreenWithCustomBackBehavior({
  isSelectionModeEnabled,
  disableSelectionMode,
}) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isSelectionModeEnabled, disableSelectionMode])
  );
  return null;
}
