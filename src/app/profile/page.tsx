"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Shield, 
  Trophy, 
  Calendar,
  Target,
  Activity,
  Settings
} from "lucide-react";
import { useUser } from "@/context/user-context";

export default function Profile() {
  const { user, profile } = useUser();
  
  // If user is not logged in, redirect to auth
  if (!user) {
    // In a real app, we would redirect, but for now we'll show a message
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </main>
      </div>
    );
  }
  
  const badges = [
    { id: 1, name: "First Steps", icon: "🎯", description: "Complete your first module", unlocked: true },
    { id: 2, name: "Week Warrior", icon: "🔥", description: "Maintain a 7-day streak", unlocked: true },
    { id: 3, name: "Quiz Master", icon: "🧠", description: "Score 100% on 5 quizzes", unlocked: true },
    { id: 4, name: "Game Champion", icon: "🎮", description: "Complete all game modules", unlocked: false },
    { id: 5, name: "Security Expert", icon: "🛡️", description: "Reach level 10", unlocked: false },
    { id: 6, name: "Speed Demon", icon: "⚡", description: "Complete a module in under 30 min", unlocked: false },
  ];

  const recentAchievements = [
    { date: "2 days ago", title: "Week Warrior Badge Unlocked", xp: 100 },
    { date: "5 days ago", title: "Reached Level 7", xp: 200 },
    { date: "1 week ago", title: "Completed Password Security Module", xp: 150 },
  ];

  const progressPercent = ((profile?.xp ?? 0) / ((profile?.level ?? 1) * 500)) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Profile Header */}
        <div className="glass-card border-primary/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary/30">
              <AvatarImage src="/kavach_logo.png" />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                {(profile?.username ?? "Agent").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gradient mb-2">
                {profile?.username ?? "Agent"}
              </h1>
              <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              
              {/* <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Level {user.level}
                </Badge>
                <Badge variant="outline" className="border-primary/30">
                  Rank #{user.rank || 100}
                </Badge>
                <Badge variant="outline" className="border-primary/30">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined Jan 2024
                </Badge>
              </div> */}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress to Level {(profile?.level ?? 1) + 1}</span>
                  <span className="text-sm font-medium text-primary">{profile?.xp ?? 0} / {(profile?.level ?? 1) * 500} XP</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>

            {/* <Button variant="outline" className="border-primary/30">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {(profile?.score ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                0
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                0 🔥
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                Level {profile?.level ?? 1}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="glass-card border-primary/20">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Your Progress</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Crack the Vault Module</h3>
                  <p className="text-muted-foreground mb-4">You've completed the password security module with a score of {profile?.score ?? 0} points.</p>
                  <Button onClick={() => window.location.href = '/modules/2'}>
                    Practice Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    defaultValue={profile?.username ?? ""}
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={user.email ?? ""}
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    placeholder="Enter current password"
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    placeholder="Enter new password"
                    className="bg-background/50 border-border/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline" className="border-primary/30">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
