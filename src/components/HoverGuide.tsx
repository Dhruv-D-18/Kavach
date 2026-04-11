"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/user-context";
import Image from "next/image";

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
    }, 1200);

    return () => clearTimeout(timer);
  }, [user, profile, seenDialogues, setActiveHoverTour]);

  // Watch for active tour changes and play audio with spotlight
  useEffect(() => {
    if (!activeHoverTour || !TOUR_DATA[activeHoverTour] || !audioRef.current) return;
    
    if (seenDialogues.has(activeHoverTour) && activeHoverTour !== "hub-welcome") return;

    const { audioFile, subtitle } = TOUR_DATA[activeHoverTour];

    audioRef.current.pause();
    markDialogueSeen(activeHoverTour);
    setSpotlightActive(true);
    setCurrentSubtitle(subtitle);

    audioRef.current.src = audioFile;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error("Audio playback failed:", err);
      setCurrentSubtitle(subtitle);
      setTimeout(() => {
        setCurrentSubtitle("");
        setSpotlightActive(false);
        setActiveHoverTour(null);
      }, 6000);
    });

  }, [activeHoverTour, seenDialogues, markDialogueSeen, setActiveHoverTour]);

  if (!user || profile?.tour_completed) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hoverFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes hoverScanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-hover-float {
          animation: hoverFloat 4s ease-in-out infinite;
        }
        .animate-hover-scanline {
          animation: hoverScanline 2s linear infinite;
        }
      `}} />

      {spotlightActive && (
        <div
          className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-[2px] pointer-events-none transition-all duration-500"
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-0 right-6 z-[6000] pointer-events-none flex flex-col items-end">
        {/* HUD Subtitle Panel */}
        {currentSubtitle && (
          <div className="max-w-lg mb-4 bg-slate-900/90 border-2 border-cyan-500/40 text-slate-200 p-5 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-md animate-in slide-in-from-bottom-8 fade-in duration-500 relative pointer-events-auto">
            <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 opacity-20 bg-gradient-to-br from-transparent to-cyan-500 rounded-br-xl" />
            
            <div className="flex items-center gap-2 mb-2 text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              Cypher Guide // Incoming Transmission
            </div>
            <p className="text-[15px] font-medium leading-relaxed font-mono">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        )}

        {/* Cypher Full Character Pop-up */}
        <div className={`relative w-48 h-64 transition-all duration-700 ${currentSubtitle ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-90'}`}>
          <div className="relative w-full h-full animate-hover-float">
             <Image 
                src="/images/cypher.png" 
                alt="Cypher" 
                fill 
                className={`object-contain transition-all duration-500 ${isPlaying ? 'brightness-125 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'brightness-100'}`}
                priority
             />
             
             {/* Scanner Line Overlay */}
             {isPlaying && (
               <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none opacity-30">
                 <div className="w-full h-1 bg-cyan-400 animate-hover-scanline" />
               </div>
             )}
          </div>
          
          {/* Base Platform Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-cyan-500/30 blur-xl rounded-full -z-10" />
        </div>
      </div>
    </>
  );
}
