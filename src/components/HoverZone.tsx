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
  const { setActiveHoverTour, isNewUser } = useUser();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Only activate hover events if they are a new user
    if (!isNewUser) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a debounce timer
    timerRef.current = setTimeout(() => {
      setActiveHoverTour(tourId);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (!isNewUser) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
