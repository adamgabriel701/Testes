/**
 * Uso: node scraper.js <URL> <seletor-do-texto> <nome-da-pasta>
 * 
 * Para encontrar o seletor:
 * 1. Abra o site no Chrome
 * 2. Clique com o botão direito no texto principal
 * 3. "Inspecionar"
 * 4. Clique com o botão direito na tag HTML que engloba o texto
 * 5. Copiar > Copy selector
 * 
 * Exemplo: node scraper.js https://site.com/artigo "article p" meu-artigo
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const selector = process.argv[3] || 'article';
const folderName = process.argv[4] || 'scraped';

if (!url) {
  console.log('Use: node scraper.js <URL> <SELETOR_CSS> <NOME_DA_PASTA>');
  process.exit(1);
}

function fetchPage(urlStr) {
  return new Promise((resolve, reject) => {
    const client = urlStr.startsWith('https') ? https : http;
    client.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      // Segue redirecionamentos (301, 302, etc)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function htmlToMarkdown(html) {
  // Remove scripts e styles
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<sup[\s\S]*?<\/sup>/gi, ''); // Remove notas de rodapé da Wikipedia
  
  // Extrai e formata blocos
  html = html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  html = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  html = html.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  html = html.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  html = html.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  html = html.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  html = html.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');
  html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  html = html.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n');
  html = html.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n');
  html = html.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  html = html.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove todas as tags HTML restantes
  html = html.replace(/<[^>]+>/g, '');
  
  // Limpa entidades HTML
  html = html.replace(/&nbsp;/g, ' ');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');
  html = html.replace(/&#\d+;/g, ''); // Remove caracteres numéricos estranhos
  
  // Limpa espaços e quebras de linha excessivas
  html = html.replace(/[ \t]+/g, ' ');
  html = html.replace(/\n{3,}/g, '\n\n');
  
  return html.trim();
}

// Parser de seletor CSS brutalmente simples (sem dependências)
function extractBySelector(fullHtml, sel) {
  // Verifica se é um ID (#id)
  if (sel.startsWith('#')) {
    const id = sel.substring(1).split(' ')[0]; // Pega só o ID, ignora o resto por enquanto
    const idRegex = new RegExp('[\\s\\S]*?id=["\']' + id + '["\'][^>]*>([\\s\\S]*?)<\\/div>', 'i');
    const match = fullHtml.match(idRegex);
    if (match) return htmlToMarkdown(match[1]);
  }
  
  // Verifica se é uma classe (.classe)
  if (sel.startsWith('.')) {
    const cls = sel.substring(1).split(' ')[0];
    // Procura por divs, articles, sections, mains com essa classe
    const tags = ['div', 'article', 'section', 'main'];
    for (const tag of tags) {
      const classPattern = cls.replace(/\./g, '\\.'); // Escapa pontos extras se houver
      const tagRegex = new RegExp('<' + tag + '[^>]*class=["\'][^"\']*' + classPattern + '[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
      const match = fullHtml.match(tagRegex);
      if (match && match[1].length > 200) return htmlToMarkdown(match[1]);
    }
  }

  // Fallback: Extrai todas as tags <p> do seletor pai (ex: "#mw-content-text p")
  const parts = sel.split(' ');
  if (parts.length > 1) {
    const parentSel = parts[0];
    let parentHtml = fullHtml;
    
    // Tenta isolar o pai
    if (parentSel.startsWith('#')) {
      const id = parentSel.substring(1);
      const idRegex = new RegExp('[\\s\\S]*?id=["\']' + id + '["\'][^>]*>([\\s\\S]*?)<\\/(div|article|section|main)>', 'i');
      const m = fullHtml.match(idRegex);
      if (m) parentHtml = m[1];
    } else if (parentSel.startsWith('.')) {
      const cls = parentSel.substring(1);
      const tags = ['div', 'article', 'section', 'main'];
      for (const tag of tags) {
        const tagRegex = new RegExp('<' + tag + '[^>]*class=["\'][^"\']*' + cls + '[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
        const m = fullHtml.match(tagRegex);
        if (m && m[1].length > 200) { parentHtml = m[1]; break; }
      }
    }

    // Puxa as tags filhas (ex: 'p', 'h2')
    const childTag = parts[parts.length - 1];
    const childRegex = new RegExp('<' + childTag + '[^>]*>([\\s\\S]*?)<\\/' + childTag + '>', 'gi');
    let match;
    let texts = [];
    while ((match = childRegex.exec(parentHtml)) !== null) {
      const cleanText = htmlToMarkdown(match[1]).trim();
      if (cleanText.length > 30) { // Ignora parágrafos muito curtos (menus, botões)
        texts.push(cleanText);
      }
    }
    return texts.join('\n\n');
  }

  // Fallback final: tenta encontrar a tag diretamente
  return htmlToMarkdown(fullHtml);
}

// Tenta extrair o título da <title>
function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : 'Conteúdo Importado';
}

async function main() {
  console.log('📡 Buscando: ' + url + '...');
  const html = await fetchPage(url);
  
  console.log('🔍 Extraindo conteúdo com seletor: "' + selector + '"...');
  const mdContent = extractBySelector(html, selector);
  const title = extractTitle(html);
  
  if (mdContent.trim().length < 100) {
    console.log('❌ Muito pouco texto extraído (' + mdContent.trim().length + ' caracteres).');
    console.log('Dica: Tente usar um seletor do pai, como "#mw-content-text" ou ".post-content"');
    return;
  }

  const dirPath = path.join(__dirname, 'content', folderName);
  fs.mkdirSync(dirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'texto.md'), mdContent);
  
  const meta = {
    type: "livro",
    title: title,
    author: "Importado",
    atmosphere: "mist",
    chapters: [{ "file": "texto.md", "title": title }]
  };
  
  fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify(meta, null, 2));
  
  const wordCount = mdContent.split(/\s+/).length;
  console.log('✅ Extraídos ' + wordCount + ' palavras.');
  console.log('📚 Pronto! Abra o Readium (npm start) e clique em "' + title + '".');
}

main().catch(function(err) {
  console.error('Erro:', err.message);
});