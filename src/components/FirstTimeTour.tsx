"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, X, Volume2, VolumeX } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  highlight?: string;
  audioFile?: string;
}

interface FirstTimeTourProps {
  onComplete: () => void;
}

// Ensure the audio files are synced with the script `scripts/generate-audio.js`
const tourSteps: TourStep[] = [
  {
    title: "Welcome to Kavach Academy!",
    description: "I'm Aegis, your cybersecurity mentor. Let me show you around this interactive learning platform where you'll master password security through hands-on missions.",
    audioFile: "/audio/tour-step-0.mp3",
    highlight: "header"
  },
  {
    title: "Your Progress Dashboard",
    description: "Track your XP, level, and completed modules here. As you complete missions, you'll earn points and unlock new challenges.",
    audioFile: "/audio/tour-step-1.mp3",
    highlight: "stats"
  },
  {
    title: "Theory & Practice",
    description: "Each module has two parts: Theory (learn the concepts) and Practice (apply what you've learned).",
    audioFile: "/audio/tour-step-2.mp3",
    highlight: "tabs"
  },
  {
    title: "Password Strength Meter",
    description: "This real-time analyzer shows how strong your password is. Watch for dictionary words and common patterns!",
    audioFile: "/audio/tour-step-3.mp3",
    highlight: "strength-meter"
  },
  {
    title: "Crack Time Estimator",
    description: "See how long it would take hackers to crack your password using modern tools. Our goal is to make this time centuries, not seconds!",
    audioFile: "/audio/tour-step-4.mp3",
    highlight: "crack-time"
  },
  {
    title: "Mission Complete!",
    description: "When you create a strong enough password, the vault unlocks! You'll earn XP based on password strength.",
    audioFile: "/audio/tour-step-5.mp3",
    highlight: "action"
  }
];

export function FirstTimeTour({ onComplete }: FirstTimeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.volume = 1.0;
    }
    
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Play corresponding audio file when step changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      
      const audioToPlay = tourSteps[currentStep].audioFile;
      if (audioToPlay) {
        audioRef.current.src = audioToPlay;
        
        // Only attempt playback automatically if not muted
        if (!isMuted) {
          // Play returns a promise that can reject if user hasn't interacted with document
          audioRef.current.play().catch(error => {
            console.error("Autoplay blocked or audio not found:", error);
            // Failing silently is common for autoplay policies, user can unmute manually
          });
        }
      }
    }
  }, [currentStep, isMuted]);

  const toggleMute = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
    } else if (isMuted && audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(e => console.error("Could not resume audio:", e));
    }
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') handleComplete();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Highlight overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
      </div>

      {/* Tour card */}
      <Card className="relative max-w-2xl w-full bg-slate-950/90 border-2 border-cyan-500 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleComplete}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-red-500/20"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-8 mt-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300 bg-cyan-500/10 px-3 py-1 text-sm font-semibold tracking-wide">
              SYSTEM INTRO // {currentStep + 1} OF {tourSteps.length}
            </Badge>
            <div className="flex gap-1.5">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-10 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                      : index < currentStep 
                        ? 'bg-cyan-800' 
                        : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-10 min-h-[140px]">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 font-mono tracking-tight">
              {step.title}
            </h3>
            <p className="text-xl text-slate-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 0 ? (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex-[0.3] border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:bg-slate-800 h-14 text-lg"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            ) : (
              <div className="flex-[0.3]" /> // Spacer
            )}
            
            <Button
              onClick={handleNext}
              className="flex-1 gradient-primary hover:brightness-110 text-white font-bold h-14 text-lg tracking-wide shadow-lg shadow-cyan-500/20"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>Start Training <ChevronRight className="w-5 h-5 ml-2" /></>
              ) : (
                <>Continue <ChevronRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </div>

          {/* Keyboard hints */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500 font-mono">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">←→</kbd> Navigate
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">ESC</kbd> Skip
            </span>
          </div>
        </div>
      </Card>
      
      {/* Visual audio wave simulation when speaking */}
      {!isMuted && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-50">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-cyan-400 rounded-full animate-pulse" 
              style={{ 
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
          <span className="text-cyan-400 text-xs ml-2 font-mono uppercase tracking-widest">Aegis Transmitting...</span>
        </div>
      )}
    </div>
  );
}
