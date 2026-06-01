import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "../theme/useTheme";
import { PoolCardSkeleton } from "./skeletons/PoolCardSkeleton";

interface PoolCardProps {
  id: string;
  name: string;
  description: string;
  totalValue: string;
  participants: number;
  apy?: string;
  isLoading?: boolean;
  onPress?: () => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  id,
  name,
  description,
  totalValue,
  participants,
  apy,
  isLoading = false,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (isLoading) {
    return <PoolCardSkeleton />;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={`pool-card-${id}`}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {apy && <Text style={styles.apy}>{apy} APY</Text>}
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Total Value</Text>
          <Text style={styles.statValue}>{totalValue}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Participants</Text>
          <Text style={styles.statValue}>{participants}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface.surface1,
      borderRadius: 12,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: "rgba(0, 0, 0, 1)",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.surface.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text.primary,
      flex: 1,
    },
    apy: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.semantic.success,
      backgroundColor: theme.colors.semantic.successLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    description: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stat: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    loadingBar: {
      backgroundColor: theme.colors.surface.surface2,
      borderRadius: 4,
      marginBottom: 12,
    },
    nameLoading: {
      height: 18,
      width: "60%",
    },
    descriptionLoading: {
      height: 14,
      width: "100%",
    },
    statLoading: {
      height: 16,
      width: "80%",
    },
  });
}
