"use client";

import { useUser } from "@/context/user-context";
import { ReactNode, useRef } from "react";

interface HoverZoneProps {
  children: ReactNode;
  tourId: string;
  className?: string;
  delayMs?: number;
}

export function HoverZone({ children, tourId, className = "", delayMs = 600 }: HoverZoneProps) {
  const { setActiveHoverTour, user, profile, seenDialogues } = useUser();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Legacy Hover Tour logic disabled to favor the new Premium Spotlight Tour
    /*
    if (!user) return;
    if (profile?.tour_completed) return;
    if (seenDialogues.has(tourId)) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setActiveHoverTour(tourId);
    }, delayMs);
    */
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
