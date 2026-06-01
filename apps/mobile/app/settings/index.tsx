import React, { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { WalletButton } from "../../components/WalletButton";
import { useWallet } from "../../hooks/useWallet";
import { useTheme } from "../../theme/useTheme";

function shortAddress(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { address, connected, disconnect, network, setNetwork } = useWallet();

  const isMainnet = network === "MAINNET";

  const handleDisconnect = () => {
    Alert.alert("Disconnect wallet?", "This will remove the current wallet session.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () => {
          void disconnect();
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Preferences</Text>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Connected wallet</Text>
          <Text style={styles.value}>{connected && address ? shortAddress(address) : "Not connected"}</Text>
          <WalletButton
            label="Disconnect wallet"
            accessibilityLabel="Disconnect wallet"
            onPress={handleDisconnect}
            state="disconnected"
            variant="danger"
            disabled={!connected}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network</Text>
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.label}>Mainnet mode</Text>
            <Text style={styles.value}>{isMainnet ? "Mainnet" : "Testnet"}</Text>
          </View>
          <Switch
            value={isMainnet}
            onValueChange={(value) => setNetwork(value ? "MAINNET" : "TESTNET")}
            trackColor={{ false: theme.colors.surface.border, true: theme.colors.brand.primaryLight }}
            thumbColor={isMainnet ? theme.colors.brand.primary : theme.colors.text.inverse}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open blocked users"
          onPress={() => router.push("/settings/blocked" as Parameters<typeof router.push>[0])}
          style={styles.linkCard}
        >
          <Text style={styles.linkTitle}>Blocked users</Text>
          <Text style={styles.linkText}>Review and unblock accounts you previously muted.</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>App version</Text>
        <Text style={styles.footerValue}>0.0.0 (build local)</Text>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.background,
      padding: 24,
      gap: 16,
    },
    eyebrow: {
      color: theme.colors.brand.secondary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    card: {
      gap: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.surface.border,
      backgroundColor: theme.colors.surface.surface1,
    },
    cardRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.surface.border,
      backgroundColor: theme.colors.surface.surface1,
    },
    label: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      marginBottom: 4,
    },
    value: {
      color: theme.colors.text.primary,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: "monospace",
    },
    linkCard: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.surface.border,
      backgroundColor: theme.colors.surface.surface1,
      gap: 4,
    },
    linkTitle: {
      color: theme.colors.text.primary,
      fontSize: 15,
      fontWeight: "700",
    },
    linkText: {
      color: theme.colors.text.secondary,
      fontSize: 13,
      lineHeight: 18,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.surface.border,
    },
    footerLabel: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      marginBottom: 4,
    },
    footerValue: {
      color: theme.colors.text.primary,
      fontSize: 13,
      fontWeight: "700",
    },
  });
}
