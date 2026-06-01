import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PoolCard } from "../../components/PoolCard";
import { PoolCardSkeleton } from "../../components/skeletons/PoolCardSkeleton";
import { useTheme } from "../../theme/useTheme";

const POOLS = [
  {
    id: "creator-fund",
    name: "Creator Fund",
    description: "Shared treasury for emerging creators",
    totalValue: "18,240 XLM",
    participants: 128,
    apy: "8.4%",
  },
  {
    id: "music-drops",
    name: "Music Drops",
    description: "Funding pool for independent releases",
    totalValue: "7,900 NOVA",
    participants: 64,
    apy: "6.1%",
  },
];

export default function PoolsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pools</Text>
      <Text style={styles.subtitle}>Community funding pools</Text>
      <View style={styles.list}>
        {loading ? (
          <>
            <PoolCardSkeleton />
            <PoolCardSkeleton />
          </>
        ) : (
          POOLS.map((pool) => <PoolCard key={pool.id} {...pool} />)
        )}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
      paddingTop: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      paddingHorizontal: 24,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      paddingHorizontal: 24,
    },
    list: {
      marginTop: 16,
    },
  });
}
