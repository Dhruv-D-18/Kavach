"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface EntropyMinigameProps {
  onComplete: () => void;
}

export function EntropyMinigame({ onComplete }: EntropyMinigameProps) {
  const [password, setPassword] = useState("P@ss");
  const [availableBlocks, setAvailableBlocks] = useState([
    { id: 'w0rd', text: 'w0rd', type: 'text' },
    { id: 'symbol', text: '!', type: 'symbol' },
    { id: 'horse', text: '_horse', type: 'text' },
  ]);
  const [crackTime, setCrackTime] = useState("2 seconds");
  const [crackTimeUnit, setCrackTimeUnit] = useState("seconds");
  const [crackTimeValue, setCrackTimeValue] = useState(2);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simple deterministic calc for educational purposes
  useEffect(() => {
    let time = 2;
    let unit = "seconds";
    
    if (password === "P@ss") {
      time = 2;
      unit = "seconds";
    } else if (password === "P@ss!") {
      time = 5;
      unit = "minutes";
    } else if (password === "P@ssw0rd") {
      time = 3;
      unit = "hours";
    } else if (password === "P@ssw0rd!") {
      time = 5;
      unit = "days";
    } else if (password.includes("_horse")) {
      time = 4000;
      unit = "years";
    } else if (password.length > 8) {
      time = 100;
      unit = "years";
    }

    setCrackTime(`${time} ${unit}`);
    setCrackTimeUnit(unit);
    setCrackTimeValue(time);

    if (unit === "years" && time >= 100) {
      setIsSuccess(true);
    }
  }, [password]);

  const handleAddBlock = (block: { id: string, text: string }) => {
    setPassword(prev => prev + block.text);
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
  };

  const handleReset = () => {
    setPassword("P@ss");
    setAvailableBlocks([
      { id: 'w0rd', text: 'w0rd', type: 'text' },
      { id: 'symbol', text: '!', type: 'symbol' },
      { id: 'horse', text: '_horse', type: 'text' },
    ]);
    setIsSuccess(false);
  };

  return (
    <Card className="w-full max-w-lg bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 text-slate-100">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          The Entropy Builder
        </CardTitle>
        <CardDescription className="text-slate-400">
          Aegis: "Increase the entropy (randomness and length) of this password to make it uncrackable. Aim for over 100 years!"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Password Display */}
        <div className="bg-black/50 p-6 rounded-lg border border-slate-700 text-center">
          <div className="text-3xl font-mono tracking-widest text-white mb-4">
            {password}
            <span className="animate-pulse">_</span>
          </div>
          
          <div className={`p-3 rounded flex items-center justify-center gap-2 font-bold ${
            crackTimeUnit === "years" ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {crackTimeUnit === "years" ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            Time to hack: {crackTime}
          </div>
        </div>

        {/* Blocks Drawer */}
        {!isSuccess && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Available Blocks</h3>
            <div className="flex flex-wrap gap-3">
              {availableBlocks.map(block => (
                <Button
                  key={block.id}
                  variant="outline"
                  onClick={() => handleAddBlock(block)}
                  className="bg-slate-800 hover:bg-cyan-900 hover:text-cyan-100 border-slate-600 font-mono text-lg py-6"
                >
                  +{block.text}
                </Button>
              ))}
              {availableBlocks.length === 0 && (
                 <p className="text-sm text-slate-500 italic">No more blocks available.</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={handleReset} size="sm" className="text-slate-400 hover:text-white">
                Reset
              </Button>
            </div>
          </div>
        )}

      </CardContent>
      {isSuccess && (
        <CardFooter className="bg-green-950/30 border-t border-green-500/30 flex flex-col items-stretch p-6 animate-in fade-in zoom-in duration-500">
           <div className="flex items-center gap-3 text-green-400 mb-4">
              <ShieldCheck className="h-8 w-8" />
              <div>
                <h4 className="font-bold">System Secured</h4>
                <p className="text-sm opacity-90">Length adds massive entropy. A bot would need centuries to guess this.</p>
              </div>
           </div>
           <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6">
             Disable Firewall & Continue
           </Button>
        </CardFooter>
      )}
    </Card>
  );
}
