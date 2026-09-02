export const SITE_CONFIG = {
  title: "/dev/log",
  author: "Adam Gabriel",
  role: "Engenheiro de Software",
  nav: [
    { label: "noticias", url: "#notes" },
    { label: "snippets", url: "#snippets" },
    { label: "arquivo", url: "#archive" },
    { label: "terminal", url: "#terminal" }
  ],
  hero: {
    greetings: [
      "olá, viajante.",
      "você encontrou o /dev/log.",
      "eu crio bugs para que você não precise.",
      "console.log('bem-vindo de volta.');"
    ],
    subtitle: "Notas da mesa de um programador — sobre código, sistemas e a alegria estranha de debugar às 2h da manhã.",
    description: "Eu sou Adam Gabriel — engenheiro de software escrevendo sobre o ofício. TypeScript hoje, Rust amanhã, assembly por diversão."
  },
  stats: [
    { value: "4", label: "artigos publicados" },
    { value: "+20", label: "projetos concluidos" },
    { value: "2d", label: "desde o último commit" },
    { value: "∞", label: "xícaras de café" }
  ],
  setup: [
    { icon: "fab fa-react", name: "React" },
    { icon: "fab fa-rust", name: "Rust" },
    { icon: "fab fa-node-js", name: "Node.js" },
    { icon: "fas fa-database", name: "PostgreSQL" },
    { icon: "fab fa-docker", name: "Docker" },
    { icon: "fab fa-aws", name: "AWS" },
    { icon: "fas fa-keyboard", name: "NeoVim" },
    { icon: "fab fa-linux", name: "Arch Linux" }
  ],
  socials: [
    { icon: "fab fa-github", url: "https://github.com/adamgabriel1" },
    { icon: "fab fa-x-twitter", url: "https://twitter.com" },
    { icon: "fas fa-rss", url: "#" },
    { icon: "fas fa-envelope", url: "mailto:adamgabriel289@gmail.com" }
  ]
};

export const SNIPPETS = [
  {
    title: "Hook useTypewriter",
    lang: "typescript",
    code: "import { useState, useEffect } from 'react';\n\nexport function useTypewriter(words: string[], speed = 80, pause = 1800) {\n  const [text, setText] = useState('');\n  const [i, setI] = useState(0);\n  const [del, setDel] = useState(false);\n\n  useEffect(() => {\n    const word = words[i % words.length];\n    const delay = del ? speed / 2 : speed;\n\n    const t = setTimeout(() => {\n      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));\n    }, delay);\n\n    if (!del && text === word) {\n      const p = setTimeout(() => setDel(true), pause);\n      return () => { clearTimeout(t); clearTimeout(p); };\n    }\n    if (del && text === '') {\n      setDel(false);\n      setI(i + 1);\n    }\n    return () => clearTimeout(t);\n  }, [text, del, i, words, speed, pause]);\n\n  return text;\n}"
  },
  {
    title: "Debounce em JS Puro",
    lang: "javascript",
    code: "function debounce(fn, delay = 300) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\n// Uso\nconst buscar = debounce((query) => {\n  console.log('Buscando por:', query);\n}, 500);"
  },
  {
    title: "Rust: Option e unwrap_or",
    lang: "rust",
    code: "fn pegar_usuario(id: u32) -> Option<String> {\n    if id == 1 {\n        Some(String::from(\"Adam\"))\n    } else {\n        None\n    }\n}\n\nfn main() {\n    let nome = pegar_usuario(2).unwrap_or_else(|| String::from(\"Visitante\"));\n    println!(\"Olá, {}\", nome); // Olá, Visitante\n}"
  },
  {
    title: "Docker: Limpar Tudo",
    lang: "bash",
    code: "# Remove todos os contêineres parados\ndocker container prune -f\n\n# Remove todas as imagens não utilizadas\ndocker image prune -a -f\n\n# Limpa volumes não usados (CUIDADO!)\ndocker volume prune -f\n\n# O comando definitivo para recuperar espaço em disco\ndocker system prune -a --volumes -f"
  }
];
