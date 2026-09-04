import sys
import os
import ctypes
import ctypes.util
from llvmlite import binding as llvm
from lumina.lexer import Lexer
from lumina.parser import Parser
from lumina.semantic import SemanticAnalyzer
from lumina.codegen import LLVMCodegen
from lumina.ast import ImportStmt

def parse_module(filename):
    with open(filename, "r") as f:
        code = f.read()
        
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    parser = Parser(tokens)
    ast = parser.parse()
    
    resolved_ast = []
    for node in ast:
        if isinstance(node, ImportStmt):
            base_dir = os.path.dirname(filename)
            if not base_dir: base_dir = "."
            imported_path = os.path.join(base_dir, node.filename)
            
            print(f"--> Importando módulo: {node.filename}")
            imported_ast = parse_module(imported_path)
            resolved_ast.extend(imported_ast)
        else:
            resolved_ast.append(node)
    return resolved_ast

def compile_lumina(filename, output_file="output.ll"):
    print("--- 1. Análise Léxica e Sintática (com Imports) ---")
    ast = parse_module(filename)
    print(f"AST gerada com sucesso! ({len(ast)} declarações no total)")
    
    print("\n--- 2. Análise Semântica (Scopes & Types) ---")
    analyzer = SemanticAnalyzer()
    try:
        analyzer.analyze(ast)
        print("Análise semântica aprovada! Nenhum erro de escopo encontrado.")
    except Exception as e:
        print(e)
        return None
    
    print("\n--- 3. Geração de Código (LLVM IR) ---")
    codegen = LLVMCodegen()
    llvm_ir = codegen.generate_module(ast)
    
    with open(output_file, "w") as f:
        f.write(llvm_ir)
    print(f"Arquivo '{output_file}' salvo com sucesso!")
    
    return llvm_ir

def run_jit(llvm_ir, cli_args):
    print("\n--- 4. Execução JIT (Just-In-Time) ---")
    try:
        llvm.initialize_native_target()
        llvm.initialize_native_asmprinter()
    except Exception:
        pass
    
    lib_c_path = ctypes.util.find_library('c')
    if lib_c_path:
        llvm.load_library_permanently(lib_c_path)

    mod = llvm.parse_assembly(llvm_ir)
    mod.verify()

    target = llvm.Target.from_default_triple()
    tm = target.create_target_machine()
    engine = llvm.create_mcjit_compiler(mod, tm)
    engine.finalize_object()
    engine.run_static_constructors()

    func_ptr = engine.get_function_address("main")
    cfunc = ctypes.CFUNCTYPE(ctypes.c_int64, ctypes.c_int32, ctypes.POINTER(ctypes.c_char_p))(func_ptr)
    
    # NOVO: Inclui o nome do arquivo como argv[0], exatamente como no C
    full_args = ["lumina_program"] + cli_args
    argc = len(full_args)
    argv = [arg.encode('utf-8') for arg in full_args]
    
    print("Executando código nativo na memória...\n")
    ret = cfunc(argc, (ctypes.c_char_p * len(argv))(*argv))
    ctypes.CDLL(None).fflush(None)
    print(f"\n[JIT] Programa finalizado com exit code: {ret}")

if __name__ == "__main__":
    args = sys.argv[1:]
    filename = args[0] if args and not args[0].startswith('--') else "program.lm"
    
    # NOVO: Captura os argumentos passados para o programa (ignorando o --run)
    cli_args = [a for a in args[1:] if a != '--run']
    
    try:
        llvm_ir = compile_lumina(filename)
        if '--run' in args and llvm_ir:
            run_jit(llvm_ir, cli_args)
    except FileNotFoundError:
        print(f"Erro: Arquivo '{filename}' não encontrado.")