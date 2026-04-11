"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EntropyMinigame } from "./minigames/EntropyMinigame";
import { SocialEngineeringMinigame } from "./minigames/SocialEngineeringMinigame";
import { HashingMinigame } from "./minigames/HashingMinigame";
import { InfoCheckpoint } from "./minigames/InfoCheckpoint";
import { TerminalVault } from "./minigames/TerminalVault";

interface Position {
  x: number;
  y: number;
}

interface SideScrollerProps {
  onReachVault?: () => void;
  onComplete?: () => void;
  onCheckpoint?: (id: string) => void;
  onDialogue?: (id: string) => void;
  isBlocked?: boolean;
}

const CHECKPOINTS = [
  {
    id: "entropy-intro",
    title: "🎲 What is Entropy?",
    type: "info",
    x: 180,
    color: "from-blue-600 to-cyan-500",
    shadow: "shadow-cyan-500/50",
    msg: "Entropy = how unpredictable a password is.\nMore length and more character types (letters/numbers/symbols) create far more combinations.\nGuessing becomes impractical when combinations explode.\n---\nNext you will open the Entropy Shield.\nYou will tune two sliders: character pool and length.\nGoal: make “Rough time to crack” reach about 100+ years."
  },
  { id: "entropy", title: "🎲 Entropy Shield", type: "minigame", x: 350, color: "from-green-600 to-emerald-500", shadow: "shadow-green-500/50" },
  { id: "warnings", title: "⚠️ Weak Passwords", type: "info", x: 550, color: "from-yellow-600 to-orange-500", shadow: "shadow-yellow-500/50", msg: "Weak passwords are short or predictable.\nAttackers can guess them quickly using automated tools.\n---\nNext, you will see how public profile clues get reused in passwords.\nIn real life, avoid names, pet names, birthdays, and years in passwords." },
  { id: "social", title: "🎣 Social Eng Trap", type: "minigame", x: 750, color: "from-purple-600 to-pink-500", shadow: "shadow-purple-500/50" },
  { id: "shield", title: "🛡️ 2FA Shield", type: "info", x: 950, color: "from-indigo-600 to-blue-500", shadow: "shadow-blue-500/50", msg: "Two‑factor authentication (2FA) adds a second step to login.\nIt is your password plus a code from an app, SMS, or a security key.\n---\nIf someone steals your password, 2FA can still stop them.\nTurn on 2FA for important accounts whenever possible." },
  { id: "hashing", title: "⚙️ Hashing Factory", type: "minigame", x: 1100, color: "from-pink-600 to-rose-500", shadow: "shadow-rose-500/50" },
];

