"use client";

import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Lock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUser } from "@/context/user-context";

export default function Dashboard() {
  const { user } = useUser();
  
  // If user is not logged in, redirect to auth
  if (!user) {
    // In a real app, we would redirect, but for now we'll show a message
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
  const xpToNext = user.level * 500;
  const progressPercent = (user.xp / xpToNext) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Welcome back, {user.username}!
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
              <div className="text-3xl font-bold text-primary">{user.level}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.xp} / {xpToNext} XP
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
              <div className="text-3xl font-bold text-primary">#{user.rank || 100}</div>
              <p className="text-xs text-muted-foreground mt-1">
                out of {(user.totalUsers || 1000).toLocaleString()} users
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
              <div className="text-3xl font-bold text-primary">{user.streak || 0}</div>
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
                  <NavLink href="/modules/2">
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
