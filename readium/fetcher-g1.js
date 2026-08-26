/**
 * Importador dedicado para os feeds RSS do G1/Globo
 * 
 * Uso: node fetcher-g1.js <URL_DO_RSS> <QUANTIDADE_DE_NOTICIAS>
 * 
 * Exemplos:
 *   node fetcher-g1.js https://g1.globo.com/dynamo/rss2.xml 10
 *   node fetcher-g1.js https://g1.globo.com/dynamo/ciencia-e-saude/rss2.xml 5
 *   node fetcher-g1.js https://g1.globo.com/dynamo/tecnologia/rss2.xml 8
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const feedUrl = process.argv[2];
const maxItems = parseInt(process.argv[3]) || 10;

if (!feedUrl) {
  console.log('========================================');
  console.log('IMPORTADOR DE RSS DO G1 PARA READIUM');
  console.log('========================================');
  console.log('');
  console.log('Uso: node fetcher-g1.js <URL_DO_RSS> <QTD_NOTICIAS>');
  console.log('');
  console.log('Feeds disponíveis:');
  console.log('  Todas:      https://g1.globo.com/dynamo/rss2.xml');
  console.log('  Ciência:    https://g1.globo.com/dynamo/ciencia-e-saude/rss2.xml');
  console.log('  Tecnologia: https://g1.globo.com/dynamo/tecnologia/rss2.xml');
  console.log('  Mundo:      https://g1.globo.com/dynamo/mundo/rss2.xml');
  console.log('  Economia:   https://g1.globo.com/dynamo/economia/rss2.xml');
  console.log('');
  process.exit(0);
}

console.log('📡 Conectando ao feed do G1...');

function fetch(urlStr) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ReadiumBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    };
    https.get(urlStr, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parser focado no formato exato do RSS do G1
function parseG1RSS(xml) {
  const items = [];
  
  // Expressão regular para encontrar cada bloco <item>...</item>
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    // Função segura para extrair tags, lidando com CDATA
    const getTag = (tagName) => {
      // Tenta CDATA primeiro
      const cdataRegex = new RegExp('<' + tagName + '><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tagName + '>', 'i');
      let m = itemXml.match(cdataRegex);
      if (m) return m[1].trim();

      // Fallback para texto puro
      const plainRegex = new RegExp('<' + tagName + '>([\\s\\S]*?)<\\/' + tagName + '>', 'i');
      m = itemXml.match(plainRegex);
      return m ? m[1].trim() : '';
    };

    const title = getTag('title');
    const link = getTag('link');
    const description = getTag('description');
    const content = getTag('content:encoded');
    const pubDate = getTag('pubDate');
    const category = getTag('category');

    // Pula se não tiver título ou conteúdo
    if (!title || (!content && !description)) continue;

    items.push({
      title: title,
      link: link,
      content: content || description,
      pubDate: pubDate,
      category: category
    });

    if (items.length >= maxItems) break;
  }

  return items;
}

// Converte o HTML do G1 em Markdown limpo (Versão 2 - Filtro pesado)
function g1HtmlToMarkdown(html) {
  if (!html) return '';
  
  let text = html;

  // === FASE 1: Remoção brutal de elementos do G1 ===
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  
  // Remove divs específicas do G1 que poluem o texto
  const g1Blacklist = [
    'widget', 'related', 'share-', 'breadcrumb', 'header-', 'footer-',
    'newsletter', 'ad-', 'banner', 'propaganda', ' recomendada',
    'mais-lidas', 'mais-vistas', 'veja-mais', 'leia-tambem',
    'saiba-mais', 'outros-modais', 'assistir', 'video-vitrine',
    'whatsapp', 'telegram', 'twitter', 'facebook', 'link',
    'embed-', 'gallery', 'multimedia', 'infografico'
  ];
  g1Blacklist.forEach(term => {
    const regex = new RegExp('<div[^>]*class=["\'][^"\']*' + term + '[^"\']*["\'][^>]*>[\\s\\S]*?<\\/div>', 'gi');
    text = text.replace(regex, '');
  });
  
  // Remove botões e links de "clique aqui", "participe", "siga", "receba"
  text = text.replace(/<a[^>]*class=["'][^"\']*(whatsapp|follow|share|cta|participe|siga|receba|clique)[^"\']*["'][^>]*>[\s\S]*?<\/a>/gi, '');
  text = text.replace(/<p[^>]*>[\s\S]*?(whatsapp|participe do canal|siga o canal|receba as not|clique aqui)[\s\S]*?<\/p>/gi, '');
  
  // Remove legendas de fotos soltas (geralmente são ruído entre parágrafos)
  text = text.replace(/<p[^>]*class=["'][^"\']*foto-legenda[^"\']*["'][^>]*>[\s\S]*?<\/p>/gi, '');
  text = text.replace(/<p[^>]*class=["'][^"\']*media-caption[^"\']*["'][^>]*>[\s\S]*?<\/p>/gi, '');
  text = text.replace(/<p[^>]*class=["'][^"\']*subtitle[^"\']*["'][^>]*>[\s\S]*?<\/p>/gi, '');
  
  // Remove parágrafos que são apenas links "VEJA TAMBÉM" ou "VÍDEOS"
  text = text.replace(/<p[^>]*>[\s\S]*?(VEJA TAMBÉM|VÍDEOS:|Leia mais notícias|Veja mais notícias|Veja vídeos|Veja o plantão|Saiba como fazer)[\s\S]*?<\/p>/gi, '');
  text = text.replace(/<p[^>]*>[\s\S]*?(Agora no g1)[\s\S]*?<\/p>/gi, '');
  
  // Remove iframes (videos embedados que viram texto feio)
  text = text.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  
  // Remove aside inteiras
  text = text.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  
  // Remove figcaption
  text = text.replace(/<figcaption[\s\S]*?<\/figcaption>/gi, '');

  // === FASE 2: Formatação ===
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n\n');
  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  
  // Imagens
  text = text.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n');
  text = text.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n');
  
  // Remove todas as tags HTML restantes
  text = text.replace(/<[^>]+>/g, '');
  
  // === FASE 3: Limpeza de texto ===
  // Entidades HTML
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#8211;/g, '—');
  text = text.replace(/&#8212;/g, '—');
  text = text.replace(/&#8220;/g, '"');
  text = text.replace(/&#8221;/g, '"');
  text = text.replace(/&#8216;/g, "'");  
  text = text.replace(/&#8217;/g, "'");
  text = text.replace(/&ldquo;/g, '"');
  text = text.replace(/&rdquo;/g, '"');
  text = text.replace(/&rsquo;/g, "'");
  
  // Espaçamento
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remove linhas que sobraram vazias ou com lixo textual comum do G1
  const linhas = text.split('\n');
  const lixeiraG1 = [
    /^\s*$/,  // Vazia
    /^\s*Reprodução\/.*$/i,
    /^\s*Divulgação$/i,
    /^\s*Prefeitura de.*$/i,
    /^\s*Polícia Militar\/Divulgação$/i,
    /^\s*g1$/i,
  ];
  
  const linhasLimpas = linhas.filter(linha => {
    return !lixeiraG1.some(regex => regex.test(linha));
  });
  
  return linhasLimpas.join('\n').trim();
}

// Formata data do RSS para formato legível
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return d.getDate() + ' de ' + meses[d.getMonth()] + ' de ' + d.getFullYear();
  } catch (e) {
    return dateStr;
  }
}

// Deduz o nome da categoria pela URL
function getCategoryName(url) {
  if (url.includes('ciencia')) return 'Ciência e Saúde';
  if (url.includes('tecnologia')) return 'Tecnologia e Games';
  if (url.includes('economia')) return 'Economia';
  if (url.includes('mundo')) return 'Mundo';
  if (url.includes('politica')) return 'Política';
  if (url.includes('educacao')) return 'Educação';
  if (url.includes('natureza')) return 'Natureza';
  if (url.includes('musica')) return 'Música';
  if (url.includes('pop-arte')) return 'Pop & Arte';
  if (url.includes('turismo')) return 'Turismo';
  return 'Notícias';
}

async function main() {
  let xml;
  try {
    xml = await fetch(feedUrl);
  } catch (err) {
    console.log('❌ Erro de conexão: ' + err.message);
    console.log('Verifique sua conexão com a internet.');
    return;
  }

  if (!xml.includes('<item>')) {
    console.log('❌ O URL não retornou um feed RSS válido.');
    console.log('Dica: Use um dos links listados acima.');
    return;
  }

  const items = parseG1RSS(xml);

  if (items.length === 0) {
    console.log('❌ Nenhuma notícia encontrada no feed.');
    return;
  }

  const categoryName = getCategoryName(feedUrl);
  const folderName = 'g1-' + categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const dirPath = path.join(__dirname, 'content', folderName);

  fs.mkdirSync(dirPath, { recursive: true });

  // Monta o Markdown com todas as notícias
  let mdContent = '';
  
  items.forEach((item, index) => {
    const date = formatDate(item.pubDate);
    mdContent += '---\n\n';
    mdContent += '## ' + item.title + '\n\n';
    if (date) mdContent += '*' + date + '*\n\n';
    if (item.category) mdContent += '**' + item.category + '**\n\n';
    mdContent += g1HtmlToMarkdown(item.content) + '\n\n';
    if (item.link) mdContent += '[Leia a notícia completa no G1](' + item.link + ')\n\n';
  });

  fs.writeFileSync(path.join(dirPath, 'texto.md'), mdContent);

  // Cria o meta.json
  const meta = {
    type: "noticias",
    title: "G1: " + categoryName,
    author: "G1 / Globo",
    atmosphere: "dawn",
    chapters: [
      { "file": "texto.md", "title": "Feed de Notícias" }
    ]
  };

  fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log('');
  console.log('========================================');
  console.log('✅ Importação concluída!');
  console.log('========================================');
  console.log('Categoria: ' + categoryName);
  console.log('Notícias:  ' + items.length);
  console.log('Pasta:     content/' + folderName + '/');
  console.log('');
  console.log(' títulos importados:');
  items.forEach((item, i) => {
    console.log('  ' + (i + 1) + '. ' + item.title.substring(0, 70) + (item.title.length > 70 ? '...' : ''));
  });
  console.log('');
  console.log('🚀 Agora rode: npm start');
  console.log('');
}

main();