export function SideScrollerLevel({ onReachVault, onComplete, onCheckpoint, onDialogue, isBlocked }: SideScrollerProps) {
  const [characterPos, setCharacterPos] = useState<Position>({ x: 50, y: 400 });
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState(false);
  const [cameraX, setCameraX] = useState(0);
  const [hasReachedVault, setHasReachedVault] = useState(false);
  const [triggeredCheckpoints, setTriggeredCheckpoints] = useState<Set<string>>(new Set());
  const [activeMinigame, setActiveMinigame] = useState<string | null>(null);

  // Dialogue triggers are now handled by the parent HUD.
  useEffect(() => {
    // Component cleanup
  }, []);

  // Level dimensions
  const levelWidth = 1450; 
  const characterSpeed = 8;
  const vaultPosition = { x: 1300, y: 350 };

  const moveCharacter = useCallback((dx: number) => {
    if (isBlocked || activeMinigame) return;

    setCharacterPos(prev => {
      const newX = Math.max(0, Math.min(levelWidth - 50, prev.x + dx));
      const newDirection = dx > 0 ? 'right' : 'left';

      setDirection(newDirection);

      if (dx !== 0) {
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 150);
      }

      // Check for checkpoints crossed (only trigger going right)
      if (dx > 0) {
        // Warning trigger (before reaching)
        const upcomingCheckpoint = CHECKPOINTS.find(cp =>
          !triggeredCheckpoints.has(cp.id) && 
          newX > cp.x - 100 && 
          newX < cp.x
        );
        if (upcomingCheckpoint) {
             // We can use a ref to prevent spamming audio
             // I will leave this for now or just play on interaction
        }

        const passedCheckpoint = CHECKPOINTS.find(cp =>
          prev.x < cp.x && newX >= cp.x && !triggeredCheckpoints.has(cp.id)
        );

        if (passedCheckpoint) {
          onDialogue?.(passedCheckpoint.id);
          setTriggeredCheckpoints(prevSet => new Set(prevSet).add(passedCheckpoint.id));
          onCheckpoint?.(passedCheckpoint.id);
          
          setActiveMinigame(passedCheckpoint.id);
          setIsMoving(false);
          // Block them slightly before the checkpoint until they solve/acknowledge it
          return { x: passedCheckpoint.x - 5, y: prev.y };
        }
      }

      return { x: newX, y: prev.y };
    });
  }, [isBlocked, activeMinigame, onCheckpoint, triggeredCheckpoints]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If a minigame is active, do not intercept keys so the user can type normally
      if (activeMinigame) return;

      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveCharacter(-characterSpeed);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveCharacter(characterSpeed);
          break;
        case 'Enter':
        case ' ':
          // Interact with vault when nearby
          if (!activeMinigame && Math.abs(characterPos.x - vaultPosition.x) < 100 && !hasReachedVault) {
            setHasReachedVault(true);
            setActiveMinigame("vault_terminal");
            onComplete?.(); // Trigger Cypher's vault intro
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveCharacter, characterPos.x, activeMinigame, hasReachedVault, onReachVault, vaultPosition.x]);

  // Update camera to follow character
  useEffect(() => {
    const targetCameraX = Math.max(0, characterPos.x - 400);
    setCameraX(targetCameraX);
  }, [characterPos.x]);

  const handleMinigameComplete = () => {
    setActiveMinigame(null);
  };

  const activeCpObj = CHECKPOINTS.find(cp => cp.id === activeMinigame);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 overflow-hidden rounded-lg border-2 border-cyan-500/30">
      {/* Parallax Background Layers */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ transform: `translateX(${-cameraX * 0.2}px)` }}
      >
        <div className="absolute bottom-0 left-0 h-64 bg-gradient-to-t from-purple-900/20 to-transparent" style={{ width: levelWidth }} />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-32 bg-purple-800/30"
            style={{ left: i * 250, width: 80 + (i % 3) * 40, height: 100 + (i % 4) * 50 }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{ transform: `translateX(${-cameraX * 0.5}px)` }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={`mid-${i}`}
            className="absolute bottom-20 bg-blue-700/20 rounded-full"
            style={{ left: i * 180, width: 60, height: 60 }}
          />
        ))}
      </div>

      {/* Game World (moves with camera) */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${-cameraX}px)` }}
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 h-[150px] bg-gradient-to-t from-slate-800 to-slate-700 border-t-4 border-cyan-500/50"
          style={{ width: levelWidth }}>
          <div className="w-full h-full opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(6,182,212,0.3) 48px, rgba(6,182,212,0.3) 50px)' }}
          />
        </div>

        {/* Checkpoint Obstacles */}
        {CHECKPOINTS.map((cp) => (
           <div 
             key={cp.id}
             className={`absolute bg-gradient-to-t ${cp.color} rounded-lg shadow-lg ${cp.shadow} flex items-center justify-center p-2 text-center text-xs text-white font-bold transition-all duration-500 ${triggeredCheckpoints.has(cp.id) && activeMinigame !== cp.id ? 'opacity-30 scale-90 -translate-y-4' : 'opacity-100'}`}
             style={{ left: cp.x + 30, bottom: 150, width: 140, height: 40 }}
           >
             {cp.title}
           </div>
        ))}

        {/* The Vault (Goal) */}
        <div
          className={`absolute transition-all duration-500 ${Math.abs(characterPos.x - vaultPosition.x) < 100 ? 'scale-110' : ''}`}
          style={{ left: vaultPosition.x, bottom: 150 }}
        >
          <div className="relative">
            <div className="w-32 h-40 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-full border-4 border-cyan-500 shadow-2xl shadow-cyan-500/50 flex items-center justify-center">
              <div className="w-24 h-32 bg-slate-900 rounded-t-full border-2 border-cyan-400/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏦</div>
                  <div className="text-xs text-cyan-400 font-bold">THE VAULT</div>
                </div>
              </div>
            </div>
            {Math.abs(characterPos.x - vaultPosition.x) < 100 && (
              <div className="absolute inset-0 bg-cyan-500/30 rounded-t-full blur-xl animate-pulse pointer-events-none" />
            )}
          </div>
        </div>

        {/* Character */}
        <div
          className={`absolute transition-all duration-150 ease-out z-10 ${isMoving ? 'scale-110' : 'scale-100'}`}
          style={{ left: characterPos.x, top: characterPos.y, width: 50, height: 50, transform: `scaleX(${direction === 'left' ? -1 : 1})` }}
        >
          <div className="relative pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white">YOU</span>
              </div>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-40">
        <div /> 
        {/* Instructions */}
        {!activeMinigame && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
            <div className="text-xs text-cyan-300 space-y-1">
              <div><kbd className="px-2 py-1 bg-slate-800 rounded mr-1">←→</kbd> Move</div>
              <div><kbd className="px-2 py-1 bg-slate-800 rounded mr-1">ENTER</kbd> Target</div>
            </div>
          </div>
        )}
      </div>

      {/* Vault Interaction Prompt */}
      {Math.abs(characterPos.x - vaultPosition.x) < 100 && !activeMinigame && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-cyan-500 animate-pulse z-40">
          <div className="text-lg text-cyan-300 font-bold">
            Press <kbd className="px-3 py-1 bg-cyan-600 rounded mx-2">ENTER</kbd> to Initiate Hack
          </div>
        </div>
      )}

      {/* Modal Overlay for Active Minigame or Info Checkpoint */}
      {activeMinigame && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full w-full flex items-center justify-center p-4 py-10">
          
          {/* Info Types */}
          {activeCpObj?.type === "info" && (
            <InfoCheckpoint 
              title={activeCpObj.title} 
              message={activeCpObj.msg!} 
              onComplete={handleMinigameComplete} 
            />
          )}

          {/* Minigame Types */}
          {activeMinigame === "entropy" && <EntropyMinigame onComplete={handleMinigameComplete} onDialogue={onDialogue} />}
          {activeMinigame === "social" && <SocialEngineeringMinigame onComplete={handleMinigameComplete} onDialogue={onDialogue} />}
          {activeMinigame === "hashing" && <HashingMinigame onComplete={handleMinigameComplete} onDialogue={onDialogue} />}
          
          {/* Terminal Vault Ending Sequence */}
          {activeMinigame === "vault_terminal" && (
            <TerminalVault onComplete={() => { handleMinigameComplete(); onReachVault?.(); onComplete?.(); }} onDialogue={onDialogue} />
          )}

          </div>
        </div>
      )}
    </div>
  );
}