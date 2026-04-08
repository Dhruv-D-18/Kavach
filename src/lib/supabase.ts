import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton pattern for Next.js dev mode (avoids multiple instances)
const globalForSupabase = global as unknown as { supabase: ReturnType<typeof createClient> };

export const supabase = globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseAnonKey);

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}

export type Profile = {
  id: string;
  username: string;
  avatar: 'male' | 'female';
  score: number;
  level: number;
  xp: number;
  tour_completed: boolean;
  created_at: string;
  updated_at: string;
};
