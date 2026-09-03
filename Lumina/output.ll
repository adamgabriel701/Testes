; ModuleID = "lumina_module"
target triple = "x86_64-pc-linux-gnu"
target datalayout = ""

%"No" = type {i64, %"No"*}
declare i32 @"printf"(i8* %".1", ...)

declare i32 @"scanf"(i8* %".1", ...)

declare i64 @"atoi"(i8* %".1")

declare i8* @"malloc"(i64 %".1")

declare void @"free"(i8* %".1")

define i64 @"main"()
{
entry:
  %"cabeca" = alloca %"No"
  %"member_ptr" = getelementptr inbounds %"No", %"No"* %"cabeca", i32 0, i32 0
  store i64 1, i64* %"member_ptr"
  %"size_bytes" = mul i64 1, 8
  %"malloc_ptr" = call i8* @"malloc"(i64 %"size_bytes")
  %"no2" = alloca i8*
  store i8* %"malloc_ptr", i8** %"no2"
  %"no2_val" = load i8*, i8** %"no2"
  %"ptr_cast" = bitcast i8* %"no2_val" to i64*
  store i64 2, i64* %"ptr_cast"
  %"member_ptr.1" = getelementptr inbounds %"No", %"No"* %"cabeca", i32 0, i32 1
  %"no2_val.1" = load i8*, i8** %"no2"
  %"ptr_cast.1" = bitcast i8* %"no2_val.1" to %"No"*
  store %"No"* %"ptr_cast.1", %"No"** %"member_ptr.1"
  %"member_ptr.2" = getelementptr inbounds %"No", %"No"* %"cabeca", i32 0, i32 0
  %"member_val" = load i64, i64* %"member_ptr.2"
  %"val1" = alloca i64
  store i64 %"member_val", i64* %"val1"
  %"member_ptr.3" = getelementptr inbounds %"No", %"No"* %"cabeca", i32 0, i32 1
  %"member_val.1" = load %"No"*, %"No"** %"member_ptr.3"
  %"member_ptr.4" = getelementptr inbounds %"No", %"No"* %"member_val.1", i32 0, i32 0
  %"member_val.2" = load i64, i64* %"member_ptr.4"
  %"val2" = alloca i64
  store i64 %"member_val.2", i64* %"val2"
  %".8" = bitcast [25 x i8]* @"str_0" to i8*
  %".9" = bitcast [4 x i8]* @"str_1" to i8*
  %".10" = call i32 (i8*, ...) @"printf"(i8* %".9", i8* %".8")
  %".11" = bitcast [2 x i8]* @"str_2" to i8*
  %".12" = call i32 (i8*, ...) @"printf"(i8* %".11")
  %"val1_val" = load i64, i64* %"val1"
  %".13" = bitcast [4 x i8]* @"str_3" to i8*
  %".14" = call i32 (i8*, ...) @"printf"(i8* %".13", i64 %"val1_val")
  %".15" = bitcast [2 x i8]* @"str_4" to i8*
  %".16" = call i32 (i8*, ...) @"printf"(i8* %".15")
  %"val2_val" = load i64, i64* %"val2"
  %".17" = bitcast [4 x i8]* @"str_5" to i8*
  %".18" = call i32 (i8*, ...) @"printf"(i8* %".17", i64 %"val2_val")
  %".19" = bitcast [2 x i8]* @"str_6" to i8*
  %".20" = call i32 (i8*, ...) @"printf"(i8* %".19")
  ret i64 0
}

@"str_0" = constant [25 x i8] c"Valores da lista ligada:\00"
@"str_1" = constant [4 x i8] c"%s \00"
@"str_2" = constant [2 x i8] c"\0a\00"
@"str_3" = constant [4 x i8] c"%d \00"
@"str_4" = constant [2 x i8] c"\0a\00"
@"str_5" = constant [4 x i8] c"%d \00"
@"str_6" = constant [2 x i8] c"\0a\00"