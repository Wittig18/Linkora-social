import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useGuidedTour } from "../context/GuidedTourContext";

export function GuidedTour() {
  const router = useRouter();
  const { active, stepIndex, currentStep, next, prev, dismiss, totalSteps } = useGuidedTour();

  useEffect(() => {
    if (!active || !currentStep.route) {
      return;
    }

    router.push(currentStep.route as Parameters<typeof router.push>[0]);
  }, [active, currentStep, router]);

  if (!active) {
    return null;
  }

  const isLast = stepIndex === totalSteps - 1;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityViewIsModal accessibilityRole="alert">
          <Text style={styles.stepLabel}>
            Step {stepIndex + 1} of {totalSteps}
          </Text>
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>

          <View style={styles.actions}>
            <Pressable onPress={dismiss} accessibilityRole="button">
              <Text style={styles.skipText}>Skip tour</Text>
            </Pressable>

            <View style={styles.navActions}>
              {stepIndex > 0 ? (
                <Pressable
                  onPress={prev}
                  style={styles.secondaryButton}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={next} style={styles.primaryButton} accessibilityRole="button">
                <Text style={styles.primaryButtonText}>{isLast ? "Got it" : "Next"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
    padding: 16,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
    padding: 20,
    gap: 8,
  },
  stepLabel: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    color: "#f9fafb",
    fontSize: 20,
    fontWeight: "800",
  },
  description: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skipText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
