from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from bs4 import BeautifulSoup
import spacy
import re

app = FastAPI(title="Geo Aggregator AI")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Geo Aggregator AI está rodando! Acesse /api/geo-news"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carrega o modelo de IA para português
nlp = spacy.load("pt_core_news_sm")

# URL do feed RSS do G1 Amazonas
RSS_URL = "https://g1.globo.com/dynamo/am/amazonas/rss2.xml"

# Lista de termos que a IA confunde com locais, mas que são ruído
BLACKLIST_TERMS = [
    "whatsapp", "g1", "reprodução", "divulgação", "polícia", "civil", "militar", 
    "pc-am", "dehs", "dipc", "derfd", "denarc", "deflu", "core", "bope", "drco",
    "ministério", "secretaria", "departamento", "delegacia", "instituto", "agência",
    "empresa", "grupo", "redes", "sociais", "pública", "participe", "clique",
    "agricultura", "cultura", "educação", "transporte", "passageiros"
]

def is_valid_location(text: str) -> bool:
    text_lower = text.lower()
    
    # Regra 1: Remover quebras de linha e espaços extras (ex: "Manaus\nReprodução")
    if "\n" in text or "\r" in text:
        return False
        
    # Regra 2: Se tiver algum termo da blacklist, rejeita
    for term in BLACKLIST_TERMS:
        if term in text_lower:
            return False
            
    # Regra 3: Locais reais geralmente têm no máximo 5 palavras
    word_count = len(text.split())
    if word_count > 5:
        return False
        
    # Regra 4: Não pode ser apenas números ou ter apenas 1 letra
    if len(text) < 3 or text.isdigit():
        return False
        
    return True

async def fetch_real_news():
    news = []
    async with httpx.AsyncClient() as client:
        response = await client.get(RSS_URL, headers={'User-Agent': 'Mozilla/5.0'}, follow_redirects=True)
        response.raise_for_status()
    
    # Parseia o XML do RSS
    soup = BeautifulSoup(response.text, 'xml')
    items = soup.find_all('item')
    
    # Pega as 10 primeiras notícias do feed
    for item in items[:10]:
        title = item.find('title').get_text(strip=True) if item.find('title') else ""
        link = item.find('link').get_text(strip=True) if item.find('link') else ""
        
        # Pega a descrição (ou conteúdo) removendo tags HTML
        desc_tag = item.find('description')
        content = BeautifulSoup(desc_tag.get_text(strip=True), 'lxml').get_text(strip=True) if desc_tag else ""
        
        if title and content:
            news.append({"title": title, "content": content, "link": link})
            
    return news

@app.get("/api/geo-news")
async def get_geo_news():
    try:
        news = await fetch_real_news()
    except Exception as e:
        return {"error": f"Não foi possível buscar as notícias: {str(e)}", "news": []}
        
    geo_news = []

    for article in news:
        text = article['title'] + ". " + article['content']
        
        # O NLP analisa o texto para encontrar lugares (LOC) e Organizações (ORG)
        doc = nlp(text)
        locations = []
        for ent in doc.ents:
            # LOC = Lugares geográficos (cidades, rios, estados)
            # ORG = Organizações, mas o spaCy costuma classificar bairros e locais menores como ORG
            if ent.label_ in ['LOC', 'ORG']:
                clean_text = ent.text.strip()
                
                # Aplica as regras de validação
                if is_valid_location(clean_text):
                    locations.append(clean_text)
        
        geo_news.append({
            "title": article['title'],
            "content": article['content'],
            "link": article['link'],
            "locations": list(set(locations)) # Remove duplicatas
        })

    return {"news": geo_news}

# Para rodar: uvicorn main:app --reload --port 8008