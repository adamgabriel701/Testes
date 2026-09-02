---
id: '01'
title: 'Sobre a Violência Silenciosa das Conversões Implícitas'
date: '12.11.24'
tags: ['JavaScript', 'Web']
readTime: '8 min'
excerpt: 'O JavaScript vai deixar você somar [] com {} e agradecer por isso. Um guia de campo para armadilhas.'
---

# Sobre a Violência Silenciosa das Conversões Implícitas

O JavaScript vai deixar você somar `[]` com `{}` e agradecer por isso. É um guia de campo para armadilhas.

> **Piada de JavaScript:** 
> O que é `[] + []`? String vazia. O que é `[] + {}`? `[object Object]`. Não tente entender, apenas aceite e aceite seus traumas.

## O Guia de Campo

Para entender as conversões implícitas, você precisa entender a diferença entre os operadores de soma `+` e o operador de coerção `ToPrimitive`.

```javascript
[] + {}; // "[object Object]"
{} + []; // 0
```

Por que isso acontece? No primeiro caso, o `+` atua como concatenação de strings, convertendo ambos os lados. No segundo caso, o `{` é interpretado como um bloco de código vazio, e o `+` atua como operador unário de soma, convertendo o array `[]` em número `0`.

> **Regra nº 1 da programação:** 
> Nunca faça deploy em uma sexta-feira às 17h. O JavaScript pode tentar te ajudar com conversões implícitas de timezone e você vai perder o seu fim de semana.
