"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Database, Zap, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

interface HashingMinigameProps {
  onComplete: () => void;
}

// Simple deterministic hash function for visual effect
const generateSimpleHash = (text: string) => {
  if (!text) return "";
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0') + "a2b4...";
};

const BASE_PASSWORDS = ["apple123", "qwerty!!", "supersecret", "ilovecats"];

export function HashingMinigame({ onComplete }: HashingMinigameProps) {
  const [introStep, setIntroStep] = useState(0); // 0/1 = instruction pages, 2 = play
  const [users, setUsers] = useState([
    { id: 1, name: "User A", password: "", salt: "" },
    { id: 2, name: "User B", password: "", salt: "" }
  ]);
  const [step, setStep] = useState(1); // 1: Initial Identical Hashes, 2: Solving/Salting added, 3: Success
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
    playAudio("/audio/hash-intro.mp3");
    return () => audioRef.current?.pause();
  }, []);

  // Success audio trigger
  useEffect(() => {
    if (step === 3) {
      playAudio("/audio/hash-success.mp3");
    }
  }, [step]);

  useEffect(() => {
    // Pick a random base password for both users
    const randomPwd = BASE_PASSWORDS[Math.floor(Math.random() * BASE_PASSWORDS.length)];
    setUsers([
      { id: 1, name: "User A", password: randomPwd, salt: "" },
      { id: 2, name: "User B", password: randomPwd, salt: "" }
    ]);
  }, []);

  const handleSaltChange = (id: number, val: string) => {
    if (introStep < 2) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, salt: val } : u));
  };

  const handleVerify = () => {
    if (introStep < 2) return;
    const salts = users.map(u => u.salt);
    if (salts[0] && salts[1] && salts[0] !== salts[1]) {
      setStep(3); // Success
    }
  };

  const hashes = users.map(u => generateSimpleHash(u.password + u.salt));
  const identicalHashes = hashes[0] === hashes[1];

  return (
    <Card className="w-full max-w-2xl bg-slate-900 border-yellow-500 shadow-2xl shadow-yellow-500/20 text-slate-100">
      <CardHeader>
        <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
          <Database className="h-6 w-6" />
          The Hashing Factory
        </CardTitle>
        <CardDescription className="text-slate-400 mt-2">
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold">Hashing, explained</div>
            {introStep < 2 ? (
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {introStep === 0 ? (
                  <>
                    <li>A hash is a one‑way fingerprint of a password.</li>
                    <li>If two users share a password, their hashes can match.</li>
                    <li>A salt is extra random text that prevents matching hashes.</li>
                  </>
                ) : (
                  <>
                    <li>Type any short salt for User A.</li>
                    <li>Type a different salt for User B.</li>
                    <li>Press Verify when hashes no longer match.</li>
                  </>
                )}
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Type a short salt for User A.</li>
                <li>Type a different salt for User B.</li>
                <li>Press Verify when hashes no longer match.</li>
              </ul>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {introStep < 2 && (
          <div className="flex gap-3">
            {introStep < 1 ? (
              <Button onClick={() => setIntroStep(1)} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                Next
              </Button>
            ) : (
              <Button onClick={() => setIntroStep(2)} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                Acknowledge &amp; Continue
              </Button>
            )}
          </div>
        )}
        
        {/* Conveyor Belt View */}
        <div className={`bg-black/50 p-6 rounded-lg border border-slate-700 relative ${introStep < 2 ? "pointer-events-none opacity-50" : ""}`}>
          
          <div className="space-y-8">
            {users.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 text-sm relative">
                <div className="w-16 font-bold text-slate-400">{u.name}</div>
                
                {/* Input block */}
                <div className="flex bg-slate-800 border border-slate-600 rounded-md font-mono items-center relative shadow-inner overflow-hidden">
                  <div className="text-white px-4 py-3 bg-slate-900 border-r border-slate-700">
                    {u.password}
                  </div>
                  <Input 
                    placeholder="Type salt..."
                    value={u.salt}
                    onChange={(e) => handleSaltChange(u.id, e.target.value)}
                    className="bg-transparent border-none text-yellow-400 h-full placeholder:text-slate-600 focus-visible:ring-0 max-w-[120px]"
                    maxLength={6}
                    disabled={step === 3}
                  />
                  {u.salt && <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-yellow-500/50" />}
                </div>

                {/* Arrow / Grinder */}
                <div className="flex flex-col items-center shrink-0 px-2 text-slate-500 text-[10px]">
                  <span>SHA-256</span>
                  <Zap className={`h-5 w-5 mt-1 ${hashes[i] ? 'text-yellow-400' : 'text-slate-600'}`} />
                </div>

                {/* Output Hash block */}
                <div className={`flex-1 border px-4 py-3 rounded-md font-mono tracking-widest transition-all duration-300 ${
                  hashes[i] 
                    ? identicalHashes 
                      ? 'bg-red-950/40 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'bg-black border-yellow-500/50 text-cyan-300' 
                    : 'bg-transparent border-dashed border-slate-700 text-slate-600'
                }`}>
                  {hashes[i] || 'Waiting...'}
                </div>
              </div>
            ))}
          </div>

          {!identicalHashes && users[0].salt && users[1].salt && step < 3 && (
            <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2">
              <Button onClick={handleVerify} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-8">
                Verify Hashes
              </Button>
            </div>
          )}

          {identicalHashes && (
             <div className="absolute inset-x-0 -bottom-3 mx-auto w-max bg-red-950/90 border border-red-500 text-red-400 text-xs px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-bounce">
               <AlertTriangle className="w-3 h-3" />
               Warning: Identical Hashes Detected. System Vulnerable!
             </div>
          )}

        </div>

      </CardContent>

      {step === 3 && (
        <CardFooter className="bg-green-950/30 border-t border-green-500/30 flex flex-col items-stretch p-6 animate-in fade-in zoom-in duration-500">
           <div className="flex items-center gap-3 text-green-400 mb-4">
              <CheckCircle2 className="h-8 w-8 shrink-0" />
              <div>
                <h4 className="font-bold">Hashes Secured</h4>
                <p className="text-sm opacity-90">Same password, different salts → different hashes. That is why websites store salted hashes instead of plain passwords.</p>
              </div>
           </div>
           <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6">
             Next
           </Button>
        </CardFooter>
      )}

    </Card>
  );
}
