"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, CheckCircle2, AlertTriangle, Search } from "lucide-react";

interface SocialEngineeringMinigameProps {
  onComplete: () => void;
}

const PASSWORDS = [
  { id: 1, text: "Buster1985!", isVulnerable: true },
  { id: 2, text: "LakersFanForever", isVulnerable: true },
  { id: 3, text: "xQ9$vLp2", isVulnerable: false },
  { id: 4, text: "Alex_Admin", isVulnerable: true },
  { id: 5, text: "m0nk3y_wreNch!", isVulnerable: false }
];

export function SocialEngineeringMinigame({ onComplete }: SocialEngineeringMinigameProps) {
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  const handleToggleFlag = (id: number) => {
    setFlaggedIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
    setErrorMsg("");
  };

  const handleVerify = () => {
    const vulnerableIds = PASSWORDS.filter(p => p.isVulnerable).map(p => p.id);
    const selectedCorrect = flaggedIds.every(id => vulnerableIds.includes(id));
    const allSelected = vulnerableIds.every(id => flaggedIds.includes(id));

    if (selectedCorrect && allSelected) {
      setErrorMsg("");
      // Handle success in UI
    } else {
      setErrorMsg("Some flagged passwords are safe, or you missed some vulnerable ones. Look closely at the OSINT profile!");
    }
  };

  const isSuccess = PASSWORDS.filter(p => p.isVulnerable).every(p => flaggedIds.includes(p.id)) && 
                    flaggedIds.every(id => PASSWORDS.find(p => p.id === id)?.isVulnerable);

  // We only show success if they clicked verify and it was right, but to keep it simple, it auto updates or relies on Verify button.
  // Let's use the Verify button to show success.
  const [verified, setVerified] = useState(false);

  const confirmVerification = () => {
    if (isSuccess) {
      setVerified(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Re-check your flags. Did you miss any based on the profile?");
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-slate-900 border-purple-500 shadow-2xl shadow-purple-500/20 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* OSINT Profile Sidebar */}
      <div className="bg-slate-800 border-r border-slate-700/50 p-6 md:w-2/5 flex flex-col shrink-0">
        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          OSINT Profile
        </h3>
        
        <div className="text-center mb-6">
           <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-purple-500/30">
              <User className="h-10 w-10 text-slate-400" />
           </div>
           <h4 className="font-bold text-xl">Target: Alex</h4>
           <div className="mt-4 space-y-3 text-sm text-slate-300 text-left bg-black/30 p-3 rounded-lg">
             <p><span className="text-purple-400 font-bold">Post 1:</span> "Happy 10th birthday to my dog Buster! 🐶"</p>
             <p><span className="text-purple-400 font-bold">Bio:</span> Software Admin. Class of 1985. Let's go Lakers! 🏀</p>
           </div>
        </div>
      </div>

      {/* Interactive Section */}
      <div className="p-6 md:w-3/5 flex flex-col">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
            Social Engineering Trap
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            Aegis: "Hackers harvest personal info to build custom password dictionaries. Flag all passwords below that are vulnerable due to personal info."
          </CardDescription>
        </CardHeader>

        <div className="flex-1 space-y-3 mb-6">
          {PASSWORDS.map(pw => (
            <div 
              key={pw.id} 
              onClick={() => !verified && handleToggleFlag(pw.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${
                flaggedIds.includes(pw.id) 
                  ? 'bg-red-950/40 border-red-500 text-red-200' 
                  : 'bg-black/40 border-slate-700 hover:border-slate-500 text-slate-300'
              } ${verified ? 'cursor-default opacity-80' : ''}`}
            >
              <span className="font-mono">{pw.text}</span>
              {flaggedIds.includes(pw.id) && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </div>
          ))}
        </div>

        {errorMsg && <p className="text-red-400 text-sm mb-4 bg-red-950/50 p-2 rounded">{errorMsg}</p>}

        {!verified ? (
          <Button 
            onClick={confirmVerification} 
            className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-auto"
          >
            Verify Flags
          </Button>
        ) : (
          <div className="mt-auto animate-in slide-in-from-bottom-4">
             <div className="bg-green-950/40 border border-green-500/30 p-4 rounded-lg mb-4 text-green-400 flex gap-3">
               <CheckCircle2 className="h-6 w-6 shrink-0" />
               <div className="text-sm">
                 <p className="font-bold">Bot Bypassed</p>
                 <p className="opacity-90">You successfully identified the dictionary flaws. Random passwords without personal info survived.</p>
               </div>
             </div>
             <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
               Continue Mission
             </Button>
          </div>
        )}

      </div>
    </Card>
  );
}
