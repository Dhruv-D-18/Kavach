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
    console.log('BootWrapper mounted');
    setMounted(true);
    
    // Check global window flag
    if (typeof window === 'undefined') return;
    
    const hasShown = window.__KAVACH_BOOT_SHOWN;
    
    if (!hasShown) {
      console.log('✅ FIRST LOAD EVER - Setting flag and showing boot');
      // Set flag IMMEDIATELY before any async operations
      window.__KAVACH_BOOT_SHOWN = true;
      console.log('Flag set:', window.__KAVACH_BOOT_SHOWN);
      
      // Show boot animation
      setShowBoot(true);
    } else {
      console.log('⏭️ Boot already shown - skipping (flag is', window.__KAVACH_BOOT_SHOWN, ')');
      setShowBoot(false);
    }
  }, []);

  const handleBootComplete = () => {
    console.log('Boot animation completed');
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
