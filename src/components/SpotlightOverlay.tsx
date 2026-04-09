"use client";

import { useEffect, useState, useCallback } from "react";

interface SpotlightOverlayProps {
  targetId: string | null;
  isOpen: boolean;
  padding?: number;
}

export function SpotlightOverlay({ targetId, isOpen, padding = 10 }: SpotlightOverlayProps) {
  const [coords, setCoords] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const updateCoords = useCallback(() => {
    if (!targetId || !isOpen) {
      setCoords(null);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    }
  }, [targetId, isOpen, padding]);

  // Update on scroll/resize
  useEffect(() => {
    updateCoords();
    window.addEventListener("scroll", updateCoords);
    window.addEventListener("resize", updateCoords);
    
    // Interval update for dynamic elements/layout shifts
    const interval = setInterval(updateCoords, 100);

    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
      clearInterval(interval);
    };
  }, [updateCoords]);

  if (!isOpen || !coords) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden transition-all duration-500">
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={coords.x}
              y={coords.y}
              width={coords.width}
              height={coords.height}
              rx="12"
              fill="black"
              className="transition-all duration-500"
            />
          </mask>
        </defs>
        <rect
          width="100%" height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#spotlight-mask)"
        />
        
        {/* Decorative Glowing Border */}
        <rect
          x={coords.x}
          y={coords.y}
          width={coords.width}
          height={coords.height}
          rx="12"
          fill="none"
          stroke="rgba(6, 182, 212, 0.5)"
          strokeWidth="2"
          className="transition-all duration-500 animate-pulse"
          style={{ filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))" }}
        />
      </svg>
    </div>
  );
}
