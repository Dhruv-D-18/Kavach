"use client";

import { useState, useEffect } from "react";
import { AppBootAnimation } from "@/components/AppBootAnimation";

// Global flag to track if boot animation has been shown (persists across component remounts)
declare global {
  interface Window {
    __KAVACH_BOOT_SHOWN?: boolean;
  }
}

export function BootWrapper({ children }: { children: React.ReactNode }) {
  const [showBoot, setShowBoot] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window === 'undefined') return;
    
    const hasShown = window.__KAVACH_BOOT_SHOWN;
    
    if (!hasShown) {
      window.__KAVACH_BOOT_SHOWN = true;
      setShowBoot(true);
    } else {
      setShowBoot(false);
    }
  }, []);

  const handleBootComplete = () => {
    setShowBoot(false);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {showBoot && <AppBootAnimation onComplete={handleBootComplete} />}
      {children}
    </>
  );
}
