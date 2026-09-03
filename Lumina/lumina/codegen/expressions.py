from llvmlite import ir
from ..ast import NumberExpr, BoolExpr, StringExpr, VariableExpr, BinaryExpr, CallExpr, ArrayExpr, IndexExpr, MemberExpr, AddressOfExpr, DerefExpr, TupleExpr

class ExpressionCodegen:
    # NOVO MÉTODO AUXILIAR RECURSIVO
    def resolve_member_ptr(self, node: MemberExpr):
        if isinstance(node.obj, VariableExpr):
            ptr = self.symbol_table.get(node.obj.name)
            if not ptr: raise Exception(f"Variável '{node.obj.name}' não declarada.")
            struct_ty = self.var_types.get(node.obj.name)
            if isinstance(struct_ty, ir.PointerType) and isinstance(struct_ty.pointee, ir.IdentifiedStructType):
                struct_ty = struct_ty.pointee
        else:
            ptr = self.codegen_expr(node.obj)
            struct_ty = ptr.type.pointee
            
        elem_index = 0
        for s_name, s_fields in self.struct_fields.items():
            if self.struct_types[s_name] == struct_ty:
                elem_index = s_fields.get(node.member, 0)
                break
        return self.builder.gep(ptr, [ir.Constant(self.i32_ty, 0), ir.Constant(self.i32_ty, elem_index)], name="member_ptr", inbounds=True)

    def codegen_expr(self, node):
        if isinstance(node, NumberExpr):
            if node.is_float: return ir.Constant(self.f64_ty, float(node.value))
            return ir.Constant(self.i64_ty, int(node.value))
        elif isinstance(node, BoolExpr):
            return ir.Constant(ir.IntType(1), 1 if node.value else 0)
        elif isinstance(node, StringExpr): 
            return self.create_global_string(node.value)
            
        elif isinstance(node, AddressOfExpr):
            if isinstance(node.val, VariableExpr):
                ptr = self.symbol_table.get(node.val.name)
                if not ptr: raise Exception(f"Variável '{node.val.name}' não declarada.")
                return self.builder.bitcast(ptr, self.voidptr_ty, name="addr_of")
            raise Exception("Endereço de memória só pode ser pego de variáveis.")
        elif isinstance(node, DerefExpr):
            ptr = self.codegen_expr(node.val)
            if ptr.type == self.voidptr_ty:
                ptr = self.builder.bitcast(ptr, self.i64_ty.as_pointer(), name="deref_ptr_cast")
            return self.builder.load(ptr, name="deref_val")
            
        elif isinstance(node, VariableExpr):
            ptr = self.symbol_table.get(node.name)
            if not ptr: raise Exception(f"Variável '{node.name}' não declarada.")
            if isinstance(ptr.type.pointee, ir.IdentifiedStructType): return ptr
            return self.builder.load(ptr, name=node.name + "_val")
            
        elif isinstance(node, BinaryExpr):
            left = self.codegen_expr(node.left)
            right = self.codegen_expr(node.right)
            
            # NOVO: Concatenação de String (Apenas se um dos lados for StringExpr na AST)
            # Isso evita que o compilador confunda com aritmética de ponteiros (ptr + int)
            if node.op == '+' and (isinstance(node.left, StringExpr) or isinstance(node.right, StringExpr)):
                buf = self.builder.alloca(ir.ArrayType(self.i8_ty, 256), name="str_concat_buf")
                buf_ptr = self.builder.bitcast(buf, self.voidptr_ty, name="buf_ptr")
                
                if left.type == self.voidptr_ty and right.type == self.i64_ty:
                    fmt_str = self.create_global_string("%s%d")
                    self.builder.call(self.sprintf, [buf_ptr, fmt_str, left, right], name="sprintf_str_int")
                elif left.type == self.i64_ty and right.type == self.voidptr_ty:
                    fmt_str = self.create_global_string("%d%s")
                    self.builder.call(self.sprintf, [buf_ptr, fmt_str, left, right], name="sprintf_int_str")
                else:
                    fmt_str = self.create_global_string("%s%s")
                    self.builder.call(self.sprintf, [buf_ptr, fmt_str, left, right], name="sprintf_str_str")
                    
                return buf_ptr
            
            # Aritmética de Ponteiros (ptr + int)
            if isinstance(left.type, ir.PointerType) and right.type == self.i64_ty:
                if node.op == '+':
                    return self.builder.gep(left, [right], name="ptr_add_tmp")
                elif node.op == '-':
                    neg_right = self.builder.neg(right, name="neg_idx")
                    return self.builder.gep(left, [neg_right], name="ptr_sub_tmp")
                    
            if left.type == self.f64_ty or right.type == self.f64_ty:
                left = self.to_float_if_needed(left)
                right = self.to_float_if_needed(right)
                if node.op == '+': return self.builder.fadd(left, right, name="fadd_tmp")
                elif node.op == '-': return self.builder.fsub(left, right, name="fsub_tmp")
                elif node.op == '*': return self.builder.fmul(left, right, name="fmul_tmp")
                elif node.op == '/': return self.builder.fdiv(left, right, name="fdiv_tmp")
                elif node.op in ('==', '!=', '<', '>', '<=', '>='): return self.builder.fcmp_ordered(node.op, left, right, name="fcmp_tmp")
            else:
                if node.op == '+': return self.builder.add(left, right, name="add_tmp")
                elif node.op == '-': return self.builder.sub(left, right, name="sub_tmp")
                elif node.op == '*': return self.builder.mul(left, right, name="mul_tmp")
                elif node.op == '/': return self.builder.sdiv(left, right, name="div_tmp")
                elif node.op in ('==', '!=', '<', '>', '<=', '>='): return self.builder.icmp_signed(node.op, left, right, name="cmp_tmp")

        elif isinstance(node, IndexExpr):
            if isinstance(node.array, VariableExpr):
                if node.array.name in self.array_sizes:
                    arr_ptr = self.symbol_table.get(node.array.name)
                    idx_val = self.codegen_expr(node.index)
                    if idx_val.type != self.i64_ty: idx_val = self.builder.fptosi(idx_val, self.i64_ty, name="idx_int")
                    elem_ptr = self.builder.gep(arr_ptr, [ir.Constant(self.i32_ty, 0), idx_val], name="elem_ptr")
                    return self.builder.load(elem_ptr, name="arr_elem_val")
                else:
                    ptr = self.codegen_expr(node.array)
                    idx_val = self.codegen_expr(node.index)
                    if idx_val.type != self.i64_ty: idx_val = self.builder.fptosi(idx_val, self.i64_ty, name="idx_int")
                    if ptr.type == self.voidptr_ty:
                        ptr = self.builder.bitcast(ptr, self.i64_ty.as_pointer(), name="heap_cast")
                    elem_ptr = self.builder.gep(ptr, [idx_val], name="heap_elem_ptr")
                    return self.builder.load(elem_ptr, name="heap_elem_val")
            else:
                ptr = self.codegen_expr(node.array)
                idx_val = self.codegen_expr(node.index)
                if idx_val.type != self.i64_ty: idx_val = self.builder.fptosi(idx_val, self.i64_ty, name="idx_int")
                if isinstance(ptr.type, ir.PointerType) and isinstance(ptr.type.pointee, ir.ArrayType):
                    elem_ptr = self.builder.gep(ptr, [ir.Constant(self.i32_ty, 0), idx_val], name="nested_elem_ptr")
                else:
                    elem_ptr = self.builder.gep(ptr, [idx_val], name="nested_heap_ptr")
                return self.builder.load(elem_ptr, name="nested_elem_val")
                
        elif isinstance(node, MemberExpr):
            # NOVO: Chama o método recursivo para resolver o ponteiro
            obj_ptr = self.resolve_member_ptr(node)
            return self.builder.load(obj_ptr, name="member_val")
            
        elif isinstance(node, CallExpr):
            if node.name == "input":
                buf = self.builder.alloca(ir.ArrayType(self.i8_ty, 256), name="input_buf")
                fmt_str = self.create_global_string("%s")
                self.builder.call(self.scanf, [fmt_str, buf])
                return self.builder.bitcast(buf, self.voidptr_ty)
            elif node.name == "atoi":
                arg_val = self.codegen_expr(node.args[0])
                return self.builder.call(self.atoi, [arg_val], name="atoi_call")
            elif node.name == "len":
                arr_name = node.args[0].name
                size = self.array_sizes.get(arr_name, 0)
                return ir.Constant(self.i64_ty, size)
            elif node.name == "free":
                ptr = self.codegen_expr(node.args[0])
                self.builder.call(self.free, [ptr], name="free_call")
                return ir.Constant(self.i64_ty, 0)
            elif node.name == "alloc":
                size_val = self.codegen_expr(node.args[0])
                size_bytes = self.builder.mul(size_val, ir.Constant(self.i64_ty, 8), name="size_bytes")
                ptr = self.builder.call(self.malloc, [size_bytes], name="malloc_ptr")
                return ptr
            elif node.name == "print":
                for arg_node in node.args:
                    arg_val = self.codegen_expr(arg_node)
                    if isinstance(arg_node, StringExpr):
                        fmt_str = self.create_global_string("%s ")
                        self.builder.call(self.printf, [fmt_str, arg_val])
                    else:
                        if arg_val.type == self.f64_ty: fmt_str = self.create_global_string("%f ")
                        elif arg_val.type == self.voidptr_ty: fmt_str = self.create_global_string("%s ")
                        else: fmt_str = self.create_global_string("%d ")
                        self.builder.call(self.printf, [fmt_str, arg_val])
                nl_str = self.create_global_string("\n")
                self.builder.call(self.printf, [nl_str])
                return ir.Constant(self.i64_ty, 0)
            elif node.is_method:
                obj_node = node.args[0]
                obj_val = self.codegen_expr(obj_node)
                struct_ty = self.var_types.get(obj_node.name)
                if isinstance(struct_ty, ir.PointerType) and isinstance(struct_ty.pointee, ir.IdentifiedStructType):
                    struct_ty = struct_ty.pointee
                struct_name = struct_ty.name if struct_ty else "Unknown"
                func_name = f"{struct_name}_{node.name}"
                if func_name in self.functions_table:
                    func, func_type = self.functions_table[func_name]
                    args = [obj_val] + [self.codegen_expr(a) for a in node.args[1:]]
                    return self.builder.call(func, args, name=func_name + "_call")
                raise Exception(f"Método '{func_name}' não encontrado.")
            elif node.name in self.functions_table:
                func, func_type = self.functions_table[node.name]
                args = []
                for i, arg_node in enumerate(node.args):
                    arg_val = self.codegen_expr(arg_node)
                    if func_type.args[i] == self.f64_ty and arg_val.type == self.i64_ty: arg_val = self.to_float_if_needed(arg_val)
                    args.append(arg_val)
                return self.builder.call(func, args, name=node.name + "_call")
            
            # NOVO: Lê um arquivo do disco
            elif node.name == "read_file":
                filename_ptr = self.codegen_expr(node.args[0])
                mode_str = self.create_global_string("r")
                
                fp = self.builder.call(self.fopen, [filename_ptr, mode_str], name="file_ptr")
                
                buf = self.builder.alloca(ir.ArrayType(self.i8_ty, 4096), name="read_buf")
                buf_ptr = self.builder.bitcast(buf, self.voidptr_ty, name="buf_ptr")
                
                self.builder.call(self.fgets, [buf_ptr, ir.Constant(self.i32_ty, 4096), fp])
                self.builder.call(self.fclose, [fp])
                
                return buf_ptr
                
            # NOVO: Escreve em um arquivo do disco
            elif node.name == "write_file":
                filename_ptr = self.codegen_expr(node.args[0])
                content_ptr = self.codegen_expr(node.args[1])
                mode_str = self.create_global_string("w")
                
                fp = self.builder.call(self.fopen, [filename_ptr, mode_str], name="file_ptr_w")
                self.builder.call(self.fputs, [content_ptr, fp])
                self.builder.call(self.fclose, [fp])
                
                return ir.Constant(self.i64_ty, 0)
                
        raise Exception(f"Nó não suportado no Codegen: {type(node)}")