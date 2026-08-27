const cmdInput = document.getElementById('cmdInput');
const typedText = document.getElementById('typedText');
const ghostText = document.getElementById('ghostText');
const output = document.getElementById('terminalOutput');
const promptText = document.getElementById('promptText');

let history = [];
let historyIndex = -1;

// Inicialização do Terminal
function bootTerminal() {
  print('<span class="success">[ OK ]</span> iniciando retro shell v2.0...');
  print('<span class="success">[ OK ]</span> montando <span class="info">/posts</span> <span class="dim">(' + BLOG_DATA.posts.length + ' entradas)</span>');
  print('<span class="success">[ OK ]</span> montando <span class="info">/snippets</span> <span class="dim">(' + BLOG_DATA.snippets.length + ' entradas)</span>');
  print('&nbsp;');
  print('<span class="dim">Digite `ajuda` para ver os comandos. Tente `neofetch` ou `ls`.</span>');
  print('&nbsp;');
}

function print(html, cls = '') {
  const div = document.createElement('div');
  div.className = 'line' + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  output.appendChild(div);
  // Destacar blocos de código recém adicionados
  div.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Comandos
const commands = {
  ajuda: () => {
    print('<span class="info">Comandos disponíveis:</span>');
    print('  <span class="accent">ls</span>          lista arquivos e diretórios');
    print('  <span class="accent">cat</span>         mostra conteúdo do arquivo (ex: cat LEIA-ME.md)');
    print('  <span class="accent">projetos</span>    lista projetos paralelos');
    print('  <span class="accent">setup</span>       exibe ferramentas que uso');
    print('  <span class="accent">redes</span>       exite links redes sociais');
    print('  <span class="accent">neofetch</span>    exibe informações do sistema');
    print('  <span class="accent">tema</span>        altera o tema visual (ex: tema cyber)');
    print('  <span class="accent">limpar</span>      limpa a tela');
  },
  help: () => commands.ajuda(),
  ls: () => {
    print('<span class="info">posts/</span>    <span class="info">snippets/</span>    <span class="info">projects/</span>    LEIA-ME.md    .sobre    .contato');
  },
  cat: (args) => {
    if (!args[0]) { print('<span class="error">cat: faltando operando de arquivo</span>'); return; }
    const file = args[0];
    
    if (file === 'LEIA-ME.md' || file === 'README.md' || file === 'leia-me.md') {
      print('<div class="line">' + marked.parse(BLOG_DATA.readme) + '</div>');
    } else if (file === '.sobre' || file === '.about' || file === 'sobre') {
      print('<div class="line">' + marked.parse(BLOG_DATA.about) + '</div>');
    } else if (file === '.contato' || file === '.contact' || file === 'contato') {
      print('<div class="line">' + marked.parse(BLOG_DATA.contact) + '</div>');
    } else if (file.startsWith('posts/')) {
      const slug = file.split('/')[1].replace('.md', '');
      const post = BLOG_DATA.posts.find(p => p.slug === slug);
      if (post) print('<div class="line">' + marked.parse(post.content) + '</div>');
      else print('<span class="error">cat: ' + file + ': Arquivo ou diretório não encontrado</span>');
    } else {
      print('<span class="error">cat: ' + file + ': Arquivo ou diretório não encontrado</span>');
    }
  },
  projetos: () => {
    BLOG_DATA.projects.forEach(p => {
      print(`<span class="accent">${p.name}</span> <span class="dim">[${p.lang}]</span> - ${p.desc}`);
    });
  },
  setup: () => {
    SITE_CONFIG.setup.forEach(t => {
      print(`<span class="info">${t.name}</span> <span class="dim">[${t.icon}]</span>`);
    });
  },
  redes: () => {
    SITE_CONFIG.socials.forEach(s => {
      print(`<span class="info">${s.icon}</span> <span class="dim">-></span> ${s.url}`);
    });
  },
  neofetch: () => {
    const ascii = `
   ___          <span class="info">usuario</span>@<span class="info">blog</span>
  /   \\         --------
 |  ◆  |        <span class="accent">OS</span>: /dev/log v2.0
 |     |        <span class="accent">Shell</span>: retro.sh 1.4
  \\___/         <span class="accent">Posts</span>: ${BLOG_DATA.posts.length}
   |||          <span class="accent">Projetos</span>: ${BLOG_DATA.projects.length}
                <span class="accent">Tema</span>: ${document.documentElement.getAttribute('data-theme')}
`;
    print(`<pre style="color: var(--fg)">${ascii}</pre>`);
  },
  tema: (args) => {
    if (!args[0]) {
      print('<span class="dim">Temas disponíveis: dark, light, cyber</span>');
      return;
    }
    const theme = args[0];
    if (['dark', 'light', 'cyber'].includes(theme)) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('devlog-theme', theme);
      document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
      print(`<span class="success">Tema alterado para: ${theme}</span>`);
    } else {
      print('<span class="error">Tema inválido. Use: dark, light, cyber</span>');
    }
  },
  quem: () => {
    print(`<span class="info">${SITE_CONFIG.author}</span> - <span class="dim">${SITE_CONFIG.role}</span>`);
  },
  whoami: () => commands.quem(),
  limpar: () => { output.innerHTML = ''; },
  clear: () => commands.limpar(),
  echo: (args) => print(escapeHtml(args.join(' '))),
  date: () => print(new Date().toLocaleString('pt-BR'))
};

