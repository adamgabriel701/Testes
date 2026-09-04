from llvmlite import ir
from ..ast import Function, StructDecl, ArrayExpr, ImplBlock
from .builtins import BuiltinManager
from .expressions import ExpressionCodegen
from .statements import StatementCodegen

class LLVMCodegen(ExpressionCodegen, StatementCodegen):
    def __init__(self):
        self.module = ir.Module(name="lumina_module")
        self.module.triple = "x86_64-pc-linux-gnu"
        self.builder = None
        self.symbol_table = {}
        self.var_types = {}
        self.string_counter = 0
        self.functions_table = {}
        self.array_sizes = {} 
        
        # NOVO: Registra todas as builtins
        self.printf, self.scanf, self.atoi, self.sprintf, self.malloc, self.free, self.fopen, self.fgets, self.fputs, self.fclose = BuiltinManager.setup_builtins(self.module)
        
        self.i64_ty = ir.IntType(64)
        self.f64_ty = ir.DoubleType()
        self.i32_ty = ir.IntType(32)
        self.i8_ty = ir.IntType(8)
        self.voidptr_ty = self.i8_ty.as_pointer()
        self.struct_types = {}
        self.struct_fields = {} 

        # NOVO: Variável global para guardar os argumentos da linha de comando (argv)
        self.argv_global = ir.GlobalVariable(self.module, self.voidptr_ty.as_pointer(), name="__lumina_argv")
        self.argv_global.linkage = 'internal'
        self.argv_global.initializer = ir.Constant(self.voidptr_ty.as_pointer(), None)

    def create_global_string(self, text):
        name = f"str_{self.string_counter}"
        self.string_counter += 1
        b = bytearray(text, 'utf-8') + b"\0"
        ty = ir.ArrayType(self.i8_ty, len(b))
        gv = ir.GlobalVariable(self.module, ty, name=name)
        gv.global_constant = True
        gv.initializer = ir.Constant(ty, b)
        return self.builder.bitcast(gv, self.voidptr_ty)

    def to_float_if_needed(self, val):
        if val.type == self.i64_ty:
            return self.builder.sitofp(val, self.f64_ty, name="int_to_float")
        return val

    def get_llvm_type(self, type_name):
        if type_name == "int": return self.i64_ty
        elif type_name == "float": return self.f64_ty
        # NOVO: str é um ponteiro para i8 (texto)
        elif type_name == "str": return self.voidptr_ty 
        elif type_name in self.struct_types: return self.struct_types[type_name]
        return self.i64_ty

    # NOVO: Tipos dos campos da Struct (Structs viram ponteiros!)
    def get_llvm_field_type(self, type_name):
        if type_name in self.struct_types: 
            return self.struct_types[type_name].as_pointer()
        return self.get_llvm_type(type_name)

    def get_llvm_param_type(self, type_name):
        if type_name in self.struct_types: 
            return self.struct_types[type_name].as_pointer()
        return self.get_llvm_type(type_name)

    def generate_module(self, declarations):
        for decl in declarations:
            if isinstance(decl, StructDecl): self.create_struct(decl)
        for decl in declarations:
            if isinstance(decl, Function): self.create_function(decl)
            # NOVO: Métodos de ImplBlock são apenas funções renomeadas
            elif isinstance(decl, ImplBlock):
                for method in decl.methods:
                    self.create_function(method)
        return str(self.module)

    def create_struct(self, node: StructDecl):
        struct_ty = self.module.context.get_identified_type(node.name)
        
        # CORREÇÃO: Registrar a Struct ANTES de mapear os campos.
        # Isso permite que ela tenha ponteiros para si mesma (Listas Ligadas).
        self.struct_types[node.name] = struct_ty
        
        field_tys = [self.get_llvm_field_type(t) for t in node.fields.values()]
        struct_ty.set_body(*field_tys)
        self.struct_fields[node.name] = {name: i for i, name in enumerate(node.fields.keys())}

    def create_function(self, func_node: Function):
        # NOVO: Se for a função main, ela deve ter a assinatura do C (int argc, char** argv)
        if func_node.name == "main":
            ret_ty = self.i64_ty
            param_types = [self.i32_ty, self.i8_ty.as_pointer().as_pointer()]
            func_type = ir.FunctionType(ret_ty, param_types)
            func = ir.Function(self.module, func_type, name="main")
            block = func.append_basic_block(name="entry")
            self.builder = ir.IRBuilder(block)
            self.symbol_table = {}
            self.var_types = {}
            
            # Mapeia os parâmetros argc e argv para as variáveis da Lumina
            if len(func_node.params) >= 1:
                p_name = func_node.params[0][0]
                ptr = self.builder.alloca(self.i32_ty, name=p_name)
                self.builder.store(func.args[0], ptr)
                self.symbol_table[p_name] = ptr
                self.var_types[p_name] = self.i32_ty
                
            if len(func_node.params) >= 2:
                p_name = func_node.params[1][0]
                ptr = self.builder.alloca(self.i8_ty.as_pointer().as_pointer(), name=p_name)
                self.builder.store(func.args[1], ptr)
                self.symbol_table[p_name] = ptr
                self.var_types[p_name] = self.i8_ty.as_pointer().as_pointer()
                
        else:
            ret_ty = self.get_llvm_type(func_node.return_type)
            param_types = [self.get_llvm_param_type(p_type) for _, p_type in func_node.params]
            func_type = ir.FunctionType(ret_ty, param_types)
            func = ir.Function(self.module, func_type, name=func_node.name)
            block = func.append_basic_block(name="entry")
            self.builder = ir.IRBuilder(block)
            self.symbol_table = {}
            self.var_types = {}
            
            for i, (p_name, p_type) in enumerate(func_node.params):
                p_ty = self.get_llvm_param_type(p_type)
                if isinstance(p_ty, ir.PointerType) and isinstance(p_ty.pointee, ir.IdentifiedStructType):
                    self.symbol_table[p_name] = func.args[i]
                    self.var_types[p_name] = p_ty
                else:
                    ptr = self.builder.alloca(p_ty, name=p_name)
                    self.builder.store(func.args[i], ptr)
                    self.symbol_table[p_name] = ptr
                    self.var_types[p_name] = p_ty
                    
        self.functions_table[func_node.name] = (func, func_type)
        for stmt in func_node.body:
            self.codegen_stmt(stmt)
        if not self.builder.block.is_terminated:
            self.builder.ret(ir.Constant(ret_ty, 0))