"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Trophy, Crown, Medal, Zap, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import { useUser } from "@/context/user-context";

export default function Leaderboard() {
  const { user, profile: myProfile } = useUser();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .order("score", { ascending: false })
      .limit(50);

    if (!error && data) {
      setPlayers(data as Profile[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Real-time subscription: update leaderboard when any profile's score changes
    const channel = (supabase as any)
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        () => {
          fetchLeaderboard(); // Re-fetch on any score update
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const getRankStyle = (rank: number, playerId: string) => {
    const isMe = user?.id === playerId;
    if (isMe) return "border-cyan-500/60 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.2)]";
    if (rank === 1) return "cyber-border bg-gradient-to-r from-yellow-400/10 to-transparent";
    if (rank === 2) return "border-slate-300/30 bg-gradient-to-r from-slate-300/10 to-transparent";
    if (rank === 3) return "border-orange-400/30 bg-gradient-to-r from-orange-400/10 to-transparent";
    return "";
  };

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <div className="pt-32 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 cyber-border rounded-2xl bg-primary/10">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Live rankings — updates in real-time as agents complete missions
            </p>
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-mono">LIVE</span>
            </div>
          </div>

          {/* My Rank Banner */}
          {user && myProfile && (
            <div className="mb-6 p-4 glass-card border-cyan-500/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 border border-cyan-500/30">
                  {myProfile.avatar === "female" ? "👩‍💻" : "🧑‍💻"}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="font-bold text-cyan-400">{myProfile.username}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{myProfile.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Level {myProfile.level}</div>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No agents on the board yet.</p>
              <p className="text-sm mt-2">Be the first to complete a mission!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className={`glass-card rounded-2xl p-5 hover:cyber-glow transition-all border ${getRankStyle(rank, player.id)}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary font-bold text-lg">
                        {rank <= 3 ? getRankIcon(rank) : rank}
                      </div>

                      {/* Avatar */}
                      <div className="text-2xl">
                        {player.avatar === "female" ? "👩‍💻" : "🧑‍💻"}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">
                            {player.username || "Anonymous Agent"}
                          </h3>
                          {user?.id === player.id && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">You</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-primary" />
                            Level {player.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-primary" />
                            {player.xp.toLocaleString()} XP
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{player.score.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA for non-logged users */}
          {!user && (
            <div className="glass-card cyber-border rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-3">Join the Competition!</h3>
              <p className="text-muted-foreground mb-6">
                Complete challenges, earn XP, and climb the leaderboard
              </p>
              <a href="/auth?mode=signup">
                <button className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl">
                  Start Competing
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
