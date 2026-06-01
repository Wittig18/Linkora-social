import React, { useMemo } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useTheme } from "../../theme/useTheme";

type PoolParams = {
  id: string;
};

export default function PoolDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { id } = useLocalSearchParams<PoolParams>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Pool</Text>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.placeholder}>Pool detail coming soon.</Text>
    </ScrollView>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
    },
    content: {
      padding: 24,
    },
    label: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
    },
    id: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
      fontFamily: "monospace",
    },
    placeholder: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
  });
}
