import Terminal from '@/components/Terminal';
import { getAllPosts } from '@/lib/posts';
import { useState } from 'react';

export default function Home({ posts }: { posts: any[] }) {
  const [coffeeCount, setCoffeeCount] = useState(0x400); // 1024 em Hexadecimal
  
  return (
    <>
      {/* HEADER COM NOMENCLATURA GEEK */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-b border-[rgba(240,234,214,0.08)]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-mono text-sm">
          <a href="/" className="font-bold text-lg"><span className="text-[#f59e0b]">/</span>dev<span className="text-[#8a8275]">/</span>log</a>
          <div className="hidden md:flex gap-9 text-[#c9c1ad]">
            <a href="#notes" className="hover:text-[#f0ead6] transition-colors">noticias</a>
            <a href="#snippets" className="hover:text-[#f0ead6] transition-colors">snippets</a>
            <a href="#archive" className="hover:text-[#f0ead6] transition-colors">arquivo</a>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20 bg-[#0c0b09] bg-grid">
        <div className="max-w-7xl mx-auto px-6 w-full z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 max-w-2xl text-[#f0ead6]">
            <h1 className="font-mono font-bold text-4xl mb-8">
              <span className="text-[#8a8275]">$</span> <span className="text-[#f59e0b]">console.log('bem-vindo.');</span>
            </h1>
            <p className="text-xl mb-5 text-[#f0ead6]">Notas da mesa de um programador.</p>
            
            {/* BOTÃO CAFÉ */}
            <button 
              onClick={() => setCoffeeCount(c => c + 1)}
              className="btn-primary bg-[#f59e0b] text-black p-3 rounded font-mono text-xs mt-4 hover:scale-105 transition-transform"
              title={`Cafés atuais: ${coffeeCount.toString(16)} (Hex)`}
            >
              ☕ Oferecer +1 café (Total: 0x{coffeeCount.toString(16)})
            </button>
          </div>

          {/* TERMINAL */}
          <div className="flex-1 w-full max-w-xl mt-10 lg:mt-0">
            <Terminal />
          </div>
        </div>
      </section>

      {/* NOTÍCIAS RECENTES (NAMESPACE CATEGORIES) */}
      <section className="py-24 px-6 bg-[#0c0b09]" id="notes">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-widest mb-4 text-[#f59e0b]">// namespace Categories</div>
            <h2 className="text-5xl font-bold text-[#f0ead6]">Últimas <span className="italic font-normal">publicações</span></h2>
            {/* Busca Geek */}
            <div className="mt-4 font-mono text-sm text-[#8a8275]">
              <span className="text-[#06b6d4]">const</span> result = <span className="text-[#f59e0b]">search</span>(query) =&gt; {'{'} 
              <input type="text" placeholder="buscar..." className="bg-transparent border-b border-[#8a8275] outline-none focus:border-[#f59e0b] ml-2" />
              {'}'}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="article-card bg-[#15130e] border border-[rgba(240,234,214,0.08)] p-7 rounded hover:border-[#f59e0b] transition-all block">
                <div className="text-[#f59e0b] opacity-20 text-5xl font-mono font-bold mb-4">{post.id}</div>
                <div className="font-mono text-xs mb-4 text-[#8a8275]">{post.date} — {post.readTime}</div>
                <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                <p className="text-sm text-[#8a8275]">{post.excerpt}</p>
                <div className="mt-6 text-[#f59e0b] font-mono text-xs uppercase tracking-widest">ler artigo →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RODAPÉ GEEK */}
      <footer className="py-12 px-6 border-t border-[rgba(240,234,214,0.08)] bg-[#0c0b09]">
        <div className="max-w-7xl mx-auto text-center font-mono text-sm text-[#8a8275]">
          <p>while(alive) {'{'} code(); {'}'} — © {new Date().getFullYear()} Adam Gabriel</p>
          <p className="mt-2 text-xs">Se você está lendo isso no DevTools, deveria estar revisando PRs.</p>
        </div>
      </footer>
    </>
  );
}

// Lê os posts no server-side
export async function getStaticProps() {
  const posts = getAllPosts();
  return {
    props: {
      posts,
    },
  };
}