"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Award, ArrowRight, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { BootAnimation } from "@/components/BootAnimation";
import { useUser } from "@/context/user-context";
import { HoverGuide } from "@/components/HoverGuide";
import { HoverZone } from "@/components/HoverZone";
import { FirstTimeTour } from "@/components/FirstTimeTour";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, profile, isLoading, hasBooted, setHasBooted, completeTour } = useUser();
  const router = useRouter();

  // Show boot animation only once per session
  if (!hasBooted) {
    return <BootAnimation onComplete={() => setHasBooted(true)} />;
  }

  // After boot, show loading state while session is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <Globe className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <div className="text-primary font-mono tracking-[0.2em] text-sm uppercase">Establishing Academy Link...</div>
        </div>
      </div>
    );
  }

  const handleProtectedLink = (path: string) => {
    if (!user) {
      router.push("/auth");
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen">
      {/* First-Time Tour Overlay for new users */}
      {user && profile && !profile.tour_completed && (
        <FirstTimeTour onComplete={completeTour} />
      )}

      <Navigation />

      {/* Hero Section */}
      <section id="tour-welcome" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl">
            <img src="/kavach_logo.png" alt="Kavach Logo" className="w-30 h-30" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Cybersecurity<br />
            <span className="text-gradient">Through Gamification</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn security concepts through interactive challenges, real-world simulations,
            and compete with cyber defenders worldwide.
          </p>

          <HoverZone tourId="explore" delayMs={300} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              id="tour-explore"
              size="lg"
              className="gradient-primary text-lg font-semibold gap-2"
              onClick={() => handleProtectedLink("/modules")}
            >
              Explore Modules
              <ArrowRight className="w-5 h-5" />
            </Button>
            {!user && (
              <Link href="/auth">
                <Button size="lg" variant="outline" className="text-lg border-primary/30 hover:border-primary">
                  Start Learning
                </Button>
              </Link>
            )}
          </HoverZone>
        </div>
      </section>

      {/* Features Grid */}
      <HoverZone tourId="features">
        <section id="tour-features" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: "Hands-On Challenges", description: "Practice real security scenarios in safe, sandboxed environments" },
                { icon: Users, title: "Compete & Learn", description: "Join leaderboards and compete with other cyber defenders" },
                { icon: Award, title: "Earn Badges & XP", description: "Track your progress and unlock achievements as you level up" },
                { icon: Globe, title: "Flexible Learning", description: "Access theory content anytime, gamification is optional" }
              ].map((feature, idx) => (
                <div key={idx} className="glass-card cyber-border p-6 rounded-2xl hover:cyber-glow transition-all group">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </HoverZone>


      {/* Footer */}
      <footer className="mt-20 border-t border-primary/20 bg-slate-950/80 backdrop-blur-md pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <img src="/kavach_logo.png" alt="Kavach" className="w-10 h-10" />
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Kavach</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Empowering the next generation of cyber defenders through immersive, gamified learning. Defend the digital realm, earn rewards, and secure your future.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                  <Globe className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                  <Shield className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Navigation</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/" className="text-slate-400 hover:text-primary transition-colors">Home Base</Link></li>
                <li><Link href="/modules" className="text-slate-400 hover:text-primary transition-colors">Training Modules</Link></li>
                <li><Link href="/leaderboard" className="text-slate-400 hover:text-primary transition-colors">Global Standings</Link></li>
                <li><Link href="/profile" className="text-slate-400 hover:text-primary transition-colors">Agent Profile</Link></li>
              </ul>
            </div>

            {/* Development Team */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Project Development</h4>
              <ul className="space-y-4 text-sm">
                <li className="text-slate-400">
                  <span className="block text-primary text-[10px] font-mono mb-1">LEAD_DEVELOPER</span>
                  <a href="https://www.linkedin.com/in/dhruv-dharkar-46826a27a" target="_blank" className="hover:text-white transition-colors">LinkedIn Profile</a>
                </li>
                <li className="text-slate-400">
                  <span className="block text-primary text-[10px] font-mono mb-1">COMMUNICATIONS</span>
                  <div className="space-y-1">
                    <a href="mailto:dhruv.y.dharkar@outlook.com" className="block hover:text-white transition-colors">dhruv.y.dharkar@outlook.com</a>
                    <a href="mailto:rijuyan.s.mallick@outlook.nuv.ac.in" className="block hover:text-white transition-colors">rijuyan.s.mallick@outlook.nuv.ac.in</a>
                    <a href="mailto:priya.s.bhatt@outlook.nuv.ac.in" className="block hover:text-white transition-colors">priya.s.bhatt@outlook.nuv.ac.in</a>
                    <a href="mailto:isha.r.rajput@outlook.nuv.ac.in" className="block hover:text-white transition-colors">isha.r.rajput@outlook.nuv.ac.in</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              © 2026 KAVACH_ACADEMY_SYSTEMS // ALL_RIGHTS_RESERVED
            </p>
            <div className="flex gap-6 text-[10px] font-mono text-slate-500 uppercase">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy_Protocol</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms_of_Engagement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}