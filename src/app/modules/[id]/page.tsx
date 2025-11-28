"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Trophy,
  ArrowLeft,
  Target
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ModuleDetail() {
  const params = useParams();
  const id = params.id;

  // Mock module data
  const module = {
    id: id || "1",
    title: "Password Security Mastery",
    description: "Learn the fundamentals of creating and managing secure passwords",
    level: "Beginner",
    duration: "45 min",
    xp: 150,
    enrolled: 1243,
    rating: 4.8,
    progress: 65,
    sections: [
      {
        id: 1,
        title: "Introduction to Password Security",
        type: "theory",
        duration: "10 min",
        completed: true,
        locked: false,
      },
      {
        id: 2,
        title: "Understanding Password Strength",
        type: "theory",
        duration: "8 min",
        completed: true,
        locked: false,
      },
      {
        id: 3,
        title: "Common Password Attacks",
        type: "theory",
        duration: "12 min",
        completed: false,
        locked: false,
      },
      {
        id: 4,
        title: "Crack the Vault - Practice Game",
        type: "game",
        duration: "15 min",
        completed: false,
        locked: false,
      },
      {
        id: 5,
        title: "Final Quiz",
        type: "quiz",
        duration: "10 min",
        completed: false,
        locked: true,
      },
    ],
  };

  const theoryContent = `# Introduction to Password Security

Passwords are the first line of defense in cybersecurity. Despite being one of the oldest security mechanisms, they remain critical in protecting our digital identities.

## Why Passwords Matter

In today's digital age, we use passwords for everything:
- Email accounts
- Social media platforms
- Banking applications
- Work systems
- Online shopping`;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/modules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Link>
        </Button>

        {/* Module Header */}
        <div className="glass-card border-primary/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                {module.level}
              </Badge>
              <h1 className="text-4xl font-bold text-gradient mb-3">
                {module.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {module.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>{module.xp} XP</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  <span>{module.enrolled.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>⭐ {module.rating}/5</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto">
              <Card className="bg-primary/10 border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {module.progress}%
                  </div>
                  <Progress value={module.progress} className="h-2 mb-3" />
                  <Button className="w-full" size="lg">
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="glass-card border-primary/20">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Course Sections</CardTitle>
                <CardDescription>
                  {module.sections.filter(s => s.completed).length} of {module.sections.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        section.locked
                          ? "bg-background/30 border-border/30 opacity-60"
                          : "bg-background/50 border-border/50 hover:border-primary/50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          section.completed
                            ? "bg-primary/20 text-primary"
                            : section.locked
                            ? "bg-background text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {section.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : section.locked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{section.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {section.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {section.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!section.locked && (
                        <Button
                          variant={section.completed ? "ghost" : "default"}
                          size="sm"
                        >
                          {section.completed ? "Review" : section.type === "game" ? "Play" : "Start"}
                          <PlayCircle className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Theory Content
                </CardTitle>
                <CardDescription>
                  Read and understand the concepts before practicing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="text-foreground space-y-4 leading-relaxed">
                    {theoryContent.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-3xl font-bold text-gradient mt-6 mb-4">{line.substring(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3">{line.substring(3)}</h2>;
                      } else if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 text-muted-foreground">{line.substring(2)}</li>;
                      } else if (line.trim() === '') {
                        return <br key={i} />;
                      } else {
                        return <p key={i} className="text-muted-foreground">{line}</p>;
                      }
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Additional Resources</CardTitle>
                <CardDescription>
                  Helpful links and materials for further learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "NIST Password Guidelines", url: "#", type: "PDF" },
                    { title: "Password Strength Calculator", url: "#", type: "Tool" },
                    { title: "Top Password Managers Comparison", url: "#", type: "Article" },
                    { title: "Common Password Attack Patterns", url: "#", type: "Video" },
                  ].map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-foreground">{resource.title}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">Open</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
