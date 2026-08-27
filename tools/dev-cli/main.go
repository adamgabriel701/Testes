package main

import (
    "bufio"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "strings"
    "time"
)

func main() {
    if len(os.Args) < 2 {
        showHelp()
        return
    }

    command := os.Args[1]

    switch command {
    case "serve":
        serveMenu()
    case "push":
        pushChanges()
    case "deps":
        installDeps()
    case "wasm":
        buildWasm()
    case "status":
        checkStatus()
    case "tree":
        printTree()
    case "build":
        buildSSG()
    default:
        showHelp()
    }
}

func showHelp() {
    fmt.Println("🛠️  Monoman - Gerenciador do Monorepo")
    fmt.Println("Uso:")
    fmt.Println("  monoman serve  - Inicia os servidores de desenvolvimento")
    fmt.Println("  monoman push   - Faz git add, commit e push (substitui att.sh)")
    fmt.Println("  monoman deps   - Roda npm install nos projetos Node")
    fmt.Println("  monoman wasm   - Compila o módulo Rust para WebAssembly (wasm-particles)")
    fmt.Println("  monoman build  - Compila o Gerador de Sites Estáticos em Rust (ssg-cli)")
    fmt.Println("  monoman status - Verifica a saúde dos serviços via Nexus Gateway")
    fmt.Println("  monoman tree   - Exibe a estrutura de pastas do projeto (ignora node_modules)")
}

func serveMenu() {
    fmt.Println("Escolha qual projeto rodar:")
    fmt.Println("1) Guaraná (PWA) [Porta 8000]")
    fmt.Println("2) Aura (Canvas) [Porta 8001]")
    fmt.Println("3) Readium (Node) [Porta 8002]")
    fmt.Println("4) Vortex (Node) [Porta 8003]")
    fmt.Println("5) Blog [Porta 8004]")
    fmt.Println("6) Nexus Gateway (Tudo junto na porta 8080)")
    fmt.Println("7) Readium AI (Python) [Porta 8005]")
    fmt.Println("8) CMS Engine (PHP) [Porta 8006]")
    fmt.Println("9) Live Hub (WebSockets) [Porta 8007]")
    fmt.Println("10) Geo Aggregator (Python NLP) [Porta 8008]")
    fmt.Println("11) Metrics Dashboard (Estático) [Porta 8009]")
    fmt.Print("Digite a opção: ")

    reader := bufio.NewReader(os.Stdin)
    opt, _ := reader.ReadString('\n')
    opt = strings.TrimSpace(opt)

    switch opt {
    case "1":
        runServer("guarana", "python3 -m http.server 8000")
    case "2":
        runServer("aura", "python3 -m http.server 8001")
    case "3":
        runServer("readium", "npm start")
    case "4":
        runServer("vortex", "npm start")
    case "5":
        runServer("meu-blog", "python3 -m http.server 8004")
    case "6":
        runServer("services/nexus-gateway", "go run main.go")
    case "7":
        runServer("services/readium-ai", "uvicorn main:app --reload --port 8005")
    case "8":
        runServer("cms-engine", "php -S localhost:8006")
    case "9":
        runServer("services/live-hub", "npm start")
    case "10":
        runServer("services/geo-aggregator", "uvicorn main:app --reload --port 8008")
    case "11":
        runServer("apps/metrics-dashboard", "python3 -m http.server 8009")
    default:
        fmt.Println("Opção inválida.")
    }
}

func pushChanges() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Digite a mensagem do commit (ou Enter para 'Atualização'): ")
    msg, _ := reader.ReadString('\n')
    msg = strings.TrimSpace(msg)
    if msg == "" {
        msg = "Atualização"
    }

    fmt.Println("📦 Adicionando arquivos...")
    exec.Command("git", "add", ".").Run()

    fmt.Printf("📝 Commitando com mensagem: '%s'...\n", msg)
    exec.Command("git", "commit", "-m", msg).Run()

    // Sincroniza com o repositório remoto antes de empurrar
    fmt.Println("🔄 Sincronizando com o repositório remoto (pull)...")
    exec.Command("git", "config", "pull.rebase", "false").Run()

    pullCmd := exec.Command("git", "pull", "origin", "main")
    pullCmd.Stdout = os.Stdout
    pullCmd.Stderr = os.Stderr
    pullCmd.Run()

    fmt.Println("🚀 Enviando para o repositório...")
    pushCmd := exec.Command("git", "push", "origin", "main")
    pushCmd.Stdout = os.Stdout
    pushCmd.Stderr = os.Stderr
    pushCmd.Run()

    fmt.Println("✅ Concluído!")
}

