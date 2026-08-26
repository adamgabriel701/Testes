#!/bin/bash

# Encerra servidores antigos na porta 8000 e 8001 se existirem
lsof -t -i:8000 | xargs kill -9 2>/dev/null
lsof -t -i:8001 | xargs kill -9 2>/dev/null

echo "Escolha qual projeto rodar:"
echo "1) Maués (Porta 8000)"
echo "2) Aura (Porta 8001)"
read -p "Digite a opção: " opt

case $opt in
  1)
    echo "🟢 Iniciando Maués na porta 8000..."
    cd guarana
    python3 -m http.server 8000
    ;;
  2)
    echo "🟣 Iniciando Aura na porta 8001..."
    cd aura
    python3 -m http.server 8001
    ;;
  *)
    echo "Opção inválida."
    ;;
esac