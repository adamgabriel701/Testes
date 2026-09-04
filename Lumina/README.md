# 🌟 Lumina Language

Lumina é uma linguagem de programação de sistemas de propósito geral, focada em alta performance, ergonomia e segurança. Ela combina a sintaxe limpa baseada em indentação (estilo Python/Nim) com o poder de baixo nível do LLVM, oferecendo tipagem estática, inferência, controle de memória híbrido (manual + RAII), Tipos Algebraicos (Enums), interoperabilidade com C e um ecossistema completo de ferramentas.

## ✨ Funcionalidades Principais

- **Sintaxe Limpa:** Sem chaves `{}` ou pontos e vírgulas `;`. O escopo é definido pela indentação.
- **Tipagem Estática & Inferência:** O compilador deduz os tipos automaticamente.
- **Mutabilidade Rigorosa:** `let` cria variáveis imutáveis. Use `mut` para variáveis mutáveis.
- **Tipos Algebraicos (ADTs):** Crie `enum`s com payloads (ex: `Some(int)`, `None`) e extraia dados de forma segura com **Pattern Matching (`match`)**.
- **Estruturas de Dados:** Arrays (estáticos e dinâmicos no Heap), Structs aninhadas e Métodos (`impl`).
- **Gerenciamento de Memória Híbrido:** 
  - Ponteiros explícitos (`&` e `*`), aritmética de ponteiros e alocação dinâmica manual (`alloc` e `free`).
  - **Auto-Free (RAII):** Variáveis alocadas no Heap são automaticamente destruídas no fim do escopo, evitando vazamentos de memória sem a necessidade de um Garbage Collector.
- **Ecossistema e FFI:** Suporte a `import` de múltiplos arquivos `.lm`, chamadas para bibliotecas C nativas via `extern fn`, Standard Library (`std/`) e Gerenciador de Pacotes Remoto (`lumina install`).
- **Ergonomia (DX):** CLI completa (`lumina_cli.py`), erros amigáveis estilo Rust (com seta `^` apontando o erro), auto-documentador (`lumina doc`) e extensão do VS Code.
- **Alta Performance:** Compila para LLVM IR otimizável com `clang -O2` ou executa instantaneamente via **Motor JIT** embutido.

## 🚀 Como Usar (CLI)

A Lumina possui uma ferramenta de linha de comando (CLI) que gerencia todo o ciclo de vida do projeto, do scaffolding à publicação.

### Pré-requisitos
- Python 3.10+
- Biblioteca Python `llvmlite` (`pip install llvmlite`)
- LLVM e Clang instalados no sistema (para compilação para binário nativo)
- Git instalado (para o gerenciador de pacotes)

### 1. Criar um novo projeto
Cria uma pasta com `lumina.json`, `main.lm` e a estrutura inicial.
```bash
python3 lumina_cli.py new meu_projeto
cd meu_projeto
```

### 2. Gerenciar Pacotes (Dependencies)
Edite o `lumina.json` para adicionar repositórios remotos do GitHub:
```json
{
  "dependencies": {
    "utils": "github:usuario/repo"
  }
}
```
Baixe as dependências para a pasta `lumina_modules/`:
```bash
python3 ../lumina_cli.py install
```

### 3. Executar via JIT (Rápido)
Compila o código para a memória RAM e executa instantaneamente, sem gerar arquivos binários.
```bash
python3 ../lumina_cli.py jit
```

### 4. Compilar para Binário Nativo (Build)
Lê o `lumina.json`, compila o IR e chama o `clang -O2` para gerar um executável nativo otimizado.
```bash
python3 ../lumina_cli.py build
./meu_projeto
```

### 5. Gerar Documentação
Extrai comentários `##` do código e gera uma página HTML estática em `docs/index.html`.
```bash
python3 ../lumina_cli.py doc
```

## 🛠️ Exemplo de Código

Aqui está um exemplo que demonstra Tipos Algebraicos, Pattern Matching, FFI e RAII:

```lumina
# Definindo um Enum (Option[T] simplificado)
enum Option:
    Some(int)
    None

fn dividir(a: int, b: int) -> Option:
    if b == 0:
        return None
    return Some(a / b)

fn main() -> int:
    let res = dividir(10, 0)
    
    # Pattern Matching com extração de variável
    match res:
        case Some(val):
            print("Sucesso! Resultado:", val)
        case None:
            print("Falha: divisao por zero")
            
    # Usando FFI para chamar a biblioteca C diretamente
    extern fn sqrt(x: float) -> float
    print("Raiz de 16:", sqrt(16.0))
    
    return 0
```

## 📦 Standard Library e Ecossistema

A Lumina possui uma pasta `std/` nativa com módulos escritos na própria linguagem (usando FFI para encapsular o C de forma segura). 

Você pode importá-los no seu código:
```lumina
import "std/math"
import "std/fs"

fn main() -> int:
    let pi = 3.1415
    print("Seno de Pi:", std_math.sin(pi))
    return 0
```

## 📂 Estrutura do Projeto

```text
Lumina/
├── lumina_cli.py            # CLI, Build System e Package Manager
├── std/                     # Standard Library nativa (math.lm, fs.lm, etc)
├── program.lm               # Código-fonte de teste principal
├── lumina/                  # Código-fonte do Compilador
│   ├── errors.py            # Classe de erros amigáveis (Rust-style)
│   ├── lexer/               # Análise Léxica (Tokens, INDENT/DEDENT)
│   ├── parser/              # Análise Sintática (AST) com Mixins
│   ├── semantic/            # Analisador Semântico (Escopos, Mutabilidade, Tipos)
│   ├── codegen/             # Geração de Código LLVM IR (RAII, Enums, FFI)
│   └── ast/                 # Definição da Árvore de Sintaxe Abstrata
└── tests/                   # Suíte de testes da linguagem
```

## 🎨 Extensão do VS Code

A Lumina possui uma extensão nativa para o VS Code que oferece realce de sintaxe e regras de indentação.

Para instalar:
1. Gere o pacote `.vsix` usando `npx @vscode/vsce package` na pasta da extensão.
2. No VS Code, vá para a aba de Extensões (`Ctrl+Shift+X`).
3. Clique nos três pontos `...` no canto superior direito > **Instalar do VSIX...**.
4. Selecione o arquivo `.vsix` gerado e recarregue a janela.
