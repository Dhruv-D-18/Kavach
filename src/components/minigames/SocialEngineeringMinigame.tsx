"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2, AlertTriangle, Search, ChevronRight } from "lucide-react";

interface SocialEngineeringMinigameProps {
  onComplete: () => void;
}

const PROFILES = [
  {
    name: "Alex",
    bio: "Software Admin. Class of 1985. Let's go Lakers! 🏀",
    posts: ['"Happy 10th birthday to my dog Buster! 🐶"'],
    vulnerabilities: ["1985", "lakers", "buster"],
    passwords: [
      { text: "Buster1985!", isVulnerable: true, target: "buster" },
      { text: "LakersFanForever", isVulnerable: true, target: "lakers" },
      { text: "xQ9$vLp2", isVulnerable: false },
      { text: "Admin_1985", isVulnerable: true, target: "1985" },
      { text: "m0nk3y_wreNch!", isVulnerable: false }
    ]
  },
  {
    name: "Sarah",
    bio: "Marketing Director. Born in Seattle. 🌧️ Coffee lover.",
    posts: ['"Just adopted the cutest cat, say hi to Luna! 🐈"', '"Married the love of my life in 2018!"'],
    vulnerabilities: ["seattle", "luna", "2018"],
    passwords: [
      { text: "LunaCat!!", isVulnerable: true, target: "luna" },
      { text: "Tr!ck0rTr3@t", isVulnerable: false },
      { text: "Seattle2018", isVulnerable: true, target: "2018" },
      { text: "coffee_luna_123", isVulnerable: true, target: "luna" },
      { text: "Jumper@45$Moon", isVulnerable: false }
    ]
  }
];

