package main

import (
    "log"
    "net/http"
    "net/http/httputil"
    "net/url"
)

func main() {
    mux := http.NewServeMux()

    // 1. Servindo arquivos estáticos diretamente (Substitui python -m http.server)
    mux.Handle("/guarana/", http.StripPrefix("/guarana/", http.FileServer(http.Dir("../guarana"))))
    mux.Handle("/aura/", http.StripPrefix("/aura/", http.FileServer(http.Dir("../aura"))))
    mux.Handle("/blog/", http.StripPrefix("/blog/", http.FileServer(http.Dir("../meu-blog"))))
    mux.Handle("/testes/", http.StripPrefix("/testes/", http.FileServer(http.Dir("../Testes"))))

    // Rota raiz redireciona para o Guaraná (PWA principal)
    mux.Handle("/", http.RedirectHandler("/guarana/", http.StatusSeeOther))

    // 2. Proxy Reverso para os projetos Node (Readium e Vortex)
    // Se o Readium estiver rodando na 8002 e Vortex na 8003
    setupProxy(mux, "/readium", "http://localhost:8002")
    setupProxy(mux, "/vortex", "http://localhost:8003")

    // 3. Endpoint de WebSocket para Aura/Vortex (exemplo de estrutura)
    // mux.HandleFunc("/ws", handleWebSocket) 

    port := ":8080"
    log.Printf("🚀 Nexus Gateway rodando em http://localhost%s\n", port)
    log.Println("Acesse: http://localhost:8080/guarana/ ou /aura/ ou /readium/")

    if err := http.ListenAndServe(port, mux); err != nil {
        log.Fatal("Erro ao iniciar servidor: ", err)
    }
}

func setupProxy(mux *http.ServeMux, path string, target string) {
    targetUrl, _ := url.Parse(target)
    proxy := httputil.NewSingleHostReverseProxy(targetUrl)
    
    // Ajusta o path antes de enviar para o servidor Node
    mux.HandleFunc(path+"/", func(w http.ResponseWriter, r *http.Request) {
        r.URL.Path = r.URL.Path[len(path):] // Remove o prefixo /readium antes de repassar
        if r.URL.Path == "" {
            r.URL.Path = "/"
        }
        proxy.ServeHTTP(w, r)
    })
}
