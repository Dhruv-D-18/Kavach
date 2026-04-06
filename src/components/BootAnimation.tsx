"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Zap } from "lucide-react";

interface BootAnimationProps {
  onComplete: () => void;
}

export function BootAnimation({ onComplete }: BootAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation phases
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Show title
      setTimeout(() => setPhase(2), 1500),  // Show icons
      setTimeout(() => setPhase(3), 2500),  // Show loading bar
      setTimeout(() => setPhase(4), 3500),  // Complete
    ];

    // Auto-complete after 4 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Fade out animation
    }, 4000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center animate-in fade-out duration-500">
      <div className="text-center">
        {/* Main Logo */}
        <div className={`mb-8 transition-all duration-700 ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative">
            <Shield className="w-32 h-32 text-cyan-500 mx-auto animate-pulse" />
            <Lock className="w-16 h-16 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Title */}
        <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
            KAVACH
          </h1>
          <p className="text-xl text-blue-300 tracking-wider">CYBERSECURITY ACADEMY</p>
        </div>

        {/* Animated Icons */}
        <div className={`flex justify-center gap-8 mt-8 transition-all duration-700 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-bounce">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="animate-pulse">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Loading Bar */}
        <div className={`mt-12 w-64 mx-auto transition-all duration-700 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-[loading_2s_ease-in-out]" />
          </div>
          <p className="text-sm text-blue-300 mt-2 animate-pulse">Initializing secure environment...</p>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-blue-400 hover:text-cyan-300 transition-colors"
        >
          Press any key or click to skip
        </button>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
