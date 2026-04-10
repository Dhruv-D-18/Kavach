"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal, Shield, CheckCircle2, ChevronRight, Search, FileText, Zap } from "lucide-react";

interface TerminalVaultProps {
  onComplete: () => void;
}

export function TerminalVault({ onComplete }: TerminalVaultProps) {
  const [introStep, setIntroStep] = useState(0); // 0/1 = instruction pages, 2 = play
  const [history, setHistory] = useState<string[]>([
    "KavachOS v2.4.1 (Admin Mode)",
    "Type command or use the Toolkit to interact."
  ]);
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  
  // Progress state: 0=start, 1=osint done, 2=wordlist done, 3=cracked
  const [step, setStep] = useState(0); 

  const terminalRef = useRef<HTMLDivElement>(null);
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
    playAudio("/audio/vault-intro.mp3");
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.toLowerCase().trim();
    setHistory(prev => [...prev, `C:\\Hacker\\Tools> ${rawCmd}`]);

    if (cmd === "analyze target") {
      if (step >= 1) {
        setHistory(prev => [...prev, "Target already analyzed."]);
      } else {
        setHistory(prev => [...prev, "[*] Scraping public profile..."]);
        playAudio("/audio/vault-osint.mp3");
        
        // Wait for Cypher to say "Data cached" (approx 2s)
        setTimeout(() => {
          setHistory(prev => [
            ...prev, 
            "Target Name: John Doe",
            "Pet Name: <span class='text-yellow-400 font-bold'>Buster</span>",
            "Significant Year: <span class='text-yellow-400 font-bold'>1985</span>",
            "Favorite Sports Team: Lakers",
            "[*] OSINT complete. Data cached."
          ]);
          setStep(1);
        }, 2500);
      }
    } else if (cmd === "generate_wordlist") {
      if (step === 0) {
        setHistory(prev => [...prev, "[!] Cannot generate wordlist. No target data. Run 'analyze target' first."]);
      } else if (step >= 2) {
         setHistory(prev => [...prev, "Wordlist already generated."]);
      } else {
        playAudio("/audio/vault-dictionary.mp3");
        setHistory(prev => [
          ...prev,
          "[*] Compiling dictionary based on OSINT...",
          "[*] Applying common permutations (capitalization, special chars)...",
          "[*] Generated 1.4 million potential combinations.",
          "Saved to target_dict.txt"
        ]);
        setStep(2);
      }
    } else if (cmd === "crack_vault target_dict.txt" || cmd === "crack_vault") {
      if (step < 2) {
        setHistory(prev => [...prev, "[!] Error: require target_dict.txt. Generate wordlist first."]);
      } else if (step === 2) {
        startHackingSequence();
      }
    } else {
      setHistory(prev => [...prev, `'${rawCmd}' is not recognized. Use the Hacker Toolkit commands.`]);
    }
    
    setInput("");
  };

  const startHackingSequence = () => {
    setIsHacking(true);
    setHistory(prev => [...prev, "[**] INITIALIZING BRUTE FORCE ATTACK...", "Target: 192.168.1.1 (VAULT)"]);
    playAudio("/audio/vault-bruteforce.mp3");
    
    // Simulating generated wordlist combinations based on OSINT
    const wordlistGuesses = [
      "john123", "doejohn", "LakersFan", "1985john", "BusterDog",
      "john1985", "lakers1985", "Buster123!", "LakersBuster", "doe1985",
      "1985Lakers", "john_doe", "Buster!985", "BusterLakers", "JOHN1985",
      "lakers_fan", "Buster1980", "1985buster", "Buster_1985"
    ];

    let attempts = 0;
    // We want the match to hit roughly when Cypher says "There... match found" 
    // which is about 6 seconds into brute-force audio.
    const interval = setInterval(() => {
      if (attempts < wordlistGuesses.length) {
        const guess = wordlistGuesses[attempts];
        setHistory(prev => [...prev, `<span class='text-red-400'>[FAIL] Testing password: ${guess}... Denied</span>`]);
        attempts++;
      } else {
        clearInterval(interval);
        setHistory(prev => [
          ...prev, 
           "<span class='text-green-400 font-bold'>=========================================</span>",
          "<span class='text-green-400 font-bold'>[SUCCESS] MATCH FOUND: Buster1985</span>",
           "<span class='text-green-400 font-bold'>=========================================</span>",
          "Access Granted. Disabling mainframe security locks."
        ]);
        
        setTimeout(() => {
          playAudio("/audio/vault-breached.mp3");
          setUnlocked(true);
          setStep(3);
        }, 1500);
      }
    }, 300); // Slower interval so 20 attempts take ~6 seconds
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (introStep < 2) return;
    if (!isHacking && !unlocked && input) {
      handleCommand(input);
    }
  };

  const triggerToolkit = (cmd: string) => {
    if (introStep < 2) return;
    if (!isHacking && !unlocked) {
      setInput(cmd);
      handleCommand(cmd);
    }
  };

  const getHint = () => {
    if (step === 0) return "Cypher: Type 'analyze target' to scrape the profile.";
    if (step === 1) return "Cypher: Type 'generate_wordlist' to build the dictionary.";
    if (step === 2) return "Cypher: Type 'crack_vault target_dict.txt'";
    return "";
  };

  if (unlocked) {
    return (
      <div className="w-full max-w-4xl bg-slate-900 border-red-500 shadow-2xl shadow-red-500/20 text-center p-12 rounded-xl animate-in zoom-in duration-500">
         <Shield className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
         <h2 className="text-4xl font-bold text-red-500 mb-4 tracking-widest">VAULT COMPROMISED</h2>
         <p className="text-cyan-200 text-lg mb-4">See how easy that was? The target's weak password 'Buster1985' was cracked instantly by your dictionary attack.</p>
         
         <div className="bg-black/40 p-5 rounded-lg border border-cyan-500/30 mb-8 max-w-2xl mx-auto text-left space-y-3">
           <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
             <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">CY</div>
             <p className="text-md font-bold text-cyan-400">Cypher Debrief & Protocol:</p>
           </div>
           <p className="text-sm text-cyan-100 italic">"What you just executed is a targeted Dictionary Attack.</p>
           <p className="text-sm text-cyan-100 italic">By running OSINT, you scraped the target's pet name and birth year to generate a custom wordlist. The brute-force script instantly found the match."</p>
           <p className="text-sm text-yellow-400 font-bold mt-2">Lesson: Never use personal details in your master passwords.</p>
           <p className="text-sm text-cyan-100 font-bold mt-2">You are now the System Admin. Secure this vault by constructing an unbreakable payload."</p>
         </div>

         <Button onClick={onComplete} size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl px-12 py-6">
           Next
         </Button>
         <Button
           onClick={() => window.location.href = '/dashboard'}
           size="lg"
           variant="outline"
           className="mt-3 border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-300 w-full"
         >
           ← Back to Dashboard
         </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-5xl bg-slate-950 border-cyan-500 shadow-2xl shadow-cyan-500/20 grid grid-cols-1 md:grid-cols-3 overflow-hidden relative">
      {introStep < 2 && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="text-cyan-300 font-bold tracking-widest text-xs mb-3 uppercase">Quick briefing</div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-200">
              {introStep === 0 ? (
                <>
                  <li>This is a safe simulation of a dictionary attack.</li>
                  <li>You will run three commands in order to unlock the vault.</li>
                  <li>Use the buttons on the right if you prefer not to type.</li>
                </>
              ) : (
                <>
                  <li>Step 1: Run <span className="font-mono text-cyan-300">analyze target</span>.</li>
                  <li>Step 2: Run <span className="font-mono text-cyan-300">generate_wordlist</span>.</li>
                  <li>Step 3: Run <span className="font-mono text-cyan-300">crack_vault</span>.</li>
                </>
              )}
            </ul>
            <div className="mt-5 flex gap-3">
              {introStep < 1 ? (
                <Button onClick={() => setIntroStep(1)} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Next
                </Button>
              ) : (
                <Button onClick={() => setIntroStep(2)} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Acknowledge &amp; Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* LEFT: Retro Terminal (2 Columns) */}
      <div className="md:col-span-2 flex flex-col border-r border-slate-800">
         <div className="bg-slate-900 border-b border-cyan-900/50 p-3 flex items-center gap-2">
           <Terminal className="text-cyan-500 w-5 h-5" />
           <span className="text-slate-300 font-mono text-sm">HackerTerminal_v2.exe</span>
         </div>
         
         <div 
           ref={terminalRef}
           className="bg-black text-green-500 font-mono p-6 h-96 overflow-y-auto space-y-2 text-sm leading-relaxed"
         >
           {history.map((line, i) => (
             <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
           ))}
           {!isHacking && (
             <form onSubmit={onSubmit} className="flex items-center gap-2 mt-4 text-green-400">
               <span>C:\Hacker\Tools&gt;</span>
               <input 
                 autoFocus
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 className="flex-1 bg-transparent outline-none border-none text-green-500"
                 placeholder={getHint()}
               />
             </form>
           )}
           {isHacking && <div className="animate-pulse">_</div>}
         </div>
      </div>

      {/* RIGHT: Tracker & Toolkit (1 Column) */}
      <div className="md:col-span-1 bg-slate-900 flex flex-col">
         {/* Mission Tracker */}
         <div className="p-6 border-b border-slate-800 flex-1">
            <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              Mission Tracker
            </h3>
            <ul className="space-y-6">
               <li className={`flex items-start gap-3 transition-opacity ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}>
                 {step >= 1 ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <div className="w-5 h-5 border-2 border-cyan-600 rounded-full shrink-0" />}
                 <div>
                   <p className={`font-bold text-sm ${step >= 1 ? 'text-green-400' : 'text-slate-200'}`}>1. Run OSINT Scan</p>
                   <p className="text-xs text-slate-500 mt-1">Gather intel on target.</p>
                 </div>
               </li>
               <li className={`flex items-start gap-3 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                 {step >= 2 ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <div className="w-5 h-5 border-2 border-cyan-600 rounded-full shrink-0" />}
                 <div>
                   <p className={`font-bold text-sm ${step >= 2 ? 'text-green-400' : 'text-slate-200'}`}>2. Compile Dictionary</p>
                   <p className="text-xs text-slate-500 mt-1">Build permutation wordlist.</p>
                 </div>
               </li>
               <li className={`flex items-start gap-3 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                 {step >= 3 ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <div className="w-5 h-5 border-2 border-cyan-600 rounded-full shrink-0" />}
                 <div>
                   <p className={`font-bold text-sm ${step >= 3 ? 'text-green-400' : 'text-slate-200'}`}>3. Execute Brute-Force</p>
                   <p className="text-xs text-slate-500 mt-1">Launch dictionary attack.</p>
                 </div>
               </li>
            </ul>
         </div>

         {/* Hacker Toolkit */}
         <div className="p-6 bg-slate-950">
            <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4">
              Hacker Toolkit Quick-Actions
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => triggerToolkit("analyze target")}
                disabled={step !== 0 || isHacking}
                className={`w-full justify-start text-xs border-slate-700 bg-slate-900 ${step === 0 ? 'text-cyan-400 border-cyan-500/50 hover:bg-cyan-900/30 hover:text-cyan-300' : 'text-slate-600'}`}
              >
                <Search className="w-4 h-4 mr-2" /> analyze target
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => triggerToolkit("generate_wordlist")}
                disabled={step !== 1 || isHacking}
                className={`w-full justify-start text-xs border-slate-700 bg-slate-900 ${step === 1 ? 'text-cyan-400 border-cyan-500/50 hover:bg-cyan-900/30 hover:text-cyan-300' : 'text-slate-600'}`}
              >
                <FileText className="w-4 h-4 mr-2" /> generate_wordlist
              </Button>

              <Button 
                variant="outline" 
                onClick={() => triggerToolkit("crack_vault target_dict.txt")}
                disabled={step !== 2 || isHacking}
                className={`w-full justify-start text-xs border-slate-700 bg-slate-900 ${step === 2 ? 'text-cyan-400 border-cyan-500/50 hover:bg-cyan-900/30 hover:text-cyan-300' : 'text-slate-600'}`}
              >
                <Zap className="w-4 h-4 mr-2" /> crack_vault dict.txt
              </Button>
            </div>
         </div>
      </div>
    </Card>
  );
}
