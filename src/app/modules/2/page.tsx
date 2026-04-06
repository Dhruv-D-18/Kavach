"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/user-context";
import { AegisGuide } from "@/components/AegisGuide";
import { ModuleBriefing } from "@/components/ModuleBriefing";
import { FirstTimeTour } from "@/components/FirstTimeTour";
import { GameModeModule } from "@/components/GameModeModule";
import { SideScrollerLevel } from "@/components/SideScrollerLevel";
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
import zxcvbn from "zxcvbn";
import { getAegisDialogue, getFirstTimeGuidance, getSuccessGuidance } from "@/lib/aegis-dialogues";

export default function CrackTheVault() {
  const router = useRouter();
  const { user, updateScore } = useUser();
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Very Weak");
  const [crackTime, setCrackTime] = useState("Instantly");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [dictionaryWords, setDictionaryWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Aegis guidance system
  const [aegisMessage, setAegisMessage] = useState<{ text: string; type: "info" | "warning" | "success" | "tip"; audioFile?: string; isBlocking?: boolean } | null>(null);
  const [showAegis, setShowAegis] = useState(true);
  const [gameState, setGameState] = useState<"scrolling" | "vault">("scrolling");
  const [isBlocked, setIsBlocked] = useState(false);

  const handleReachVault = () => {
    setGameState("vault");
    setAegisMessage({
      text: "You are now in Admin Mode. Secure this compromised vault by constructing a password payload strong enough to resist modern brute-force dictionaries. I'll provide real-time feedback as you type.",
      type: "info",
      audioFile: "/audio/vault-reached.mp3",
    });
  };

  const handleCheckpoint = (id: string) => {
    // SideScrollerLevel now handles info blocks internally. No Aegis dialogue needed.
  };

  const handleSkipGuide = () => {
    setIsBlocked(false);
    setAegisMessage(null);
  };

  // Password strength evaluation logic using zxcvbn
  const evaluatePasswordStrength = (pwd: string) => {
    if (!pwd) {
      return {
        score: 0,
        label: "Very Weak",
        time: "Instantly",
        feedback: ["Enter a password to check its strength"],
        dictionaryWords: []
      };
    }

    const result = zxcvbn(pwd);

    // Map zxcvbn score (0-4) to percentage (0-100)
    const scorePercentage = (result.score / 4) * 100;

    // Determine strength label
    let label = "Very Weak";
    if (result.score === 4) label = "Very Strong";
    else if (result.score === 3) label = "Strong";
    else if (result.score === 2) label = "Medium";
    else if (result.score === 1) label = "Weak";

    // Get crack time
    const time = result.crack_times_display.offline_slow_hashing_1e4_per_second;

    // Get feedback
    const feedback = [...result.feedback.suggestions];
    if (result.feedback.warning) {
      feedback.unshift(result.feedback.warning);
    }

    // Extract dictionary words if any
    const dictionaryWords: string[] = [];
    if (result.sequence) {
      result.sequence.forEach((item: any) => {
        if (item.dictionary_name && item.matched_word) {
          dictionaryWords.push(item.matched_word);
        }
      });
    }

    // Add specific feedback about dictionary words
    if (dictionaryWords.length > 0) {
      feedback.unshift(`Contains common dictionary words: ${dictionaryWords.join(', ')}`);
      feedback.unshift('Dictionary words make passwords easier to crack');
    }

    return {
      score: scorePercentage,
      label,
      time,
      feedback,
      dictionaryWords
    };
  };

  // Evaluate password when it changes
  useEffect(() => {
    if (password) {
      const result = evaluatePasswordStrength(password);
      setStrength(result.score);
      setStrengthLabel(result.label);
      setCrackTime(result.time);
      setFeedback(result.feedback);
      setDictionaryWords(result.dictionaryWords);
    } else {
      setStrength(0);
      setStrengthLabel("Very Weak");
      setCrackTime("Instantly");
      setFeedback([]);
      setDictionaryWords([]);
      setAegisMessage(null);
    }
  }, [password]);

  // Only trigger voice/aegis dialogue on explicit check
  const handleCheckPassword = () => {
    if (!password) return;

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    const aegisDialogue = getAegisDialogue({
      password,
      strength,
      dictionaryWords,
      feedback,
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSymbols,
      length: password.length
    });

    setAegisMessage(aegisDialogue as any);
  };

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

      // Show success message from Aegis
      const successMessage = getSuccessGuidance(earnedXp, attempts + 1);
      setAegisMessage(successMessage as any);
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

      {/* Aegis Guide Component */}
      <AegisGuide message={aegisMessage} isVisible={showAegis} onSkip={handleSkipGuide} />

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
                            <h4 className="font-bold text-foreground">Dictionary Words & Password Security:</h4>
                            <p>
                              Dictionary attacks are one of the most common methods used by hackers to crack passwords.
                              These attacks use lists of common words, phrases, and previously breached passwords to guess
                              user credentials. Passwords containing dictionary words are significantly weaker because
                              they can be cracked much faster than truly random passwords.
                            </p>
                            <div className="space-y-2">
                              <h5 className="font-semibold text-foreground">Why Dictionary Words Are Dangerous:</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Common words are easy to guess and found in wordlists used by hackers</li>
                                <li>Even with numbers or symbols added, dictionary words remain vulnerable</li>
                                <li>Modern cracking tools can test billions of word combinations per second</li>
                                <li>Personal information (names, pets, hobbies) are also dictionary words to attackers</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-semibold text-foreground">Personal Information Targeting:</h5>
                              <p>
                                Attackers specifically target personal information when trying to crack passwords. They gather
                                names, birthdays, pet names, and other personal details from:
                              </p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Social media profiles (Facebook, LinkedIn, Instagram)</li>
                                <li>Public records and professional directories</li>
                                <li>Previous data breaches</li>
                                <li>Direct social engineering interactions</li>
                              </ul>
                              <p>
                                Using tools like <code>cewl</code>, attackers can create custom wordlists from a person's
                                website or social media content, making name-based attacks even more effective.
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-semibold text-foreground">How to Avoid Dictionary Words:</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Use passphrases instead of single words (e.g., "PurpleTiger$Jumped@Moon" rather than "purple")</li>
                                <li>Create acronyms from sentences (e.g., "My1stCarW@5Red!" from "My first car was red!")</li>
                                <li>Use random combinations of words not typically used together</li>
                                <li>Include numbers and symbols in unpredictable positions</li>
                                <li><strong>Avoid all personal information</strong> (names, dates, pet names) in passwords</li>
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                              <p className="text-sm text-blue-200">
                                <strong>Pro Tip:</strong> The password "correcthorsebatterystaple" became famous for
                                illustrating how longer, random combinations of words can be more secure than
                                traditional complex passwords with symbols and numbers.
                              </p>
                            </div>
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
                            <h4 className="font-bold text-foreground">How Password Strength Checkers Work:</h4>
                            <p>
                              Modern password strength checkers like the one in this module use sophisticated algorithms
                              to evaluate password security. Our implementation uses the industry-standard zxcvbn library
                              developed by Dropbox, which analyzes passwords based on multiple factors:
                            </p>
                            <div className="space-y-2">
                              <h5 className="font-semibold text-foreground">Key Analysis Factors:</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Dictionary Word Detection:</strong> Checks against lists of common words and previously breached passwords</li>
                                <li><strong>Pattern Recognition:</strong> Identifies common patterns like keyboard sequences (qwerty) or repeated characters</li>
                                <li><strong>Entropy Calculation:</strong> Measures randomness and unpredictability of character combinations</li>
                                <li><strong>Brute Force Resistance:</strong> Estimates how long it would take to crack the password using computational methods</li>
                                <li><strong>Personal Information:</strong> Detects names, dates, and other personal information that might be easily guessed</li>
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                              <p className="text-sm text-purple-200">
                                <strong>Security Insight:</strong> A strong password isn't just about complexity symbols.
                                It's about unpredictability and avoiding any patterns that attackers commonly look for.
                              </p>
                            </div>
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
                    {gameState === "scrolling" ? (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-cyan-400 mb-2">Journey to the Vault</h3>
                          <p className="text-sm text-muted-foreground">
                            Walk to the vault and press ENTER to begin your password challenge
                          </p>
                        </div>

                        <SideScrollerLevel
                          onReachVault={handleReachVault}
                          onCheckpoint={handleCheckpoint}
                          isBlocked={isBlocked}
                        />

                        {/* Instructions */}
                        <Card className="bg-slate-900/50 border-cyan-500/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm text-cyan-300">
                              <div className="flex items-center gap-4">
                                <span><kbd className="px-2 py-1 bg-slate-800 rounded">←→</kbd> or <kbd className="px-2 py-1 bg-slate-800 rounded">AD</kbd> Move</span>
                                <span>•</span>
                                <span><kbd className="px-2 py-1 bg-slate-800 rounded">ENTER</kbd> Enter Vault</span>
                              </div>
                              <div className="text-xs text-slate-400">
                                Reach 100% to unlock password challenge
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      // THE VAULT PASSWORD UI
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-cyan-400 mb-2">Vault Admin Root</h3>
                          <p className="text-slate-400">Construct an unbreakable payload to secure the system.</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="password-input">Password Core String</Label>
                            <Input
                              id="password-input"
                              type="text"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyDown={handleKeyPress}
                              disabled={unlocked}
                              className="font-mono text-lg mt-2 bg-slate-900 border-cyan-700/50"
                              placeholder="Enter your payload here..."
                            />
                          </div>

                          {/* Live Strength Feedback */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm mt-4">
                              <span className="text-slate-400">Encryption Strength</span>
                              <span className={getStrengthColor()}>{strengthLabel} ({Math.round(strength)}%)</span>
                            </div>

                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                              <div
                                className={`h-full transition-all duration-300 ${getStrengthBarColor().replace('[&>div]:', '')}`}
                                style={{ width: `${strength}%` }}
                              />
                            </div>

                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-slate-500">Estimated Crack Time:</span>
                              <span className={`font-mono ${getCrackTimeColor()}`}>{crackTime}</span>
                            </div>
                          </div>

                          {/* Live Hints/Feedback */}
                          {feedback.length > 0 && (
                            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-2">
                              <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Vulnerabilities Detected
                              </h4>
                              <ul className="list-disc pl-5 text-sm text-red-300 space-y-1">
                                {feedback.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-4 mt-6">
                            <Button
                              variant="outline"
                              className="w-1/3 h-12 border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-200"
                              onClick={handleCheckPassword}
                              disabled={unlocked || password.length === 0}
                            >
                              Check
                            </Button>

                            <Button
                              className="flex-1 gradient-primary font-bold text-lg h-12"
                              onClick={handleSubmit}
                              disabled={unlocked || password.length === 0}
                            >
                              {unlocked ? "Vault Secured!" : "Deploy Security Payload"}
                            </Button>
                          </div>
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
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span className="text-muted-foreground">Avoid dictionary words (use passphrases instead)</span>
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