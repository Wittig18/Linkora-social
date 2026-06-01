import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity } from "react-native";

import { WalletProvider } from "../context/WalletContext";
import { useWallet } from "../hooks/useWallet";
import { parseDeepLink } from "../utils/deepLinks";
import { ToastProvider } from "../context/ToastContext";
import { useTheme } from "../theme/useTheme";

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function HeaderWalletAddress() {
  const { theme } = useTheme();
  const router = useRouter();
  const { address, connected } = useWallet();

  return (
      <TouchableOpacity
      style={[
        styles.headerWallet,
        {
          backgroundColor: theme.colors.surface.surface1,
          borderColor: theme.colors.surface.border,
        },
      ]}
      onPress={() => router.push("/connect" as Parameters<typeof router.push>[0])}
      accessibilityRole="button"
      accessibilityLabel={
        connected && address ? `Connected wallet ${address}` : "Open wallet connection screen"
      }
    >
      <Text style={[styles.headerWalletText, { color: theme.colors.text.primary }]}>
        {connected && address ? shortAddress(address) : "Connect"}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Root layout — wraps the entire app in WalletProvider and sets up
 * the bottom tab navigator with deep-link handling.
 *
 * Screens:
 *   (tabs)/feed        — main post feed
 *   (tabs)/explore     — discovery / search
 *   (tabs)/pools       — community pools
 *   (tabs)/mini-apps   — mini app browser
 *   (tabs)/profile     — user profile
 *
 * Stack screens (detail views) are declared as modal/stack routes
 * alongside the tabs via the Tabs.Screen `href` opt-out pattern.
 */
export default function RootLayout() {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function handleInitialUrl() {
      let initialUrl: string | null = null;
      try {
        initialUrl = await Linking.getInitialURL();
      } catch {
        return;
      }
      if (isMounted && initialUrl) {
        handleDeepLink(initialUrl);
      }
    }

    function handleDeepLink(url: string) {
      const deepLink = parseDeepLink(url);
      if (!deepLink) return;
      router.push(deepLink.path as Parameters<typeof router.push>[0]);
    }

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    handleInitialUrl();

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [router]);

  return (
    <WalletProvider>
      <ToastProvider>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.surface.background,
            },
            headerTitleStyle: {
              color: theme.colors.text.primary,
              fontWeight: "700",
            },
            headerTintColor: theme.colors.text.primary,
            headerRight: () => <HeaderWalletAddress />,
            tabBarActiveTintColor: theme.colors.brand.primary,
            tabBarInactiveTintColor: theme.colors.text.secondary,
            tabBarStyle: {
              backgroundColor: theme.colors.surface.background,
              borderTopColor: theme.colors.surface.border,
            },
          }}
        >
          <Tabs.Screen name="(tabs)/feed" options={{ title: "Feed", tabBarLabel: "Feed" }} />
          <Tabs.Screen name="(tabs)/explore" options={{ title: "Explore", tabBarLabel: "Explore" }} />
          <Tabs.Screen name="(tabs)/pools" options={{ title: "Pools", tabBarLabel: "Pools" }} />
          <Tabs.Screen
            name="(tabs)/mini-apps"
            options={{ title: "Mini Apps", tabBarLabel: "Mini Apps" }}
          />
          <Tabs.Screen name="(tabs)/profile" options={{ title: "Profile", tabBarLabel: "Profile" }} />
          <Tabs.Screen name="settings" options={{ href: null, title: "Settings" }} />
          <Tabs.Screen name="settings/blocked" options={{ href: null, title: "Blocked Users" }} />
          <Tabs.Screen name="connect" options={{ href: null, title: "Connect Wallet" }} />
          {/* Detail screens — hidden from tab bar */}
          <Tabs.Screen name="post/[id]" options={{ href: null, headerShown: true, title: "Post" }} />
          <Tabs.Screen
            name="profile/[address]"
            options={{ href: null, headerShown: true, title: "Profile" }}
          />
          <Tabs.Screen name="pool/[id]" options={{ href: null, headerShown: true, title: "Pool" }} />
        </Tabs>
      </ToastProvider>
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  headerWallet: {
    minHeight: 32,
    minWidth: 82,
    borderRadius: 16,
    marginRight: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerWalletText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "monospace",
  },
});
