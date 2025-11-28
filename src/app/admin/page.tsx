import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3
} from "lucide-react";

export default function Admin() {
  // Mock analytics data
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalModules: 24,
    totalXPAwarded: 156789,
    avgCompletionRate: 67,
    newUsersToday: 34,
    gamesPlayedToday: 156,
    avgSessionTime: "23 min",
  };

  const topModules = [
    { id: 1, name: "Password Security Mastery", completions: 456, rating: 4.8, avgTime: "42 min" },
    { id: 2, name: "Phishing Detection Lab", completions: 389, rating: 4.6, avgTime: "38 min" },
    { id: 3, name: "Network Security Basics", completions: 312, rating: 4.7, avgTime: "51 min" },
    { id: 4, name: "Encryption Fundamentals", completions: 278, rating: 4.5, avgTime: "45 min" },
    { id: 5, name: "Web Security 101", completions: 234, rating: 4.4, avgTime: "39 min" },
  ];

  const recentActivity = [
    { user: "user_1234", action: "Completed module", module: "Password Security", time: "2 min ago", xp: 150 },
    { user: "user_5678", action: "Started module", module: "Phishing Detection", time: "5 min ago", xp: 0 },
    { user: "user_9012", action: "Earned badge", module: "Week Warrior", time: "8 min ago", xp: 100 },
    { user: "user_3456", action: "Reached level 5", module: null, time: "12 min ago", xp: 200 },
    { user: "user_7890", action: "Completed quiz", module: "Network Basics Quiz", time: "15 min ago", xp: 75 },
  ];

  const systemHealth = [
    { metric: "API Response Time", value: "124ms", status: "good" },
    { metric: "Database Connection", value: "Healthy", status: "good" },
    { metric: "Active Sessions", value: "892", status: "good" },
    { metric: "Error Rate", value: "0.3%", status: "good" },
    { metric: "Server Load", value: "42%", status: "good" },
    { metric: "Storage Used", value: "67%", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform analytics and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+{stats.newUsersToday}</span> new today
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Modules
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalModules}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.avgCompletionRate}% avg completion
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                XP Awarded
              </CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalXPAwarded.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="glass-card border-primary/20">
            <TabsTrigger value="modules">Top Modules</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Most Popular Modules
                </CardTitle>
                <CardDescription>Ranked by completion count and user ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topModules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{module.name}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {module.completions} completions
                            </span>
                            <span>⭐ {module.rating}/5</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.avgTime} avg
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Real-Time Activity Feed
                </CardTitle>
                <CardDescription>Live updates from across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground">
                            <span className="font-mono text-sm text-muted-foreground">{activity.user}</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">{activity.action}</span>
                          </p>
                          {activity.module && (
                            <p className="text-sm text-muted-foreground">{activity.module}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                      {activity.xp > 0 && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          +{activity.xp} XP
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Health Monitor
                </CardTitle>
                <CardDescription>Current platform status and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemHealth.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        item.status === "good"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-yellow-500/10 border-yellow-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{item.metric}</p>
                        {item.status === "good" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${
                        item.status === "good" ? "text-green-500" : "text-yellow-500"
                      }`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">All Systems Operational</p>
                      <p className="text-sm text-muted-foreground">Last checked: Just now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
