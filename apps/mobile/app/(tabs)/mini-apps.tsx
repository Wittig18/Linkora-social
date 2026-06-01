import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme/useTheme";

export default function MiniAppsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Apps</Text>
      <Text style={styles.subtitle}>Browse and launch mini apps</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
  });
}
