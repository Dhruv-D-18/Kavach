"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/user-context";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CrackTheVault() {
  const router = useRouter();
  const { user, updateScore } = useUser();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Very Weak");
  const [crackTime, setCrackTime] = useState("Instantly");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Password strength evaluation logic
  const evaluatePasswordStrength = (pwd: string) => {
    let score = 0;
    let feedback: string[] = [];

    // Length check
    if (pwd.length < 8) {
      feedback.push("Use at least 8 characters");
    } else {
      score += 20;
      if (pwd.length >= 12) score += 10;
      if (pwd.length >= 16) score += 10;
    }

    // Character variety
    if (/[a-z]/.test(pwd)) score += 10;
    else feedback.push("Add lowercase letters");

    if (/[A-Z]/.test(pwd)) score += 10;
    else feedback.push("Add uppercase letters");

    if (/[0-9]/.test(pwd)) score += 10;
    else feedback.push("Add numbers");

    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    else feedback.push("Add special characters");

    // Common patterns
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 20;
      feedback.push("Avoid repeated characters");
    }

    if (/(123|abc|qwe|password|admin)/i.test(pwd)) {
      score -= 30;
      feedback.push("Avoid common patterns");
    }

    // Bonus for complexity
    if (pwd.length >= 12 && /[^A-Za-z0-9]/.test(pwd)) score += 10;

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine strength label and crack time
    let label = "Very Weak";
    let time = "Instantly";

    if (score >= 80) {
      label = "Very Strong";
      time = "Centuries";
    } else if (score >= 60) {
      label = "Strong";
      time = "Years";
    } else if (score >= 40) {
      label = "Medium";
      time = "Days";
    } else if (score >= 20) {
      label = "Weak";
      time = "Hours";
    }

    return { score, label, time, feedback };
  };

  // Evaluate password when it changes
  useEffect(() => {
    if (password) {
      const result = evaluatePasswordStrength(password);
      setStrength(result.score);
      setStrengthLabel(result.label);
      setCrackTime(result.time);
      setFeedback(result.feedback);
    } else {
      setStrength(0);
      setStrengthLabel("Very Weak");
      setCrackTime("Instantly");
      setFeedback([]);
    }
  }, [password]);

  // Handle password submission
  const handleSubmit = () => {
    const earnedXp = Math.floor(strength * 1.5);

    if (strength >= 80) {
      setUnlocked(true);

      // Bonus for perfect score
      if (strength === 100) {
        setXp(earnedXp + 50); // Bonus 50 XP for perfect password
        setScore(score + earnedXp + 50);
      } else {
        setXp(earnedXp);
        setScore(score + earnedXp);
      }

      // Level up logic
      const newLevel = Math.floor((score + earnedXp) / 500) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }

      // Update user's score in the database
      if (user) {
        updateScore(earnedXp);
      }
    } else {
      // Partial XP for attempts
      const partialXp = Math.floor(earnedXp * 0.5);
      setScore(score + partialXp);
    }
    setAttempts(attempts + 1);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Reset the game
  const resetGame = () => {
    setPassword("");
    setUnlocked(false);
    setAttempts(0);
  };

  // Get strength color
  const getStrengthColor = () => {
    if (strength >= 80) return "text-green-500";
    if (strength >= 60) return "text-blue-500";
    if (strength >= 40) return "text-yellow-500";
    if (strength >= 20) return "text-orange-500";
    return "text-red-500";
  };

  // Get strength bar color
  const getStrengthBarColor = () => {
    if (strength >= 80) return "[&>div]:bg-green-500";
    if (strength >= 60) return "[&>div]:bg-blue-500";
    if (strength >= 40) return "[&>div]:bg-yellow-500";
    if (strength >= 20) return "[&>div]:bg-orange-500";
    return "[&>div]:bg-red-500";
  };

  // Get crack time color
  const getCrackTimeColor = () => {
    if (strength >= 80) return "text-green-500";
    if (strength >= 60) return "text-blue-500";
    if (strength >= 40) return "text-yellow-500";
    if (strength >= 20) return "text-orange-500";
    return "text-red-500";
  };

  // Get strength description
  const getStrengthDescription = () => {
    if (strength >= 80) return "Excellent! This password would take centuries to crack.";
    if (strength >= 60) return "Strong password. Would take years to crack with brute force.";
    if (strength >= 40) return "Medium strength. Could be cracked in days with modern tools.";
    if (strength >= 20) return "Weak password. Might be cracked in hours.";
    return "Very weak. Could be cracked instantly.";
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/modules")}
          >
            ← Back to Modules
          </Button>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Crack the Vault
          </h1>
          <p className="text-muted-foreground">
            Create an unbreakable password to unlock the vault and earn XP!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Crack the Vault
                </CardTitle>
                <CardDescription>
                  Learn about password security and test your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="practice" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="theory">Theory</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                  </TabsList>
                  <TabsContent value="theory" className="mt-0">
                    <div className="space-y-4">
                      <div className="p-6 rounded-lg bg-muted/50 border border-border/50">
                        <h3 className="text-xl font-bold text-foreground mb-4">Password Security Theory</h3>
                        <div className="space-y-4 text-muted-foreground">
                          <p>
                            Password security is one of the most fundamental aspects of cybersecurity. A strong password
                            acts as the first line of defense against unauthorized access to your accounts, protecting
                            your personal information, financial data, and digital identity.
                          </p>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Why Passwords Matter:</h4>
                            <p>
                              Over 80% of data breaches are linked to weak, stolen, or reused passwords. Understanding
                              how passwords work and how attackers try to break them is crucial for staying safe online.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Password Entropy & Complexity:</h4>
                            <p>
                              Entropy measures randomness and unpredictability. Higher entropy = stronger password.
                              Include lowercase, uppercase, numbers, and special characters to increase complexity.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Common Attack Methods:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Brute Force: Trying all combinations systematically.</li>
                              <li>Dictionary Attacks: Using common words and passwords.</li>
                              <li>Credential Stuffing: Reusing breached credentials on other sites.</li>
                              <li>Rainbow Table Attacks: Using pre-computed hashes to crack passwords.</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Best Practices:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Use 12+ characters (longer is stronger)</li>
                              <li>Include a mix of character types (uppercase, lowercase, numbers, symbols)</li>
                              <li>Use unique passwords for each account</li>
                              <li>Consider passphrases (e.g., "Coffee!Morning@Park2024")</li>
                              <li>Use a password manager</li>
                              <li>Enable multi-factor authentication (2FA)</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Password Managers & MFA:</h4>
                            <p>
                              Password managers store all passwords encrypted behind one master password, generating
                              strong, random passwords and syncing across devices. MFA adds extra security layers
                              beyond passwords, such as authentication apps or hardware keys.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Real-World Impact:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>81% of breaches are due to poor passwords.</li>
                              <li>6-character passwords can be cracked in 1 second.</li>
                              <li>65% of people reuse passwords across accounts.</li>
                              <li>99.9% of attacks can be blocked with multi-factor authentication.</li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground">Password Strength Examples:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>password123 → Instantly cracked</li>
                              <li>P@ssw0rd → Seconds</li>
                              <li>MyD0g2024! → Hours</li>
                              <li>C0ff33&Cr0!ss@nt$ → Years</li>
                              <li>Tr0p!c@l#P@r@d!s3$Sunr!s3 → Centuries</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="practice" className="mt-0">
                    {!unlocked ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-24 h-24 mb-4 cyber-border rounded-2xl bg-primary/10" role="img" aria-label="Locked vault icon">
                            <Lock className="w-12 h-12 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Secure the Vault</h2>
                          <p className="text-muted-foreground">
                            Create a strong password to unlock the digital vault
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">
                              Your Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter a strong password..."
                                className="pr-12 h-12 bg-background/50 border-border/50 focus:border-primary"
                                aria-describedby="password-requirements"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Password Strength Meter */}
                          {password && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground">Strength: {strengthLabel}</span>
                                <span className="text-sm text-muted-foreground">{strength}/100</span>
                              </div>
                              <Progress 
                                value={strength} 
                                className={`h-3 ${getStrengthBarColor()}`}
                                aria-label={`Password strength: ${strengthLabel}`}
                              />

                              <div className="text-sm">
                                <span className="font-medium text-foreground">Estimated crack time: </span>
                                <span className={getCrackTimeColor()}>
                                  {crackTime}
                                </span>
                              </div>

                              {/* Strength Description */}
                              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <p className="text-sm text-foreground">
                                  {getStrengthDescription()}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Password Requirements */}
                          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <h4 className="font-medium text-foreground mb-3">Password Requirements:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[
                                {
                                  label: "At least 8 characters",
                                  met: password.length >= 8,
                                  required: true
                                },
                                {
                                  label: "Uppercase letter",
                                  met: /[A-Z]/.test(password),
                                  required: false
                                },
                                {
                                  label: "Lowercase letter",
                                  met: /[a-z]/.test(password),
                                  required: false
                                },
                                {
                                  label: "Number",
                                  met: /[0-9]/.test(password),
                                  required: false
                                },
                                {
                                  label: "Special character",
                                  met: /[^A-Za-z0-9]/.test(password),
                                  required: false
                                },
                                {
                                  label: "At least 12 characters (bonus)",
                                  met: password.length >= 12,
                                  required: false
                                }
                              ].map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  {req.met ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className={`text-sm ${req.met ? 'text-green-500' : 'text-muted-foreground'}`}>
                                    {req.label}
                                    {req.required && <span className="text-red-500"> *</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Feedback */}
                          {feedback.length > 0 && (
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium text-yellow-500">Tips to improve:</span>
                              </div>
                              <ul className="text-sm space-y-1">
                                {feedback.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-yellow-500">•</span>
                                    <span className="text-yellow-200">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <Button
                            onClick={handleSubmit}
                            className="w-full gradient-primary"
                            disabled={!password}
                          >
                            Attempt Unlock
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 cyber-border rounded-2xl bg-green-500/10" role="img" aria-label="Unlocked vault icon">
                          <Unlock className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-500 mb-2">Vault Unlocked!</h2>
                        <p className="text-muted-foreground mb-6">
                          Congratulations! You've created a strong password.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                          <div className="glass-card p-4 rounded-lg">
                            <div className="text-3xl font-bold text-primary">+{xp}</div>
                            <div className="text-sm text-muted-foreground">XP Earned</div>
                          </div>
                          <div className="glass-card p-4 rounded-lg">
                            <div className="text-3xl font-bold text-primary">{attempts}</div>
                            <div className="text-sm text-muted-foreground">Attempts</div>
                          </div>
                          <div className="glass-card p-4 rounded-lg">
                            <div className="text-3xl font-bold text-primary">{strength}%</div>
                            <div className="text-sm text-muted-foreground">Strength</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="mb-6">
                          <h4 className="font-medium text-foreground mb-3">Badges Earned</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {strength >= 80 && (
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                <Shield className="h-4 w-4 mr-1" />
                                Vault Master
                              </Badge>
                            )}
                            {strength === 100 && (
                              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                <Trophy className="h-4 w-4 mr-1" />
                                Perfect Security
                              </Badge>
                            )}
                            {attempts === 1 && (
                              <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                                <Zap className="h-4 w-4 mr-1" />
                                First Try
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                          <Button onClick={resetGame} variant="outline" className="border-primary/30">
                            Try Again
                          </Button>
                          <Button onClick={() => router.push("/modules")} className="gradient-primary">
                            Back to Modules
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-bold text-primary">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total XP</span>
                    <span className="font-bold text-primary">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current XP</span>
                    <span className="font-bold text-primary">{xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attempts</span>
                    <span className="font-bold text-primary">{attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password Strength</span>
                    <span className={`font-bold ${getStrengthColor()}`}>
                      {strength}%
                    </span>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Level {level} Progress</span>
                    <span className="text-sm text-primary">{score % 500}/500 XP</span>
                  </div>
                  <Progress value={(score % 500) / 5} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {500 - (score % 500)} XP needed for Level {level + 1}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-medium text-foreground mb-2">Password Tips</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">Use at least 12 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">Mix uppercase and lowercase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">Include numbers and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span className="text-muted-foreground">Avoid common words or patterns</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm text-blue-200">
                      A password with 12+ characters including symbols would take centuries to crack with brute force.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm text-purple-200">
                      80% of hacking-related breaches involve weak or stolen passwords.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-sm text-cyan-200">
                      Using a password manager can generate and store unique passwords for all your accounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}