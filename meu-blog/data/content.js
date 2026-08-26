window.BLOG_DATA = {
  posts: [
    {
      id: "01",
      slug: "conversoes-implicitas",
      title: "Sobre a Violência Silenciosa das Conversões Implícitas",
      date: "12.11.24",
      tags: ["JavaScript"],
      readTime: "8 min",
      excerpt: "O JavaScript vai deixar você somar `[]` com `{}` e agradecer por isso. Um guia de campo para armadilhas.",
      content: `# Sobre a Violência Silenciosa das Conversões Implícitas

O JavaScript vai deixar você somar \`[]\` com \`{}\` e agradecer por isso.

\`\`\`javascript
[] + {}; // "[object Object]"
{} + []; // 0
\`\`\`

Este é um guia de campo para armadilhas. Tome cuidado por aí.`
    },
    {
      id: "02",
      slug: "lexer-a-mao",
      title: "Um Lexer, À Mão, Num Domingo à Tarde",
      date: "28.10.24",
      tags: ["Compiladores"],
      readTime: "14 min",
      excerpt: "Pule o regex. Pule o gerador. Duzentas linhas de switch e você entenderá algo novo.",
      content: `# Um Lexer, À Mão, Num Domingo à Tarde

Pule o regex. Pule o gerador.

\`\`\`c
while (c != EOF) {
    switch(c) {
        case ' ': break;
        // ...
    }
}
\`\`\`

Duzentas linhas de switch e você entenderá algo novo sobre cada linguagem que você já usou.`
    },
    {
      id: "03",
      slug: "remocao-try-catch",
      title: "Por Que Removi Todos os Try/Catch do Meu Código",
      date: "14.10.24",
      tags: ["Erros"],
      readTime: "6 min",
      excerpt: "Tipos de resultado, canais de erro e a paz curiosa de deixar as coisas falharem alto em desenvolvimento.",
      content: `# Por Que Removi Todos os Try/Catch do Meu Código

Tipos de resultado, canais de erro e a paz curiosa de deixar as coisas falharem alto no desenvolvimento.

> Deixe falhar. Deixe falhar alto.`
    },
    {
      id: "04",
      slug: "rust-para-humanos",
      title: "Rust para Humanos: Por que eu mudei de lado",
      date: "01.10.24",
      tags: ["Rust"],
      readTime: "11 min",
      excerpt: "O compilador de Rust é como um professor rigoroso. No começo você odeia, depois percebe que aprendeu.",
      content: `# Rust para Humanos

O compilador de Rust é como um professor rigoroso.

\`\`\`rust
fn main() {
    let x = 5;
    println!("O valor é: {}", x);
}
\`\`\`

> Se compila, provavelmente está certo.`
    },
    {
      id: "05",
      slug: "docker-na-veia",
      title: "Docker na Veia: Containers sem complicação",
      date: "20.09.24",
      tags: ["DevOps"],
      readTime: "9 min",
      excerpt: "Parou de funcionar na minha máquina? Então vamos colocar a sua máquina dentro de um container.",
      content: `# Docker na Veia

Parou de funcionar na minha máquina? Então vamos colocar a sua máquina dentro de um container.

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
\`\`\`

Simples assim.`
    },
    {
      id: "06",
      slug: "postgres-magia",
      title: "PostgreSQL: A Magia que Você Ignorava",
      date: "15.09.24",
      tags: ["Banco de Dados"],
      readTime: "12 min",
      excerpt: "JSONB, Arrays e CTEs. Como parar de tratar o Postgres como um mero armazenador de tabelas.",
      content: `# PostgreSQL: A Magia que Você Ignorava

JSONB, Arrays e CTEs.

\`\`\`sql
SELECT * FROM users WHERE preferences @> '{"theme": "dark"}';
\`\`\`

Como parar de tratar o Postgres como um mero armazenador de tabelas.`
    },
    {
      id: "07",
      slug: "css-cancer",
      title: "Curando o Câncer de CSS em Projetos Legados",
      date: "02.09.24",
      tags: ["CSS", "Frontend"],
      readTime: "7 min",
      excerpt: "Era uma vez \`!important\` em todo canto. Eis a jornada de como refatorei o CSS sem quebrar o app.",
      content: `# Curando o Câncer de CSS

Era uma vez \`!important\` em todo canto.

> Dica de ouro: Especificidade mata importância.`
    },
    {
      id: "08",
      slug: "mentes-programadoras",
      title: "O Programador Zen e a Arte de Escrever Menos",
      date: "18.08.24",
      tags: ["Carreira"],
      readTime: "5 min",
      excerpt: "Por que o melhor código é aquele que você apagou antes de dar commit.",
      content: `# O Programador Zen

Por que o melhor código é aquele que você apagou antes de dar commit.

\`\`\`bash
git commit --allow-empty -m "Refatoração filosófica"
\`\`\``
    }
  ],
  snippets: [
    {
      title: "Hook useTypewriter",
      lang: "typescript",
      code: `import { useState, useEffect } from 'react';

export function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    const delay = del ? speed / 2 : speed;

    const t = setTimeout(() => {
      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);

    if (!del && text === word) {
      const p = setTimeout(() => setDel(true), pause);
      return () => { clearTimeout(t); clearTimeout(p); };
    }
    if (del && text === '') {
      setDel(false);
      setI(i + 1);
    }
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}`
    },
    {
      title: "Debounce em JS Puro",
      lang: "javascript",
      code: `function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Uso
const buscar = debounce((query) => {
  console.log('Buscando por:', query);
}, 500);`
    },
    {
      title: "Rust: Option e unwrap_or",
      lang: "rust",
      code: `fn pegar_usuario(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Adam"))
    } else {
        None
    }
}

fn main() {
    let nome = pegar_usuario(2).unwrap_or_else(|| String::from("Visitante"));
    println!("Olá, {}", nome); // Olá, Visitante
}`
    },
    {
      title: "Docker: Limpar Tudo",
      lang: "bash",
      code: `# Remove todos os contêineres parados
docker container prune -f

# Remove todas as imagens não utilizadas
docker image prune -a -f

# Limpa volumes não usados (CUIDADO!)
docker volume prune -f

# O comando definitivo para recuperar espaço em disco
docker system prune -a --volumes -f`
    }
  ],
  projects: [
    { name: "pocketforth", lang: "C", desc: "Um interpretador Forth em exatos 1024 bytes de C99." },
    { name: "glow.css", lang: "CSS", desc: "Um arquivo CSS que adiciona brilho de fósforo CRT a qualquer elemento." }
  ],
  about: `# sobre

Sou um engenheiro de software que escreve na internet ocasionalmente.

> Me contate em adamgabriel289@gmail.com — ou digite \`mail adamgabriel289@gmail.com\` no terminal abaixo.`,
  contact: `# contato

- email:    adamgabriel289@gmail.com
- github:   github.com/adamgabriel1
- twitter:  twitter.com

Ou apenas digite \`mail adamgabriel289@gmail.com\` e escreva-me neste terminal.`,
  readme: `# LEIA-ME.md

bem-vindo ao /dev/log — um blog de desenvolvedor que pensa que é um terminal.

digite \`ajuda\` para ver o que você pode fazer.
digite \`ls\` para olhar ao redor.
digite \`neofetch\` para ver informações do sistema.`
};