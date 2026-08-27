package main

import (
    "fmt"
    "net/http"
    "os"
    "sync"
    "time"
)

func main() {
    if len(os.Args) < 3 {
        fmt.Println("Uso: load-tester <url> <num_requests> <concurrency>")
        fmt.Println("Ex: load-tester http://localhost:8080/health 1000 50")
        return
    }

    targetURL := os.Args[1]
    totalRequests := 0
    concurrency := 0
    fmt.Sscanf(os.Args[2], "%d", &totalRequests)
    fmt.Sscanf(os.Args[3], "%d", &concurrency)

    fmt.Printf("🔥 Iniciando teste de carga em: %s\n", targetURL)
    fmt.Printf("📊 Total de Requisições: %d | Concorrência: %d\n\n", totalRequests, concurrency)

    var wg sync.WaitGroup
    jobs := make(chan int, totalRequests)
    results := make(chan int, totalRequests)

    // Gerador de jobs
    go func() {
        for i := 0; i < totalRequests; i++ {
            jobs <- i
        }
        close(jobs)
    }()

    startTime := time.Now()

    // Workers concorrentes
    for w := 0; w < concurrency; w++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for range jobs {
                resp, err := http.Get(targetURL)
                if err != nil {
                    results <- 0 // Erro
                } else {
                    results <- resp.StatusCode
                    resp.Body.Close()
                }
            }
        }()
    }

    // Espera todos os workers terminarem
    go func() {
        wg.Wait()
        close(results)
    }()

    // Coleta de resultados
    success := 0
    errors := 0
    for status := range results {
        if status == 200 {
            success++
        } else {
            errors++
        }
    }

    duration := time.Since(startTime)
    
    fmt.Println("═══════════════════════════════════════")
    fmt.Printf("⏱️  Tempo Total: %v\n", duration)
    fmt.Printf("✅ Sucessos (200 OK): %d\n", success)
    fmt.Printf("❌ Falhas/Erros: %d\n", errors)
    fmt.Printf("🚀 Requisições por segundo: %.2f\n", float64(totalRequests)/duration.Seconds())
    fmt.Println("═══════════════════════════════════════")
}
