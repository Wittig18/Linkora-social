import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export const GUIDED_TOUR_STORAGE_KEY = "linkora_guided_tour_dismissed";

export interface TourStep {
  id: string;
  title: string;
  description: string;
  route?: "/(tabs)/feed" | "/(tabs)/pools" | "/(tabs)/mini-apps";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "feed",
    title: "Your Feed",
    description: "This is your feed — posts from creators you follow",
    route: "/(tabs)/feed",
  },
  {
    id: "post-actions",
    title: "Like & Tip",
    description: "Tap the heart to like, or send a tip with the coin icon",
    route: "/(tabs)/feed",
  },
  {
    id: "pools",
    title: "Community Pools",
    description: "Join community pools to earn rewards",
    route: "/(tabs)/pools",
  },
  {
    id: "governance",
    title: "Governance",
    description: "Vote on governance proposals from the web app",
  },
  {
    id: "mini-apps",
    title: "Mini Apps",
    description: "Explore mini-apps in the sidebar",
    route: "/(tabs)/mini-apps",
  },
];

interface GuidedTourContextValue {
  active: boolean;
  stepIndex: number;
  currentStep: TourStep;
  next: () => void;
  prev: () => void;
  dismiss: () => void;
  resetTour: () => void;
  totalSteps: number;
}

const GuidedTourContext = createContext<GuidedTourContextValue | null>(null);

export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await SecureStore.getItemAsync(GUIDED_TOUR_STORAGE_KEY);
        setActive(stored !== "true");
      } catch {
        setActive(true);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const dismiss = useCallback(async () => {
    try {
      await SecureStore.setItemAsync(GUIDED_TOUR_STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures; still hide the tour for this session.
    }
    setActive(false);
  }, []);

  const next = useCallback(() => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }
    void dismiss();
  }, [stepIndex, dismiss]);

  const prev = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const resetTour = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(GUIDED_TOUR_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    setStepIndex(0);
    setActive(true);
  }, []);

  if (!ready) {
    return <>{children}</>;
  }

  return (
    <GuidedTourContext.Provider
      value={{
        active,
        stepIndex,
        currentStep: TOUR_STEPS[stepIndex],
        next,
        prev,
        dismiss,
        resetTour,
        totalSteps: TOUR_STEPS.length,
      }}
    >
      {children}
    </GuidedTourContext.Provider>
  );
}

export function useGuidedTour() {
  const context = useContext(GuidedTourContext);
  if (!context) {
    throw new Error("useGuidedTour must be used within GuidedTourProvider");
  }
  return context;
}