// Autocompletar
function getCandidates(word) {
  const files = ['posts/', 'snippets/', 'projects/', 'LEIA-ME.md', '.sobre', '.contato'];
  const cmds = Object.keys(commands);
  if (word.startsWith('cat ')) return [];
  if (word.startsWith('tema ')) return ['dark', 'light', 'cyber'];
  return [...cmds, ...files].filter(c => c.toLowerCase().startsWith(word.toLowerCase()));
}

function updateGhost() {
  const val = cmdInput.value;
  const words = val.split(' ');
  const word = words[words.length - 1];
  
  if (val && !val.endsWith(' ')) {
    const matches = getCandidates(word);
    if (matches.length === 1) {
      ghostText.textContent = matches[0].slice(word.length);
      return;
    }
  }
  ghostText.textContent = '';
}

// Manipulação de Entrada
cmdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = cmdInput.value.trim();
    print(`<span style="color:#4ade80">usuario@blog</span><span style="color:var(--accent-2)">:~</span>$ ${escapeHtml(val)}`);
    
    if (val) {
      history.push(val);
      const [cmd, ...args] = val.split(/\s+/);
      if (commands[cmd]) {
        commands[cmd](args);
      } else {
        print(`<span class="error">${cmd}: comando não encontrado</span>`);
      }
    }
    cmdInput.value = '';
    typedText.textContent = '';
    ghostText.textContent = '';
  } else if (e.key === 'Tab') {
    e.preventDefault();
    if (ghostText.textContent) {
      cmdInput.value += ghostText.textContent;
      typedText.textContent = cmdInput.value;
      ghostText.textContent = '';
    }
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (e.key === 'ArrowUp' && historyIndex < history.length - 1) historyIndex++;
    else if (e.key === 'ArrowDown' && historyIndex > 0) historyIndex--;
    else if (e.key === 'ArrowDown') { historyIndex = -1; cmdInput.value = ''; typedText.textContent = ''; return; }
    
    cmdInput.value = history[history.length - 1 - historyIndex] || '';
    typedText.textContent = cmdInput.value;
  }
});

cmdInput.addEventListener('input', () => {
  typedText.textContent = cmdInput.value;
  updateGhost();
});

// Focar terminal ao clicar
document.querySelector('.terminal-window').addEventListener('click', () => cmdInput.focus());

// Iniciar
bootTerminal();