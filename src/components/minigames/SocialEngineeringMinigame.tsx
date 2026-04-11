"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2, AlertTriangle, Search, ChevronRight } from "lucide-react";

interface SocialEngineeringMinigameProps {
  onComplete: () => void;
  onDialogue?: (id: string) => void;
}

const FALLBACK_PROFILE = {
  name: "Alex",
  bio: "Software Admin. Class of 1985. Let's go Lakers! 🏀",
  posts: ['"Happy 10th birthday to my dog Buster! 🐶"'],
  vulnerabilities: ["1985", "lakers", "buster"],
  correct_password: "Buster1985"
};

export function SocialEngineeringMinigame({ onComplete, onDialogue }: SocialEngineeringMinigameProps) {
  const [profile, setProfile] = useState<any>(FALLBACK_PROFILE);
  const [identifiedIds, setIdentifiedIds] = useState<number[]>([]);
  const [selectedPasswordIdx, setSelectedPasswordIdx] = useState<number | null>(null);
  const [guessInput, setGuessInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verified, setVerified] = useState(false);

  // Trigger intro on mount
  useEffect(() => {
    onDialogue?.("social"); // Use the updated 'social' ID for the sequence
  }, [onDialogue]);

  // Success dialogue trigger
  useEffect(() => {
    if (verified) {
      onDialogue?.("se-success");
    }
  }, [verified, onDialogue]);

  const [passwords, setPasswords] = useState<any[]>([
      { text: "Buster1985!", isVulnerable: true, target: "buster" },
      { text: "LakersFanForever", isVulnerable: true, target: "lakers" },
      { text: "xQ9$vLp2", isVulnerable: false },
      { text: "Admin_1985", isVulnerable: true, target: "1985" },
      { text: "m0nk3y_wreNch!", isVulnerable: false }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await import("@/lib/supabase").then(m => m.supabase.from("password_scenarios").select("*"));
        let target = FALLBACK_PROFILE;
        if (data && data.length > 0) {
          target = data[Math.floor(Math.random() * data.length)];
        }
        setProfile(target as any);

        // Generate dynamic password list
        const vulns = target.vulnerabilities || ["Buster", "1985", "Lakers"];
        const generated = [
          { text: `${vulns[0]}${vulns[1]}!`, isVulnerable: true, target: vulns[0].toLowerCase() },
          { text: `${vulns[2]}FanForever`, isVulnerable: true, target: vulns[2].toLowerCase() },
          { text: "xQ9$vLp2", isVulnerable: false },
          { text: `Admin_${vulns[1]}`, isVulnerable: true, target: vulns[1].toLowerCase() },
          { text: "m0nk3y_wreNch!", isVulnerable: false }
        ].sort(() => Math.random() - 0.5);
        setPasswords(generated);

      } catch (err) {
        console.error("Failed to fetch profiles:", err);
        setProfile(FALLBACK_PROFILE as any);
        setPasswords([
            { text: "Buster1985!", isVulnerable: true, target: "buster" },
            { text: "LakersFanForever", isVulnerable: true, target: "lakers" },
            { text: "xQ9$vLp2", isVulnerable: false },
            { text: "Admin_1985", isVulnerable: true, target: "1985" },
            { text: "m0nk3y_wreNch!", isVulnerable: false }
        ]);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordClick = (idx: number, isVuln: boolean) => {
    if (verified) return;
    if (!isVuln) {
      setErrorMsg("That password doesn't contain personal information. It's safe.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setSelectedPasswordIdx(idx);
    setGuessInput("");
    setErrorMsg("");
  };

  const handleGuessSubmit = () => {
    if (selectedPasswordIdx === null || !profile) return;
    const pw = passwords[selectedPasswordIdx];
    if (guessInput.toLowerCase().includes(pw.target as string)) {
      setIdentifiedIds(prev => [...prev, selectedPasswordIdx]);
      setSelectedPasswordIdx(null);
      setGuessInput("");
      setErrorMsg("");
      const vulnTargetCount = passwords.filter(p => p.isVulnerable).length;
      if (identifiedIds.length + 1 >= vulnTargetCount) {
        setVerified(true);
      }
    } else {
      setErrorMsg(`Incorrect. Look closer at ${profile?.name || 'the'} profile.`);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center p-20 text-cyan-500 font-mono animate-pulse">
      INITIALIZING PROFILE DATA...
    </div>
  );

  return (
    <Card className="w-full max-w-3xl bg-slate-900 border-purple-500 shadow-2xl shadow-purple-500/20 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      <div className="bg-slate-800 border-r border-slate-700/50 p-6 md:w-2/5 flex flex-col shrink-0">
        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Public profile (clues)
        </h3>
        <div className="text-center mb-6">
           <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-purple-500/30">
              <User className="h-10 w-10 text-slate-400" />
           </div>
            <h4 className="font-bold text-xl">Target: {profile?.name || "Unknown Analyst"}</h4>
            <div className="mt-4 space-y-3 text-sm text-slate-300 text-left bg-black/30 p-4 rounded-lg border border-slate-700/50">
              <p><span className="text-purple-400 font-bold block mb-1">Bio:</span> {profile?.bio || "No public bio available."}</p>
              <div>
                <span className="text-purple-400 font-bold block mb-1">Recent Posts:</span>
                <ul className="space-y-2">
                  {(profile?.posts || []).map((post: string, i: number) => (
                    <li key={i} className="italic text-slate-400 border-l-2 border-purple-500/50 pl-2">{post}</li>
                  ))}
                  {(!profile?.posts || profile.posts.length === 0) && <li className="text-slate-500 italic">No recent activity.</li>}
                </ul>
              </div>
            </div>
        </div>
      </div>

      <div className="p-6 md:w-3/5 flex flex-col relative">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
            Social Engineering Trap
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            <div className="space-y-2">
              <div className="text-slate-200 font-semibold">How to play</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Read the clues on the left.</li>
                <li>Click a weak password that uses a clue.</li>
                <li>Type the clue (word or year) to confirm it.</li>
              </ul>
            </div>
          </CardDescription>
        </CardHeader>

        <div className="flex-1 space-y-3 mb-6 relative">
          <div className="text-xs text-purple-400 mb-2 font-bold tracking-widest uppercase">
            Identified Vulnerabilities: {identifiedIds.length} / {passwords.filter(p => p.isVulnerable).length}
          </div>

          {passwords.map((pw, i) => {
            const isIdentified = identifiedIds.includes(i);
            const isSelected = selectedPasswordIdx === i;
            return (
              <div key={i} className={`rounded-lg border overflow-hidden transition-all duration-300 ${isIdentified ? 'border-red-500 bg-red-950/20' : isSelected ? 'border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/20' : 'border-slate-700 bg-black/40 hover:border-slate-500 hover:bg-black/60'}`}>
                <div className={`p-3 cursor-pointer flex justify-between items-center ${isIdentified ? 'opacity-70' : ''}`} onClick={() => !isIdentified && handlePasswordClick(i, pw.isVulnerable)}>
                  <span className="font-mono text-xs">{pw.text}</span>
                  {isIdentified && <AlertTriangle className="h-5 w-5 text-red-500" />}
                </div>
                {isSelected && !isIdentified && (
                  <div className="p-3 bg-black/60 border-t border-purple-500/30 flex gap-2 animate-in slide-in-from-top-2">
                    <Input value={guessInput} onChange={(e) => setGuessInput(e.target.value)} placeholder="Type the clue keyword..." className="bg-slate-900 border-purple-500/50 h-9 text-xs" onKeyDown={(e) => e.key === 'Enter' && handleGuessSubmit()} autoFocus />
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white" onClick={handleGuessSubmit}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errorMsg && <p className="absolute bottom-20 left-6 right-6 text-red-400 text-xs bg-red-950/50 p-3 rounded border border-red-900/50">{errorMsg}</p>}

        {verified && (
          <div className="mt-auto animate-in slide-in-from-bottom-4">
             <div className="bg-green-950/40 border border-green-500/30 p-4 rounded-lg mb-4 text-green-400 flex gap-3">
               <CheckCircle2 className="h-6 w-6 shrink-0" />
               <div className="text-xs">
                 <p className="font-bold">Bot Bypassed</p>
                 <p className="opacity-90">Weakness identified in the target's dictionary using profile data.</p>
               </div>
             </div>
             <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12">Continue mission</Button>
          </div>
        )}
      </div>
    </Card>
  );
}