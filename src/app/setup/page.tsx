"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is no longer needed — Supabase Auth handles new/returning users.
// Redirect to home.
export default function SetupPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