export function SocialEngineeringMinigame({ onComplete }: SocialEngineeringMinigameProps) {
  const [introStep, setIntroStep] = useState(0); // 0/1 = instruction pages, 2 = play
  const [profile, setProfile] = useState<typeof PROFILES[0] | null>(null);
  const [identifiedIds, setIdentifiedIds] = useState<number[]>([]);
  const [selectedPasswordIdx, setSelectedPasswordIdx] = useState<number | null>(null);
  const [guessInput, setGuessInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verified, setVerified] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
  };

  // Play intro on mount
  useEffect(() => {
    playAudio("/audio/se-intro.mp3");
    return () => audioRef.current?.pause();
  }, []);

  // Success audio trigger
  useEffect(() => {
    if (verified) {
      playAudio("/audio/se-success.mp3");
    }
  }, [verified]);

  useEffect(() => {
    const randomProfile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
    setProfile(randomProfile);
  }, []);

  const handlePasswordClick = (idx: number, isVuln: boolean) => {
    if (introStep < 2) return;
    if (verified) return;
    
    if (!isVuln) {
      setErrorMsg("That password doesn't contain personal information. It's safe.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    
    // Select to guess
    setSelectedPasswordIdx(idx);
    setGuessInput("");
    setErrorMsg("");
  };

  const handleGuessSubmit = () => {
    if (selectedPasswordIdx === null || !profile) return;
    
    const pw = profile.passwords[selectedPasswordIdx];
    if (guessInput.toLowerCase().includes(pw.target as string)) {
      setIdentifiedIds(prev => [...prev, selectedPasswordIdx]);
      setSelectedPasswordIdx(null);
      setErrorMsg("");
      
      // Check if all vulnerable are found
      const vulnTargetCount = profile.passwords.filter(p => p.isVulnerable).length;
      if (identifiedIds.length + 1 >= vulnTargetCount) {
        setVerified(true);
      }
    } else {
      playAudio("/audio/se-error.mp3");
      setErrorMsg(`Incorrect. Look closer at ${profile.name}'s profile.`);
    }
  };

  if (!profile) return null;

  const totalVulnerable = profile.passwords.filter(p => p.isVulnerable).length;

  return (
    <Card className="w-full max-w-3xl bg-slate-900 border-purple-500 shadow-2xl shadow-purple-500/20 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* OSINT Profile Sidebar */}
      <div className="bg-slate-800 border-r border-slate-700/50 p-6 md:w-2/5 flex flex-col shrink-0">
        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Public profile (clues)
        </h3>
        
        <div className="text-center mb-6">
           <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-purple-500/30">
              <User className="h-10 w-10 text-slate-400" />
           </div>
           <h4 className="font-bold text-xl">Target: {profile.name}</h4>
           <div className="mt-4 space-y-3 text-sm text-slate-300 text-left bg-black/30 p-4 rounded-lg border border-slate-700/50">
             <p><span className="text-purple-400 font-bold block mb-1">Bio:</span> {profile.bio}</p>
             <div>
               <span className="text-purple-400 font-bold block mb-1">Recent Posts:</span>
               <ul className="space-y-2">
                 {profile.posts.map((post, i) => (
                   <li key={i} className="italic text-slate-400 border-l-2 border-purple-500/50 pl-2">{post}</li>
                 ))}
               </ul>
             </div>
           </div>
        </div>
      </div>

      {/* Interactive Section */}
      <div className="p-6 md:w-3/5 flex flex-col relative">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
            Social Engineering Trap
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            <div className="space-y-2">
              <div className="text-slate-200 font-semibold">How it works</div>
              {introStep < 2 ? (
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  {introStep === 0 ? (
                    <>
                      <li>Attackers read public profiles for clues.</li>
                      <li>They guess passwords using pet names, years, and teams.</li>
                      <li>This is called social engineering + OSINT guessing.</li>
                    </>
                  ) : (
                    <>
                      <li>Read the clues on the left.</li>
                      <li>Click a weak password that uses a clue.</li>
                      <li>Type the clue (word or year) to confirm it.</li>
                    </>
                  )}
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>Read the clues on the left.</li>
                  <li>Click a weak password that uses a clue.</li>
                  <li>Type the clue (word or year) to confirm it.</li>
                </ul>
              )}
            </div>
          </CardDescription>
        </CardHeader>

        {introStep < 2 && (
          <div className="mb-4 flex gap-3">
            {introStep < 1 ? (
              <Button onClick={() => setIntroStep(1)} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Next
              </Button>
            ) : (
              <Button onClick={() => setIntroStep(2)} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Acknowledge &amp; Continue
              </Button>
            )}
          </div>
        )}

        <div className="flex-1 space-y-3 mb-6 relative">
          <div className="text-xs text-purple-400 mb-2 font-bold tracking-widest uppercase">
            Identified: {identifiedIds.length} / {totalVulnerable}
          </div>

          {profile.passwords.map((pw, i) => {
            const isIdentified = identifiedIds.includes(i);
            const isSelected = selectedPasswordIdx === i;

            return (
              <div key={i} className={`rounded-lg border overflow-hidden transition-all duration-300 ${isIdentified ? 'border-red-500 bg-red-950/20' : isSelected ? 'border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/20' : 'border-slate-700 bg-black/40 hover:border-slate-500 hover:bg-black/60'}`}>
                <div 
                  className={`p-3 cursor-pointer flex justify-between items-center ${isIdentified ? 'opacity-70' : ''}`}
                  onClick={() => !isIdentified && handlePasswordClick(i, pw.isVulnerable)}
                >
                  <span className="font-mono">{pw.text}</span>
                  {isIdentified && <AlertTriangle className="h-5 w-5 text-red-500" />}
                </div>

                {isSelected && !isIdentified && (
                  <div className="p-3 bg-black/60 border-t border-purple-500/30 flex gap-2 animate-in slide-in-from-top-2">
                    <Input 
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      placeholder="Type the clue from the profile (e.g. year, pet name)..."
                      className="bg-slate-900 border-purple-500/50 focus-visible:ring-purple-500 h-9"
                      onKeyDown={(e) => e.key === 'Enter' && handleGuessSubmit()}
                      autoFocus
                    />
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white" onClick={handleGuessSubmit}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errorMsg && <p className="absolute bottom-20 left-6 right-6 text-red-400 text-sm bg-red-950/50 p-3 rounded border border-red-900/50 animate-in fade-in zoom-in">{errorMsg}</p>}

        {verified && (
          <div className="mt-auto animate-in slide-in-from-bottom-4">
             <div className="bg-green-950/40 border border-green-500/30 p-4 rounded-lg mb-4 text-green-400 flex gap-3">
               <CheckCircle2 className="h-6 w-6 shrink-0" />
               <div className="text-sm">
                 <p className="font-bold">Bot Bypassed</p>
                 <p className="opacity-90">You successfully identified the dictionary flaws traced back to the target's public profile.</p>
               </div>
             </div>
             <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12">
               Next
             </Button>
          </div>
        )}

      </div>
    </Card>
  );
}
