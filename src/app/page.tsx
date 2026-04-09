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
import { useRouter } from "next/navigation";

export default function Home() {
  const [bootDone, setBootDone] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Show boot animation first
  if (!bootDone) {
    return <BootAnimation onComplete={() => setBootDone(true)} />;
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
      {/* HoverGuide shows Cypher dialogues and spotlight for logged-in new users */}
      <HoverGuide />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
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
        <section className="py-20 px-4">
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

      {/* Learning Modules Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Learning Modules</h2>
            <p className="text-muted-foreground text-lg">Start with these beginner-friendly modules</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <HoverZone tourId="crack-vault" className="h-full">
              <div
                className="glass-card cyber-border p-6 rounded-2xl hover:cyber-glow transition-all h-full cursor-pointer group"
                onClick={() => handleProtectedLink("/modules/1")}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">Crack the Vault</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Beginner</span>
                </div>
                <p className="text-muted-foreground mb-4">Master the art of creating unbreakable passwords</p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  {user ? "Launch Module" : "Sign in to Play"}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </div>
              </div>
            </HoverZone>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-primary/30 hover:border-primary" onClick={() => handleProtectedLink("/modules")}>
              View All Modules
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <HoverZone tourId="create-account">
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="glass-card cyber-border rounded-3xl p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Defend the Digital World?</h2>
                <Link href="/auth?mode=signup">
                  <Button size="lg" className="gradient-primary text-lg font-semibold">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </HoverZone>
      )}
    </div>
  );
}