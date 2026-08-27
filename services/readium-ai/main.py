from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import httpx
import os
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime

app = FastAPI(title="Readium AI Engine")

# CAMINHO ABSOLUTO OU RELATIVO PARA A PASTA CONTENT DO SEU READIUM
# Como o serviço está em services/readium-ai, subimos duas pastas para achar o readium
READIUM_CONTENT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'readium', 'content'))

# ================= HTML DO PAINEL DE CONTROLE =================
PAINEL_HTML = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Readium AI - Painel</title>
    <style>
        body { font-family: 'Space Grotesk', sans-serif; background: #0a0a0a; color: #eee; padding: 40px; }
        h1 { color: #ff9800; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .card { background: #161616; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        input, button { padding: 10px; border: 1px solid #333; background: #222; color: #fff; border-radius: 4px; }
        button { cursor: pointer; background: #ff9800; color: #000; font-weight: bold; margin-top: 10px; }
        .log { background: #000; padding: 10px; height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🤖 Readium AI Engine</h1>
    <p>Salvando direto em: <code>READIUM/content</code></p>
    
    <div class="card">
        <h3>1. Importar Feed RSS (G1, Blogs)</h3>
        <input type="text" id="rssUrl" placeholder="https://g1.globo.com/dynamo/rss2.xml" style="width: 80%">
        <input type="text" id="rssCat" placeholder="Categoria (ex: Tecnologia)" style="width: 30%">
        <button onclick="fetchRSS()">Importar Feed</button>
    </div>

    <div class="card">
        <h3>2. Raspagem Direta (URL + Seletor CSS)</h3>
        <input type="text" id="pageUrl" placeholder="https://site.com/artigo" style="width: 80%"><br><br>
        <input type="text" id="pageSel" placeholder="Seletor CSS (ex: article, .post-content)" style="width: 50%">
        <input type="text" id="pageName" placeholder="Nome da Pasta" style="width: 30%">
        <button onclick="fetchPage()">Rasar Página</button>
    </div>

    <div class="card">
        <h3>Logs</h3>
        <div class="log" id="logBox">Aguardando ações...</div>
    </div>

    <script>
        async function fetchRSS() {
            const url = document.getElementById('rssUrl').value;
            const cat = document.getElementById('rssCat').value || 'Notícias';
            document.getElementById('logBox').innerHTML += `<br>🔄 Buscando RSS: ${url}...`;
            const res = await fetch('/api/rss', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({url, category_name: cat}) });
            const data = await res.json();
            document.getElementById('logBox').innerHTML += `<br>✅ ${data.message}`;
        }
        async function fetchPage() {
            const url = document.getElementById('pageUrl').value;
            const selector = document.getElementById('pageSel').value || 'article';
            const folder = document.getElementById('pageName').value || 'scraped';
            document.getElementById('logBox').innerHTML += `<br>🔄 Raspando URL: ${url}...`;
            const res = await fetch('/api/scrape', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({url, selector, folder_name: folder}) });
            const data = await res.json();
            document.getElementById('logBox').innerHTML += `<br>✅ ${data.message} - Tempo: ${data.reading_time}`;
        }
    </script>
</body>
</html>
"""

# ================= LÓGICA DE RASPAGEM E IA =================
def html_to_markdown(html):
    if not html: return ""
    soup = BeautifulSoup(html, 'lxml')
    
    # Limpeza de lixo do G1 e propagandas
    for tag in soup.find_all(['script', 'style', 'aside', 'iframe', 'svg']):
        tag.decompose()
    for tag in soup.find_all(class_=re.compile(r'(widget|related|share|newsletter|ad-|banner|whatsapp|cta)')):
        tag.decompose()

    for h in soup.find_all(['h1', 'h2', 'h3']):
        level = int(h.name[1])
        h.replace_with(f"\n{'#' * level} {h.get_text(strip=True)}\n")
    for p in soup.find_all('p'):
        p.replace_with(f"\n{p.get_text(strip=True)}\n\n")
    for b in soup.find_all(['strong', 'b']):
        b.replace_with(f"**{b.get_text(strip=True)}**")
    for i in soup.find_all(['em', 'i']):
        i.replace_with(f"*{i.get_text(strip=True)}*")
    for a in soup.find_all('a', href=True):
        a.replace_with(f"[{a.get_text(strip=True)}]({a['href']})")
    for img in soup.find_all('img', src=True):
        alt = img.get('alt', '')
        img.replace_with(f"\n![{alt}]({img['src']})\n")

    text = soup.get_text()
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

def calculate_reading_time(text):
    words = len(text.split())
    return max(1, round(words / 200))

# ================= ROTAS DA API FASTAPI =================
@app.get("/", response_class=HTMLResponse)
async def painel():
    return PAINEL_HTML

class RSSRequest(BaseModel):
    url: str
    max_items: Optional[int] = 10
    category_name: Optional[str] = "Notícias"

@app.post("/api/rss")
async def fetch_rss(req: RSSRequest, bg_tasks: BackgroundTasks):
    async with httpx.AsyncClient() as client:
        response = await client.get(req.url, headers={'User-Agent': 'Mozilla/5.0'}, follow_redirects=True)
        response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'xml')
    items = []
    for item in soup.find_all('item')[:req.max_items]:
        content_tag = item.find('content:encoded') or item.find('description')
        content = content_tag.get_text(strip=True) if content_tag else ""
        items.append({
            "title": item.find('title').get_text(strip=True) if item.find('title') else "",
            "link": item.find('link').get_text(strip=True) if item.find('link') else "",
            "content": html_to_markdown(content)
        })

    folder_name = f"g1-{req.category_name.lower().replace(' ', '-')}"
    
    def save_to_readium():
        dir_path = os.path.join(READIUM_CONTENT_DIR, folder_name)
        os.makedirs(dir_path, exist_ok=True)
        md_content = "\n\n---\n\n".join([f"## {i['title']}\n\n{i['content']}" for i in items])
        
        with open(os.path.join(dir_path, 'texto.md'), 'w', encoding='utf-8') as f:
            f.write(md_content)
            
        meta = {
            "type": "noticias",
            "title": f"G1: {req.category_name}",
            "author": "G1 / Globo",
            "atmosphere": "dawn",
            "chapters": [{"file": "texto.md", "title": "Feed de Notícias"}]
        }
        with open(os.path.join(dir_path, 'meta.json'), 'w', encoding='utf-8') as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    bg_tasks.add_task(save_to_readium)
    return {"message": f"{len(items)} notícias salvas em {folder_name}/"}

class ScrapeRequest(BaseModel):
    url: str
    selector: Optional[str] = "article"
    folder_name: Optional[str] = "scraped"

@app.post("/api/scrape")
async def scrape_page(req: ScrapeRequest, bg_tasks: BackgroundTasks):
    async with httpx.AsyncClient() as client:
        response = await client.get(req.url, headers={'User-Agent': 'Mozilla/5.0'}, follow_redirects=True)
        response.raise_for_status()
        
    soup = BeautifulSoup(response.text, 'lxml')
    title = soup.find('title').get_text(strip=True) if soup.find('title') else "Conteúdo"
    element = soup.select_one(req.selector) or soup.find('body')
    
    content = html_to_markdown(str(element))
    read_time = calculate_reading_time(content)
    
    def save_to_readium():
        dir_path = os.path.join(READIUM_CONTENT_DIR, req.folder_name)
        os.makedirs(dir_path, exist_ok=True)
        
        with open(os.path.join(dir_path, 'texto.md'), 'w', encoding='utf-8') as f:
            f.write(content)
            
        meta = {
            "type": "livro",
            "title": title,
            "author": "Importado via IA",
            "atmosphere": "mist",
            "reading_time": f"{read_time} min",
            "chapters": [{"file": "texto.md", "title": title}]
        }
        with open(os.path.join(dir_path, 'meta.json'), 'w', encoding='utf-8') as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    bg_tasks.add_task(save_to_readium)
    return {"message": "Página raspada com sucesso!", "title": title, "reading_time": f"{read_time} min"}