"use client";

import { useState, Suspense } from "react";
import { Shield, Mail, Lock, User, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

type AuthStep = "form" | "avatar" | "email-sent";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, signup, setAvatar } = useUser();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [step, setStep] = useState<AuthStep>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | null>(null);

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (mode === "login") {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Invalid email or password.");
      }
    } else {
      const result = await signup(formData.username, formData.email, formData.password);
      if (result.success) {
        if (result.sessionCreated) {
          // Email confirmation is OFF — session created instantly, go to home
          router.push("/");
        } else {
          // Email confirmation is ON — tell user to check inbox
          setStep("email-sent");
        }
      } else {
        setError(result.error || "Could not create account.");
      }
    }
    setIsLoading(false);
  };

  const handleAvatarSelect = async (avatar: "male" | "female") => {
    setSelectedAvatar(avatar);
  };

  const handleAvatarConfirm = async () => {
    if (!selectedAvatar) return;
    setIsLoading(true);
    await setAvatar(selectedAvatar);
    router.push("/");
  };


  if (step === "email-sent") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="w-full max-w-lg">
          <div className="glass-card cyber-border rounded-3xl p-10 text-center">
            <div className="text-6xl mb-6">📬</div>
            <h1 className="text-3xl font-bold mb-3">Check Your Inbox</h1>
            <p className="text-muted-foreground mb-2">
              We sent a confirmation link to:
            </p>
            <p className="text-primary font-mono font-bold text-lg mb-6">{formData.email}</p>
            <p className="text-muted-foreground text-sm mb-8">
              Click the link in the email to activate your account. Once confirmed, come back and sign in — Cypher will guide you through the rest.
            </p>
            <button
              onClick={() => { setStep("form"); setMode("login"); }}
              className="px-8 py-3 gradient-primary text-white font-semibold rounded-xl w-full"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "avatar") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="w-full max-w-lg">
          <div className="glass-card cyber-border rounded-3xl p-10 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 cyber-border rounded-2xl bg-primary/10">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Choose Your Agent</h1>
              <p className="text-muted-foreground">Cypher will greet you differently based on your identity.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Male Avatar */}
              <button
                onClick={() => handleAvatarSelect("male")}
                className={`group relative rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  selectedAvatar === "male"
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-800/50"
                }`}
              >
                <div className="text-6xl mb-3">🧑‍💻</div>
                <div className={`font-bold text-lg ${selectedAvatar === "male" ? "text-cyan-400" : "text-slate-300"}`}>
                  Male Agent
                </div>
                <div className="text-xs text-muted-foreground mt-1">Default Avatar</div>
                {selectedAvatar === "male" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>

              {/* Female Avatar */}
              <button
                onClick={() => handleAvatarSelect("female")}
                className={`group relative rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  selectedAvatar === "female"
                    ? "border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                    : "border-slate-700 bg-slate-900/50 hover:border-pink-500/50 hover:bg-slate-800/50"
                }`}
              >
                <div className="text-6xl mb-3">👩‍💻</div>
                <div className={`font-bold text-lg ${selectedAvatar === "female" ? "text-pink-400" : "text-slate-300"}`}>
                  Female Agent
                </div>
                <div className="text-xs text-muted-foreground mt-1">Default Avatar</div>
                {selectedAvatar === "female" && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
            </div>

            <Button
              onClick={handleAvatarConfirm}
              disabled={!selectedAvatar || isLoading}
              className="w-full h-12 gradient-primary text-lg font-semibold"
            >
              {isLoading ? "Launching Academy..." : "Enter the Academy"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Shield className="w-10 h-10 text-primary group-hover:cyber-glow transition-all" />
          <span className="text-2xl font-bold">Kavach Academy</span>
        </Link>

        <div className="glass-card cyber-border rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 cyber-border rounded-2xl bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Welcome Back" : "Join Kavach"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Continue your cybersecurity journey"
                : "Start defending the digital world"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleFormSubmit}>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="cyberdefender"
                    value={formData.username}
                    onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                    className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@kavach.io"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-12 gradient-primary text-lg font-semibold">
              {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => { 
                setMode(mode === "login" ? "signup" : "login"); 
                setError(""); 
                setFormData({ username: "", email: "", password: "" }); 
              }}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-primary animate-pulse">Loading...</div></div>}>
      <AuthContent />
    </Suspense>
  );
}
