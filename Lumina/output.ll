; ModuleID = "lumina_module"
target triple = "x86_64-pc-linux-gnu"
target datalayout = ""

declare i32 @"printf"(i8* %".1", ...)

declare i32 @"scanf"(i8* %".1", ...)

declare i32 @"sprintf"(i8* %".1", i8* %".2", ...)

declare i64 @"atoi"(i8* %".1")

declare i8* @"malloc"(i64 %".1")

declare void @"free"(i8* %".1")

declare i8* @"fopen"(i8* %".1", i8* %".2")

declare i8* @"fgets"(i8* %".1", i32 %".2", i8* %".3")

declare i32 @"fputs"(i8* %".1", i8* %".2")

declare void @"fclose"(i8* %".1")

@"__lumina_argv" = internal global i8** null
define i64 @"saudacao"(i8* %".1")
{
entry:
  %"nome" = alloca i8*
  store i8* %".1", i8** %"nome"
  %".4" = bitcast [5 x i8]* @"str_0" to i8*
  %"nome_val" = load i8*, i8** %"nome"
  %"str_concat_buf" = alloca [256 x i8]
  %"buf_ptr" = bitcast [256 x i8]* %"str_concat_buf" to i8*
  %".5" = bitcast [5 x i8]* @"str_1" to i8*
  %"sprintf_str_str" = call i32 (i8*, i8*, ...) @"sprintf"(i8* %"buf_ptr", i8* %".5", i8* %".4", i8* %"nome_val")
  %"msg" = alloca i8*
  store i8* %"buf_ptr", i8** %"msg"
  %"msg_val" = load i8*, i8** %"msg"
  %".7" = bitcast [4 x i8]* @"str_2" to i8*
  %".8" = call i32 (i8*, ...) @"printf"(i8* %".7", i8* %"msg_val")
  %".9" = bitcast [2 x i8]* @"str_3" to i8*
  %".10" = call i32 (i8*, ...) @"printf"(i8* %".9")
  ret i64 0
}

@"str_0" = constant [5 x i8] c"Ola \00"
@"str_1" = constant [5 x i8] c"%s%s\00"
@"str_2" = constant [4 x i8] c"%s \00"
@"str_3" = constant [2 x i8] c"\0a\00"
define i64 @"criar_log"()
{
entry:
  %".2" = bitcast [30 x i8]* @"str_4" to i8*
  %"conteudo" = alloca i8*
  store i8* %".2", i8** %"conteudo"
  %".4" = bitcast [8 x i8]* @"str_5" to i8*
  %"conteudo_val" = load i8*, i8** %"conteudo"
  %".5" = bitcast [2 x i8]* @"str_6" to i8*
  %"file_ptr_w" = call i8* @"fopen"(i8* %".4", i8* %".5")
  %".6" = call i32 @"fputs"(i8* %"conteudo_val", i8* %"file_ptr_w")
  call void @"fclose"(i8* %"file_ptr_w")
  ret i64 0
}

