# 🌐 Ecossistema Full-Stack Monorepo

Um monorepo modular e poliglota que une frontends interativos, microsserviços de backend, inteligência artificial e alta performance computacional. Projetado para ser um laboratório de arquitetura de software, explorando o melhor de cada linguagem.

## 🏗️ Arquitetura do Projeto

Este repositório é dividido em 5 áreas principais, garantindo isolamento e escalabilidade:

```text
.
├── apps/               # Frontends (PWA, Canvas, Blogs, Dashboards)
├── services/           # Microsserviços Backend (APIs, Gateways, WebSockets)
├── packages/           # Módulos compartilhados (Rust / WebAssembly)
├── tools/              # CLIs e Automação (Go, Rust)
├── tests/              # Laboratório de experimentos e rascunhos
```

```markdown
## 🚀 Tecnologias Utilizadas

Este ecossistema utiliza **6 linguagens de programação** diferentes, cada uma resolvida o problema onde ela é mais forte:

| Linguagem | Onde é usada | Papel no Ecossistema |
| :--- | :--- | :--- |
| **JavaScript / HTML** | `apps/` | Interfaces ricas, PWA (Guaraná), Canvas Experimental (Aura/Vortex) |
| **Go** | `services/nexus-gateway`, `tools/dev-cli` | Proxy reverso, Orquestração de containers, CLIs ultrarrápidas |
| **Python** | `services/readium-ai`, `services/geo-aggregator` | Web Scraping, NLP (Processamento de Linguagem Natural), APIs em FastAPI |
| **PHP** | `services/cms-engine` | CMS Headless com SQLite para gestão de conteúdo dinâmico |
| **Rust** | `packages/wasm-particles`, `packages/wasm-tts`, `tools/ssg-cli` | Física de partículas Wasm, Processamento de Text-to-Speech, e gerador de sites estáticos |

## 📂 Módulos Principais

### 📱 Apps (Frontends)
* **Guaraná:** PWA turístico de Maués/AM, com mapas offline, mapas de calor de UX e modo acessível.
* **Aura:** Portfólio interativo com motor de partículas 3D rodando em WebAssembly (Rust).
* **Readium:** Leitor de artigos imersivo com tema dinâmico e processamento de texto via IA.
* **Metrics Dashboard:** Painel cyberpunk para monitoramento de servidores em tempo real.

### ⚙️ Services (Backends)
* **Nexus Gateway (Go):** O maestro do ecossistema. Sobe todos os serviços, atua como reverse proxy na porta `8080` e possui endpoint de telemetria (`/health`).
* **Readium AI (Python):** API FastAPI que faz scraping de RSS, limpa HTML com BeautifulSoup e gera resumos com NLP.
* **Geo Aggregator (Python):** Motor de curadoria de notícias que usa `spacy` para extrair localizações geográficas de textos journalistlicos.
* **CMS Engine (PHP):** Headless CMS com painel admin para gerenciar eventos e hospedagens, servindo JSON puro para o frontend.
* **Live Hub (Node.js):** Servidor Socket.io para atualizações de interface em tempo real (Server-Sent Events).

### 📦 Packages (Módulos Compartilhados)
* **Wasm Particles (Rust):** Motor de física computacional compilado para WebAssembly, alimentando os gráficos do projeto *Aura*.
* **Wasm TTS (Rust):** Processador de texto que limpa Markdown e divide frases para alimentar a API nativa de Text-to-Speech do navegador no projeto *Readium*.

### 🛠️ Tools (Automação)
* **Dev CLI (`monoman` em Go):** O coração do desenvolvimento. Substitui scripts Bash. Comandos: `monoman serve`, `monoman push`, `monoman tree`, `monoman status`.
* **Load Tester (Go):** Ferramenta de stress test para simular tráfego concorrente nas APIs.
* **SSG CLI (Rust):** Gerador de sites estáticos ultrarrápido que compila Markdown para HTML.

## 📦 Como Rodar o Ambiente

Toda a gestão do monorepo é feita via CLI. Primeiro, compile o gerenciador:

```bash
# Alternativa direta para instalar o monoman no PATH do sistema
go install ./tools/dev-cli/...

# Ou, se preferir compilar e mover manualmente:
cd tools/dev-cli
go build -o monoman
sudo mv monoman /usr/local/bin/
```

Agora você tem acesso aos comandos mágicos:

```bash
# Sobe o painel interativo para escolher qual serviço rodar
monoman serve

# Sobe TODOS os serviços de uma vez via Nexus Gateway (porta 8080)
monoman serve -> Opção 6

# Verifica a saúde de todos os microsserviços em tempo real
monoman status

# Faz commit e push sincronizando com o repositório remoto
monoman push

# Exibe a estrutura de pastas limpa (ignorando node_modules)
monoman tree
```

## 🧠 Decisões de Arquitetura
1. **Isolamento de Performance:** O cálculo de física do projeto *Aura* não roda em JS, mas em Rust compilado para WebAssembly via Web Workers, mantendo a thread principal livre a 60 FPS.
2. **Desacoplamento:** O frontend (Guaraná) não sabe que o PHP existe. Ele apenas consome um JSON. Se amanhã o PHP for trocado por Go, o frontend não muda.
3. **DX (Developer Experience):** Zero configuração manual. O `nexus-gateway` sobe e gerencia os processos PHP, Python e Node automaticamente.