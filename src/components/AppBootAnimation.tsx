"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Zap, Eye, KeyRound, Trophy } from "lucide-react";

interface AppBootAnimationProps {
  onComplete: () => void;
}

export function AppBootAnimation({ onComplete }: AppBootAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [skipHint, setSkipHint] = useState(true);

  useEffect(() => {
    // Animation phases
    const timers = [
      setTimeout(() => setPhase(1), 800),    // Show logo
      setTimeout(() => setPhase(2), 2000),   // Show tagline
      setTimeout(() => setPhase(3), 3000),   // Show animated icons
      setTimeout(() => setPhase(4), 4500),   // Show loading bar
      setTimeout(() => setPhase(5), 6000),   // Complete
    ];

    // Auto-complete after 6.5 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 500);
    }, 6500);

    // Hide skip hint after 3 seconds
    const hintTimer = setTimeout(() => {
      setSkipHint(false);
    }, 3000);

    // Emergency timeout - force complete after 10 seconds
    const emergencyTimer = setTimeout(() => {
      console.log('Boot animation emergency timeout');
      setIsVisible(false);
      onComplete();
    }, 10000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
      clearTimeout(hintTimer);
      clearTimeout(emergencyTimer);
    };
  }, [onComplete]);

  // Skip on keypress or click
  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setIsVisible(false);
      setTimeout(() => onComplete(), 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center"
      onClick={handleSkip}
      style={{ cursor: 'pointer' }}
    >
      <div className="text-center px-4">
        {/* Main Logo Animation */}
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative mb-8">
            {/* Rotating shield */}
            <Shield className="w-40 h-40 text-cyan-500 mx-auto animate-spin-slow" style={{ animationDuration: '8s' }} />
            
            {/* Pulsing lock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Lock className="w-20 h-20 text-blue-400 animate-pulse" />
            </div>
            
            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
              <Zap className="w-6 h-6 text-yellow-400 absolute top-0 left-1/2 -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
              <Eye className="w-6 h-6 text-purple-400 absolute bottom-0 left-1/2 -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3 tracking-wider">
            KAVACH
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <p className="text-2xl text-blue-200 tracking-widest font-light">CYBERSECURITY ACADEMY</p>
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Tagline */}
        <div className={`transition-all duration-700 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg text-cyan-300/80 italic mb-8">
            "Master Security. Think Like a Hacker."
          </p>
        </div>

        {/* Animated Feature Icons */}
        <div className={`flex justify-center gap-6 mt-8 transition-all duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDelay: '0s' }}>
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-cyan-300">Learn</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-blue-300">Practice</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-purple-300">Master</span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className={`mt-12 w-80 mx-auto transition-all duration-1000 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-[loading_3s_ease-in-out]"
              style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' }}
            />
          </div>
          <p className="text-sm text-blue-300 mt-3 animate-pulse tracking-wide">
            Initializing secure learning environment...
          </p>
        </div>

        {/* Skip Button */}
        <div className={`absolute bottom-12 left-0 right-0 text-center transition-opacity duration-500 ${skipHint ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-sm text-blue-400/70 animate-pulse">
            Press any key or click to skip
          </p>
        </div>

        {/* Version */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs text-slate-600">
            v1.0.0 • Phase 1 Prototype
          </p>
        </div>
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
