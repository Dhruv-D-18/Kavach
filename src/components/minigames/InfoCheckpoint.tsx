"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Info, CheckCircle } from "lucide-react";

interface InfoCheckpointProps {
  title: string;
  message: string;
  onComplete: () => void;
}

export function InfoCheckpoint({ title, message, onComplete }: InfoCheckpointProps) {
  return (
    <Card className="w-full max-w-lg bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 text-slate-100 animate-in fade-in zoom-in duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
          <Info className="h-6 w-6" />
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400">
          Cypher Intercept - Knowledge Module
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-cyan-950/30 p-6 rounded-lg border border-cyan-500/30 text-lg leading-relaxed text-cyan-50">
          {message}
        </div>
      </CardContent>

      <CardFooter>
         <Button onClick={onComplete} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 flex items-center gap-2">
           <CheckCircle className="h-5 w-5" />
           Acknowledge & Continue
         </Button>
      </CardFooter>
    </Card>
  );
}
