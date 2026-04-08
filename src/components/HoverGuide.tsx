"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/user-context";

const TOUR_DATA: Record<string, { audioFile: string; subtitle: string }> = {
  "hub-welcome": {
    audioFile: "/audio/hub-welcome.mp3",
    subtitle: "Welcome to Kavach Academy! I'm Cypher, your cybersecurity mentor. I'll guide you through everything.",
  },
  "explore": {
    audioFile: "/audio/hover-explore.mp3",
    subtitle: "Click Explore Modules to see our full training curriculum.",
  },
  "features": {
    audioFile: "/audio/hover-features.mp3",
    subtitle: "Here you can track your XP, earn badges, and rise through the ranks.",
  },
  "crack-vault": {
    audioFile: "/audio/hover-crack-vault.mp3",
    subtitle: "Crack the Vault is our flagship beginner module. Learn everything about password entropy and cracking speeds.",
  },
  "create-account": {
    audioFile: "/audio/hover-create-account.mp3",
    subtitle: "Ready to defend the digital world? Create an account to save your progress!",
  },
};

export function HoverGuide() {
  const { activeHoverTour, setActiveHoverTour, user, profile, seenDialogues, markDialogueSeen } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [spotlightActive, setSpotlightActive] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setActiveHoverTour(null);
        setTimeout(() => {
          setCurrentSubtitle("");
          setSpotlightActive(false);
        }, 800);
      };
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current?.remove();
    };
  }, [setActiveHoverTour]);

  // Play hub-welcome on first visit (only for users whose tour isn't complete)
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.tour_completed) return;
    if (seenDialogues.has("hub-welcome")) return;

    const timer = setTimeout(() => {
      setActiveHoverTour("hub-welcome");
    }, 1200); // small delay after page loads

    return () => clearTimeout(timer);
  }, [user, profile, seenDialogues, setActiveHoverTour]);

  // Watch for active tour changes and play audio with spotlight
  useEffect(() => {
    if (!activeHoverTour || !TOUR_DATA[activeHoverTour] || !audioRef.current) return;
    
    // Don't replay dialogues the user has already seen
    if (seenDialogues.has(activeHoverTour) && activeHoverTour !== "hub-welcome") return;

    const { audioFile, subtitle } = TOUR_DATA[activeHoverTour];

    // Stop current audio
    audioRef.current.pause();

    // Mark as seen
    markDialogueSeen(activeHoverTour);

    // Activate spotlight
    setSpotlightActive(true);
    setCurrentSubtitle(subtitle);

    // Play audio
    audioRef.current.src = audioFile;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error("Audio playback failed:", err);
      setCurrentSubtitle(subtitle);
      // Auto-clear after 6s if audio fails
      setTimeout(() => {
        setCurrentSubtitle("");
        setSpotlightActive(false);
        setActiveHoverTour(null);
      }, 6000);
    });

  }, [activeHoverTour, seenDialogues, markDialogueSeen, setActiveHoverTour]);

  // Only show for logged in, non-tour-complete users
  if (!user || profile?.tour_completed) return null;

  return (
    <>
      {/* Spotlight Overlay - dims background when a dialogue is playing */}
      {spotlightActive && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] pointer-events-none transition-all duration-500"
          aria-hidden="true"
        />
      )}

      {/* Cypher Guide Panel - fixed to bottom-right, always above spotlight */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-3">
        {/* Subtitle Bubble */}
        {currentSubtitle && (
          <div className="max-w-lg bg-slate-900/95 border border-cyan-500/40 text-slate-200 p-5 rounded-2xl shadow-2xl shadow-cyan-500/20 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in">
            <p className="text-[15px] font-medium leading-relaxed font-mono">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        )}

        {/* Cypher Avatar */}
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 bg-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 ${isPlaying ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'border-slate-700'}`}>
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-cyan-500 font-bold tracking-widest text-xs">CYPHER</span>
          </div>

          {/* Voice Waves */}
          {isPlaying && (
            <div className="absolute -bottom-2 flex items-center justify-center gap-[3px] bg-slate-900 px-3 py-1 rounded-full border border-cyan-500/50">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 10 + 6}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.5s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
