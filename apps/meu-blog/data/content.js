window.BLOG_DATA = {
  "posts": [
    {
      "id": "01",
      "slug": "conversoes-implicitas",
      "title": "Sobre a Violência Silenciosa das Conversões Implícitas",
      "date": "12.11.24",
      "tags": [
        "JavaScript"
      ],
      "readTime": "8 min",
      "excerpt": "O JavaScript vai deixar você somar \`[]\` com \`{}\` e agradecer por isso. Um guia de campo para armadilhas.",
      "content": "# Sobre a Violência Silenciosa das Conversões Implícitas\n\nO JavaScript vai deixar você somar \`[]\` com \`{}\` e agradecer por isso.\n\n\`\`\`javascript\n[] + {}; // \"[object Object]\"\n{} + []; // 0\n\`\`\`\n\nEste é um guia de campo para armadilhas. Tome cuidado por aí."
    },
    {
      "id": "02",
      "slug": "lexer-a-mao",
      "title": "Um Lexer, À Mão, Num Domingo à Tarde",
      "date": "28.10.24",
      "tags": [
        "Compiladores"
      ],
      "readTime": "14 min",
      "excerpt": "Pule o regex. Pule o gerador. Duzentas linhas de switch e você entenderá algo novo.",
      "content": "# Um Lexer, À Mão, Num Domingo à Tarde\n\nPule o regex. Pule o gerador.\n\n\`\`\`c\nwhile (c != EOF) {\n    switch(c) {\n        case ' ': break;\n        // ...\n    }\n}\n\`\`\`\n\nDuzentas linhas de switch e você entenderá algo novo sobre cada linguagem que você já usou."
    },
    {
      "id": "03",
      "slug": "remocao-try-catch",
      "title": "Por Que Removi Todos os Try/Catch do Meu Código",
      "date": "14.10.24",
      "tags": [
        "Erros"
      ],
      "readTime": "6 min",
      "excerpt": "Tipos de resultado, canais de erro e a paz curiosa de deixar as coisas falharem alto em desenvolvimento.",
      "content": "# Por Que Removi Todos os Try/Catch do Meu Código\n\nTipos de resultado, canais de erro e a paz curiosa de deixar as coisas falharem alto no desenvolvimento.\n\n> Deixe falhar. Deixe falhar alto."
    },
    {
      "id": "04",
      "slug": "rust-para-humanos",
      "title": "Rust para Humanos: Por que eu mudei de lado",
      "date": "01.10.24",
      "tags": [
        "Rust"
      ],
      "readTime": "11 min",
      "excerpt": "O compilador de Rust é como um professor rigoroso. No começo você odeia, depois percebe que aprendeu.",
      "content": "# Rust para Humanos\n\nO compilador de Rust é como um professor rigoroso.\n\n\`\`\`rust\nfn main() {\n    let x = 5;\n    println!(\"O valor é: {}\", x);\n}\n\`\`\`\n\n> Se compila, provavelmente está certo."
    },
    {
      "id": "05",
      "slug": "docker-na-veia",
      "title": "Docker na Veia: Containers sem complicação",
      "date": "20.09.24",
      "tags": [
        "DevOps"
      ],
      "readTime": "9 min",
      "excerpt": "Parou de funcionar na minha máquina? Então vamos colocar a sua máquina dentro de um container.",
      "content": "# Docker na Veia\n\nParou de funcionar na minha máquina? Então vamos colocar a sua máquina dentro de um container.\n\n\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]\n\`\`\`\n\nSimples assim."
    },
    {
      "id": "06",
      "slug": "postgres-magia",
      "title": "PostgreSQL: A Magia que Você Ignorava",
      "date": "15.09.24",
      "tags": [
        "Banco de Dados"
      ],
      "readTime": "12 min",
      "excerpt": "JSONB, Arrays e CTEs. Como parar de tratar o Postgres como um mero armazenador de tabelas.",
      "content": "# PostgreSQL: A Magia que Você Ignorava\n\nJSONB, Arrays e CTEs.\n\n\`\`\`sql\nSELECT * FROM users WHERE preferences @> '{\"theme\": \"dark\"}';\n\`\`\`\n\nComo parar de tratar o Postgres como um mero armazenador de tabelas."
    },
    {
      "id": "07",
      "slug": "css-cancer",
      "title": "Curando o Câncer de CSS em Projetos Legados",
      "date": "02.09.24",
      "tags": [
        "CSS",
        "Frontend"
      ],
      "readTime": "7 min",
      "excerpt": "Era uma vez \`!important\` em todo canto. Eis a jornada de como refatorei o CSS sem quebrar o app.",
      "content": "# Curando o Câncer de CSS\n\nEra uma vez \`!important\` em todo canto.\n\n> Dica de ouro: Especificidade mata importância."
    },
    {
      "id": "08",
      "slug": "mentes-programadoras",
      "title": "O Programador Zen e a Arte de Escrever Menos",
      "date": "18.08.24",
      "tags": [
        "Carreira"
      ],
      "readTime": "5 min",
      "excerpt": "Por que o melhor código é aquele que você apagou antes de dar commit.",
      "content": "# O Programador Zen\n\nPor que o melhor código é aquele que você apagou antes de dar commit.\n\n\`\`\`bash\ngit commit --allow-empty -m \"Refatoração filosófica\"\n\`\`\`"
    },
    {
      "id": "09",
      "slug": "meu_post",
      "title": "Entendendo Ponteiros em C",
      "date": "10.10.24",
      "tags": [
        "C",
        "Sistemas"
      ],
      "readTime": "5 min",
      "excerpt": "Um mergulho profundo em como a memória funciona.",
      "content": "\n# Entendendo Ponteiros em C\n\nPonteiros não são monstruos, são apenas endereços de memória.\n\n\\\`\\\`\\\`c\nint *ptr = NULL;\n\\\`\\\`\\\`\n"
    },
    {
      "id": "10",
      "slug": "script",
      "title": "script",
      "date": "26.08.26",
      "tags": [
        "Externo"
      ],
      "readTime": "5 min",
      "excerpt": "Arquivo importado: script.py",
      "content": "# script\n\nCódigo fonte extraído do arquivo \`script.py\`:\n\n\`\`\`py\nimport sys\n\ndef hello_world():\n    print(\"Olá do Python!\")\n\nhello_world()\n\`\`\`\n"
    }
  ],
  "snippets": [
    {
      "title": "Hook useTypewriter",
      "lang": "typescript",
      "code": "import { useState, useEffect } from 'react';\n\nexport function useTypewriter(words: string[], speed = 80, pause = 1800) {\n  const [text, setText] = useState('');\n  const [i, setI] = useState(0);\n  const [del, setDel] = useState(false);\n\n  useEffect(() => {\n    const word = words[i % words.length];\n    const delay = del ? speed / 2 : speed;\n\n    const t = setTimeout(() => {\n      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));\n    }, delay);\n\n    if (!del && text === word) {\n      const p = setTimeout(() => setDel(true), pause);\n      return () => { clearTimeout(t); clearTimeout(p); };\n    }\n    if (del && text === '') {\n      setDel(false);\n      setI(i + 1);\n    }\n    return () => clearTimeout(t);\n  }, [text, del, i, words, speed, pause]);\n\n  return text;\n}"
    },
    {
      "title": "Debounce em JS Puro",
      "lang": "javascript",
      "code": "function debounce(fn, delay = 300) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\n// Uso\nconst buscar = debounce((query) => {\n  console.log('Buscando por:', query);\n}, 500);"
    },
    {
      "title": "Rust: Option e unwrap_or",
      "lang": "rust",
      "code": "fn pegar_usuario(id: u32) -> Option<String> {\n    if id == 1 {\n        Some(String::from(\"Adam\"))\n    } else {\n        None\n    }\n}\n\nfn main() {\n    let nome = pegar_usuario(2).unwrap_or_else(|| String::from(\"Visitante\"));\n    println!(\"Olá, {}\", nome); // Olá, Visitante\n}"
    },
    {
      "title": "Docker: Limpar Tudo",
      "lang": "bash",
      "code": "# Remove todos os contêineres parados\ndocker container prune -f\n\n# Remove todas as imagens não utilizadas\ndocker image prune -a -f\n\n# Limpa volumes não usados (CUIDADO!)\ndocker volume prune -f\n\n# O comando definitivo para recuperar espaço em disco\ndocker system prune -a --volumes -f"
    }
  ],
  "projects": [
    {
      "name": "pocketforth",
      "lang": "C",
      "desc": "Um interpretador Forth em exatos 1024 bytes de C99."
    },
    {
      "name": "glow.css",
      "lang": "CSS",
      "desc": "Um arquivo CSS que adiciona brilho de fósforo CRT a qualquer elemento."
    }
  ],
  "about": "# sobre\n\nSou um engenheiro de software que escreve na internet ocasionalmente.\n\n> Me contate em adamgabriel289@gmail.com — ou digite \`mail adamgabriel289@gmail.com\` no terminal abaixo.",
  "contact": "# contato\n\n- email:    adamgabriel289@gmail.com\n- github:   github.com/adamgabriel1\n- twitter:  twitter.com\n\nOu apenas digite \`mail adamgabriel289@gmail.com\` e escreva-me neste terminal.",
  "readme": "# LEIA-ME.md\n\nbem-vindo ao /dev/log — um blog de desenvolvedor que pensa que é um terminal.\n\ndigite \`ajuda\` para ver o que você pode fazer.\ndigite \`ls\` para olhar ao redor.\ndigite \`neofetch\` para ver informações do sistema."
};