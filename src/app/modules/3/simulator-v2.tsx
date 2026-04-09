"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CypherGuide } from "@/components/CypherGuide";
import { useUser } from "@/context/user-context";
import { ArrowLeft, ShieldCheck, Timer, Trophy, CircleCheck, CircleX, RotateCcw } from "lucide-react";

type Level = "easy" | "medium" | "hard";
type Phase = "guide" | "question" | "feedback" | "level-up" | "result";

type Scenario = {
  id: string;
  level: Level;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const LEVELS: Level[] = ["easy", "medium", "hard"];
const QUESTIONS_PER_LEVEL = 5;
const QUESTION_TIME_SECONDS = 12;
const FAST_BONUS_THRESHOLD = 7;

const LEVEL_POOL: Record<Level, Scenario[]> = {
  easy: [
    { id: "e1", level: "easy", question: "You find a USB drive on a lab desk with no label.", options: ["Plug it into your laptop", "Give it to admin/ignore it", "Take it home"], correctAnswer: 1, explanation: "Unknown USB devices can contain malware payloads." },
    { id: "e2", level: "easy", question: "You see 'Free_Cafe_WiFi' with no password.", options: ["Connect immediately", "Ask staff and verify network name", "Use it for banking"], correctAnswer: 1, explanation: "Attackers create fake hotspots that look legitimate." },
    { id: "e3", level: "easy", question: "A caller claims to be from your bank and asks for OTP.", options: ["Share OTP", "Disconnect and contact bank via official number", "Ask for details and then share"], correctAnswer: 1, explanation: "OTP must never be shared with anyone." },
    { id: "e4", level: "easy", question: "Choose the safest new password.", options: ["123456", "yourname123", "G@meR!2026#Secure"], correctAnswer: 2, explanation: "Long, mixed, unique passwords are harder to crack." },
    { id: "e5", level: "easy", question: "Email comes from support@paypa1.com.", options: ["Click link", "Delete/report email", "Reply to ask"], correctAnswer: 1, explanation: "Lookalike domains are a classic phishing trick." },
    { id: "e6", level: "easy", question: "Website offers free cracked premium software.", options: ["Install immediately", "Scan and verify source first", "Disable antivirus then install"], correctAnswer: 1, explanation: "Pirated software frequently carries malware." },
    { id: "e7", level: "easy", question: "Friend asks for your account password.", options: ["Share once", "Refuse politely", "Send later"], correctAnswer: 1, explanation: "Passwords are personal credentials and must stay private." },
    { id: "e8", level: "easy", question: "You used email on a public cyber cafe PC.", options: ["Leave directly", "Log out and clear browser data", "Save password for next time"], correctAnswer: 1, explanation: "Always sign out and clear traces on shared machines." },
    { id: "e9", level: "easy", question: "Device asks for system update.", options: ["Ignore", "Install update", "Postpone forever"], correctAnswer: 1, explanation: "Updates patch known security vulnerabilities." },
    { id: "e10", level: "easy", question: "Unknown number sends random link on WhatsApp.", options: ["Click", "Ignore/delete", "Forward to group"], correctAnswer: 1, explanation: "Unknown links can lead to phishing or malware pages." },
    { id: "e11", level: "easy", question: "You signed in on your friend's phone.", options: ["Stay logged in", "Log out after use", "Save password"], correctAnswer: 1, explanation: "Shared devices increase account exposure risk." },
    { id: "e12", level: "easy", question: "You download an app from an unknown source.", options: ["Install now", "Check reviews/developer first", "Disable permissions and install"], correctAnswer: 1, explanation: "App authenticity should be verified before install." },
    { id: "e13", level: "easy", question: "Unknown sender emails an attachment.", options: ["Open it", "Verify sender authenticity first", "Download and scan later"], correctAnswer: 1, explanation: "Unexpected attachments are common malware vectors." },
    { id: "e14", level: "easy", question: "You leave your laptop for a few minutes.", options: ["Leave unlocked", "Lock screen", "Keep camera on only"], correctAnswer: 1, explanation: "A locked screen blocks unauthorized access." },
    { id: "e15", level: "easy", question: "Browser asks to save account password.", options: ["Always save in browser", "Use a trusted password manager", "Write password in notes app"], correctAnswer: 1, explanation: "Password managers are safer for storing credentials." },
    { id: "e16", level: "easy", question: "Phone battery is low; public USB charging station available.", options: ["Use cable directly", "Use power-only adapter or avoid", "Disable screen lock and charge"], correctAnswer: 1, explanation: "Public USB ports can be abused for data attacks." },
    { id: "e17", level: "easy", question: "Message says: 'You won ₹5000, click now!'", options: ["Click to claim", "Ignore/report as scam", "Share with friends"], correctAnswer: 1, explanation: "Prize scams use emotion to trigger unsafe actions." },
    { id: "e18", level: "easy", question: "You reuse one password across many apps.", options: ["Safe", "Risky", "Best practice"], correctAnswer: 1, explanation: "Credential reuse enables credential-stuffing attacks." },
    { id: "e19", level: "easy", question: "Unknown Bluetooth device requests pairing.", options: ["Accept", "Reject", "Accept briefly"], correctAnswer: 1, explanation: "Unknown pairing requests can expose your device." },
    { id: "e20", level: "easy", question: "Caller sends link to 'verify identity'.", options: ["Click", "Ignore and verify via official site", "Reply with details"], correctAnswer: 1, explanation: "Identity verification should happen only on trusted channels." },
  ],
  medium: [
    { id: "m1", level: "medium", question: "Login page looks like Gmail but URL has a typo.", options: ["Login anyway", "Check URL and open official Gmail manually", "Refresh and retry"], correctAnswer: 1, explanation: "Typosquatted login pages steal credentials." },
    { id: "m2", level: "medium", question: "Email says account will be blocked in 1 hour.", options: ["Click now", "Verify request using official channel", "Ignore all emails forever"], correctAnswer: 1, explanation: "Urgent threats are common phishing pressure tactics." },
    { id: "m3", level: "medium", question: "A payment QR code is pasted over the original at a shop.", options: ["Scan quickly", "Verify with shop owner before paying", "Use whichever is nearest"], correctAnswer: 1, explanation: "Tampered QR codes can redirect payments to attackers." },
    { id: "m4", level: "medium", question: "Browser warns 'Not Secure' on a form page.", options: ["Submit personal data", "Avoid entering sensitive data", "Disable warning permanently"], correctAnswer: 1, explanation: "Insecure pages can expose transmitted information." },
    { id: "m5", level: "medium", question: "Friend's social media account sends a strange link.", options: ["Open it", "Confirm through separate channel first", "Forward it"], correctAnswer: 1, explanation: "Compromised accounts often spread malicious links." },
    { id: "m6", level: "medium", question: "App named 'Faceb00k' appears in app store.", options: ["Install quickly", "Check developer and reviews carefully", "Install if icon looks right"], correctAnswer: 1, explanation: "Fake apps mimic names and logos to trick users." },
    { id: "m7", level: "medium", question: "Unknown sender sends 'Invoice.pdf'.", options: ["Open attachment", "Verify source before opening", "Forward to coworker"], correctAnswer: 1, explanation: "Invoice-themed phishing is a common attack pattern." },
    { id: "m8", level: "medium", question: "You see 'Airport_Free_WiFi_2' and 'Airport_Free_WiFi'.", options: ["Connect to stronger signal", "Ask staff for official SSID", "Use both networks"], correctAnswer: 1, explanation: "Evil twin networks imitate real hotspots." },
    { id: "m9", level: "medium", question: "Password reset email arrives but you didn't request it.", options: ["Click and reset", "Ignore link and check account directly", "Reply with your username"], correctAnswer: 1, explanation: "Unrequested reset emails may be phishing attempts." },
    { id: "m10", level: "medium", question: "Browser extension requests read/write on all websites.", options: ["Allow all", "Review permissions and install only if justified", "Grant now and remove later"], correctAnswer: 1, explanation: "Overprivileged extensions can steal sensitive data." },
    { id: "m11", level: "medium", question: "You receive a high-paying job email from unknown domain.", options: ["Open attached form", "Validate sender, company, and domain first", "Send resume instantly"], correctAnswer: 1, explanation: "Fake recruitment emails are used for phishing and malware." },
    { id: "m12", level: "medium", question: "SMS says: 'OTP expired, reply with new OTP now.'", options: ["Reply OTP", "Do not share OTP and verify in official app", "Call number in SMS"], correctAnswer: 1, explanation: "OTP phishing via SMS is common and effective." },
    { id: "m13", level: "medium", question: "Coworker sends an APK file over chat for a required app.", options: ["Install APK", "Use trusted official app store/source", "Disable Play Protect and install"], correctAnswer: 1, explanation: "Sideloaded APKs can bypass safety checks and contain malware." },
    { id: "m14", level: "medium", question: "A pop-up says your PC is infected, calls support number.", options: ["Call immediately", "Close tab and run trusted security scan", "Install popup tool"], correctAnswer: 1, explanation: "Scareware pop-ups aim to trick users into fraud." },
    { id: "m15", level: "medium", question: "New app asks for contacts, camera, microphone unnecessarily.", options: ["Allow all permissions", "Grant only required permissions", "Give all then hope for best"], correctAnswer: 1, explanation: "Excessive permissions increase privacy and data theft risk." },
    { id: "m16", level: "medium", question: "Bank alert message contains shortened link to 'secure account'.", options: ["Open link", "Open banking app directly and verify", "Send link to family"], correctAnswer: 1, explanation: "Sensitive actions should be done from trusted apps/sites." },
    { id: "m17", level: "medium", question: "Someone asks to screen-share to 'fix' your login issue.", options: ["Share screen and controls", "Refuse and contact official support", "Share briefly"], correctAnswer: 1, explanation: "Screen-sharing scams can steal credentials and OTPs live." },
    { id: "m18", level: "medium", question: "You download file named report.pdf.exe.", options: ["Open file", "Delete/report suspicious file", "Rename to .pdf and open"], correctAnswer: 1, explanation: "Double extensions often hide executable malware files." },
    { id: "m19", level: "medium", question: "Browser notification says 'Virus found! Click to clean.'", options: ["Click notification", "Block spam notifications and scan with trusted tool", "Allow site notifications"], correctAnswer: 1, explanation: "Malicious notifications are phishing vectors." },
    { id: "m20", level: "medium", question: "You receive 'new login from unknown device' alert.", options: ["Ignore it", "Change password and review active sessions", "Reply to alert email"], correctAnswer: 1, explanation: "Immediate account hardening can stop account takeover." },
  ],
  hard: [
    { id: "h1", level: "hard", question: "Email includes your name, college details, and asks for portal login.", options: ["Trust because details are accurate", "Verify deeply via official portal and sender headers", "Reply with credentials"], correctAnswer: 1, explanation: "Spear phishing uses real context to appear legitimate." },
    { id: "h2", level: "hard", question: "Caller claims to be IT admin and requests your credentials.", options: ["Share for quick fix", "Refuse and report through official IT process", "Share temporary password"], correctAnswer: 1, explanation: "Legitimate IT teams never ask for your password directly." },
    { id: "h3", level: "hard", question: "USB labeled 'Exam Papers 2026' is found near lab systems.", options: ["Open immediately", "Report to admin/security without plugging in", "Copy files first"], correctAnswer: 1, explanation: "Curiosity-labeled USB bait is a known social engineering method." },
    { id: "h4", level: "hard", question: "You receive a suspicious bit.ly link from a known contact.", options: ["Click", "Expand/preview URL and verify context first", "Forward link"], correctAnswer: 1, explanation: "Short links hide malicious destinations." },
    { id: "h5", level: "hard", question: "Job offer asks ₹500 for processing before onboarding.", options: ["Pay and continue", "Decline/report scam", "Borrow money and pay"], correctAnswer: 1, explanation: "Upfront-payment job offers are common fraud patterns." },
    { id: "h6", level: "hard", question: "You get repeated MFA prompts you didn't initiate.", options: ["Approve to stop notifications", "Deny prompts and reset credentials immediately", "Ignore prompts"], correctAnswer: 1, explanation: "MFA fatigue attacks rely on accidental approval." },
    { id: "h7", level: "hard", question: "Service warns your password appeared in a breach.", options: ["Ignore warning", "Change password and rotate reused passwords", "Wait for next alert"], correctAnswer: 1, explanation: "Breach exposure requires immediate credential hygiene." },
    { id: "h8", level: "hard", question: "Popup asks to update Flash Player on modern browser.", options: ["Install update", "Ignore fake update and close tab", "Install as admin"], correctAnswer: 1, explanation: "Fake updater popups frequently deliver malware." },
    { id: "h9", level: "hard", question: "You must access sensitive data on public WiFi without VPN.", options: ["Proceed anyway", "Use VPN or postpone until trusted network", "Turn off antivirus"], correctAnswer: 1, explanation: "Untrusted networks increase interception risk significantly." },
    { id: "h10", level: "hard", question: "Downloaded assignment file expected PDF but is .exe.", options: ["Run file", "Delete and report immediately", "Rename and execute"], correctAnswer: 1, explanation: "Executable masquerading as documents is a malware indicator." },
    { id: "h11", level: "hard", question: "Browser says certificate invalid for your bank site.", options: ["Proceed anyway", "Stop and verify domain/certificate via trusted channel", "Retry on another browser"], correctAnswer: 1, explanation: "Certificate errors may indicate man-in-the-middle interception." },
    { id: "h12", level: "hard", question: "Coworker requests sensitive student data over personal email.", options: ["Send quickly", "Validate request and use approved secure channel", "Zip and password-protect then send"], correctAnswer: 1, explanation: "Data sharing must follow policy and approved channels." },
    { id: "h13", level: "hard", question: "LinkedIn recruiter asks for passport and bank details pre-interview.", options: ["Share documents", "Refuse and verify recruiter identity first", "Send partial details"], correctAnswer: 1, explanation: "Identity theft campaigns often begin on professional platforms." },
    { id: "h14", level: "hard", question: "Cloud doc asks you to re-authenticate via embedded form.", options: ["Enter credentials in form", "Open cloud service directly in new tab and verify", "Use alternate account"], correctAnswer: 1, explanation: "Embedded forms are used in credential harvesting attacks." },
    { id: "h15", level: "hard", question: "Unknown person requests remote desktop to help recover files.", options: ["Grant access", "Decline and contact official support", "Share one-time code"], correctAnswer: 1, explanation: "Remote access scams can lead to full compromise." },
    { id: "h16", level: "hard", question: "Voice call sounds like your manager (possibly deepfake) requesting urgent transfer.", options: ["Transfer immediately", "Verify through known secondary channel", "Share only part of amount"], correctAnswer: 1, explanation: "Deepfake-enabled social engineering requires out-of-band verification." },
    { id: "h17", level: "hard", question: "You get 'Google Docs access request' from unknown domain lookalike.", options: ["Approve", "Reject and verify sender/domain carefully", "Forward to team"], correctAnswer: 1, explanation: "Lookalike domains spoof trusted collaboration tools." },
    { id: "h18", level: "hard", question: "A 'game mod' executable is shared in student forum.", options: ["Run for testing", "Sandbox/avoid and verify reputation first", "Disable defender and run"], correctAnswer: 1, explanation: "Malware is often disguised as games or mods." },
    { id: "h19", level: "hard", question: "Internal user asks for raw database export for 'urgent analytics'.", options: ["Share export", "Apply least-privilege and managerial/security approval", "Upload to personal drive"], correctAnswer: 1, explanation: "Insider-threat risk requires strict data governance controls." },
    { id: "h20", level: "hard", question: "You suspect session hijack after using kiosk browser.", options: ["Do nothing", "Revoke sessions, change password, enable MFA review", "Clear local cache only"], correctAnswer: 1, explanation: "Session invalidation and credential reset are key containment steps." },
  ],
};

const levelColor: Record<Level, string> = {
  easy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  hard: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

function pickRandomScenarios(level: Level): Scenario[] {
  const shuffled = [...LEVEL_POOL[level]].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUESTIONS_PER_LEVEL);
}

export default function SecurityAwarenessSimulatorV2() {
  const router = useRouter();
  const { user, updateScore } = useUser();

  const [phase, setPhase] = useState<Phase>("guide");
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelScenarios, setLevelScenarios] = useState<Scenario[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [levelCorrectCount, setLevelCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string; delta: number; fastBonus: boolean } | null>(null);
  const [guideMessage, setGuideMessage] = useState<{ text: string; type: "info" | "warning" | "success" | "tip" } | null>(null);
  const [resultTitle, setResultTitle] = useState("Mission Complete");

  const currentLevel = LEVELS[levelIndex] ?? "hard";
  const scenario = levelScenarios[scenarioIndex];
  const totalQuestions = LEVELS.length * QUESTIONS_PER_LEVEL;
  const answeredQuestions = levelIndex * QUESTIONS_PER_LEVEL + scenarioIndex + (phase === "feedback" || phase === "level-up" || phase === "result" ? 1 : 0);
  const progress = (answeredQuestions / totalQuestions) * 100;

  const performance = useMemo(() => {
    if (score >= 180) return "Elite Defender";
    if (score >= 120) return "Strong Defender";
    if (score >= 60) return "Rising Defender";
    return "Needs More Practice";
  }, [score]);

  useEffect(() => {
    if (!user) router.push("/auth");
  }, [router, user]);

  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase !== "guide") return;
    setGuideMessage({
      type: "info",
      text: "Agent, you'll face three levels: Easy, Medium, and Hard. You'll get 5 random scenarios per level. Score all 5 correctly to unlock the next level."
    });
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const intro = new SpeechSynthesisUtterance(
        "Welcome to Security Awareness Simulator. You must clear Easy, Medium, and Hard levels. Each level has five random cyber scenarios. Answer all five correctly to advance."
      );
      intro.rate = 1.01;
      intro.pitch = 1.02;
      intro.volume = 0.95;
      window.speechSynthesis.speak(intro);
    }
  }, [phase]);

  const startLevel = (nextLevelIndex: number) => {
    const nextLevel = LEVELS[nextLevelIndex];
    const picks = pickRandomScenarios(nextLevel);
    setLevelIndex(nextLevelIndex);
    setLevelScenarios(picks);
    setScenarioIndex(0);
    setLevelCorrectCount(0);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setGuideMessage({
      type: "tip",
      text: `Level ${nextLevelIndex + 1} (${nextLevel.toUpperCase()}) started. Solve all 5 correctly to advance.`
    });
    setPhase("question");
  };

  const startGame = () => startLevel(0);

  const handleAnswer = async (picked: number) => {
    if (!scenario || phase !== "question") return;
    setSelected(picked);

    const isCorrect = picked === scenario.correctAnswer;
    const isFast = isCorrect && timeLeft >= FAST_BONUS_THRESHOLD;
    const delta = isCorrect ? 10 + (isFast ? 5 : 0) : -5;

    setScore((prev) => prev + delta);
    setCorrectCount((prev) => prev + (isCorrect ? 1 : 0));
    setWrongCount((prev) => prev + (isCorrect ? 0 : 1));
    setLevelCorrectCount((prev) => prev + (isCorrect ? 1 : 0));

    setFeedback({ correct: isCorrect, text: scenario.explanation, delta, fastBonus: isFast });
    setPhase("feedback");

    if (isCorrect && user) {
      await updateScore(10 + (isFast ? 5 : 0));
    }

    window.setTimeout(() => {
      const lastInLevel = scenarioIndex >= QUESTIONS_PER_LEVEL - 1;

      if (!lastInLevel) {
        setScenarioIndex((prev) => prev + 1);
        setSelected(null);
        setFeedback(null);
        setTimeLeft(QUESTION_TIME_SECONDS);
        setPhase("question");
        return;
      }

      const finalLevelCorrect = levelCorrectCount + (isCorrect ? 1 : 0);
      const passedLevel = finalLevelCorrect === QUESTIONS_PER_LEVEL;

      if (!passedLevel) {
        setResultTitle(`Level ${levelIndex + 1} Failed`);
        setGuideMessage({
          type: "warning",
          text: `You got ${finalLevelCorrect}/5 in ${currentLevel.toUpperCase()}. You need all 5 correct to advance. Retry from Level 1.`
        });
        setPhase("result");
        return;
      }

      const hasNextLevel = levelIndex < LEVELS.length - 1;
      if (hasNextLevel) {
        setGuideMessage({
          type: "success",
          text: `Excellent. Level ${levelIndex + 1} cleared perfectly. Prepare for Level ${levelIndex + 2}.`
        });
        setPhase("level-up");
        return;
      }

      setResultTitle("Mission Complete");
      setGuideMessage({
        type: "success",
        text: "Outstanding. You cleared all levels with perfect level progression."
      });
      setPhase("result");
    }, 1500);
  };

  const restart = () => {
    setPhase("guide");
    setLevelIndex(0);
    setLevelScenarios([]);
    setScenarioIndex(0);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setLevelCorrectCount(0);
    setSelected(null);
    setFeedback(null);
    setResultTitle("Mission Complete");
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <CypherGuide message={guideMessage} isVisible={true} />

      <main className="container mx-auto px-4 py-8 mt-16">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/modules")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Security Awareness Simulator</h1>
            <p className="text-muted-foreground">Decision-based training with level progression.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={levelColor[currentLevel]}>
              {currentLevel.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              Score: {score}
            </Badge>
          </div>
        </div>

        <Card className="glass-card border-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Total Progress</span>
              <span>{Math.min(answeredQuestions, totalQuestions)} / {totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {phase === "guide" && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Mission Briefing
              </CardTitle>
              <CardDescription>
                3 levels, 5 random scenarios each. Clear each level with 5/5 correct.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">Level 1: Basic awareness and safe habits.</div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">Level 2: Realistic phishing and platform abuse.</div>
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">Level 3: Advanced social engineering and containment.</div>
              </div>
              <Button onClick={startGame} className="w-full h-12 gradient-primary text-lg font-semibold">
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "question" && scenario && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">{scenario.question}</CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-primary" /> {timeLeft}s remaining</span>
                <span>{currentLevel.toUpperCase()} • Q{scenarioIndex + 1}/5</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {scenario.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(optionIndex)}
                    disabled={selected !== null}
                    className="text-left rounded-xl border border-border/60 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-primary/5 disabled:opacity-70"
                  >
                    <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "feedback" && feedback && scenario && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {feedback.correct ? <CircleCheck className="h-5 w-5 text-emerald-400" /> : <CircleX className="h-5 w-5 text-rose-400" />}
                {feedback.correct ? "Correct Choice" : "Risky Choice"}
              </CardTitle>
              <CardDescription>{feedback.correct ? "Good security instinct." : "Re-check risk signals before acting."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-background/40 p-4 text-sm text-muted-foreground">{feedback.text}</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={feedback.delta >= 0 ? "text-emerald-300 border-emerald-500/40" : "text-rose-300 border-rose-500/40"}>
                  {feedback.delta >= 0 ? `+${feedback.delta}` : feedback.delta} points
                </Badge>
                {feedback.fastBonus && <Badge variant="outline" className="text-cyan-300 border-cyan-500/40">+5 fast bonus</Badge>}
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "level-up" && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleCheck className="h-5 w-5 text-emerald-400" />
                Level Cleared Perfectly
              </CardTitle>
              <CardDescription>You answered all 5 correctly. Advance to the next level.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => startLevel(levelIndex + 1)} className="w-full h-12 gradient-primary text-lg font-semibold">
                Continue to Level {levelIndex + 2}
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "result" && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                {resultTitle}
              </CardTitle>
              <CardDescription>Security awareness simulation report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Total Score</p>
                  <p className="text-3xl font-bold text-primary">{score}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Correct</p>
                  <p className="text-3xl font-bold text-emerald-400">{correctCount}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Incorrect</p>
                  <p className="text-3xl font-bold text-rose-400">{wrongCount}</p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">Performance Summary</p>
                <p className="text-xl font-bold text-primary">{performance}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You solved {correctCount} of {correctCount + wrongCount} attempted scenarios. Clear each level with 5/5 to complete the simulator path.
                </p>
              </div>

              <Button onClick={restart} className="w-full gradient-primary h-12 text-lg font-semibold">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Simulator
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

