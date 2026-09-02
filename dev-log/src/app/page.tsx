import ThemeAndEffects from '@/components/ThemeAndEffects';
import { getAllPosts } from '@/lib/posts';
import { SNIPPETS, SITE_CONFIG } from '@/data/site';

export default async function Home() {
  const posts = getAllPosts();

  return (
    <main>
      {/* Renderiza Header, Hero, Terminal, Themes e Marquee */}
      <ThemeAndEffects />

      {/* Notícias Recentes */}
      <section className="py-24 md:py-32 px-6" id="notes">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest mb-4 accent">// namespace Categories</div>
              <h2 className="text-5xl md:text-7xl section-title">Últimas <span>publicações</span></h2>
            </div>
            {/* Busca Geek */}
            <div className="font-mono text-sm text-(--muted)">
              <span className="text-(--accent-2)">const</span> result = <span className="accent">search</span>(query) =&gt; {'{'} 
              <input type="text" placeholder="buscar..." className="bg-transparent border-b border-(--muted) outline-none focus:border-(--accent) ml-2 text-foreground" />
              {'}'}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="article-card">
                <div className="flex items-start justify-between mb-6">
                  <div className="card-num">{post.id}</div>
                  <span className="tag">{post.tags?.[0]}</span>
                </div>
                <div className="font-mono text-xs mb-4 muted">{post.date} — {post.readTime}</div>
                <h3 className="font-bold text-2xl mb-4 leading-tight">{post.title}</h3>
                <p className="text-sm mb-8 muted">{post.excerpt}</p>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest accent">
                  <span>ler artigo</span><span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Snippets */}
      <section className="py-24 md:py-32 px-6" id="snippets" style={{ background: 'var(--bg-elev)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-widest mb-4 accent">// trechos de código</div>
            <h2 className="text-5xl md:text-7xl section-title">Snippets <span>úteis</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {SNIPPETS.map((snippet, index) => (
              <div key={index} className="bg-(--bg-elev-2) border border-(--border-strong) rounded-lg overflow-hidden">
                <div className="bg-[rgba(255,255,255,0.03)] border-b border-(--border) p-4 flex justify-between items-center">
                  <span className="font-mono text-xs muted">{snippet.title}</span>
                  <button className="text-xs border border-(--border-strong) text-(--muted) px-2 py-1 rounded">copiar</button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono"><code>{snippet.code}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="py-24 md:py-32 px-6" id="setup">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-widest mb-4 accent">// ferramentas</div>
            <h2 className="text-5xl md:text-7xl section-title">Meu <span>setup</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SITE_CONFIG.setup.map(tool => (
              <div key={tool.name} className="setup-item">
                <i className={tool.icon}></i>
                <div className="font-mono text-sm">{tool.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-mono text-sm muted">while(alive) {'{'} code(); {'}'} — © {new Date().getFullYear()} {SITE_CONFIG.author}</div>
          <div className="flex items-center gap-5">
            {SITE_CONFIG.socials.map(s => (
              <a key={s.url} href={s.url} className="hover-link text-lg"><i className={s.icon}></i></a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}