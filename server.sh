#!/bin/bash

# Encerra servidores antigos
lsof -t -i:8000 | xargs kill -9 2>/dev/null
lsof -t -i:8001 | xargs kill -9 2>/dev/null
lsof -t -i:8002 | xargs kill -9 2>/dev/null
lsof -t -i:8003 | xargs kill -9 2>/dev/null

echo "Escolha qual projeto rodar:"
echo "1) Maués          (Porta 8000)"
echo "2) Aura           (Porta 8001)"
echo "3) Readium        (Porta 8002)"
echo "4) Vortex         (Porta 8003)"
read -p "Digite a opção: " opt

case $opt in
  1)
    echo "🟢 Iniciando Maués na porta 8000..."
    cd guarana
    python3 -m http.server 8000 2>&1 | grep -v "code 400" | grep -v "favicon.ico"
    ;;
  2)
    echo "🟣 Iniciando Aura na porta 8001..."
    cd aura
    python3 -m http.server 8001 2>&1 | grep -v "code 400" | grep -v "favicon.ico"
    ;;
  3)
    echo "🟣 Iniciando Readium na porta 8002..."
    cd readium
    npm start
    ;;
  4)
    echo "🟣 Iniciando Readium na porta 8003..."
    cd vortex
    npm start
    ;;
  *)
    echo "Opção inválida."
    ;;
esac
