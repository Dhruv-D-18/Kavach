"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalVaultProps {
  onComplete: () => void;
}

export function TerminalVault({ onComplete }: TerminalVaultProps) {
  const [history, setHistory] = useState<string[]>([
    "KAVACH OS [Version 10.0.19045.2846]",
    "(c) Kavach Corporation. All rights reserved.",
    "",
    "Establishing secure connection to Vault Server...",
    "Connection Established. Root Access Required.",
    "Type 'help' for available commands."
  ]);
  const [input, setInput] = useState("");
  const [isHacking, setIsHacking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const rawCmd = cmd.trim();
    const lowerCmd = rawCmd.toLowerCase();
    
    setHistory(prev => [...prev, `C:\\Hacker\\Tools> ${rawCmd}`]);

    if (lowerCmd === "help") {
      setHistory(prev => [...prev, 
        "Available Commands:",
        "  analyze target          - Run OSINT scan on the vault owner",
        "  generate_wordlist       - Compile dictionary based on OSINT data",
        "  crack_vault [list]      - Execute brute-force using specified wordlist",
        "  clear                   - Clear screen"
      ]);
    } else if (lowerCmd === "clear") {
      setHistory([
        "KAVACH OS [Version 10.0.19045.2846]",
        "(c) Kavach Corporation. All rights reserved."
      ]);
    } else if (lowerCmd === "analyze target") {
      setHistory(prev => [...prev, 
        "[!!] Initializing OSINT module...",
        "Scanning public profiles... [OK]",
        "Target Name: John Doe",
        "Pet Name: Buster",
        "Significant Year: 1985",
        "Favorite Sports Team: Lakers"
      ]);
    } else if (lowerCmd === "generate_wordlist") {
      setHistory(prev => [...prev, 
        "[**] Analyzing parameters...",
        "[**] Permutating strings (Buster, 1985, Lakers)...",
        "[OK] Wordlist compiled successfully.",
        "[OK] Saved as 'target_dict.txt'."
      ]);
    } else if (lowerCmd.startsWith("crack_vault")) {
      if (!lowerCmd.includes("target_dict.txt") && !lowerCmd.includes("--wordlist")) {
        setHistory(prev => [...prev, "[ERROR] Missing valid wordlist. Try 'crack_vault target_dict.txt'"]);
      } else {
        startHackingSequence();
      }
    } else if (lowerCmd === "") {
      // Do nothing, just empty prompt
    } else {
      setHistory(prev => [...prev, `'${rawCmd}' is not recognized as an internal or external command.`]);
    }
    
    setInput("");
  };

  const startHackingSequence = () => {
    setIsHacking(true);
    setHistory(prev => [...prev, "[**] INITIALIZING BRUTE FORCE ATTACK...", "Target: 192.168.1.1 (VAULT)"]);
    
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const randomJunk = Math.random().toString(36).substring(2, 12);
      
      if (attempts < 20) {
        setHistory(prev => [...prev, `[FAIL] Testing password: ${randomJunk}... Access Denied`]);
      } else {
        clearInterval(interval);
        setHistory(prev => [
          ...prev, 
           "=========================================",
          "[SUCCESS] MATCH FOUND: Buster1985",
           "=========================================",
          "Access Granted. Disabling mainframe security locks."
        ]);
        setTimeout(() => {
          setUnlocked(true);
        }, 1500);
      }
    }, 100); // Super fast scrolling
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHacking && !unlocked) {
      handleCommand(input);
    }
  };

  if (unlocked) {
    return (
      <div className="w-full max-w-4xl bg-cyan-950 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/50 rounded-lg p-10 text-center animate-in zoom-in duration-500">
         <LockOpen className="h-24 w-24 text-cyan-400 mx-auto mb-6 animate-pulse" />
         <h2 className="text-4xl font-bold text-red-500 mb-4 tracking-widest">VAULT COMPROMISED</h2>
         <p className="text-cyan-200 text-lg mb-4">See how easy that was? The target's weak password 'Buster1985' was cracked instantly by your dictionary attack.</p>
         
         <div className="bg-black/40 p-5 rounded-lg border border-cyan-500/30 mb-8 max-w-2xl mx-auto text-left space-y-3">
           <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
             <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">AG</div>
             <p className="text-md font-bold text-cyan-400">Aegis Debrief & Protocol:</p>
           </div>
           <p className="text-sm text-cyan-100 italic">"What you just executed is a targeted Dictionary Attack.</p>
           <p className="text-sm text-cyan-100 italic">By running OSINT (Open Source Intelligence), you scraped the target's pet name and birth year to generate a custom wordlist. The brute-force script instantly found the match."</p>
           <p className="text-sm text-cyan-100 font-bold mt-2">Lesson: Never use personal details in your master passwords. You are now the System Admin. Secure this vault by constructing an unbreakable payload."</p>
         </div>

         <Button onClick={onComplete} size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl px-12 py-6">
           Enter Admin Mode
         </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl h-[500px] bg-black border border-slate-700 shadow-2xl rounded-lg overflow-hidden flex flex-col font-mono text-sm leading-relaxed" style={{ boxShadow: "0 0 40px rgba(0, 255, 0, 0.1)" }}>
      {/* Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="h-4 w-4" />
          <span>VAULT_SHELL_v2.1.exe</span>
        </div>
        
        {/* Fake Window Controls */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div 
        className="flex-1 p-4 overflow-y-auto text-green-500 relative"
        style={{ 
           textShadow: "0 0 5px rgba(0,255,0,0.5)",
           backgroundImage: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)",
           backgroundSize: "100% 4px" // CRT scanline effect
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="space-y-1 mb-4">
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {!isHacking && (
          <form onSubmit={onSubmit} className="flex">
            <span className="mr-2">C:\Hacker\Tools&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-green-500 shadow-none"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </form>
        )}
        
        <div ref={bottomRef} className="h-4"></div>
      </div>
    </div>
  );
}
