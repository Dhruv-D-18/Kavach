"use client";

import { useState, useRef } from "react";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

export default function Auth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, signup } = useUser();
  
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    
    if (mode === "login") {
      const success = login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        // In a real app, show an error message
        alert("Invalid email or password");
      }
    } else {
      const username = usernameRef.current?.value || "";
      const success = signup(username, email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        // In a real app, show an error message
        alert("User already exists");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Shield className="w-10 h-10 text-primary group-hover:cyber-glow transition-all" />
          <span className="text-2xl font-bold">Kavach Academy</span>
        </Link>
        
        {/* Auth Card */}
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
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={usernameRef}
                    id="username"
                    type="text"
                    placeholder="cyberdefender"
                    className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="agent@kavach.io"
                  className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            
            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 gradient-primary text-lg font-semibold"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full h-12 border-border/50 hover:border-primary/50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
