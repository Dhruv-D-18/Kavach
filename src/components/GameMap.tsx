"use client";

import { useState, useEffect, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface GameMapProps {
  children?: React.ReactNode;
  onPositionChange?: (pos: Position) => void;
  gridSize?: number;
}

export function GameMap({ children, onPositionChange, gridSize = 50 }: GameMapProps) {
  const [characterPos, setCharacterPos] = useState<Position>({ x: 4, y: 4 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);

  // Map boundaries (8x8 grid)
  const mapWidth = 8;
  const mapHeight = 8;

  const moveCharacter = useCallback((dx: number, dy: number, newDirection: 'up' | 'down' | 'left' | 'right') => {
    setCharacterPos(prev => {
      const newX = Math.max(0, Math.min(mapWidth - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(mapHeight - 1, prev.y + dy));
      
      if (onPositionChange && (newX !== prev.x || newY !== prev.y)) {
        onPositionChange({ x: newX, y: newY });
      }
      
      return { x: newX, y: newY };
    });
    
    setDirection(newDirection);
    setIsMoving(true);
    setTimeout(() => setIsMoving(false), 200);
  }, [onPositionChange]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveCharacter(0, -1, 'up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveCharacter(0, 1, 'down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveCharacter(-1, 0, 'left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveCharacter(1, 0, 'right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveCharacter]);

  // Render grid tiles
  const renderGrid = () => {
    const tiles = [];
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const isWalkable = true; // Can add walls/obstacles later
        tiles.push(
          <div
            key={`${x}-${y}`}
            className={`absolute border border-slate-700/30 ${
              isWalkable ? 'bg-slate-800/20' : 'bg-slate-900/60'
            }`}
            style={{
              left: x * gridSize,
              top: y * gridSize,
              width: gridSize,
              height: gridSize,
            }}
          />
        );
      }
    }
    return tiles;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-slate-950 to-blue-950 rounded-lg overflow-hidden border-2 border-cyan-500/30">
      {/* Grid Background */}
      <div className="absolute inset-0">
        {renderGrid()}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 text-xs text-cyan-500/50 font-mono">
        SECURE VAULT v2.0
      </div>
      <div className="absolute top-4 right-4 text-xs text-blue-400/50 font-mono">
        [{characterPos.x}, {characterPos.y}]
      </div>

      {/* Interactive Stations */}
      <div 
        className="absolute"
        style={{
          left: 1 * gridSize,
          top: 1 * gridSize,
        }}
      >
        <div className="w-12 h-12 bg-purple-600/30 border-2 border-purple-500 rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-2xl">📚</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-300 whitespace-nowrap">
          Theory Station
        </div>
      </div>

      <div 
        className="absolute"
        style={{
          left: 6 * gridSize,
          top: 1 * gridSize,
        }}
      >
        <div className="w-12 h-12 bg-cyan-600/30 border-2 border-cyan-500 rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-2xl">🔐</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cyan-300 whitespace-nowrap">
          Password Terminal
        </div>
      </div>

      <div 
        className="absolute"
        style={{
          left: 1 * gridSize,
          top: 6 * gridSize,
        }}
      >
        <div className="w-12 h-12 bg-green-600/30 border-2 border-green-500 rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-2xl">🏆</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-300 whitespace-nowrap">
          Rewards Center
        </div>
      </div>

      <div 
        className="absolute"
        style={{
          left: 6 * gridSize,
          top: 6 * gridSize,
        }}
      >
        <div className="w-12 h-12 bg-yellow-600/30 border-2 border-yellow-500 rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-2xl">📊</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-yellow-300 whitespace-nowrap">
          Stats Dashboard
        </div>
      </div>

      {/* Phishing Lab Station */}
      <div 
        className="absolute"
        style={{
          left: 1 * gridSize,
          top: 3 * gridSize,
        }}
      >
        <div className="w-12 h-12 bg-purple-600/30 border-2 border-purple-500 rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-2xl">🎣</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-300 whitespace-nowrap">
          Phishing Lab
        </div>
      </div>

      {/* Player Character */}
      <div
        className={`absolute transition-all duration-200 ease-out z-10 ${
          isMoving ? 'scale-110' : 'scale-100'
        }`}
        style={{
          left: characterPos.x * gridSize + (gridSize - 48) / 2,
          top: characterPos.y * gridSize + (gridSize - 48) / 2,
          width: 48,
          height: 48,
        }}
      >
        {/* Character placeholder - will be replaced with Rive */}
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center ${
          direction === 'up' ? '-rotate-45' : 
          direction === 'down' ? 'rotate-0' :
          direction === 'left' ? '-rotate-90' : 'rotate-90'
        }`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold text-white">YOU</span>
          </div>
        </div>
        
        {/* Direction indicator */}
        <div 
          className="absolute w-2 h-2 bg-cyan-400 rounded-full left-1/2 -translate-x-1/2 -top-1 animate-pulse"
          style={{
            transform: `translate(-50%, -8px) rotate(${
              direction === 'up' ? '0deg' :
              direction === 'right' ? '90deg' :
              direction === 'down' ? '180deg' : '270deg'
            })`
          }}
        />
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
        <div className="flex items-center justify-between text-xs text-cyan-300">
          <div className="flex gap-4">
            <span><kbd className="px-2 py-1 bg-slate-800 rounded">WASD</kbd> or <kbd className="px-2 py-1 bg-slate-800 rounded">Arrows</kbd> to move</span>
            <span>•</span>
            <span>Explore the vault</span>
            <span>•</span>
            <span>Visit stations</span>
          </div>
        </div>
      </div>

      {/* Content overlay for interactions */}
      {children}
    </div>
  );
}
