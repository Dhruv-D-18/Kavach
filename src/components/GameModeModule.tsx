"use client";

import { useState } from "react";
import { GameMap } from "@/components/GameMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Lock, Trophy, BarChart3 } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface GameModeModuleProps {
  onExit: () => void;
}

export function GameModeModule({ onExit }: GameModeModuleProps) {
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 4, y: 4 });

  // Check if player is near a station
  const isNearStation = (stationX: number, stationY: number) => {
    return Math.abs(playerPos.x - stationX) <= 1 && Math.abs(playerPos.y - stationY) <= 1;
  };

  const handlePositionChange = (pos: Position) => {
    setPlayerPos(pos);
    
    // Auto-open nearby stations
    if (isNearStation(1, 1) && !activeStation) {
      setActiveStation('theory');
    } else if (isNearStation(6, 1) && !activeStation) {
      setActiveStation('password');
    } else if (isNearStation(1, 6) && !activeStation) {
      setActiveStation('rewards');
    } else if (isNearStation(6, 6) && !activeStation) {
      setActiveStation('stats');
    }
  };

  const renderActiveStation = () => {
    switch (activeStation) {
      case 'theory':
        return (
          <Card className="max-w-2xl bg-slate-900/95 border-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-300">Theory Station</h3>
                </div>
                <Button onClick={() => setActiveStation(null)} size="icon" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-slate-300 mb-4">
                Learn about password security concepts, attack methods, and best practices.
              </p>
              <Button 
                onClick={() => {/* Navigate to theory page */}}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Open Theory Module
              </Button>
            </CardContent>
          </Card>
        );

      case 'password':
        return (
          <Card className="max-w-2xl bg-slate-900/95 border-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-300">Password Terminal</h3>
                </div>
                <Button onClick={() => setActiveStation(null)} size="icon" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-slate-300 mb-4">
                Test your skills by creating strong passwords. Aegis will guide you!
              </p>
              <Button 
                onClick={() => {/* Navigate to password challenge */}}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                Start Password Challenge
              </Button>
            </CardContent>
          </Card>
        );

      case 'rewards':
        return (
          <Card className="max-w-2xl bg-slate-900/95 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-300">Rewards Center</h3>
                </div>
                <Button onClick={() => setActiveStation(null)} size="icon" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-slate-300 mb-4">
                View your earned badges, XP, and achievements.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Badge className="bg-yellow-600">🥇 Gold Hacker</Badge>
                <Badge className="bg-blue-600">🔐 Password Master</Badge>
                <Badge className="bg-purple-600">⭐ Quick Learner</Badge>
              </div>
            </CardContent>
          </Card>
        );

      case 'stats':
        return (
          <Card className="max-w-2xl bg-slate-900/95 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-yellow-300">Stats Dashboard</h3>
                </div>
                <Button onClick={() => setActiveStation(null)} size="icon" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="text-yellow-400 font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span>XP:</span>
                  <span className="text-cyan-400 font-bold">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span>Modules Completed:</span>
                  <span className="text-green-400 font-bold">3/8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Kavach Academy - Training Grounds
          </h2>
          <Button onClick={onExit} variant="outline" className="border-slate-600">
            Exit to Menu
          </Button>
        </div>

        {/* Game Map */}
        <div className="relative">
          <GameMap onPositionChange={handlePositionChange}>
            {/* Station interaction overlays */}
            {renderActiveStation()}
          </GameMap>
        </div>

        {/* Mini-map or additional UI can go here */}
      </div>
    </div>
  );
}
