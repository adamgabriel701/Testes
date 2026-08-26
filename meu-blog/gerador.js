const fs = require('fs');
const path = require('path');

// Pastas e arquivos
const INPUT_DIR = './posts_externos';
const OUTPUT_FILE = './data/content.js'; // Vai ler e atualizar o seu arquivo original

const EXTENSOES_SUPORTADAS = ['.md', '.txt', '.py', '.c', '.cpp', '.cs', '.java', '.rs', '.go', '.sh', '.js'];

// 1. Tenta ler o content.js atual para não perder seus posts antigos
let dadosAtuais = { posts: [], snippets: [], projects: [], about: "", contact: "", readme: "" };

if (fs.existsSync(OUTPUT_FILE)) {
    const conteudoAtual = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    
    // Extrai o objeto JSON de dentro de "window.BLOG_DATA = { ... };"
    const match = conteudoAtual.match(/window\.BLOG_DATA\s*=\s*([\s\S]+?);\s*$/);
    if (match && match[1]) {
        try {
            // Usa eval para interpretar o objeto (que contém template strings e crases)
            dadosAtuais = eval('(' + match[1] + ')');
            if (!dadosAtuais.posts) dadosAtuais.posts = [];
            if (!dadosAtuais.snippets) dadosAtuais.snippets = [];
            if (!dadosAtuais.projects) dadosAtuais.projects = [];
            if (!dadosAtuais.about) dadosAtuais.about = "";
            if (!dadosAtuais.contact) dadosAtuais.contact = "";
            if (!dadosAtuais.readme) dadosAtuais.readme = "";
        } catch (e) {
            console.error("Erro ao ler o content.js atual. Verifique se a sintaxe está correta.", e);
            process.exit(1);
        }
    }
} else {
    console.log("Arquivo content.js não encontrado. Criando um novo...");
}

// 2. Pega os slugs que já existem para não duplicar
const slugsExistentes = new Set(dadosAtuais.posts.map(p => p.slug));

// 3. Pega o maior ID atual para continuar a numeração
let maxId = 0;
dadosAtuais.posts.forEach(p => {
    const idNum = parseInt(p.id);
    if (idNum > maxId) maxId = idNum;
});

if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR);
    console.log(`Pasta "${INPUT_DIR}" criada. Coloque seus arquivos lá e rode novamente.`);
    process.exit(0);
}

const arquivos = fs.readdirSync(INPUT_DIR);
let novosPostsCount = 0;

// 4. Processa os arquivos externos
arquivos.forEach(file => {
    const filePath = path.join(INPUT_DIR, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return;

    const ext = path.extname(file).toLowerCase();
    if (!EXTENSOES_SUPORTADAS.includes(ext)) return;

    const conteudoBruto = fs.readFileSync(filePath, 'utf-8');
    let titulo = file.replace(ext, '').replace(/[-_]/g, ' ');
    let data = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
    let tags = ['Externo'];
    let readTime = '5 min';
    let excerpt = `Arquivo importado: ${file}`;
    let content = '';

    const slug = file.replace(ext, '').toLowerCase().replace(/\s/g, '-');
    
    // Pula se o post já existir
    if (slugsExistentes.has(slug)) {
        console.log(`- Pulando "${file}" (já existe no content.js)`);
        return;
    }

    // Se for Markdown (.md), tenta ler metadados
    if (ext === '.md' || ext === '.txt') {
        const lines = conteudoBruto.split('\n');
        if (lines[0].trim() === '---') {
            let metaEnd = false;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '---') { metaEnd = true; continue; }
                if (!metaEnd) {
                    const [key, ...val] = lines[i].split(':');
                    const value = val.join(':').trim();
                    if (key.trim() === 'title') titulo = value;
                    if (key.trim() === 'date') data = value;
                    if (key.trim() === 'tags') tags = value.split(',').map(t => t.trim());
                    if (key.trim() === 'excerpt') excerpt = value;
                } else {
                    content += lines[i] + '\n';
                }
            }
        } else {
            content = conteudoBruto;
        }
    } else {
        // Se for código fonte, coloca dentro de um bloco markdown
        const lang = ext.replace('.', '');
        content = `# ${titulo}\n\nCódigo fonte extraído do arquivo \`${file}\`:\n\n\`\`\`${lang}\n${conteudoBruto}\n\`\`\`\n`;
    }

    maxId++; // Incrementa o ID
    const id = String(maxId).padStart(2, '0');

    dadosAtuais.posts.push({
        id: id,
        slug: slug,
        title: titulo,
        date: data,
        tags: tags,
        readTime: readTime,
        excerpt: excerpt,
        content: content
    });
    novosPostsCount++;
});

// 5. Salva tudo de volta no content.js
const stringData = JSON.stringify(dadosAtuais, null, 2)
    .replace(/`/g, '\\`')      // Escapa crases
    .replace(/\$\{/g, '\\${'); // Escapa ${} do template string

const fileContent = `window.BLOG_DATA = ${stringData};`;

fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
console.log(`\n✅ Sucesso! ${novosPostsCount} novos arquivos adicionados.`);
console.log(`Total de posts agora: ${dadosAtuais.posts.length}`);