'use client';
import { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from '@/data/site';

export default function Terminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    '<span class="success">[ OK ]</span> iniciando retro shell v2.0...',
    '<span class="success">[ OK ]</span> montando <span class="info">/posts</span>',
    '<span class="dim">Digite `ajuda` para ver os comandos.</span>',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, any> = {
    ajuda: () => [
      'Comandos disponíveis:',
      '  <span class="accent">ls</span>          lista arquivos',
      '  <span class="accent">cafe</span>        oferece um café ao autor (+1)',
      '  <span class="accent">setup</span>       exibe ferramentas',
      '  <span class="accent">neofetch</span>    info do sistema',
      '  <span class="accent">limpar</span>      limpa a tela',
    ],
    ls: () => ['<span class="info">posts/</span>    <span class="info">snippets/</span>    LEIA-ME.md'],
    cafe: () => ['<span class="success">☕ Café oferecido! O autor agradece.</span>'],
    setup: () => SITE_CONFIG.setup.map(t => `<span class="info">${t.name}</span> <span class="dim">[${t.icon}]</span>`),
    neofetch: () => [
      `<pre style="color: var(--fg)">   ___          <span class="info">usuario</span>@<span class="info">blog</span>
  /   \\         --------
 |  ◆  |        <span class="accent">OS</span>: /dev/log v2.0
 |     |        <span class="accent">Shell</span>: retro.sh 1.4
  \\___/         <span class="accent">Tema</span>: ${document.documentElement.getAttribute('data-theme')}
   |||</pre>`
    ],
    limpar: () => { setOutput([]); return []; }
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().split(' ')[0];
      const newOutput = [...output, `<span class="success">usuario@blog</span><span class="accent-2">:~</span>$ ${input}`];
      
      if (cmd) {
        const result = commands[cmd] ? commands[cmd]() : [`<span class="error">${cmd}: comando não encontrado</span>`];
        setOutput([...newOutput, ...result]);
      } else {
        setOutput(newOutput);
      }
      setHistory([...history, input]);
      setInput('');
    }
  };

  return (
    <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="flex gap-1.5">
          <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
        </div>
        <span className="font-mono text-xs muted">usuario@blog: ~</span>
      </div>
      <div className="terminal-body">
        <div className="output">
          {output.map((line, i) => (
            <div key={i} className="line" dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </div>
        <div className="prompt-line">
          <span className="prompt">usuario@blog<span className="path">:~</span>$</span>
          <div className="input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="text-foreground"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}