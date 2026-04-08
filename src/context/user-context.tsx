"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string; sessionCreated?: boolean }>;
  logout: () => Promise<void>;
  updateScore: (points: number) => Promise<void>;
  setAvatar: (avatar: 'male' | 'female') => Promise<void>;
  completeTour: () => Promise<void>;
  isNewUser: boolean;
  activeHoverTour: string | null;
  setActiveHoverTour: (id: string | null) => void;
  seenDialogues: Set<string>;
  markDialogueSeen: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeHoverTour, setActiveHoverTour] = useState<string | null>(null);
  const [seenDialogues, setSeenDialogues] = useState<Set<string>>(new Set());

  // Fetch profile from Supabase
  const fetchProfile = async (userId: string) => {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  // Load seen dialogues from localStorage (per user)
  const loadSeenDialogues = (userId: string) => {
    const stored = localStorage.getItem(`seenDialogues_${userId}`);
    if (stored) {
      setSeenDialogues(new Set(JSON.parse(stored)));
    }
  };

  // On mount: check existing session
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        loadSeenDialogues(session.user.id);
      }
      setIsLoading(false);
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        loadSeenDialogues(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setSeenDialogues(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      await fetchProfile(data.user.id);
    }
    return { success: true };
  };

  const signup = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string; sessionCreated?: boolean }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username } // passed to trigger via raw_user_meta_data
      }
    });

    if (error) return { success: false, error: error.message };

    // If email confirmation is disabled, a session is created immediately
    if (data.session && data.user) {
      await fetchProfile(data.user.id);
      return { success: true, sessionCreated: true };
    }

    // Email confirmation required — no session yet
    return { success: true, sessionCreated: false };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateScore = async (points: number) => {
    if (!user || !profile) return;

    const newScore = profile.score + points;
    const newXp = profile.xp + points;
    const newLevel = newXp >= profile.level * 500 ? profile.level + 1 : profile.level;

    const { data, error } = await (supabase as any)
      .from("profiles")
      .update({ score: newScore, xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const setAvatar = async (avatar: 'male' | 'female') => {
    if (!user) return;
    const { data, error } = await (supabase as any)
      .from("profiles")
      .update({ avatar, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const completeTour = async () => {
    if (!user) return;
    await (supabase as any)
      .from("profiles")
      .update({ tour_completed: true, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    setProfile(prev => prev ? { ...prev, tour_completed: true } : null);
  };

  const markDialogueSeen = (id: string) => {
    setSeenDialogues(prev => {
      const next = new Set(prev).add(id);
      if (user) {
        localStorage.setItem(`seenDialogues_${user.id}`, JSON.stringify([...next]));
      }
      return next;
    });
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      isLoading,
      login,
      signup,
      logout,
      updateScore,
      setAvatar,
      completeTour,
      isNewUser,
      activeHoverTour,
      setActiveHoverTour,
      seenDialogues,
      markDialogueSeen,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}