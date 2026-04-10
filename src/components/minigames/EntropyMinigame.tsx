"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Settings2, Hash, KeySquare } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface EntropyMinigameProps {
  onComplete: () => void;
}

const POOLS = [
  { id: 1, name: "Numbers only (0–9)", size: 10 },
  { id: 2, name: "Letters only (a–z)", size: 26 },
  { id: 3, name: "Letters + numbers", size: 62 },
  { id: 4, name: "Letters + numbers + symbols", size: 94 }
];

export function EntropyMinigame({ onComplete }: EntropyMinigameProps) {
  const [introStep, setIntroStep] = useState(0); // 0/1 = instruction pages, 2 = play
  const [length, setLength] = useState(8);
  const [poolIndex, setPoolIndex] = useState(1); // Default to Lowercase
  
  const [combinationsDisplay, setCombinationsDisplay] = useState("");
  const [crackTimeDisplay, setCrackTimeDisplay] = useState("Instantly");
  const [isSuccess, setIsSuccess] = useState(false);
  const targetYears = 100;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionCount = useRef(0);
  const playedProgress = useRef(false);
  const introDone = introStep >= 2;

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
  };

  // Play intro on mount
  useEffect(() => {
    playAudio("/audio/entropy-intro.mp3");
    return () => audioRef.current?.pause();
  }, []);

  // Success audio trigger
  useEffect(() => {
    if (isSuccess) {
      playAudio("/audio/entropy-success.mp3");
    }
  }, [isSuccess]);

  useEffect(() => {
    const poolSize = POOLS[poolIndex].size;
    // Calculate permutations: poolSize ^ length
    // Using BigInt might be overkill, we can just use Math.pow and format it
    const perms = Math.pow(poolSize, length);
    
    // Format permutations
    if (perms > 1e15) {
      setCombinationsDisplay(`${(perms / 1e15).toFixed(2)} Quadrillion`);
    } else if (perms > 1e12) {
      setCombinationsDisplay(`${(perms / 1e12).toFixed(2)} Trillion`);
    } else if (perms > 1e9) {
      setCombinationsDisplay(`${(perms / 1e9).toFixed(2)} Billion`);
    } else if (perms > 1e6) {
      setCombinationsDisplay(`${(perms / 1e6).toFixed(2)} Million`);
    } else {
      setCombinationsDisplay(perms.toLocaleString());
    }

    // Modern offline hacker rig tests ~100 Billion hashes per second
    const hashesPerSecond = 100_000_000_000;
    const secondsToCrack = perms / hashesPerSecond;
    const minutes = secondsToCrack / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365.25;

    let timeStr = "";
    if (secondsToCrack < 1) timeStr = "Instantly";
    else if (secondsToCrack < 60) timeStr = `${Math.floor(secondsToCrack)} Seconds`;
    else if (minutes < 60) timeStr = `${Math.floor(minutes)} Minutes`;
    else if (hours < 24) timeStr = `${Math.floor(hours)} Hours`;
    else if (days < 365) timeStr = `${Math.floor(days)} Days`;
    else if (years < 1000) timeStr = `${Math.floor(years)} Years`;
    else if (years < 1000000) timeStr = `${Math.floor(years / 1000)} Millennia`;
    else timeStr = "Eternity";

    setCrackTimeDisplay(timeStr);

    if (years >= targetYears) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }

  }, [length, poolIndex]);

  return (
    <Card className="w-full max-w-2xl max-h-[540px] overflow-y-auto bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 text-slate-100">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
          <Settings2 className="h-6 w-6" />
          Entropy Shield
        </CardTitle>
        <CardDescription className="text-slate-200 mt-2">
          <div className="space-y-2">
            <div className="text-slate-100 font-semibold">Entropy Shield</div>
            {!introDone ? (
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {introStep === 0 ? (
                  <>
                    <li>Entropy means how hard a password is to guess.</li>
                    <li>Longer passwords create more combinations.</li>
                    <li>More character types create even more combinations.</li>
                  </>
                ) : (
                  <>
                    <li>Use the two sliders to change the password space.</li>
                    <li>Watch <strong>Rough time to crack</strong> as your feedback.</li>
                    <li>Goal: reach about <strong>100+ years</strong> to continue.</li>
                  </>
                )}
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Move the sliders to choose <strong>character types</strong> and <strong>length</strong>.</li>
                <li>Watch <strong>Rough time to crack</strong>.</li>
                <li>Goal: reach about <strong>100+ years</strong>.</li>
              </ul>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {!introDone && (
          <div className="flex gap-3">
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
        )}

        <div className={introDone ? "" : "pointer-events-none opacity-50"}>
        
        {/* Sliders Area */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold tracking-widest text-slate-300">
              <span className="flex items-center gap-2"><KeySquare className="h-4 w-4 text-purple-400" /> CHARACTER POOL</span>
              <span className="text-purple-400">{POOLS[poolIndex].name} ({POOLS[poolIndex].size} chars)</span>
            </div>
            <Slider 
              value={[poolIndex]} 
              min={0} 
              max={3} 
              step={1}
              onValueChange={(v) => {
                if (introDone && !isSuccess) {
                  setPoolIndex(v[0]);
                  interactionCount.current++;
                  if (interactionCount.current >= 3 && !playedProgress.current) {
                    playAudio("/audio/entropy-progress.mp3");
                    playedProgress.current = true;
                  }
                }
              }}
              className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-300 [&>.relative>.absolute]:bg-purple-600 cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold tracking-widest text-slate-300">
              <span className="flex items-center gap-2"><Hash className="h-4 w-4 text-cyan-400" /> STRING LENGTH</span>
              <span className="text-cyan-400">{length} characters</span>
            </div>
            <Slider 
              value={[length]} 
              min={4} 
              max={24} 
              step={1}
              onValueChange={(v) => {
                if (introDone && !isSuccess) {
                  setLength(v[0]);
                  interactionCount.current++;
                  if (interactionCount.current >= 3 && !playedProgress.current) {
                    playAudio("/audio/entropy-progress.mp3");
                    playedProgress.current = true;
                  }
                }
              }}
              className="[&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-300 [&>.relative>.absolute]:bg-cyan-600 transform-gpu cursor-pointer"
            />
          </div>

        </div>

        {/* Real-time Math Display */}
        <div className="bg-black/80 p-6 rounded-lg border-2 border-slate-700 shadow-inner">
          <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800">
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">How many combinations</span>
              <span className="text-xl font-mono text-slate-200">{combinationsDisplay}</span>
              <span className="text-[10px] text-slate-600 italic">Bigger = harder to guess</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Rough time to crack</span>
              <span className={`text-2xl font-black tracking-widest uppercase transition-colors duration-500 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {crackTimeDisplay}
              </span>
              <span className="text-[10px] text-slate-600 italic">Example speed (for learning)</span>
            </div>
          </div>
        </div>

        </div>
      </CardContent>

      <CardFooter className={`border-t transition-colors duration-500 flex flex-col items-stretch p-6 ${isSuccess ? 'bg-green-950/30 border-green-500/30' : 'bg-slate-900 border-slate-800'}`}>
        {isSuccess ? (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="flex items-center gap-3 text-green-400 mb-4 justify-center">
                <ShieldCheck className="h-8 w-8 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Strong enough</h4>
                  <p className="text-sm opacity-90 text-green-200">You made the password space big enough that automated guessing would take about 100 years or more in this simulation. That is what &ldquo;high entropy&rdquo; means in practice.</p>
                </div>
             </div>
             <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 text-lg mt-2 shadow-lg shadow-cyan-900">
               Next
             </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-500 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">Keep sliding—aim for about 100+ years crack time</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
