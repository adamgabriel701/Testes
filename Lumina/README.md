# 🌟 Lumina Language

Lumina é uma linguagem de programação de propósito geral, focada em alta performance e sintaxe limpa. Ela combina a ergonomia da sintaxe baseada em indentação (estilo Python/Nim) com o poder de baixo nível do LLVM, oferecendo tipagem estática, inferência de tipos, gerenciamento de memória manual e compilação para código nativo de altíssima performance.

## ✨ Funcionalidades Principais

- **Sintaxe Limpa:** Sem chaves `{}` ou pontos e vírgulas `;`. O escopo é definido pela indentação (4 espaços).
- **Tipagem Estática & Inferência:** O compilador deduz os tipos automaticamente quando não especificados.
- **Mutabilidade Rigorosa:** Variáveis declaradas com `let` são imutáveis (constantes locais). Use `mut` para variáveis mutáveis.
- **Estruturas de Controle Avançadas:** `if/elif/else`, `while`, `for` (com ranges `0..10`) e `match/switch` nativo.
- **Estruturas de Dados:** Suporte a Arrays (estáticos e dinâmicos no Heap) e Structs.
- **Orientação a Objetos Básica:** Defina métodos para suas structs usando blocos `impl`.
- **Gerenciamento de Memória:** Ponteiros explícitos (`&` e `*`), aritmética de ponteiros, e alocação dinâmica manual (`alloc` e `free`).
- **Biblioteca Padrão (I/O):** Funções nativas como `print`, `input`, `read_file`, `write_file`, e conversões de tipo (`int()`, `float()`, `str()`).
- **Múltiplos Arquivos:** Suporte a `import "modulo.lm"` para dividir o projeto em arquivos.
- **Alta Performance:** Compila diretamente para LLVM IR, que pode ser otimizado com `clang -O2` ou executado instantaneamente via motor JIT.

## 🚀 Como Usar

### Pré-requisitos
- Python 3.10+
- Biblioteca Python `llvmlite` (`pip install llvmlite`)
- LLVM e Clang instalados no sistema (para compilação para binário nativo)

### Compilação e Execução JIT (Rápida)
A forma mais rápida de rodar um programa Lumina é usando o motor JIT embutido. Isso compila o código para a memória RAM e executa instantaneamente, sem gerar arquivos binários.

```bash
python main.py program.lm --run
```

Você também pode passar argumentos para a linha de comando:
```bash
python main.py program.lm --run "Maria" 25
```

### Compilação para Executável Nativo (Binário)
Se você quiser um executável otimizado para distribuição, faça a geração do IR e use o `clang` com otimização nível 2:

```bash
python main.py program.lm
clang -O2 output.ll -o meu_programa
./meu_programa
```

## 📂 Estrutura do Projeto

```text
Lumina/
├── main.py                 # Ponto de entrada e orquestrador do compilador / Motor JIT
├── program.lm              # Código-fonte de teste principal
├── util.lm                 # Módulo importado de exemplo
├── output.ll               # LLVM IR gerado
├── lumina/                 # Código-fonte do Compilador
│   ├── lexer/              # Análise Léxica (Tokens, INDENT/DEDENT)
│   ├── parser/             # Análise Sintática (AST)
│   ├── semantic/           # Analisador Semântico (Escopos, Mutabilidade, Tipos)
│   ├── codegen/            # Geração de Código LLVM IR
│   └── ast/                # Definição da Árvore de Sintaxe Abstrata
└── tests/                  # Suíte de testes da linguagem
```

## 🛠️ Exemplo de Código

```lumina
struct Ponto:
    x: int
    y: int

impl Ponto:
    fn somar(self: Ponto) -> int:
        return self.x + self.y

fn main(argc: int, argv: str) -> int:
    mut p: Ponto
    p.x = 10
    p.y = 20
    
    let soma = p.somar()
    print("Soma dos pontos:", soma)
    
    return 0
```
