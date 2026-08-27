use std::fs;
use std::collections::HashMap;
use std::path::Path;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 3 {
        println!("Uso: search-core <diretorio_conteudo> <termo_busca>");
        return;
    }
    
    let dir_path = &args[1];
    let search_term = args[2].to_lowercase();
    
    let mut index: HashMap<String, Vec<String>> = HashMap::new();

    // Função recursiva para ler diretórios
    fn read_dir_recursive(dir: &Path, search_term: &str, index: &mut HashMap<String, Vec<String>>) {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    read_dir_recursive(&path, search_term, index);
                } else if path.is_file() {
                    if let Some(ext) = path.extension() {
                        if ext == "md" || ext == "txt" {
                            if let Ok(content) = fs::read_to_string(&path) {
                                let lower_content = content.to_lowercase();
                                if lower_content.contains(search_term) {
                                    index.entry(search_term.to_string())
                                        .or_default()
                                        .push(path.file_name().unwrap().to_string_lossy().to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    read_dir_recursive(Path::new(dir_path), &search_term, &mut index);

    // Retorna o resultado como JSON simples
    let matches = index.get(&search_term).cloned().unwrap_or_default();
    println!("{{\"term\": \"{}\", \"matches\": {:?}}}", search_term, matches);
}