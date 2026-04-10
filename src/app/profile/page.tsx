"use client";

import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user, profile, isLoading } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ modules: 0 });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: ""
  });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({ ...prev, username: profile.username }));
    }
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [profile, user]);

  const handleUpdateAccount = async () => {
    if (!user) return;
    setUpdateLoading(true);
    setMessage(null);
    try {
      // 1. Update Username in Profiles table
      if (formData.username && formData.username !== profile?.username) {
        const { error: profileError } = await (supabase as any)
          .from("profiles")
          .update({ username: formData.username, updated_at: new Date().toISOString() })
          .eq("id", user.id);
        
        if (profileError) throw profileError;
      }

      // 2. Update Email/Password in Supabase Auth
      const updatePayload: any = {};
      if (formData.email && formData.email !== user.email) updatePayload.email = formData.email;
      if (formData.newPassword) updatePayload.password = formData.newPassword;

      if (Object.keys(updatePayload).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updatePayload);
        if (authError) throw authError;
      }

      setMessage({ text: "Account credentials updated successfully.", type: "success" });
      setFormData(prev => ({ ...prev, newPassword: "" })); // Clear password field
    } catch (err: any) {
      console.error("Update error:", err);
      setMessage({ text: err.message || "Failed to update account.", type: "error" });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      const { data, error } = await (supabase as any)
        .from('student_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
        // Count unique modules
        const uniqueModules = new Set(data.map((s: any) => s.module_id)).size;
        setStats({ modules: uniqueModules });
      }
    }
    fetchHistory();
  }, [user]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4 font-mono">
          <div className="w-16 h-16 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-cyan-500 tracking-[0.3em] uppercase text-xs animate-pulse">Establishing Secure ID Connection...</div>
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
                  <span className="text-sm font-medium text-primary">{(profile?.xp ?? 0) % 500} / 500 XP</span>
                </div>
                <Progress value={((profile?.xp ?? 0) % 500) / 5} className="h-2" />
              </div>
            </div>

            {/* <Button variant="outline" className="border-primary/30">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total XP</p>
                  <p className="text-2xl font-bold text-slate-100">{profile?.xp.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Modules</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.modules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card cyber-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Clearance Level</p>
                  <p className="text-2xl font-bold text-cyan-400">Level {profile?.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Account Lifecycle Management</CardTitle>
              <CardDescription>Update your agent credentials and security protocols</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {message && (
                <div className={`p-3 rounded border text-xs font-mono mb-4 ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                  [{message.type.toUpperCase()}] {message.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-background/50 border-border/50 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50 border-border/50 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="bg-background/50 border-border/50 font-mono"
                />
                <p className="text-[10px] text-muted-foreground italic">Leave blank to keep current password</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateAccount} disabled={updateLoading} className="gradient-primary">
                  {updateLoading ? "Synchronizing..." : "Execute Updates"}
                </Button>
                <Button variant="outline" className="border-primary/30" onClick={() => window.location.reload()}>
                  Revert Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
