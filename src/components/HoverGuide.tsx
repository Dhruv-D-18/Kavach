"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/user-context";

// Map the tourIds from HoverZone to physical files and text subtitles.
// We expanded the text so that it matches a longer ElevenLabs generated audio file!
const TOUR_DATA: Record<string, { audioFile: string; subtitle: string }> = {
  "welcome": {
    audioFile: "/audio/hover-welcome.mp3",
    subtitle: "Welcome to Kavach Academy! I am Aegis, your guide. Hover over elements to learn more"
  },
  "explore": {
    audioFile: "/audio/hover-explore.mp3",
    subtitle: "Click Explore Modules to see our full training curriculum."
  },
  "features": {
    audioFile: "/audio/hover-features.mp3",
    subtitle: "Here you can track your XP, earn badges."
  },
  "crack-vault": {
    audioFile: "/audio/hover-crack-vault.mp3",
    subtitle: "Crack the Vault is our beginner module. Here you'll learn everything about password entropy and cracking speeds"
  },
  "create-account": {
    audioFile: "/audio/hover-create-account.mp3",
    subtitle: "Ready to defend the digital world? Create an account to save your progress!"
  }
};

export function HoverGuide() {
  const { activeHoverTour, setActiveHoverTour, isNewUser } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  // Initialize audio object once
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      audioRef.current.onended = () => {
        setIsPlaying(false);
        // We clear the active tour so it doesn't conflict if they hover the same thing again
        setActiveHoverTour(null);
        setTimeout(() => setCurrentSubtitle(""), 1000);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [setActiveHoverTour]);

  // Handle Auto-Playing the Welcome Message
  useEffect(() => {
    if (isNewUser && !hasPlayedWelcome && audioRef.current) {
      // Small timeout to give the page time to load its UI fully before speaking
      const timer = setTimeout(() => {
        const { audioFile, subtitle } = TOUR_DATA["welcome"];
        audioRef.current!.src = audioFile;
        // User must have interacted with doc, but we try anyway
        audioRef.current!.play().then(() => {
          setIsPlaying(true);
          setCurrentSubtitle(subtitle);
          setHasPlayedWelcome(true);
        }).catch(err => {
          console.error("Autoplay failed for welcome (interaction required).", err);
          // Just fall back gracefully 
          setHasPlayedWelcome(true);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewUser, hasPlayedWelcome]);

  // Watch for active tour ID changes coming from mouse hovers
  useEffect(() => {
    if (!isNewUser) return;

    // We don't want hovers to interrupt the Welcome message if it's currently playing!
    if (isPlaying && currentSubtitle === TOUR_DATA["welcome"].subtitle) {
      return;
    }

    if (activeHoverTour && TOUR_DATA[activeHoverTour] && audioRef.current) {
      const { audioFile, subtitle } = TOUR_DATA[activeHoverTour];

      // Stop anything heavily playing
      audioRef.current.pause();

      // Load and play the new audio
      audioRef.current.src = audioFile;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentSubtitle(subtitle);
      }).catch(err => {
        console.error("Audio playback failed: ", err);
        setCurrentSubtitle(subtitle); // fallback to text only
      });

    }
  }, [activeHoverTour, isNewUser, isPlaying, currentSubtitle]);

  // Completely hide everything if not a new user
  if (!isNewUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-3">
      {/* Dialogue Bubble - increased max-width to allow longer sentences natively */}
      {currentSubtitle && (
        <div className="max-w-lg bg-slate-900 border border-cyan-500/30 text-slate-200 p-5 rounded-2xl shadow-lg shadow-cyan-500/10 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in">
          <p className="text-[15px] font-medium leading-relaxed font-mono">
            "{currentSubtitle}"
          </p>
        </div>
      )}

      {/* Persistent Character Avatar */}
      <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 bg-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 ${isPlaying ? 'border-cyan-400' : 'border-slate-700'}`}>

        {/* Placeholder for Rive Avatar Character */}
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-cyan-500 font-bold tracking-widest text-xs">AEGIS</span>
        </div>

        {/* Dynamic Voice Waves indicating talking */}
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
  );
}