@"str_4" = constant [30 x i8] c"Sistema iniciado com sucesso!\00"
@"str_5" = constant [8 x i8] c"log.txt\00"
@"str_6" = constant [2 x i8] c"w\00"
define i64 @"main"(i32 %".1", i8** %".2")
{
entry:
  %"argc" = alloca i32
  store i32 %".1", i32* %"argc"
  %"argv" = alloca i8**
  store i8** %".2", i8*** %"argv"
  %".6" = bitcast [32 x i8]* @"str_7" to i8*
  %".7" = bitcast [4 x i8]* @"str_8" to i8*
  %".8" = call i32 (i8*, ...) @"printf"(i8* %".7", i8* %".6")
  %".9" = bitcast [2 x i8]* @"str_9" to i8*
  %".10" = call i32 (i8*, ...) @"printf"(i8* %".9")
  %"argc_val" = load i32, i32* %"argc"
  %"cmp_tmp" = icmp sgt i32 %"argc_val", 1
  br i1 %"cmp_tmp", label %"if.then", label %"if.else"
if.then:
  %"argv_val" = load i8**, i8*** %"argv"
  %"arg_ptr_ptr" = getelementptr i8*, i8** %"argv_val", i64 1
  %"arg_val" = load i8*, i8** %"arg_ptr_ptr"
  %"nome" = alloca i8*
  store i8* %"arg_val", i8** %"nome"
  %".13" = bitcast [5 x i8]* @"str_10" to i8*
  %"nome_val" = load i8*, i8** %"nome"
  %"str_concat_buf" = alloca [256 x i8]
  %"buf_ptr" = bitcast [256 x i8]* %"str_concat_buf" to i8*
  %".14" = bitcast [5 x i8]* @"str_11" to i8*
  %"sprintf_str_str" = call i32 (i8*, i8*, ...) @"sprintf"(i8* %"buf_ptr", i8* %".14", i8* %".13", i8* %"nome_val")
  %".15" = bitcast [4 x i8]* @"str_12" to i8*
  %".16" = call i32 (i8*, ...) @"printf"(i8* %".15", i8* %"buf_ptr")
  %".17" = bitcast [2 x i8]* @"str_13" to i8*
  %".18" = call i32 (i8*, ...) @"printf"(i8* %".17")
  br label %"if.end"
if.else:
  %".20" = bitcast [24 x i8]* @"str_14" to i8*
  %".21" = bitcast [4 x i8]* @"str_15" to i8*
  %".22" = call i32 (i8*, ...) @"printf"(i8* %".21", i8* %".20")
  %".23" = bitcast [2 x i8]* @"str_16" to i8*
  %".24" = call i32 (i8*, ...) @"printf"(i8* %".23")
  br label %"if.end"
if.end:
  %"x" = alloca i64
  store i64 10, i64* %"x"
  %"x_old" = load i64, i64* %"x"
  %"add_assign" = add i64 %"x_old", 5
  store i64 %"add_assign", i64* %"x"
  %".28" = bitcast [12 x i8]* @"str_17" to i8*
  %".29" = bitcast [4 x i8]* @"str_18" to i8*
  %".30" = call i32 (i8*, ...) @"printf"(i8* %".29", i8* %".28")
  %"x_val" = load i64, i64* %"x"
  %".31" = bitcast [4 x i8]* @"str_19" to i8*
  %".32" = call i32 (i8*, ...) @"printf"(i8* %".31", i64 %"x_val")
  %".33" = bitcast [2 x i8]* @"str_20" to i8*
  %".34" = call i32 (i8*, ...) @"printf"(i8* %".33")
  %"x_old.1" = load i64, i64* %"x"
  %"mul_assign" = mul i64 %"x_old.1", 2
  store i64 %"mul_assign", i64* %"x"
  %".36" = bitcast [22 x i8]* @"str_21" to i8*
  %".37" = bitcast [4 x i8]* @"str_22" to i8*
  %".38" = call i32 (i8*, ...) @"printf"(i8* %".37", i8* %".36")
  %"x_val.1" = load i64, i64* %"x"
  %".39" = bitcast [4 x i8]* @"str_23" to i8*
  %".40" = call i32 (i8*, ...) @"printf"(i8* %".39", i64 %"x_val.1")
  %".41" = bitcast [2 x i8]* @"str_24" to i8*
  %".42" = call i32 (i8*, ...) @"printf"(i8* %".41")
  %".43" = bitcast [3 x i8]* @"str_25" to i8*
  %"str_num" = alloca i8*
  store i8* %".43", i8** %"str_num"
  %"str_num_val" = load i8*, i8** %"str_num"
  %"atoi_call" = call i64 @"atoi"(i8* %"str_num_val")
  %"num" = alloca i64
  store i64 %"atoi_call", i64* %"num"
  %".46" = bitcast [28 x i8]* @"str_26" to i8*
  %".47" = bitcast [4 x i8]* @"str_27" to i8*
  %".48" = call i32 (i8*, ...) @"printf"(i8* %".47", i8* %".46")
  %"num_val" = load i64, i64* %"num"
  %".49" = bitcast [4 x i8]* @"str_28" to i8*
  %".50" = call i32 (i8*, ...) @"printf"(i8* %".49", i64 %"num_val")
  %".51" = bitcast [2 x i8]* @"str_29" to i8*
  %".52" = call i32 (i8*, ...) @"printf"(i8* %".51")
  %".53" = bitcast [27 x i8]* @"str_30" to i8*
  %".54" = bitcast [4 x i8]* @"str_31" to i8*
  %".55" = call i32 (i8*, ...) @"printf"(i8* %".54", i8* %".53")
  %"num_val.1" = load i64, i64* %"num"
  %"float_cast" = sitofp i64 %"num_val.1" to double
  %".56" = bitcast [4 x i8]* @"str_32" to i8*
  %".57" = call i32 (i8*, ...) @"printf"(i8* %".56", double %"float_cast")
  %".58" = bitcast [2 x i8]* @"str_33" to i8*
  %".59" = call i32 (i8*, ...) @"printf"(i8* %".58")
  %"ativo" = alloca i1
  store i1 1, i1* %"ativo"
  %"logado" = alloca i1
  store i1 0, i1* %"logado"
  %"ativo_val" = load i1, i1* %"ativo"
  %"logado_val" = load i1, i1* %"logado"
  %"not_tmp" = xor i1 %"logado_val", 1
  %"and_tmp" = and i1 %"ativo_val", %"not_tmp"
  br i1 %"and_tmp", label %"if.then.1", label %"if.end.1"
if.then.1:
  %".63" = bitcast [30 x i8]* @"str_34" to i8*
  %".64" = bitcast [4 x i8]* @"str_35" to i8*
  %".65" = call i32 (i8*, ...) @"printf"(i8* %".64", i8* %".63")
  %".66" = bitcast [2 x i8]* @"str_36" to i8*
  %".67" = call i32 (i8*, ...) @"printf"(i8* %".66")
  br label %"if.end.1"
if.end.1:
  ret i64 0
}

