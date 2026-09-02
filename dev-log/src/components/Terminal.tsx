'use client';
import { useState, useEffect, useRef } from 'react';

export default function Terminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    '<span class="text-green-400">[ OK ]</span> iniciando retro shell v2.0...',
    '<span class="text-[#8a8275]">Digite `ajuda` para ver os comandos.</span>',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, any> = {
    ajuda: () => [
      'Comandos disponíveis:',
      '  <span class="text-[#f59e0b]">ls</span>          lista arquivos',
      '  <span class="text-[#f59e0b]">cafe</span>        oferece um café ao autor (+1)',
    ],
    ls: () => ['<span class="text-cyan-400">posts/</span>    <span class="text-cyan-400">snippets/</span>    LEIA-ME.md'],
    cafe: () => ['<span class="text-green-400">☕ Café oferecido! O autor agradece.</span>'],
    limpar: () => { setOutput([]); return []; }
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().split(' ')[0];
      const newOutput = [...output, `usuario@blog:~$ ${input}`];
      
      if (cmd) {
        const result = commands[cmd] ? commands[cmd]() : [`<span class="text-red-500">${cmd}: comando não encontrado</span>`];
        newOutput.push(...result);
      }
      setOutput(newOutput);
      setHistory([...history, input]);
      setInput('');
    }
  };

  return (
    <div className="terminal-window bg-[#14120e] border border-[rgba(240,234,214,0.18)] rounded-lg overflow-hidden shadow-2xl" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header bg-[rgba(255,255,255,0.04)] border-b border-[rgba(240,234,214,0.08)] p-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
          <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
        </div>
        <span className="text-xs text-[#8a8275] font-mono">usuario@blog: ~</span>
      </div>
      <div className="terminal-body p-4 h-[380px] overflow-y-auto font-mono text-sm">
        {output.map((line, i) => (
          <div key={i} className="line mb-1" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        <div className="prompt-line flex items-center gap-2 pt-2 border-t border-[rgba(240,234,214,0.08)]">
          <span className="text-green-400 text-shadow-glow">usuario@blog<span className="text-[#06b6d4]">:~</span>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-[#f0ead6] font-mono caret-[#f59e0b]"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
