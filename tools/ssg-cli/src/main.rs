use std::fs;
use std::path::Path;
use pulldown_cmark::{Parser, html};

fn generate_html(md_content: &str, title: &str) -> String {
    let parser = Parser::new(md_content);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    format!(r#"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>{}</title>
    <style>body{{font-family:sans-serif;max-width:800px;margin:50px auto;line-height:1.6;color:#333}} img{{max-width:100%}}</style>
</head>
<body>
{}
</body>
</html>
    "#, title, html_output)
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    
    if args.len() != 3 {
        println!("🛠️  Uso: ssg-cli <arquivo_entrada.md> <arquivo_saida.html>");
        println!("Exemplo: ssg-cli meu_post.md saida.html");
        return;
    }

    let input_path = &args[1];
    let output_path = &args[2];

    let md_content = match fs::read_to_string(input_path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("❌ Erro ao ler arquivo: {}", e);
            return;
        }
    };

    let title = Path::new(input_path).file_stem().unwrap().to_str().unwrap();
    let html_content = generate_html(&md_content, title);

    match fs::write(output_path, html_content) {
        Ok(_) => println!("✅ HTML gerado com sucesso em: {}", output_path),
        Err(e) => eprintln!("❌ Erro ao salvar: {}", e),
    }
}