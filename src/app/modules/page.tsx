import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight, Search, Radar } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    id: 1,
    icon: Lock,
    title: "Crack the Vault",
    description: "Master password creation by understanding entropy, common patterns, and building unbreakable passwords. Test your skills in this interactive password strength challenge.",
    level: "Beginner",
    duration: "20 min",
    xp: 400,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    id: 2,
    icon: Search,
    title: "The Phishing Catch",
    description: "Analyze suspicious emails and websites. Use forensic tools like URL Sniffers and SSL X-Rays to identify red flags and block malicious threats.",
    level: "Analyst",
    duration: "15 min",
    xp: 250,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    id: 3,
    icon: Radar,
    title: "Operation Iron Wall",
    description: "Defend Kavach Central Database in a live SOC stream. Intercept suspicious packets by analyzing source IP, port, and payload size under pressure.",
    level: "Guardian",
    duration: "18 min",
    xp: 350,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10"
  }
];

export default function Modules() {
  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      
      <div className="pt-32 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 cyber-border rounded-2xl bg-primary/10">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Kavach Academy <span className="text-gradient">Training Modules</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master the art of cyber defense through high-fidelity simulations. Complete every operation to reach Guardian rank.
            </p>
          </div>
          
          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {modules.map((module) => (
              <div key={module.id} className="flex flex-col h-full glass-card cyber-border rounded-2xl p-6 hover:cyber-glow transition-all group">
                <div className="flex-grow text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl ${module.bgColor} ${module.color}`}>
                    <module.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <h3 className="text-3xl font-bold">{module.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                    {module.description}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                      {module.level}
                    </span>
                    <span className="text-muted-foreground">⏱️ {module.duration}</span>
                    <span className="text-primary font-semibold">+{module.xp} XP</span>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button className="gradient-primary font-semibold group-hover:shadow-lg transition-shadow px-8" asChild>
                      <Link href={`/modules/${module.id}`}>
                        Start Challenge
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          

        </div>
      </div>
    </div>
  );
}
