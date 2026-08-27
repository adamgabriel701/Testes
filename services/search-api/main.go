package main

import (
    "fmt"
    "net/http"
    "os/exec"
)

func main() {
    http.HandleFunc("/api/search", func(w http.ResponseWriter, r *http.Request) {
        term := r.URL.Query().Get("q")
        if term == "" {
            http.Error(w, "Parâmetro 'q' é obrigatório", http.StatusBadRequest)
            return
        }

        // Caminho do binário Rust compilado e dos conteúdos do Readium
        rustBin := "../../packages/search-core/target/release/search-core"
        contentDir := "../../apps/readium/content"

        // Chama o binário Rust para fazer a busca pesada
        cmd := exec.Command(rustBin, contentDir, term)
        output, err := cmd.Output()
        if err != nil {
            http.Error(w, "Erro ao executar busca no Rust", http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        w.Write(output)
    })

    fmt.Println("🔍 Search API rodando na porta 8010")
    http.ListenAndServe(":8010", nil)
}