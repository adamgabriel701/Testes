<?php
// cms-engine/seed.php
require 'db.php';
 $db = (new Database())->getPdo();

// Caminho para os seus JSONs atuais
 $eventosJson = file_get_contents('../guarana/data/eventos.json');
 $hospedagensJson = file_get_contents('../guarana/data/hospedagens.json');

 $eventos = json_decode($eventosJson, true);
 $hospedagens = json_decode($hospedagensJson, true);

// Limpa tabelas para reimportar
 $db->exec("DELETE FROM eventos; DELETE FROM hospedagens;");

// Insere Eventos
 $stmt = $db->prepare("INSERT INTO eventos (nome, data, mes, tipo, cor, descricao, local) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($eventos as $ev) {
    $stmt->execute([$ev['nome'], $ev['data'], $ev['mes'], $ev['tipo'], $ev['cor'], $ev['desc'], $ev['local']]);
}

// Insere Hospedagens
 $stmt = $db->prepare("INSERT INTO hospedagens (nome, tier, tipo, preco, avaliacao, img, descricao, whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($hospedagens as $h) {
    $stmt->execute([$h['nome'], $h['tier'], $h['tipo'], $h['preco'], $h['avaliacao'], $h['img'], $h['desc'], $h['whatsapp']]);
}

echo "✅ Dados migrados com sucesso para o banco SQLite!\n";
