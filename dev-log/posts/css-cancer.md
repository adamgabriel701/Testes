---
id: '07'
title: 'Curando o Câncer de CSS em Projetos Legados'
date: '02.09.24'
tags: ['CSS', 'Frontend']
readTime: '7 min'
excerpt: 'Era uma vez !important em todo canto. Eis a jornada de como refatorei o CSS sem quebrar o app.'
---

# Curando o Câncer de CSS

Era uma vez `!important` em todo canto. Eis a jornada de como refatorei o CSS sem quebrar o app inteiro no processo.

> **Piada de CSS:** 
> CSS é igual a tentar arrumar uma cama elástica com tiras de fita crepe — você mexe em um canto e o outro levanta.

## A Doença

Quando o projeto cresce sem metodologias (BEM, CSS Modules, Tailwind), as regras de especificidade viram uma guerra. 

```css
/* O início do fim */
.botao {
  color: red !important;
}

/* 6 meses depois... */
div.container .botao {
  color: blue !important; /* Por que não funciona?! */
}
```

## A Cura

A especificidade mata a importância. Em vez de usar `!important`, entenda como a cascata funciona. Utilize ferramentas modernas como *CSS Modules* ou *Scoped CSS* para garantir que suas classes não vazem para componentes errados.

> **Glossário Sincero:**
> *Especificidade:* A métrica inventada pelos navegadores para decidir qual regra quebrar seu layout primeiro.
