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

\`\`\`js
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
      excerpt: "Pule o regex. Pule o gerador. Duzentas linhas de switch e você entenderá algo novo sobre toda linguagem que já usou.",
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
    }
  ],
  projects: [
    { name: "pocketforth", lang: "C", desc: "Um interpretador Forth em exatos 1024 bytes de C99." },
    { name: "glow.css", lang: "CSS", desc: "Um arquivo CSS que adiciona brilho de fósforo CRT a qualquer elemento." }
  ],
  about: `# sobre

Sou um engenheiro de software que escreve na internet ocasionalmente.

> Me contate em ola@devlog.exemplo — ou digite \`mail ola@devlog.exemplo\` no terminal abaixo.`,
  contact: `# contato

- email:    ola@devlog.exemplo
- github:   github.com/exemplo
- pgp:      0xDEADBEEFCAFEBABE

Ou apenas digite \`mail ola@devlog.exemplo\` e escreva-me neste terminal.`,
  readme: `# LEIA-ME.md

bem-vindo ao /dev/log — um blog de desenvolvedor que pensa que é um terminal.

digite \`ajuda\` para ver o que você pode fazer.
digite \`ls\` para olhar ao redor.
digite \`cat posts/conversoes-implicitas.md\` para ler um post.`
};