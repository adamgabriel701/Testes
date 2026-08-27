import re

def calculate_reading_time(text: str) -> int:
    """Calcula o tempo de leitura em minutos (Média humana: 200 ppm)"""
    words = len(text.split())
    minutes = max(1, round(words / 200))
    return minutes

def extract_keywords(text: str, num: int = 5) -> list:
    """Extrai palavras-chave simples baseadas em frequência (Pode ser trocado por LLM)"""
    # Remove stop words básicas
    stop_words = {'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'ao', 'ele', 'das', 'à', 'seu', 'sua', 'ou', 'quando', 'muito', 'nos', 'já', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'muita'}
    
    words = re.findall(r'\b[a-zà-ú]{4,}\b', text.lower())
    filtered_words = [w for w in words if w not in stop_words]
    
    # Conta frequência
    freq = {}
    for w in filtered_words:
        freq[w] = freq.get(w, 0) + 1
        
    # Top palavras
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, count in sorted_words[:num]]

def generate_summary(text: str, max_chars: int = 300) -> str:
    """
    Gera um resumo. 
    Dica Avançada: Aqui você pode integrar com a API da OpenAI ou HuggingFace.
    Ex: response = openai.ChatCompletion.create(...)
    """
    # Resumo simples pegando o primeiro parágrafo significativo
    paragraphs = text.split('\n\n')
    summary = paragraphs[0] if paragraphs else text
    
    if len(summary) > max_chars:
        summary = summary[:max_chars].rsplit(' ', 1)[0] + '...'
        
    return summary
