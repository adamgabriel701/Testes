/**
 * Uso: node fetcher.js <url-do-rss> <nome-da-pasta>
 * Exemplo: node fetcher.js https://blog.exemplo.com/feed nome-do-blog
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const folderName = process.argv[3] || 'imported';
const dirPath = path.join(__dirname, 'content', folderName);

if (!url) {
  console.log('Use: node fetcher.js <URL_DO_RSS> <NOME_DA_PASTA>');
  process.exit(1);
}

// Baixar o XML do feed
function fetch(urlStr) {
  return new Promise((resolve, reject) => {
    const client = urlStr.startsWith('https') ? https : http;
    client.get(urlStr, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parser de XML simples (sem depender de libs externas)
function parseXml(xml) {
  const items = [];
  const regex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = regex.exec(xml)) !== null) {
    const item = match[1];
    const getTag = (tag) => {
      const m = item.match(new RegExp(`<${tag}><![CDATA[([\\s\\S]*?)]]><\\/${tag}>`)) ||
                item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };

    // Limpar HTML do conteúdo para Markdown básico
    let content = getTag('content:encoded') || getTag('description');
    content = content
      .replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, '\n## $1\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n> $1\n')
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n')
      .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]+>/g, '') // Remove tags restantes
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n'); // Max 2 quebras de linha

    items.push({
      title: getTag('title'),
      author: getTag('dc:creator') || getTag('author') || 'Desconhecido',
      link: getTag('link'),
      content: content.trim(),
    });
  }
  return items;
}

async function main() {
  console.log(`📡 Buscando feed: ${url}...`);
  const xml = await fetch(url);
  const items = parseXml(xml);
  
  if (items.length === 0) {
    console.log('❌ Nenhum artigo encontrado. O URL é um feed RSS válido?');
    return;
  }

  console.log(`✅ Encontrados ${items.length} artigos. Criando estrutura...`);
  fs.mkdirSync(dirPath, { recursive: true });

  // Cria um único conteúdo com todos os artigos
  let mdContent = '';
  items.forEach((item, i) => {
    mdContent += `---\n\n## ${item.title}\n\n`;
    mdContent += item.content + '\n\n';
  });

  fs.writeFileSync(path.join(dirPath, 'texto.md'), mdContent);

  const meta = {
    type: "reportagem",
    title: folderName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    author: items[0].author,
    atmosphere: "calm",
    chapters: [{ "file": "texto.md", "title": "Artigos Importados" }]
  };

  fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log(`📚 Pronto! Abra o Readium e clique em "${meta.title}".`);
}

main().catch(err => console.error('Erro:', err.message));
