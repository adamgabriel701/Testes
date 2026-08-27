package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os/exec"
	"sync"
	"time"
)

// Mapeamento de todos os serviços do ecossistema
var services = map[string]ServiceConfig{
    "guarana": {
        Port: "8000", Path: "guarana",
        StartCmd: []string{"python3", "-m", "http.server", "8000"}, Dir: "../../apps/guarana", // Atualizado
        HealthURL: "http://localhost:8000",
    },
    "aura": {
        Port: "8001", Path: "aura",
        StartCmd: []string{"python3", "-m", "http.server", "8001"}, Dir: "../../apps/aura", // Atualizado
        HealthURL: "http://localhost:8001",
    },
    "readium": {
        Port: "8002", Path: "readium",
        StartCmd: []string{"npm", "start"}, Dir: "../../apps/readium", // Atualizado
        HealthURL: "http://localhost:8002",
    },
    "vortex": {
        Port: "8003", Path: "vortex",
        StartCmd: []string{"npm", "start"}, Dir: "../../apps/vortex", // Atualizado
        HealthURL: "http://localhost:8003",
    },
    "meu-blog": {
        Port: "8004", Path: "blog",
        StartCmd: []string{"python3", "-m", "http.server", "8004"}, Dir: "../../apps/meu-blog", // Atualizado
        HealthURL: "http://localhost:8004",
    },
    // Os serviços que já estão na pasta services/ não mudam o caminho relativo!
    "readium-ai": {
        Port: "8005", Path: "readium-ai",
        StartCmd: []string{"uvicorn", "main:app", "--port", "8005"}, Dir: "../../services/readium-ai",
        HealthURL: "http://localhost:8005",
    },
    "cms-engine": {
        Port: "8006", Path: "cms-engine",
        StartCmd: []string{"php", "-S", "localhost:8006"}, Dir: "../../services/cms-engine",
        HealthURL: "http://localhost:8006",
    },
    "live-hub": {
        Port: "8007", Path: "live-hub",
        StartCmd: []string{"npm", "start"}, Dir: "../../services/live-hub",
        HealthURL: "http://localhost:8007",
    },
}

type ServiceConfig struct {
	Port      string
	Path      string
	StartCmd  []string
	Dir       string
	HealthURL string
	Cmd       *exec.Cmd
}

var (
	mu      sync.Mutex
	status  = make(map[string]string)
	started = false
)

func main() {
	mux := http.NewServeMux()

	// Inicia todos os serviços de uma vez em background
	startAllServices()

	// 1. Rota de Telemetria Visual (Dashboard HTML)
	mux.HandleFunc("/health", dashboardHandler)

	// Rota para a CLI dev-cli consumir o JSON
	mux.HandleFunc("/api/health", jsonHealthHandler)

	// 2. Proxy Reverso para TODOS os serviços
	// Ao usar "/guarana/" -> "http://localhost:8000", o Go encaminha a requisição
	// mantendo o path original. Ex: /guarana/index.html vai para 8000/index.html
	setupProxy(mux, "/guarana", "http://localhost:8000")
	setupProxy(mux, "/aura", "http://localhost:8001")
	setupProxy(mux, "/readium", "http://localhost:8002")
	setupProxy(mux, "/vortex", "http://localhost:8003")
	setupProxy(mux, "/blog", "http://localhost:8004")
	setupProxy(mux, "/readium-ai", "http://localhost:8005")
	setupProxy(mux, "/cms-engine", "http://localhost:8006")
	setupProxy(mux, "/live-hub", "http://localhost:8007")

	// Rota raiz redireciona para o painel de telemetria
	mux.Handle("/", http.RedirectHandler("/health", http.StatusSeeOther))

	port := ":8080"
	log.Printf("🚀 Nexus Gateway 2.0 rodando em http://localhost%s\n", port)
	log.Println("📊 Painel de telemetria: http://localhost:8080/health")

	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatal("Erro ao iniciar servidor: ", err)
	}
}

