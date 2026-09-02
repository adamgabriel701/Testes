---
id: '04'
title: 'Rust para Humanos: Por que eu mudei de lado'
date: '01.10.24'
tags: ['Rust', 'Sistemas']
readTime: '11 min'
excerpt: 'O compilador de Rust é como um professor rigoroso. No começo você odeia, depois percebe que aprendeu.'
---

# Rust para Humanos

O compilador de Rust é como um professor rigoroso. No começo você odeia, depois percebe que aprendeu.

> **Piada de Linguagem:** 
> C te dá corda suficiente para se enforcar. C++ te dá a corda, a árvore e o nó prontos. Rust não te deixa subir na árvore sem um colete de segurança.

## Por que mudar?

Sistemas em C/C++ são rápidos, mas a gestão de memória manual abre espaço para vazamentos de memória e temidos segfaults. Rust traz o conceito de *Ownership* (Posse), garantindo segurança de memória em tempo de compilação, sem precisar de um Garbage Collector.

```rust
fn main() {
    let x = 5;      // x é dono do valor
    let y = &x;     // y pega emprestado o valor de x
    
    // Se tentarmos modificar x aqui enquanto y existe, o compilador barra.
    println!("O valor é: {}", y);
}
```

> **Regra de Ouro do Rust:**
> Se compila, provavelmente está certo.
