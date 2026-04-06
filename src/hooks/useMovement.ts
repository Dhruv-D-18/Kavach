// src/hooks/useMovement.ts
import { useState, useEffect } from 'react';

export function useMovement(onMove: (newPos: { x: number, y: number }) => void) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = position.x;
      let newY = position.y;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(0, position.y - 1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(7, position.y + 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(0, position.x - 1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(11, position.x + 1);
          break;
        default:
          return;
      }
      
      // Check collision/boundaries
      if (!isCollision(newX, newY)) {
        setPosition({ x: newX, y: newY });
        onMove({ x: newX, y: newY });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);
  
  const isCollision = (x: number, y: number) => {
    // Implement collision logic
    return false; // Placeholder
  };
  
  return position;
}