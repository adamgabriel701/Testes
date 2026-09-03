from llvmlite import ir
from ..ast import ReturnStmt, VarDecl, AssignStmt, IfStmt, WhileStmt, ForStmt, MemberExpr, ArrayExpr, MatchStmt, DerefExpr, IndexExpr, VariableExpr

class StatementCodegen:
    def codegen_stmt(self, node):
        if isinstance(node, VarDecl):
            if node.var_type in self.struct_types:
                struct_ty = self.struct_types[node.var_type]
                ptr = self.builder.alloca(struct_ty, name=node.name)
                self.symbol_table[node.name] = ptr
                self.var_types[node.name] = struct_ty
            elif isinstance(node.value, ArrayExpr):
                num_elements = len(node.value.elements)
                arr_ty = ir.ArrayType(self.i64_ty, num_elements)
                ptr = self.builder.alloca(arr_ty, name=node.name)
                self.var_types[node.name] = arr_ty
                self.symbol_table[node.name] = ptr
                self.array_sizes[node.name] = num_elements
                for i, el in enumerate(node.value.elements):
                    el_val = self.codegen_expr(el)
                    if el_val.type != self.i64_ty: el_val = self.builder.fptosi(el_val, self.i64_ty, name="to_int")
                    elem_ptr = self.builder.gep(ptr, [ir.Constant(self.i32_ty, 0), ir.Constant(self.i32_ty, i)])
                    self.builder.store(el_val, elem_ptr)
            else:
                val = self.codegen_expr(node.value) if node.value else ir.Constant(self.i64_ty, 0)
                var_ty = val.type
                if node.var_type == "float":
                    var_ty = self.f64_ty
                    val = self.to_float_if_needed(val)
                ptr = self.builder.alloca(var_ty, name=node.name)
                self.builder.store(val, ptr)
                self.symbol_table[node.name] = ptr
                self.var_types[node.name] = var_ty

        elif isinstance(node, AssignStmt):
            # 1. Atribuição em Ponteiro Desreferenciado (*ptr = val)
            if isinstance(node.target, DerefExpr):
                ptr = self.codegen_expr(node.target.val)
                if ptr.type == self.voidptr_ty:
                    ptr = self.builder.bitcast(ptr, self.i64_ty.as_pointer(), name="ptr_cast")
                val = self.codegen_expr(node.value)
                self.builder.store(val, ptr)
                
            # 2. Atribuição em Array (arr[i] = val)
            elif isinstance(node.target, IndexExpr):
                # Se for array da pilha (Stack)
                if isinstance(node.target.array, VariableExpr) and node.target.array.name in self.array_sizes:
                    arr_ptr = self.symbol_table.get(node.target.array.name)
                    idx_val = self.codegen_expr(node.target.index)
                    if idx_val.type != self.i64_ty: idx_val = self.builder.fptosi(idx_val, self.i64_ty, name="idx_int")
                    elem_ptr = self.builder.gep(arr_ptr, [ir.Constant(self.i32_ty, 0), idx_val], name="assign_elem_ptr")
                    val = self.codegen_expr(node.value)
                    self.builder.store(val, elem_ptr)
                else:
                    # Se for array do Heap
                    ptr = self.codegen_expr(node.target.array)
                    idx_val = self.codegen_expr(node.target.index)
                    if idx_val.type != self.i64_ty: idx_val = self.builder.fptosi(idx_val, self.i64_ty, name="idx_int")
                    if ptr.type == self.voidptr_ty:
                        ptr = self.builder.bitcast(ptr, self.i64_ty.as_pointer(), name="heap_assign_cast")
                    elem_ptr = self.builder.gep(ptr, [idx_val], name="heap_assign_ptr")
                    val = self.codegen_expr(node.value)
                    self.builder.store(val, elem_ptr)
                    
            # 3. Atribuição em Membro de Struct (obj.campo = val ou a.b.c = val)
            elif isinstance(node.target, MemberExpr):
                # Chama o método recursivo para resolver ponteiros encadeados
                obj_ptr = self.resolve_member_ptr(node.target)
                val = self.codegen_expr(node.value)
                
                # Se for armazenar um ponteiro em outro ponteiro de struct, faz o bitcast
                if isinstance(val.type, ir.PointerType) and isinstance(obj_ptr.type.pointee, ir.PointerType):
                    val = self.builder.bitcast(val, obj_ptr.type.pointee, name="ptr_cast")
                    
                self.builder.store(val, obj_ptr)
                
            # 4. Atribuição em Variável Simples (x = val)
            else:
                ptr = self.symbol_table.get(node.target.name)
                if not ptr: raise Exception(f"Variável '{node.target.name}' não declarada.")
                val = self.codegen_expr(node.value)
                var_ty = self.var_types[node.target.name]
                if var_ty == self.f64_ty and val.type == self.i64_ty: val = self.to_float_if_needed(val)
                self.builder.store(val, ptr)

        elif isinstance(node, ReturnStmt):
            # Agora retorna uma lista de valores. Retornamos apenas o primeiro por enquanto.
            val = self.codegen_expr(node.values[0])
            self.builder.ret(val)

        elif isinstance(node, IfStmt):
            cond_val = self.codegen_expr(node.condition)
            if cond_val.type != ir.IntType(1): cond_val = self.builder.icmp_signed("!=", cond_val, ir.Constant(self.i64_ty, 0), name="if_cond")
            then_bb = self.builder.append_basic_block(name="if.then")
            else_bb = self.builder.append_basic_block(name="if.else") if node.else_body else None
            end_bb = self.builder.append_basic_block(name="if.end")
            if else_bb: self.builder.cbranch(cond_val, then_bb, else_bb)
            else: self.builder.cbranch(cond_val, then_bb, end_bb)
            self.builder.position_at_end(then_bb)
            for stmt in node.then_body: self.codegen_stmt(stmt)
            if not self.builder.block.is_terminated: self.builder.branch(end_bb)
            if else_bb:
                self.builder.position_at_end(else_bb)
                for stmt in node.else_body: self.codegen_stmt(stmt)
                if not self.builder.block.is_terminated: self.builder.branch(end_bb)
            self.builder.position_at_end(end_bb)

        elif isinstance(node, WhileStmt):
            cond_bb = self.builder.append_basic_block(name="while.cond")
            body_bb = self.builder.append_basic_block(name="while.body")
            end_bb = self.builder.append_basic_block(name="while.end")
            self.builder.branch(cond_bb)
            self.builder.position_at_end(cond_bb)
            cond_val = self.codegen_expr(node.condition)
            if cond_val.type != ir.IntType(1): cond_val = self.builder.icmp_signed("!=", cond_val, ir.Constant(self.i64_ty, 0), name="while_cond")
            self.builder.cbranch(cond_val, body_bb, end_bb)
            self.builder.position_at_end(body_bb)
            for stmt in node.body: self.codegen_stmt(stmt)
            if not self.builder.block.is_terminated: self.builder.branch(cond_bb)
            self.builder.position_at_end(end_bb)

        elif isinstance(node, ForStmt):
            ptr = self.builder.alloca(self.i64_ty, name=node.var_name)
            start_val = self.codegen_expr(node.start)
            if start_val.type != self.i64_ty: start_val = self.builder.fptosi(start_val, self.i64_ty, name="for_start_int")
            self.builder.store(start_val, ptr)
            self.symbol_table[node.var_name] = ptr
            self.var_types[node.var_name] = self.i64_ty
            end_val = self.codegen_expr(node.end)
            if end_val.type != self.i64_ty: end_val = self.builder.fptosi(end_val, self.i64_ty, name="for_end_int")

            cond_bb = self.builder.append_basic_block(name="for.cond")
            body_bb = self.builder.append_basic_block(name="for.body")
            end_bb = self.builder.append_basic_block(name="for.end")
            self.builder.branch(cond_bb)
            self.builder.position_at_end(cond_bb)
            curr_val = self.builder.load(ptr, name=node.var_name + "_val")
            cond = self.builder.icmp_signed("<", curr_val, end_val, name="for_cond")
            self.builder.cbranch(cond, body_bb, end_bb)
            self.builder.position_at_end(body_bb)
            for stmt in node.body: self.codegen_stmt(stmt)
            if not self.builder.block.is_terminated:
                next_val = self.builder.add(curr_val, ir.Constant(self.i64_ty, 1), name="for_next")
                self.builder.store(next_val, ptr)
                self.builder.branch(cond_bb)
            self.builder.position_at_end(end_bb)
            
        elif isinstance(node, MatchStmt):
            cond_val = self.codegen_expr(node.condition)
            if cond_val.type != self.i64_ty:
                cond_val = self.builder.fptosi(cond_val, self.i64_ty, name="match_cond_int")
            default_bb = self.builder.append_basic_block(name="match.default")
            end_bb = self.builder.append_basic_block(name="match.end")
            case_bbs = []
            for val_node, _ in node.cases:
                case_bbs.append(self.builder.append_basic_block(name=f"match.case_{val_node.value}"))
            sw = self.builder.switch(cond_val, default_bb)
            for i, (val_node, body) in enumerate(node.cases):
                case_bb = case_bbs[i]
                val = ir.Constant(self.i64_ty, int(val_node.value))
                sw.add_case(val, case_bb)
                self.builder.position_at_end(case_bb)
                for stmt in body: self.codegen_stmt(stmt)
                if not self.builder.block.is_terminated: self.builder.branch(end_bb)
            self.builder.position_at_end(default_bb)
            if node.default:
                for stmt in node.default: self.codegen_stmt(stmt)
            if not self.builder.block.is_terminated: self.builder.branch(end_bb)
            self.builder.position_at_end(end_bb)
            
        else:
            self.codegen_expr(node)