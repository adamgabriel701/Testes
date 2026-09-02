'use client';
import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/data/site';

export default function ThemeAndEffects() {
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');

  // Máquina de Escrever
  useEffect(() => {
    let gIdx = 0, cIdx = 0, deleting = false;
    const interval = setInterval(() => {
      const current = SITE_CONFIG.hero.greetings[gIdx];
      if (deleting) {
        cIdx--;
        setTypedText(current.slice(0, cIdx));
        if (cIdx === 0) { deleting = false; gIdx = (gIdx + 1) % SITE_CONFIG.hero.greetings.length; }
      } else {
        cIdx++;
        setTypedText(current.slice(0, cIdx));
        if (cIdx === current.length) deleting = true;
      }
    }, deleting ? 35 : 120);

    return () => clearInterval(interval);
  }, []);

  // Scroll Effects
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowTop(scrollTop > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Theme Toggle
  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('devlog-theme', t);
  };

  useEffect(() => {
    const saved = localStorage.getItem('devlog-theme');
    if (saved) changeTheme(saved);
  }, []);

  return (
    <>
      <div className="progress-bar" id="progressBar" style={{ width: `${progress}%` }}></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#hero" className="font-mono font-bold text-lg flex items-center">
            <span className="accent">/</span>dev<span className="muted">/</span>log<span className="logo-cursor"></span>
          </a>
          <div className="hidden md:flex items-center gap-9 font-mono text-sm">
            {SITE_CONFIG.nav.map(item => (
              <a key={item.url} href={item.url} className="hover-link">{item.label}</a>
            ))}
          </div>
          <div className="theme-toggle">
            <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => changeTheme('dark')}><i className="fas fa-moon"></i></button>
            <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => changeTheme('light')}><i className="fas fa-sun"></i></button>
            <button className={`theme-btn ${theme === 'cyber' ? 'active' : ''}`} onClick={() => changeTheme('cyber')}><i className="fas fa-terminal"></i></button>
          </div>
        </nav>
      </header>

      {/* Hero Section integrado aqui para usar o useState da máquina de escrever */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-grid pt-24 pb-20" id="hero">
        <div className="float-dot" style={{ width: '500px', height: '500px', top: '5%', left: '-150px' }}></div>
        <div className="float-dot secondary" style={{ width: '600px', height: '600px', bottom: '-200px', right: '-200px', animationDelay: '-5s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 w-full z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-8 font-mono text-xs flex-wrap muted">
              <span className="tag">Edição 042</span><span>·</span>
              <span>{new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}</span><span>·</span>
              <span className="flex items-center gap-2"><span className="stat-dot"></span> online</span>
            </div>
            <h1 className="font-mono font-bold mb-8 hero-title">
              <span className="muted">$</span> <span className="cursor">{typedText}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-5 subtitle">{SITE_CONFIG.hero.subtitle}</p>
            <p className="text-base md:text-lg mb-12 max-w-2xl muted">{SITE_CONFIG.hero.description}</p>
            <div className="flex flex-wrap gap-4 mb-20">
              <a href="#notes" className="btn-primary">ler últimas <i className="fas fa-arrow-right text-xs"></i></a>
              <a href="#terminal" className="btn-secondary"><i className="fas fa-terminal text-xs"></i> abrir terminal</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
              {SITE_CONFIG.stats.map(stat => (
                <div key={stat.label}>
                  <div className="font-mono font-bold text-3xl md:text-4xl accent">{stat.value}</div>
                  <div className="font-mono text-xs uppercase tracking-widest mt-2 muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 w-full max-w-xl" id="terminal">
            <TerminalClient />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-5 border-y marquee-wrap">
        <div className="marquee font-mono text-sm uppercase tracking-widest muted">
          {SITE_CONFIG.setup.map(t => <span key={t.name}>{t.name}</span>).reduce((acc: any[], el) => acc.concat([el, <span key={`s-${el}`}>·</span>]), [])}
        </div>
      </div>

      {/* Search bar geek */}
      <div className="hidden"> {/* Colocado aqui escondido apenas para manter a lógica centralizada, o input real vai na page.tsx */}
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="back-to-top show">
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}

// Importação dinâmica do terminal para evitar erros de Server Component
import TerminalClient from './Terminal';