func installDeps() {
    var dirs []string
    filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
        if err != nil || info.IsDir() {
            return nil
        }
        if info.Name() == "package.json" {
            if !strings.Contains(path, "node_modules") {
                dirs = append(dirs, filepath.Dir(path))
            }
        }
        return nil
    })

    for _, dir := range dirs {
        fmt.Printf("🔧 Instalando dependências em: %s\n", dir)
        cmd := exec.Command("npm", "install")
        cmd.Dir = dir
        cmd.Stdout = os.Stdout
        cmd.Stderr = os.Stderr
        cmd.Run()
    }
    fmt.Println("✅ Dependências Node instaladas!")
}

func buildWasm() {
    fmt.Println("🦀 Compilando Rust para WebAssembly...")
    dir := "wasm-particles"
    if _, err := os.Stat(dir); os.IsNotExist(err) {
        dir = "apps/aura/pkg/wasm-particles"
    }

    cmd := exec.Command("wasm-pack", "build", "--target", "web")
    cmd.Dir = dir
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    if err := cmd.Run(); err != nil {
        fmt.Printf("❌ Erro ao compilar Wasm: %v\n", err)
        return
    }
    fmt.Println("✅ WebAssembly compilado com sucesso!")
}

func buildSSG() {
    fmt.Println("🦀 Compilando gerador de sites estáticos (SSG) em Rust...")
    dir := "tools/ssg-cli"
    cmd := exec.Command("cargo", "build", "--release")
    cmd.Dir = dir
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    if err := cmd.Run(); err != nil {
        fmt.Printf("❌ Erro ao compilar SSG: %v\n", err)
        return
    }
    fmt.Println("✅ SSG compilado! Binário em: tools/ssg-cli/target/release/ssg-cli")
}

func runServer(dir string, command string) {
    parts := strings.Fields(command)
    fmt.Printf("🟣 Iniciando %s...\n", dir)

    cmd := exec.Command(parts[0], parts[1:]...)
    cmd.Dir = dir
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    if err := cmd.Run(); err != nil {
        fmt.Printf("Erro ao rodar: %v\n", err)
    }
}

func checkStatus() {
    fmt.Println("📊 Verificando saúde dos serviços via Nexus Gateway (http://localhost:8080/api/health)...")
    client := http.Client{Timeout: 3 * time.Second}
    resp, err := client.Get("http://localhost:8080/api/health")
    if err != nil {
        fmt.Println("❌ Nexus Gateway está offline. Rode 'monoman serve' e escolha a opção 6.")
        return
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)

    var data struct {
        Gateway  string `json:"gateway"`
        Services []struct {
            Name   string `json:"name"`
            Status string `json:"status"`
            Port   string `json:"port"`
        } `json:"services"`
    }

    json.Unmarshal(body, &data)

    fmt.Printf("🚀 Gateway: \033[32m%s\033[0m\n", data.Gateway)
    fmt.Println("-----------------------------------")

    for _, svc := range data.Services {
        var color string
        switch svc.Status {
        case "Online":
            color = "\033[32m" // Verde
        case "Starting":
            color = "\033[33m" // Amarelo
        default:
            color = "\033[31m" // Vermelho
        }
        fmt.Printf("🔗 %-12s :%s  %s%s\033[0m\n", svc.Name, svc.Port, color, svc.Status)
    }
    fmt.Println("-----------------------------------")
}

func printTree() {
    cmd := exec.Command("git", "ls-files")
    output, err := cmd.Output()
    if err != nil {
        fmt.Println("❌ Erro ao ler arquivos do Git. Certifique-se de estar na raiz do repositório.")
        return
    }

    files := strings.Split(strings.TrimSpace(string(output)), "\n")
    fmt.Println("📁 Estrutura do Projeto (Baseado no Git)")
    fmt.Println(".")

    printedDirs := make(map[string]bool)

    for _, file := range files {
        if file == "" {
            continue
        }

        parts := strings.Split(file, "/")
        currentPath := ""

        for i := 0; i < len(parts)-1; i++ {
            currentPath += parts[i] + "/"
            if !printedDirs[currentPath] {
                indent := ""
                if i > 0 {
                    indent = strings.Repeat("│   ", i)
                }
                fmt.Printf("%s├── %s/\n", indent, parts[i])
                printedDirs[currentPath] = true
            }
        }

        depth := len(parts) - 1
        indent := ""
        if depth > 0 {
            indent = strings.Repeat("│   ", depth)
        }

        fileName := parts[len(parts)-1]
        fmt.Printf("%s├── %s\n", indent, fileName)
    }
}