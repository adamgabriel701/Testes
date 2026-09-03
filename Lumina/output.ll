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
define i64 @"main"()
{
entry:
  %".2" = bitcast [9 x i8]* @"str_7" to i8*
  %"saudacao_call" = call i64 @"saudacao"(i8* %".2")
  %"criar_log_call" = call i64 @"criar_log"()
  %".3" = bitcast [8 x i8]* @"str_8" to i8*
  %".4" = bitcast [2 x i8]* @"str_9" to i8*
  %"file_ptr" = call i8* @"fopen"(i8* %".3", i8* %".4")
  %"read_buf" = alloca [4096 x i8]
  %"buf_ptr" = bitcast [4096 x i8]* %"read_buf" to i8*
  %".5" = call i8* @"fgets"(i8* %"buf_ptr", i32 4096, i8* %"file_ptr")
  call void @"fclose"(i8* %"file_ptr")
  %"dados" = alloca i8*
  store i8* %"buf_ptr", i8** %"dados"
  %".8" = bitcast [21 x i8]* @"str_10" to i8*
  %".9" = bitcast [4 x i8]* @"str_11" to i8*
  %".10" = call i32 (i8*, ...) @"printf"(i8* %".9", i8* %".8")
  %".11" = bitcast [2 x i8]* @"str_12" to i8*
  %".12" = call i32 (i8*, ...) @"printf"(i8* %".11")
  %"dados_val" = load i8*, i8** %"dados"
  %".13" = bitcast [4 x i8]* @"str_13" to i8*
  %".14" = call i32 (i8*, ...) @"printf"(i8* %".13", i8* %"dados_val")
  %".15" = bitcast [2 x i8]* @"str_14" to i8*
  %".16" = call i32 (i8*, ...) @"printf"(i8* %".15")
  ret i64 0
}

@"str_7" = constant [9 x i8] c"Universo\00"
@"str_8" = constant [8 x i8] c"log.txt\00"
@"str_9" = constant [2 x i8] c"r\00"
@"str_10" = constant [21 x i8] c"Conteudo do arquivo:\00"
@"str_11" = constant [4 x i8] c"%s \00"
@"str_12" = constant [2 x i8] c"\0a\00"
@"str_13" = constant [4 x i8] c"%s \00"
@"str_14" = constant [2 x i8] c"\0a\00"