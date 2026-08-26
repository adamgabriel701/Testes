const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CONTENT_DIR = path.join(__dirname, 'content');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

http.createServer((req, res) => {
  // Rota da API: Lista o conteúdo de uma pasta
  if (req.url.startsWith('/api/content')) {
    const urlParts = req.url.replace('/api/content', '').split('?')[0];
    const targetDir = path.join(CONTENT_DIR, urlParts);
    
    if (!fs.existsSync(targetDir)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Pasta não encontrada' }));
    }

    fs.readdir(targetDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Erro ao ler diretório' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(files));
    });
    return;
  }

  // Servir arquivos estáticos
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Arquivo não encontrado');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`🚀 Readium rodando em http://localhost:${PORT}`);
  console.log(`📚 Coloque seus conteúdos em: ${CONTENT_DIR}`);
});
