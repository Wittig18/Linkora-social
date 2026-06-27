import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { NavBar } from "@/components/NavBar";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ThemeBootstrap } from "@/components/ThemeBootstrap";
import { KeyboardShortcutsProvider } from "@/contexts/KeyboardShortcutsContext";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";

export const metadata: Metadata = {
  title: "Linkora",
  description: "Decentralised social on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeBootstrap />
        <WalletProvider>
          <NotificationsProvider>
            <KeyboardShortcutsProvider>
              <NavBar />
              <main>{children}</main>
              <KeyboardShortcutsModal />
            </KeyboardShortcutsProvider>
          </NotificationsProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
