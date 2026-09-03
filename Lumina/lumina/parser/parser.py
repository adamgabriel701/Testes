from ..lexer.tokens import TokenType
from .expressions import ExpressionParser
from .statements import StatementParser
from ..ast import StructDecl, ImplBlock, ImportStmt

class Parser(ExpressionParser, StatementParser):
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current_token(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def peek(self, offset=1):
        if self.pos + offset < len(self.tokens): return self.tokens[self.pos + offset]
        return None

    def consume(self, expected_type=None):
        token = self.current_token()
        if token and (expected_type is None or token.type == expected_type):
            self.pos += 1
            return token
        if token: 
            raise Exception(f"Erro de Sintaxe na linha {token.line}, coluna {token.col}:\nEsperado {expected_type}, mas encontrei {token.type} ('{token.value}')")
        raise Exception("Erro de Sintaxe: Fim inesperado do código")

    def parse(self):
        declarations = []
        while self.current_token() and self.current_token().type != TokenType.EOF:
            if self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'fn':
                declarations.append(self.parse_function())
            elif self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'struct':
                declarations.append(self.parse_struct())
            elif self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'impl':
                declarations.append(self.parse_impl())
            # NOVO: Captura imports no escopo global
            elif self.current_token().type == TokenType.KEYWORD and self.current_token().value == 'import':
                declarations.append(self.parse_statement())
            else:
                self.consume()
        return declarations