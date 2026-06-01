import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ProfileCardSkeleton } from "../../components/skeletons/ProfileCardSkeleton";
import { WalletButton } from "../../components/WalletButton";
import { useWallet } from "../../hooks/useWallet";
import { useTheme } from "../../theme/useTheme";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { address, connected, connect, disconnect, state, network } = useWallet();

  if (state === "loading") {
    return (
      <View style={styles.container}>
        <ProfileCardSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Wallet profile</Text>
      <Text style={styles.title}>Profile</Text>

      {connected && address ? (
        <View style={styles.card}>
          <Text style={styles.address}>
            {address.slice(0, 6)}…{address.slice(-4)}
          </Text>
          <Text style={styles.meta}>Network: {network ?? "TESTNET"}</Text>
          <View style={styles.actions}>
            <WalletButton
              label="Settings"
              accessibilityLabel="Open settings"
              onPress={() => router.push("/settings" as Parameters<typeof router.push>[0])}
              state="disconnected"
              variant="secondary"
            />
            <WalletButton
              label="Disconnect"
              accessibilityLabel="Disconnect wallet"
              onPress={disconnect}
              state="disconnected"
              variant="danger"
            />
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.meta}>No wallet connected</Text>
          <WalletButton
            label="Connect Wallet"
            accessibilityLabel="Connect wallet"
            onPress={() => connect()}
            state="disconnected"
          />
        </View>
      )}
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
      gap: 8,
    },
    eyebrow: {
      color: theme.colors.brand.secondary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    card: {
      width: "100%",
      backgroundColor: theme.colors.surface.surface1,
      borderWidth: 1,
      borderColor: theme.colors.surface.border,
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    address: {
      fontSize: 14,
      color: theme.colors.text.primary,
      fontFamily: "monospace",
    },
    meta: {
      color: theme.colors.text.secondary,
      fontSize: 13,
    },
    actions: {
      gap: 10,
    },
  });
}
