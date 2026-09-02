'use client';
import { useState } from 'react';

export default function CoffeeButton() {
  const [coffeeCount, setCoffeeCount] = useState(0x400); // 1024 em Hexadecimal

  return (
    <button 
      onClick={() => setCoffeeCount(c => c + 1)}
      className="btn-primary bg-[#f59e0b] text-black p-3 rounded font-mono text-xs mt-4 hover:scale-105 transition-transform"
      title={`Cafés atuais: ${coffeeCount.toString(16)} (Hex)`}
    >
      ☕ Oferecer +1 café (Total: 0x{coffeeCount.toString(16)})
    </button>
  );
}
