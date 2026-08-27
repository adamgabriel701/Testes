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
    case "status": // NOVO COMANDO
        checkStatus()
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
    fmt.Println("  monoman wasm   - Compila o módulo Rust para WebAssembly")
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
    
    // NOVA LÓGICA: Sincroniza com o repositório remoto antes de empurrar
    fmt.Println("🔄 Sincronizando com o repositório remoto (pull)...")
    
    // Configura para sempre fazer merge automaticamente, evitando o erro que você teve
    exec.Command("git", "config", "pull.rebase", "false").Run()
    
    // Puxa as alterações
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
    // Procura por package.json no diretório atual e subdiretórios
    var dirs []string
    filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
        if err != nil || info.IsDir() {
            return nil
        }
        if info.Name() == "package.json" {
            // Ignora a pasta node_modules
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

// Novo comando: Compila o código Rust em WebAssembly
func buildWasm() {
    fmt.Println("🦀 Compilando Rust para WebAssembly...")
    
    // Ajuste o caminho se sua pasta wasm-particles estiver em outro lugar
    dir := "wasm-particles" 
    if _, err := os.Stat(dir); os.IsNotExist(err) {
        dir = "apps/aura/pkg/wasm-particles" // Fallback de caminho
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
    fmt.Println("📊 Verificando saúde dos serviços via Nexus Gateway (http://localhost:8080/health)...")
    
    client := http.Client{Timeout: 3 * time.Second}
    resp, err := client.Get("http://localhost:8080/health")
    if err != nil {
        fmt.Println("❌ Nexus Gateway está offline. Rode 'monoman serve' e escolha a opção 6.")
        return
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    
    // Estrutura para parsear o JSON
    var data struct {
        Gateway  string `json:"gateway"`
        Services []struct {
            Name   string `json:"name"`
            Status string `json:"status"`
            Port   string `json:"port"`
        } `json:"services"`
    }

    json.Unmarshal(body, &data)

    fmt.Printf("🚀 Gateway: %s%s\n", "\033[32m", data.Gateway+"\033[0m")
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