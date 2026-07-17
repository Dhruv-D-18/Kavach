"use client";

import { useState } from 'react';

export function DialogueSystem() {
  const [activeMessage] = useState<string | null>(null);

  return (
    <div>
      {activeMessage && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
              CY
            </div>
            <div>
              <p className="font-bold mb-1">Cypher:</p>
              <p>{activeMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
