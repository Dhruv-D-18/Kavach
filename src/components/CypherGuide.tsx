"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import Image from "next/image";

interface CypherMessage {
  text: string;
  type: "info" | "warning" | "success" | "tip";
  audioFile?: string;
  isBlocking?: boolean;
}

interface CypherGuideProps {
  message: CypherMessage | null;
  isVisible: boolean;
  onSkip?: () => void;
  onNext?: () => void;
  isTour?: boolean;
  tourStep?: { current: number; total: number };
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  displayDuration?: number;
}

export function CypherGuide({ 
  message, 
  isVisible, 
  onSkip, 
  onNext, 
  isTour, 
  tourStep,
  position = "top-right",
  displayDuration = 8000
}: CypherGuideProps) {
  const [displayedMessage, setDisplayedMessage] = useState<CypherMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Debugging log to confirm the component is being called
  useEffect(() => {
    if (isVisible && message) {
      console.log("CypherGuide triggered with message:", message.text);
    }
  }, [isVisible, message]);

  // Handle entry state
  useEffect(() => {
    if (isVisible && message) {
      if (!hasEntered) {
        setHasEntered(true);
      }
    } else if (!isVisible) {
      setHasEntered(false);
    }
  }, [isVisible, message, hasEntered]);

  // Initialize audio object once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Simple, direct playback logic
  useEffect(() => {
    if (!message || !isVisible) {
      setDisplayedMessage(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      return;
    }

    if (audioRef.current) {
      setDisplayedMessage(message);
      setIsTyping(true);
      
      if (message.audioFile) {
        audioRef.current.pause();
        audioRef.current.src = message.audioFile;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsTyping(false);
        }).catch(err => {
          console.warn("Audio block/error:", err);
          setIsTyping(false);
        });
      } else {
        setIsTyping(false);
      }

      let hideTimer: NodeJS.Timeout | null = null;
      if (!message.isBlocking) {
        hideTimer = setTimeout(() => setDisplayedMessage(null), displayDuration);
      }
      return () => { if (hideTimer) clearTimeout(hideTimer); };
    }
  }, [message, isVisible, displayDuration]);

  if (!isVisible || !displayedMessage) return null;

  const isLeft = position.includes("left");
  const isTop = position.includes("top");

  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "top-20 left-4";
      case "bottom-left": return "bottom-4 left-4";
      case "top-right": return "top-20 right-4";
      default: return "bottom-4 right-4"; // bottom-right (new default)
    }
  };

  const getTypeGlow = () => {
    switch (displayedMessage.type) {
      case "warning": return "shadow-[0_0_20px_rgba(234,179,8,0.3)] border-yellow-500/50";
      case "success": return "shadow-[0_0_20px_rgba(34,197,94,0.3)] border-green-500/50";
      case "tip": return "shadow-[0_0_20px_rgba(6,182,212,0.3)] border-cyan-500/50";
      default: return "shadow-[0_0_20px_rgba(34,211,238,0.2)] border-cyan-500/30";
    }
  };

  return (
    <div className={`fixed inset-0 z-[1000] pointer-events-none`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cypherFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseCyan {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)); }
        }
        .animate-cypher-float {
          animation: cypherFloat 4s ease-in-out infinite;
        }
        .animate-cypher-speaker {
          animation: pulseCyan 2s ease-in-out infinite;
        }
      `}} />

      <div className={`fixed ${getPositionClasses()} flex items-center transition-all duration-500`}>
        <div className={`flex ${isLeft ? "flex-row" : "flex-row-reverse"} items-end gap-0 max-w-2xl`}>
          
          {/* Cypher Character Illustration */}
          <div className={`relative w-48 h-64 flex-shrink-0 animate-cypher-float ${isPlaying ? "animate-cypher-speaker" : ""} ${!hasEntered ? "animate-in slide-in-from-bottom duration-700" : ""}`}>
            <Image 
              src="/images/cypher.png" 
              alt="Cypher" 
              fill
              className="object-contain"
              priority
            />
            {/* Base Glow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-500/20 blur-xl rounded-full -z-10" />
          </div>

          {/* Data Anchor Line (SVG) */}
          <div className={`relative h-6 w-12 flex-shrink-0 mb-6 ${isLeft ? "-ml-2" : "-mr-2"}`}>
              <svg width="100%" height="100%" viewBox="0 0 50 100" preserveAspectRatio="none">
                  <path 
                      d={isLeft ? "M 0 50 L 50 80" : "M 50 50 L 0 80"} 
                      stroke="rgba(34, 211, 238, 0.4)" 
                      strokeWidth="2" 
                      fill="none" 
                      className="animate-pulse"
                  />
              </svg>
          </div>

          {/* HUD Dialogue Box */}
          <div className={`relative mb-6 ${!hasEntered ? `animate-in ${isLeft ? "slide-in-from-left" : "slide-in-from-right"} fade-in zoom-in duration-300` : ""} pointer-events-auto`}>
            <div className={`
               ${getTypeGlow()}
               bg-slate-950/90 backdrop-blur-md border-2 p-5 rounded-2xl max-w-sm
               relative
            `}>
               <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
               <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />

               <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="flex flex-col gap-1">
                    {tourStep && (
                       <span className="text-[8px] uppercase font-bold text-cyan-500/60 font-mono tracking-[0.2em]">
                         Training Mode // Step {tourStep.current} of {tourStep.total}
                       </span>
                    )}
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                       <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 font-mono">
                          Cypher_v2.0 // {(displayedMessage.type || "info").toUpperCase()}
                       </span>
                    </div>
                  </div>
                  {isTyping && <span className="text-[8px] text-cyan-500/60 font-mono animate-pulse uppercase">decrypting...</span>}
               </div>

               <div className="relative">
                  <p className="text-sm font-medium leading-relaxed text-slate-200">
                     {displayedMessage.text}
                  </p>

                  {isPlaying && (
                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-cyan-400/80 rounded-full animate-bounce" 
                          style={{ 
                            height: `${Math.random() * 10 + 4}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.6s'
                          }}
                        />
                      ))}
                    </div>
                  )}
               </div>

               {displayedMessage.isBlocking && (onSkip || onNext) && (
                  <div className="mt-4 flex gap-2 justify-end pointer-events-auto">
                    {onNext && (
                      <button 
                        onClick={() => {
                          console.log("HUD Continue clicked");
                          if (audioRef.current) audioRef.current.pause();
                          setIsPlaying(false);
                          onNext();
                        }}
                        className="text-[10px] font-black tracking-wider bg-white hover:bg-cyan-500 text-black px-4 py-2 rounded-lg transition-all shadow-[0_4px_10px_rgba(255,255,255,0.2)] active:translate-y-0.5"
                      >
                         Acknowledge & Continue »
                      </button>
                    )}
                    {onSkip && (
                      <button 
                        onClick={() => {
                          if (audioRef.current) audioRef.current.pause();
                          setIsPlaying(false);
                          onSkip();
                        }}
                        className="text-[10px] uppercase font-bold text-slate-500 hover:text-white px-2 py-1 transition-colors"
                      >
                        {isTour ? "Terminate" : "Skip Term"}
                      </button>
                    )}
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}