"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Database, Zap, Sparkles, CheckCircle2 } from "lucide-react";

interface HashingMinigameProps {
  onComplete: () => void;
}

export function HashingMinigame({ onComplete }: HashingMinigameProps) {
  const [users, setUsers] = useState([
    { id: 1, name: "User A", password: "apple123", salt: "", hash: "" },
    { id: 2, name: "User B", password: "apple123", salt: "", hash: "" }
  ]);
  const [step, setStep] = useState(1); // 1: Initial, 2: Hashed identical, 3: Salt added, 4: Hashed different

  const generateHash = (text: string) => {
    // Dummy hash for visualization
    if (text === "apple123") return "e3b0c442...";
    if (text === "apple123+X9z") return "f5d12a89...";
    if (text === "apple123+Q2p") return "c8a09b31...";
    return "a1b2c3d4...";
  };

  const handleHash = () => {
    if (step === 1) {
      setUsers(users.map(u => ({ ...u, hash: generateHash(u.password) })));
      setStep(2);
    } else if (step === 3) {
      setUsers(users.map(u => ({ ...u, hash: generateHash(u.password + u.salt) })));
      setStep(4);
    }
  };

  const handleAddSalt = () => {
    setUsers([
      { ...users[0], salt: "+X9z", hash: "" },
      { ...users[1], salt: "+Q2p", hash: "" }
    ]);
    setStep(3);
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-900 border-yellow-500 shadow-2xl shadow-yellow-500/20 text-slate-100">
      <CardHeader>
        <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
          <Database className="h-6 w-6" />
          The Hashing Factory
        </CardTitle>
        <CardDescription className="text-slate-400">
          {step <= 2 
            ? 'Aegis: "Two users chose the same password. Run them through the SHA-256 grinder and observe the result."'
            : 'Aegis: "Now that we added unique Salt (random data) to each, hash them again to see how it protects the database."'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Conveyor Belt View */}
        <div className="bg-black/50 p-6 rounded-lg border border-slate-700 relative">
          
          <div className="space-y-6">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-4 text-sm">
                <div className="w-20 font-bold text-slate-400">{u.name}</div>
                
                {/* Input block */}
                <div className="bg-slate-800 border border-slate-600 px-4 py-2 rounded-l-md font-mono flex items-center">
                  <span className="text-white">{u.password}</span>
                  {u.salt && <span className="text-yellow-400 ml-1">{u.salt}</span>}
                </div>

                {/* Arrow / Grinder */}
                <Zap className={`h-5 w-5 ${u.hash ? 'text-yellow-400' : 'text-slate-600'} shrink-0`} />

                {/* Output block */}
                <div className={`flex-1 border px-4 py-2 rounded-r-md font-mono ${
                  u.hash ? 'bg-black border-yellow-500/50 text-cyan-300' : 'bg-transparent border-dashed border-slate-700 text-slate-600'
                }`}>
                  {u.hash || 'Waiting...'}
                </div>
              </div>
            ))}
          </div>

          {step === 2 && (
             <div className="absolute inset-x-0 bottom-[-15px] mx-auto w-max bg-red-950/90 border border-red-500 text-red-400 text-xs px-3 py-1 rounded-full animate-pulse shadow-xl">
               Warning: Identical Hashes Found. Vulnerable to patterns!
             </div>
          )}

        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {(step === 1 || step === 3) && (
            <Button onClick={handleHash} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-8">
              Run SHA-256 Grinder
            </Button>
          )}

          {step === 2 && (
            <Button onClick={handleAddSalt} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 flex items-center gap-2 animate-in zoom-in">
              <Sparkles className="h-4 w-4" />
              Add Unique Salt
            </Button>
          )}
        </div>

      </CardContent>

      {step === 4 && (
        <CardFooter className="bg-green-950/30 border-t border-green-500/30 flex flex-col items-stretch p-6 animate-in fade-in zoom-in duration-500">
           <div className="flex items-center gap-3 text-green-400 mb-4">
              <CheckCircle2 className="h-8 w-8 shrink-0" />
              <div>
                <h4 className="font-bold">Hashes Secured</h4>
                <p className="text-sm opacity-90">Salting ensures that even identical passwords look completely different in the database, defeating Rainbow Tables.</p>
              </div>
           </div>
           <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6">
             Upload to Server & Continue
           </Button>
        </CardFooter>
      )}

    </Card>
  );
}
