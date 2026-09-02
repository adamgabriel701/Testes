---
id: '99'
title: ' gambiarra do mes: O checkbox que salva vidas'
date: '01.11.24'
tags: ['Gambiarra', 'Carreira']
readTime: '3 min'
excerpt: 'Análise bem-humorada de uma solução temporária que virou definitiva na arquitetura de software.'
---

# A Gambiarra do Mês

Você sabe que uma solução temporária se tornou definitiva quando ela sobrevive a 3 mudanças de gerência. Hoje analisamos o "Checkbox Mágico".

> **Glossário Sincero:**
> *Solução Temporária:* Código escrito para corrigir um bug urgente na sexta-feira, com a promessa mental de que será refatorado na segunda. (Raramente é).

## O Contexto

Tínhamos um bug em produção onde o sistema de pagamentos duplicava a cobrança a cada 15 segundos devido a uma falha no Webhook. Em vez de arrumar o sistema de filas, um dev (eu) adicionou um checkbox no painel admin:

```html
<!-- Não clique aqui a menos que saiba o que está fazendo -->
<input type="checkbox" id="force-single-payment" />
```

Esse checkbox fazia um `SELECT FOR UPDATE` travando a tabela inteira de pagamentos por 5 segundos. Funcionou? Sim. Ficou bonito? Não.

> **Glossário Sincero:**
> *Não é um bug, é uma funcionalidade não documentada.* (Verdadeiro quando o cliente decide que gosta do comportamento errado).
