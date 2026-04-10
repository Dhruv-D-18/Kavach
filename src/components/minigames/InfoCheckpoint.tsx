"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Info } from "lucide-react";

interface InfoCheckpointProps {
  title: string;
  message: string;
  onComplete: () => void;
}

export function InfoCheckpoint({ title, message, onComplete }: InfoCheckpointProps) {
  const pages = useMemo(() => {
    // Use "---" as a page separator inside message text.
    // Each page can contain newlines / bullets which we render as a list.
    const rawPages = message
      .split(/\n\s*---\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean);
    return rawPages.length > 0 ? rawPages : [message];
  }, [message]);

  const [page, setPage] = useState(0);
  const isLast = page >= pages.length - 1;

  const lines = useMemo(() => {
    return pages[page]
      .split(/\n+|•\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [page, pages]);

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
        <div className="bg-cyan-950/30 p-5 rounded-lg border border-cyan-500/30 text-base leading-relaxed text-cyan-50">
          <ul className="list-disc pl-5 space-y-2">
            {lines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter>
        {!isLast ? (
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 flex items-center gap-2"
          >
            Acknowledge &amp; Continue
            <CheckCircle2 className="h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
