from llvmlite import ir

class BuiltinManager:
    @staticmethod
    def setup_builtins(module):
        voidptr_ty = ir.IntType(8).as_pointer()
        
        printf_ty = ir.FunctionType(ir.IntType(32), [voidptr_ty], var_arg=True)
        printf = ir.Function(module, printf_ty, name="printf")
        
        scanf_ty = ir.FunctionType(ir.IntType(32), [voidptr_ty], var_arg=True)
        scanf = ir.Function(module, scanf_ty, name="scanf")
        
        atoi_ty = ir.FunctionType(ir.IntType(64), [voidptr_ty])
        atoi = ir.Function(module, atoi_ty, name="atoi")
        
        # NOVO: malloc e free para Arrays Dinâmicos
        malloc_ty = ir.FunctionType(voidptr_ty, [ir.IntType(64)])
        malloc_fn = ir.Function(module, malloc_ty, name="malloc")
        
        free_ty = ir.FunctionType(ir.VoidType(), [voidptr_ty])
        free_fn = ir.Function(module, free_ty, name="free")
        
        return printf, scanf, atoi, malloc_fn, free_fn