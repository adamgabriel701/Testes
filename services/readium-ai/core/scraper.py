import httpx
import re
from bs4 import BeautifulSoup
from datetime import datetime

class WebScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    async def fetch_rss(self, url: str, max_items: int = 10):
        """Substitui o fetcher-g1.js e fetcher.js"""
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, follow_redirects=True)
            response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'xml')
        items = []
        
        for item in soup.find_all('item')[:max_items]:
            # Pega conteúdo completo ou descrição
            content_tag = item.find('content:encoded') or item.find('description')
            content = content_tag.get_text(strip=True) if content_tag else ""
            
            pub_date_str = item.find('pubDate').get_text(strip=True) if item.find('pubDate') else ""
            try:
                pub_date = datetime.strptime(pub_date_str, "%a, %d %b %Y %H:%M:%S %z").strftime("%d de %m de %Y")
            except:
                pub_date = pub_date_str

            items.append({
                "title": item.find('title').get_text(strip=True) if item.find('title') else "",
                "link": item.find('link').get_text(strip=True) if item.find('link') else "",
                "pubDate": pub_date,
                "category": item.find('category').get_text(strip=True) if item.find('category') else "",
                "content": self.html_to_markdown(content)
            })
        return items

    async def fetch_page(self, url: str, selector: str = "article"):
        """Substitui o scraper.js"""
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, follow_redirects=True)
            response.raise_for_status()
            
        soup = BeautifulSoup(response.text, 'lxml')
        title = soup.find('title').get_text(strip=True) if soup.find('title') else "Conteúdo Importado"
        
        # Extrai pelo seletor CSS
        element = soup.select_one(selector)
        if not element:
            element = soup.find('body') # Fallback
            
        content = self.html_to_markdown(str(element))
        return {"title": title, "content": content}

    def html_to_markdown(self, html: str) -> str:
        """Conversor limpo, substitui as Regex pesadas do Node.js"""
        if not html: return ""
        
        soup = BeautifulSoup(html, 'lxml')
        
        # Limpeza pesada de lixo do G1 e propagandas
        for tag in soup.find_all(['script', 'style', 'aside', 'iframe', 'svg']):
            tag.decompose()
            
        for tag in soup.find_all(class_=re.compile(r'(widget|related|share|newsletter|ad-|banner|whatsapp|cta)')):
            tag.decompose()

        # Conversão para Markdown
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

        # Retorna apenas o texto limpo
        text = soup.get_text()
        
        # Limpa quebras de linha excessivas
        text = re.sub(r'\n{3,}', '\n\n', text).strip()
        return text
