"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Lock, UserCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUser } from "@/context/user-context";

export default function Dashboard() {
  const { user, profile, setAvatar, completeTour, isLoading } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarConfirm = async () => {
    if (!selectedAvatar) return;
    setAvatarLoading(true);
    try {
      await setAvatar(selectedAvatar);
      // Mark onboarding complete so modal closes for both male and female choices.
      await completeTour();
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle Loading Session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4 font-mono">
          <div className="w-16 h-16 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-cyan-500 tracking-[0.3em] uppercase text-xs animate-pulse">Decrypting User Data...</div>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </main>
      </div>
    );
  }
  
  // Calculate xpToNext based on level (500 XP per level)
  const currentLevel = profile?.level ?? 1;
  const xpInCurrentLevel = (profile?.xp ?? 0) % 500;
  const progressPercent = (xpInCurrentLevel / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />

      {/* Avatar Selection Overlay — shown for brand-new users on first login */}
      {user && profile && !profile.tour_completed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="glass-card cyber-border rounded-3xl p-10 text-center max-w-lg w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 cyber-border rounded-2xl bg-primary/10">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Agent!</h1>
            <p className="text-muted-foreground mb-8">Choose your identity. Cypher will address you accordingly.</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setSelectedAvatar("male")}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  selectedAvatar === "male"
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "border-slate-700 bg-slate-900/50 hover:border-cyan-500/50"
                }`}
              >
                <div className="text-6xl mb-3">🧑‍💻</div>
                <div className={`font-bold text-lg ${selectedAvatar === "male" ? "text-cyan-400" : "text-slate-300"}`}>Male Agent</div>
                {selectedAvatar === "male" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedAvatar("female")}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  selectedAvatar === "female"
                    ? "border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    : "border-slate-700 bg-slate-900/50 hover:border-pink-500/50"
                }`}
              >
                <div className="text-6xl mb-3">👩‍💻</div>
                <div className={`font-bold text-lg ${selectedAvatar === "female" ? "text-pink-400" : "text-slate-300"}`}>Female Agent</div>
                {selectedAvatar === "female" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
            </div>

            <Button
              onClick={handleAvatarConfirm}
              disabled={!selectedAvatar || avatarLoading}
              className="w-full h-12 gradient-primary text-lg font-semibold"
            >
              {avatarLoading ? "Saving..." : "Enter the Academy"}
            </Button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Welcome back, {profile?.username ?? "Agent"}!
          </h1>
          <p className="text-muted-foreground">Continue your cybersecurity journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Level
              </CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">Level {profile?.level ?? 1}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((profile?.level ?? 1) - 1) * 500} + {xpInCurrentLevel} = <span className="text-cyan-400 font-bold">{profile?.xp ?? 0} Total XP</span>
              </p>
              <Progress value={progressPercent} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Global Rank
              </CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">#{profile?.score ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total Score
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Modules Completed
              </CardTitle>
              <Lock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                1/1
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                100% complete
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{profile?.level ?? 1}</div>
              <p className="text-xs text-muted-foreground mt-1">days in a row 🔥</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Module */}
          <Card className="glass-card border-primary/20 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-foreground">Crack the Vault</CardTitle>
              <CardDescription>Master password creation and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <Lock className="h-16 w-16 text-primary mb-4" />
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Practice creating strong passwords and learn about password security in this interactive module.
                </p>
                <Button asChild>
                  <NavLink href="/modules/1">
                    Start Module
                  </NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}