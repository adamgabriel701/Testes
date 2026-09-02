---
id: '06'
title: 'PostgreSQL: A Magia que Você Ignorava'
date: '15.09.24'
tags: ['Banco de Dados', 'SQL']
readTime: '12 min'
excerpt: 'JSONB, Arrays e CTEs. Como parar de tratar o Postgres como um mero armazenador de tabelas.'
---

# PostgreSQL: A Magia que Você Ignorava

JSONB, Arrays e CTEs. Como parar de tratar o Postgres como um mero armazenador de tabelas e começar a usar seu verdadeiro poder.

> **Piada de Banco de Dados:** 
> Por que os programadores confundem o Halloween com o Natal? Porque Oct 31 == Dec 25. (Octal 31 é igual a Decimal 25).

## JSONB é seu amigo

Muitas vezes os desenvolvedores correm para bancos NoSQL só para guardar dados não estruturados. Mas o PostgreSQL tem o tipo `JSONB`, que permite indexar e consultar JSON de forma nativa e super rápida.

```sql
-- Busca usuários cuja preferência de tema seja dark
-- dentro de uma coluna JSONB chamada 'preferences'
SELECT * FROM users 
WHERE preferences @> '{"theme": "dark"}';
```

## CTEs (Common Table Expressions)

As CTEs permitem dividir consultas complexas em blocos legíveis. É como criar variáveis dentro de uma query SQL.

> **Commit da Semana:** 
> `fix: adicionado JOIN para corrigir bug que era na verdade um problema de dados mortos no cache. Novamente.`
