// src/components/DialogueSystem.tsx
import { useState } from 'react';

interface DialogueTrigger {
  levelId: string;
  message: string;
  position: { x: number, y: number };
}

export function DialogueSystem({ triggers }: { triggers: DialogueTrigger[] }) {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  
  const showMessage = (message: string) => {
    setActiveMessage(message);
    setTimeout(() => setActiveMessage(null), 5000);
  };
  
  return (
    <div>
      {activeMessage && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
              A
            </div>
            <div>
              <p className="font-bold mb-1">Aegis:</p>
              <p>{activeMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}