use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct TtsProcessor;

#[wasm_bindgen]
impl TtsProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TtsProcessor {
        TtsProcessor
    }

    // Recebe um texto Markdown bruto e retorna um Array de Strings (frases limpas)
    pub fn process_text(&self, raw_md: &str) -> Vec<String> {
        let mut text = raw_md.to_string();

        // Limpa marcações básicas de Markdown
        text = text.replace("##", "");
        text = text.replace("**", "");
        text = text.replace("*", "");
        text = text.replace("`", "");
        text = text.replace(">", "");
        text = text.replace("[", "");
        text = text.replace("]", "");

        // Divide o texto em frases usando pontuação
        let mut chunks = Vec::new();
        let mut current_chunk = String::new();
        
        for c in text.chars() {
            current_chunk.push(c);
            // Se achar pontuação final, corta a frase
            if c == '.' || c == '!' || c == '?' || c == '\n' {
                let trimmed = current_chunk.trim().to_string();
                if !trimmed.is_empty() {
                    chunks.push(trimmed);
                }
                current_chunk.clear();
            }
        }
        
        // Adiciona o último pedaço se sobrar algo
        let last_trimmed = current_chunk.trim().to_string();
        if !last_trimmed.is_empty() {
            chunks.push(last_trimmed);
        }

        chunks
    }
}
