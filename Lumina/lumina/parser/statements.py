from ..ast import VarDecl, AssignStmt, ReturnStmt, Function, IfStmt, WhileStmt, ForStmt, StructDecl, VariableExpr, MatchStmt, ImplBlock, DerefExpr, MemberExpr, IndexExpr
from ..lexer import TokenType

class StatementParser:
    def parse_statement(self):
        token = self.current_token()
        
        if token.type == TokenType.KEYWORD and token.value == 'struct':
            return self.parse_struct()
            
        elif token.type == TokenType.KEYWORD and token.value == 'impl':
            return self.parse_impl()
            
        elif token.type == TokenType.KEYWORD and token.value == 'return':
            self.consume()
            values = [self.parse_expression()]
            # NOVO: Se vier vírgula, temos múltiplos retornos
            while self.current_token() and self.current_token().type == TokenType.OP and self.current_token().value == ',':
                self.consume()
                values.append(self.parse_expression())
            self.consume(TokenType.NEWLINE)
            return ReturnStmt(values)
            
        elif token.type == TokenType.KEYWORD and token.value in ('let', 'mut'):
            is_mutable = (token.value == 'mut')
            self.consume()
            var_name = self.consume(TokenType.IDENT).value
            var_type = None
            if self.current_token().type == TokenType.OP and self.current_token().value == ':':
                self.consume()
                var_type = self.consume(TokenType.IDENT).value
            expr = None
            if self.current_token().type == TokenType.OP and self.current_token().value == '=':
                self.consume()
                expr = self.parse_expression()
            self.consume(TokenType.NEWLINE)
            return VarDecl(var_name, var_type, expr, is_mutable)
            
        elif token.type == TokenType.KEYWORD and token.value in ('if', 'elif'):
            return self.parse_if()
        elif token.type == TokenType.KEYWORD and token.value == 'while':
            return self.parse_while()
        elif token.type == TokenType.KEYWORD and token.value == 'for':
            return self.parse_for()
        elif token.type == TokenType.KEYWORD and token.value == 'match':
            return self.parse_match()
            
        # Atribuição em Ponteiro (*ptr = val)
        elif token.type == TokenType.OP and token.value == '*':
            node = self.parse_expression()
            if self.current_token() and self.current_token().type == TokenType.OP and self.current_token().value == '=':
                self.consume()
                expr = self.parse_expression()
                self.consume(TokenType.NEWLINE)
                return AssignStmt(node, expr)
            self.consume(TokenType.NEWLINE)
            return node

        # Atribuição em Variável Simples (x = val)
        elif token.type == TokenType.IDENT and self.peek() and self.peek().type == TokenType.OP and self.peek().value == '=':
            name = self.consume(TokenType.IDENT).value
            self.consume(TokenType.OP) # '='
            expr = self.parse_expression()
            self.consume(TokenType.NEWLINE)
            return AssignStmt(VariableExpr(name), expr)
            
        # NOVO: Atribuição em Array (arr[i] = val) ou Membro de Struct (obj.x = val)
        # Se for IDENT seguido de '[' ou '.', parseamos a expressão completa
        elif token.type == TokenType.IDENT and self.peek() and self.peek().type == TokenType.OP and self.peek().value in ('[', '.'):
            node = self.parse_expression()
            if self.current_token() and self.current_token().type == TokenType.OP and self.current_token().value == '=':
                self.consume() # '='
                expr = self.parse_expression()
                self.consume(TokenType.NEWLINE)
                return AssignStmt(node, expr)
            self.consume(TokenType.NEWLINE)
            return node
            
        else:
            expr = self.parse_expression()
            self.consume(TokenType.NEWLINE)
            return expr

    def parse_struct(self):
        self.consume() # 'struct'
        name = self.consume(TokenType.IDENT).value
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        fields = {}
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            field_name = self.consume(TokenType.IDENT).value
            self.consume(TokenType.OP) # ':'
            field_type = self.consume(TokenType.IDENT).value
            fields[field_name] = field_type
            self.consume(TokenType.NEWLINE)
            
        self.consume(TokenType.DEDENT)
        return StructDecl(name, fields)

    def parse_impl(self):
        self.consume() # 'impl'
        struct_name = self.consume(TokenType.IDENT).value
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        methods = []
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            if self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'fn':
                func = self.parse_function()
                # Renomeia internamente para StructName_metodo para evitar colisão
                func.name = f"{struct_name}_{func.name}"
                methods.append(func)
                
        self.consume(TokenType.DEDENT)
        return ImplBlock(struct_name, methods)

    def parse_if(self):
        self.consume() # 'if' ou 'elif'
        condition = self.parse_expression()
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        then_body = []
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            then_body.append(self.parse_statement())
        self.consume(TokenType.DEDENT)
        
        else_body = None
        if self.current_token() and self.current_token().type == TokenType.KEYWORD and self.current_token().value in ('else', 'elif'):
            if self.current_token().value == 'elif':
                else_body = [self.parse_if()]
            else:
                self.consume() # 'else'
                self.consume(TokenType.OP) # ':'
                self.consume(TokenType.NEWLINE)
                self.consume(TokenType.INDENT)
                else_body = []
                while self.current_token() and self.current_token().type != TokenType.DEDENT:
                    if self.current_token().type == TokenType.NEWLINE:
                        self.consume()
                        continue
                    else_body.append(self.parse_statement())
                self.consume(TokenType.DEDENT)
                
        return IfStmt(condition, then_body, else_body)

    def parse_while(self):
        self.consume() # 'while'
        condition = self.parse_expression()
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        body = []
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            body.append(self.parse_statement())
        self.consume(TokenType.DEDENT)
        return WhileStmt(condition, body)

    def parse_for(self):
        self.consume() # 'for'
        var_name = self.consume(TokenType.IDENT).value
        self.consume(TokenType.KEYWORD) # 'in'
        start = self.parse_expression()
        self.consume(TokenType.OP) # '..'
        end = self.parse_expression()
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        body = []
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            body.append(self.parse_statement())
        self.consume(TokenType.DEDENT)
        return ForStmt(var_name, start, end, body)

    def parse_match(self):
        self.consume() # 'match'
        condition = self.parse_expression()
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        cases = []
        default = None
        
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
                
            if self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'case':
                self.consume() # 'case'
                val = self.parse_expression()
                self.consume(TokenType.OP) # ':'
                self.consume(TokenType.NEWLINE)
                self.consume(TokenType.INDENT)
                
                body = []
                while self.current_token() and self.current_token().type != TokenType.DEDENT:
                    if self.current_token().type == TokenType.NEWLINE:
                        self.consume()
                        continue
                    body.append(self.parse_statement())
                self.consume(TokenType.DEDENT)
                cases.append((val, body))
                
            elif self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'default':
                self.consume() # 'default'
                self.consume(TokenType.OP) # ':'
                self.consume(TokenType.NEWLINE)
                self.consume(TokenType.INDENT)
                
                default = []
                while self.current_token() and self.current_token().type != TokenType.DEDENT:
                    if self.current_token().type == TokenType.NEWLINE:
                        self.consume()
                        continue
                    default.append(self.parse_statement())
                self.consume(TokenType.DEDENT)
                
        self.consume(TokenType.DEDENT)
        return MatchStmt(condition, cases, default)

    def parse_function(self):
        self.consume(TokenType.KEYWORD) # 'fn'
        name = self.consume(TokenType.IDENT).value
        
        params = []
        self.consume(TokenType.OP) # '('
        if self.current_token().type != TokenType.OP or self.current_token().value != ')':
            while True:
                p_name = self.consume(TokenType.IDENT).value
                self.consume(TokenType.OP) # ':'
                p_type = self.consume(TokenType.IDENT).value
                params.append((p_name, p_type))
                if self.current_token().type == TokenType.OP and self.current_token().value == ',':
                    self.consume() # ','
                else:
                    break
        self.consume(TokenType.OP) # ')'
        
        return_type = "void"
        if self.current_token().type == TokenType.OP and self.current_token().value == '->':
            self.consume() # '->'
            return_type = self.consume(TokenType.IDENT).value
            
        self.consume(TokenType.OP) # ':'
        self.consume(TokenType.NEWLINE)
        self.consume(TokenType.INDENT)
        
        body = []
        while self.current_token() and self.current_token().type != TokenType.DEDENT:
            if self.current_token().type == TokenType.NEWLINE:
                self.consume()
                continue
            body.append(self.parse_statement())
            
        self.consume(TokenType.DEDENT)
        return Function(name, params, return_type, body)