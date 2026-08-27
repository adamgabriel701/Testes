<?php
// cms-engine/db.php
class Database {
    private $pdo;
    private $dbPath = __DIR__ . '/database.sqlite';

    public function __construct() {
        // Cria o arquivo SQLite se não existir
        if (!file_exists($this->dbPath)) {
            touch($this->dbPath);
        }
        $this->pdo = new PDO('sqlite:' . $this->dbPath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->initTables();
    }

    private function initTables() {
        // Tabela de Hospedagens
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS hospedagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT, tier TEXT, tipo TEXT, preco REAL, 
            avaliacao REAL, img TEXT, descricao TEXT, whatsapp TEXT
        )");

        // Tabela de Eventos
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT, data TEXT, mes TEXT, tipo TEXT, 
            cor TEXT, descricao TEXT, local TEXT
        )");
    }

    public function getPdo() {
        return $this->pdo;
    }
}