func startAllServices() {
	mu.Lock()
	defer mu.Unlock()
	if started {
		return
	}
	started = true

	for name, svc := range services {
		log.Printf("🟡 Iniciando serviço: %s (Porta %s)...\n", name, svc.Port)

		cmd := exec.Command(svc.StartCmd[0], svc.StartCmd[1:]...)
		cmd.Dir = svc.Dir
		// Impede que os logs poluam o terminal do Gateway
		cmd.Stdout = nil
		cmd.Stderr = nil

		err := cmd.Start()
		if err != nil {
			log.Printf("❌ Erro ao iniciar %s: %v\n", name, err)
			status[name] = "Error"
			continue
		}

		// Salva o processo na struct
		svc.Cmd = cmd
		services[name] = svc
		status[name] = "Starting"

		// Goroutine para monitorar se o processo morre
		go func(n string, c *exec.Cmd) {
			err := c.Wait()
			if err != nil {
				mu.Lock()
				status[n] = "Crashed"
				mu.Unlock()
				log.Printf("💥 Serviço %s parou inesperadamente!\n", n)
			}
		}(name, cmd)
	}

	// Goroutine para checar a saúde real (HTTP) periodicamente
	go monitorHealth()
}

func monitorHealth() {
	for {
		time.Sleep(5 * time.Second) // Checa a cada 5 segundos
		mu.Lock()
		for name, svc := range services {
			if svc.HealthURL == "" {
				continue
			}
			client := http.Client{Timeout: 2 * time.Second}
			resp, err := client.Get(svc.HealthURL)
			if err != nil || resp.StatusCode >= 500 {
				if status[name] != "Crashed" {
					status[name] = "Offline"
				}
			} else {
				status[name] = "Online"
				resp.Body.Close()
			}
		}
		mu.Unlock()
	}
}

// Configura o proxy reverso sem alterar o Path interno da URL
func setupProxy(mux *http.ServeMux, path string, target string) {
	targetUrl, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(targetUrl)

	// Remove o prefixo (ex: /guarana) antes de enviar para o servidor interno (ex: 8000)
	// Assim o servidor interno acha que a requisição foi feita na raiz "/"
	mux.HandleFunc(path+"/", func(w http.ResponseWriter, r *http.Request) {
		// Loga a rota acessada no terminal do Gateway
		log.Printf("🔄 Roteando %s -> %s%s", path, target, r.URL.Path)

		r.URL.Path = r.URL.Path[len(path):]
		if r.URL.Path == "" {
			r.URL.Path = "/"
		}
		proxy.ServeHTTP(w, r)
	})
}

// Painel Visual HTML de Telemetria
func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	html := `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Nexus Gateway - Telemetria</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; }
            h1 { color: #38bdf8; border-bottom: 2px solid #1e293b; padding-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
            .card { background: #1e293b; padding: 20px; border-radius: 12px; border-left: 5px solid #64748b; transition: all 0.3s; }
            .card.online { border-color: #22c55e; box-shadow: 0 0 15px rgba(34, 197, 94, 0.2); }
            .card.offline, .card.crashed, .card.error { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
            .card.starting { border-color: #f59e0b; }
            .title { font-size: 18px; font-weight: bold; text-transform: capitalize; margin-bottom: 5px; }
            .status { font-size: 14px; display: flex; align-items: center; gap: 8px; }
            .dot { width: 10px; height: 10px; border-radius: 50%; background: #64748b; }
            .online .dot { background: #22c55e; }
            .offline .dot, .crashed .dot, .error .dot { background: #ef4444; }
            .starting .dot { background: #f59e0b; }
            .port { font-size: 12px; color: #94a3b8; margin-top: 5px; }
            a { color: #38bdf8; text-decoration: none; font-size: 14px; display: inline-block; margin-top: 10px; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <h1>🚀 Nexus Gateway Dashboard</h1>
        <p>Monitoramento em tempo real do ecossistema de microserviços.</p>
        <div class="grid">
    `

	mu.Lock()
	for name, svc := range services {
		st := status[name]
		html += fmt.Sprintf(`
            <div class="card %s">
                <div class="title">%s</div>
                <div class="status"><div class="dot"></div> %s</div>
                <div class="port">Porta interna: %s</div>
                <a href="http://localhost:8080/%s/" target="_blank">Acessar rota ↗</a>
            </div>
        `, st, name, st, svc.Port, svc.Path)
	}
	mu.Unlock()

	html += `
        </div>
        <script>setTimeout(() => location.reload(), 5000);</script>
    </body>
    </html>`

	w.Write([]byte(html))
}

// Rota que retorna o JSON para a Dev-CLI (monoman status)
func jsonHealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	mu.Lock()
	defer mu.Unlock()

	jsonStr := `{"gateway": "Online", "services": [`
	first := true
	for name, st := range status {
		if !first {
			jsonStr += ","
		}
		first = false
		jsonStr += fmt.Sprintf(`{"name": "%s", "status": "%s", "port": "%s"}`, name, st, services[name].Port)
	}
	jsonStr += `]}`
	w.Write([]byte(jsonStr))
}