@"str_7" = constant [32 x i8] c"Argumentos da linha de comando:\00"
@"str_8" = constant [4 x i8] c"%s \00"
@"str_9" = constant [2 x i8] c"\0a\00"
@"str_10" = constant [5 x i8] c"Ola \00"
@"str_11" = constant [5 x i8] c"%s%s\00"
@"str_12" = constant [4 x i8] c"%s \00"
@"str_13" = constant [2 x i8] c"\0a\00"
@"str_14" = constant [24 x i8] c"Nenhum argumento extra.\00"
@"str_15" = constant [4 x i8] c"%s \00"
@"str_16" = constant [2 x i8] c"\0a\00"
@"str_17" = constant [12 x i8] c"X somado 5:\00"
@"str_18" = constant [4 x i8] c"%s \00"
@"str_19" = constant [4 x i8] c"%d \00"
@"str_20" = constant [2 x i8] c"\0a\00"
@"str_21" = constant [22 x i8] c"X multiplicado por 2:\00"
@"str_22" = constant [4 x i8] c"%s \00"
@"str_23" = constant [4 x i8] c"%d \00"
@"str_24" = constant [2 x i8] c"\0a\00"
@"str_25" = constant [3 x i8] c"42\00"
@"str_26" = constant [28 x i8] c"String convertida para int:\00"
@"str_27" = constant [4 x i8] c"%s \00"
@"str_28" = constant [4 x i8] c"%d \00"
@"str_29" = constant [2 x i8] c"\0a\00"
@"str_30" = constant [27 x i8] c"Int convertido para float:\00"
@"str_31" = constant [4 x i8] c"%s \00"
@"str_32" = constant [4 x i8] c"%f \00"
@"str_33" = constant [2 x i8] c"\0a\00"
@"str_34" = constant [30 x i8] c"Usuario ativo mas nao logado.\00"
@"str_35" = constant [4 x i8] c"%s \00"
@"str_36" = constant [2 x i8] c"\0a\00"