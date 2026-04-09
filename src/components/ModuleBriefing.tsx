"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Trophy, Target, BookOpen, Play } from "lucide-react";

interface ModuleBriefingProps {
  title: string;
  description: string;
  objectives: string[];
  moduleName: string;
  onAccept: () => void;
}

export function ModuleBriefing({ title, description, objectives, moduleName, onAccept }: ModuleBriefingProps) {
  return (
    <div className="w-full animate-in fade-in zoom-in duration-500">
      <Card className="w-full bg-gradient-to-br from-slate-900 to-blue-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-cyan-500/20 border-2 border-cyan-500 animate-pulse">
              <Shield className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                {moduleName}
              </Badge>
            </div>
          </div>

          {/* Mission Objectives */}
          <div className="space-y-6">
            <div className="bg-blue-950/50 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Mission Overview
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  What You'll Learn
                </h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Mission Rewards
                </h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">⭐</span>
                    Up to 150 XP points
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">⭐</span>
                    Level progression
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">⭐</span>
                    Password security expertise
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">⭐</span>
                    Unlock next module
                  </li>
                </ul>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center justify-center gap-2 text-blue-200 bg-blue-950/30 rounded-lg p-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Estimated time: 15-20 minutes</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={onAccept}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-6 text-lg shadow-lg shadow-cyan-500/50"
              >
                <Play className="w-5 h-5 mr-2" />
                Accept Mission
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="px-8 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Return to Base
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
