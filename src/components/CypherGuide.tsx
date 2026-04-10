"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

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
}

export function CypherGuide({ message, isVisible, onSkip, onNext, isTour }: CypherGuideProps) {
  const [displayedMessage, setDisplayedMessage] = useState<CypherMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mount Audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        // If it was blocking, we might want to auto-skip/resume after audio finishes
        if (displayedMessage?.isBlocking && onSkip) {
          onSkip();
        }
      };
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [displayedMessage, onSkip]);

  useEffect(() => {
    if (message) {
      setIsTyping(true);
      setDisplayedMessage(message);
      
      // Stop existing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Handle Audio Playback
      if (message.audioFile && audioRef.current) {
        audioRef.current.src = message.audioFile;
        audioRef.current.play().then(() => {
          setIsTyping(false);
          setIsPlaying(true);
        }).catch(err => {
          console.error("Audio playback failed:", err);
          setIsTyping(false);
          // If playback failed but it's blocking, we still need to allow progression via the skip button which renders below.
        });
      } else {
        setIsTyping(false);
      }

      // If it's NOT blocking, auto-hide after 8 seconds 
      // (If it IS blocking, it waits for audio 'onended' or manual onSkip)
      let hideTimer: NodeJS.Timeout | null = null;
      if (!message.isBlocking) {
        hideTimer = setTimeout(() => {
          setDisplayedMessage(null);
        }, 8000);
      }

      return () => {
        if (hideTimer) clearTimeout(hideTimer);
      };
    } else {
      setDisplayedMessage(null);
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [message]);

  if (!isVisible || !displayedMessage) return null;

  const getTypeStyles = () => {
    switch (displayedMessage.type) {
      case "warning":
        return "bg-yellow-600/90 border-yellow-500/50 text-yellow-50";
      case "success":
        return "bg-green-600/90 border-green-500/50 text-green-50";
      case "tip":
        return "bg-blue-600/90 border-blue-500/50 text-blue-50";
      default:
        return "bg-slate-700/90 border-slate-500/50 text-slate-50";
    }
  };

  return (
    <div className={`fixed top-4 right-4 ${isTour ? "z-[90]" : "z-50"} max-w-md animate-in slide-in-from-right fade-in duration-300`}>
      <Card className={`${getTypeStyles()} border-2 shadow-xl`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Cypher Avatar */}
            <Avatar className="h-12 w-12 border-2 border-white/50 bg-gradient-to-br from-cyan-500 to-blue-600">
              <AvatarFallback className="text-sm font-bold text-white">
                CY
              </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-bold text-sm">Cypher</span>
                  {isTyping && <span className="text-xs opacity-70">typing...</span>}
                </div>
                {displayedMessage.isBlocking && (onSkip || onNext) && (
                  <div className="flex gap-2">
                    {onNext && (
                      <button 
                        onClick={() => {
                          if (audioRef.current) audioRef.current.pause();
                          setIsPlaying(false);
                          onNext();
                        }}
                        className="text-[10px] font-bold bg-cyan-500 hover:bg-cyan-400 text-cyan-950 px-2 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all animate-pulse"
                      >
                        NEXT &gt;&gt;
                      </button>
                    )}
                    {onSkip && (
                      <button 
                        onClick={() => {
                          if (audioRef.current) audioRef.current.pause();
                          setIsPlaying(false);
                          onSkip();
                        }}
                        className="text-xs bg-black/20 hover:bg-black/40 px-2 py-1 rounded border border-white/20 transition-colors"
                      >
                        {isTour ? "End Tour" : "Skip >>"}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed">
                {displayedMessage.text}
              </p>
              
              {isPlaying && (
                <div className="flex items-center gap-1 mt-2 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-white/70 rounded-full animate-pulse" 
                      style={{ 
                        height: `${Math.random() * 8 + 4}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.4s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
