import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Award, ArrowRight, Lock, Mail, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl">
            <img 
              src="/kavach_logo.png" 
              alt="Kavach Logo" 
              className="w-30 h-30" 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Cybersecurity<br />
            <span className="text-gradient">Through Gamification</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn security concepts through interactive challenges, real-world simulations, 
            and compete with cyber defenders worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules">
              <Button size="lg" className="gradient-primary text-lg font-semibold gap-2">
                Explore Modules
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="text-lg border-primary/30 hover:border-primary">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Hands-On Challenges",
                description: "Practice real security scenarios in safe, sandboxed environments"
              },
              {
                icon: Users,
                title: "Compete & Learn",
                description: "Join leaderboards and compete with other cyber defenders"
              },
              {
                icon: Award,
                title: "Earn Badges & XP",
                description: "Track your progress and unlock achievements as you level up"
              },
              {
                icon: Globe,
                title: "Flexible Learning",
                description: "Access theory content anytime, gamification is optional"
              }
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
      
      {/* Learning Modules Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Learning Modules</h2>
            <p className="text-muted-foreground text-lg">
              Start with these beginner-friendly modules
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/modules/2" className="group">
              <div className="glass-card cyber-border p-6 rounded-2xl hover:cyber-glow transition-all h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">Crack the Vault</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    Beginner
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">Master the art of creating unbreakable passwords</p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Start Learning
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/modules">
              <Button variant="outline" className="border-primary/30 hover:border-primary">
                View All Modules
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card cyber-border rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Defend the Digital World?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of learners mastering cybersecurity through interactive challenges
            </p>
            <Link href="/auth?mode=signup">
              <Button size="lg" className="gradient-primary text-lg font-semibold">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
