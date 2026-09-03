import sys
from lumina.lexer import Lexer
from lumina.parser import Parser
from lumina.semantic import SemanticAnalyzer
from lumina.codegen import LLVMCodegen

def compile_lumina(source_code, output_file="output.ll"):
    print("--- 1. Análise Léxica (Lexer) ---")
    lexer = Lexer(source_code)
    tokens = lexer.tokenize()
    print("Tokens gerados com sucesso!")
    
    print("\n--- 2. Análise Sintática (Parser) ---")
    parser = Parser(tokens)
    ast = parser.parse()
    print(f"AST gerada com sucesso! ({len(ast)} declarações encontradas)")
    
    print("\n--- 3. Análise Semântica (Scopes & Types) ---")
    analyzer = SemanticAnalyzer()
    try:
        analyzer.analyze(ast)
        print("Análise semântica aprovada! Nenhum erro de escopo encontrado.")
    except Exception as e:
        print(e)
        return
    
    print("\n--- 4. Geração de Código (LLVM IR) ---")
    codegen = LLVMCodegen()
    llvm_ir = codegen.generate_module(ast)
    print(llvm_ir)
    
    with open(output_file, "w") as f:
        f.write(llvm_ir)
    print(f"Arquivo '{output_file}' salvo com sucesso!")

if __name__ == "__main__":
    filename = sys.argv[1] if len(sys.argv) > 1 else "program.lm"
    try:
        with open(filename, "r") as f:
            code = f.read()
        compile_lumina(code)
    except FileNotFoundError:
        print(f"Erro: Arquivo '{filename}' não encontrado.")