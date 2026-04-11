"use client";

import { useState, useEffect } from "react";
import { CypherGuide } from "./CypherGuide";
import { SpotlightOverlay } from "./SpotlightOverlay";

interface TourStep {
  title: string;
  description: string;
  highlightId: string | null;
  audioFile: string;
  type: "info" | "tip" | "success";
}

interface FirstTimeTourProps {
  onComplete: () => void;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Kavach Academy!",
    description: "I'm Cypher, your cybersecurity mentor. Let me show you around this interactive learning platform where you'll master digital defense through hands-on missions.",
    highlightId: "tour-welcome",
    audioFile: "/audio/tour-step-0.mp3",
    type: "info"
  },
  {
    title: "The Training Ground",
    description: "This is where the action happens. Click 'Explore Modules' to find our training games, from vault-cracking to catching phishing scams.",
    highlightId: "tour-explore",
    audioFile: "/audio/tour-step-1.mp3",
    type: "info"
  },
  {
    title: "Your Rank & Progress",
    description: "You earn Experience Points (XP) for every successful mission. Leveling up shows the Academy you're ready for more advanced operations.",
    highlightId: "tour-features",
    audioFile: "/audio/tour-step-2.mp3",
    type: "info"
  },
  {
    title: "Friendly Competition",
    description: "Keep an eye on the Global Standings. Seeing how other agents are performing is a great way to stay sharp!",
    highlightId: "tour-leaderboard",
    audioFile: "/audio/tour-step-3.mp3",
    type: "info"
  },
  {
    title: "Ready for Action?",
    description: "You're all set! Head over to the Modules and pick 'Crack the Vault' to begin your first training session. Good luck, Agent!",
    highlightId: null,
    audioFile: "/audio/tour-step-4.mp3",
    type: "success"
  }
];

export function FirstTimeTour({ onComplete }: FirstTimeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const current = tourSteps[currentStep];

  // Auto-scroll to highlighted elements
  useEffect(() => {
    if (current.highlightId) {
      const el = document.getElementById(current.highlightId);
      if (el) {
        // We use a small delay to ensure the DOM is ready and any previous animations finished
        const timer = setTimeout(() => {
           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, current.highlightId]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Tour final step reached, completing...");
      onComplete();
    }
  };

  return (
    <>
      {/* Spotlight Overlay */}
      <SpotlightOverlay targetId={current.highlightId} isOpen={true} />

      {/* Persistent Cypher Character & HUD */}
      <CypherGuide
        message={{
          text: current.description,
          type: current.type,
          audioFile: current.audioFile,
          isBlocking: true
        }}
        isVisible={true}
        isTour={true}
        tourStep={{ current: currentStep + 1, total: tourSteps.length }}
        onNext={handleNext}
        onSkip={onComplete}
        position="bottom-right"
      />
    </>
  );
}
