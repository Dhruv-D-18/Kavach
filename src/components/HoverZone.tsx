"use client";

import { ReactNode } from "react";

interface HoverZoneProps {
  children: ReactNode;
  className?: string;
}

export function HoverZone({ children, className = "" }: HoverZoneProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
