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
define i64 @"main"(i32 %".1", i8** %".2")
{
entry:
  %".4" = bitcast [27 x i8]* @"str_0" to i8*
  %".5" = bitcast [7 x i8]* @"str_1" to i8*
  %"str_concat_buf" = alloca [256 x i8]
  %"buf_ptr" = bitcast [256 x i8]* %"str_concat_buf" to i8*
  %".6" = bitcast [5 x i8]* @"str_2" to i8*
  %"sprintf_str_str" = call i32 (i8*, i8*, ...) @"sprintf"(i8* %"buf_ptr", i8* %".6", i8* %".4", i8* %".5")
  %"conteudo" = alloca i8*
  store i8* %"buf_ptr", i8** %"conteudo"
  %".8" = bitcast [8 x i8]* @"str_3" to i8*
  %"conteudo_val" = load i8*, i8** %"conteudo"
  %".9" = bitcast [2 x i8]* @"str_4" to i8*
  %"file_ptr_w" = call i8* @"fopen"(i8* %".8", i8* %".9")
  %".10" = call i32 @"fputs"(i8* %"conteudo_val", i8* %"file_ptr_w")
  call void @"fclose"(i8* %"file_ptr_w")
  %".12" = bitcast [8 x i8]* @"str_5" to i8*
  %".13" = bitcast [2 x i8]* @"str_6" to i8*
  %"file_ptr" = call i8* @"fopen"(i8* %".12", i8* %".13")
  %"read_buf" = alloca [4096 x i8]
  %"buf_ptr.1" = bitcast [4096 x i8]* %"read_buf" to i8*
  %".14" = call i8* @"fgets"(i8* %"buf_ptr.1", i32 4096, i8* %"file_ptr")
  call void @"fclose"(i8* %"file_ptr")
  %"lido" = alloca i8*
  store i8* %"buf_ptr.1", i8** %"lido"
  %".17" = bitcast [27 x i8]* @"str_7" to i8*
  %".18" = bitcast [4 x i8]* @"str_8" to i8*
  %".19" = call i32 (i8*, ...) @"printf"(i8* %".18", i8* %".17")
  %".20" = bitcast [2 x i8]* @"str_9" to i8*
  %".21" = call i32 (i8*, ...) @"printf"(i8* %".20")
  %"lido_val" = load i8*, i8** %"lido"
  %".22" = bitcast [4 x i8]* @"str_10" to i8*
  %".23" = call i32 (i8*, ...) @"printf"(i8* %".22", i8* %"lido_val")
  %".24" = bitcast [2 x i8]* @"str_11" to i8*
  %".25" = call i32 (i8*, ...) @"printf"(i8* %".24")
  ret i64 0
}

@"str_0" = constant [27 x i8] c"Log gerado pela Lumina em \00"
@"str_1" = constant [7 x i8] c"agora.\00"
@"str_2" = constant [5 x i8] c"%s%s\00"
@"str_3" = constant [8 x i8] c"log.txt\00"
@"str_4" = constant [2 x i8] c"w\00"
@"str_5" = constant [8 x i8] c"log.txt\00"
@"str_6" = constant [2 x i8] c"r\00"
@"str_7" = constant [27 x i8] c"Conte\c3\bado lido do arquivo:\00"
@"str_8" = constant [4 x i8] c"%s \00"
@"str_9" = constant [2 x i8] c"\0a\00"
@"str_10" = constant [4 x i8] c"%s \00"
@"str_11" = constant [2 x i8] c"\0a\00"