<?php
// cms-engine/index.php
require 'db.php';

session_start();
 $db = (new Database())->getPdo();
 $route = $_GET['route'] ?? 'home';

// ==========================================
// 1. API PÚBLICA (Retorna JSON para o Guaraná)
// ==========================================
if ($route === 'api/eventos') {
    header('Content-Type: application/json');
    $stmt = $db->query("SELECT * FROM eventos ORDER BY data ASC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ajusta as chaves para bater com o seu frontend (desc em vez de descricao)
    echo json_encode(array_map(function($e) {
        return [
            "id" => $e['id'],
            "nome" => $e['nome'],
            "data" => $e['data'],
            "mes" => $e['mes'],
            "tipo" => $e['tipo'],
            "cor" => $e['cor'],
            "desc" => $e['descricao'],
            "local" => $e['local']
        ];
    }, $data));
    exit;
}

if ($route === 'api/hospedagens') {
    header('Content-Type: application/json');
    $stmt = $db->query("SELECT * FROM hospedagens ORDER BY preco ASC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(array_map(function($h) {
        return [
            "id" => $h['id'],
            "nome" => $h['nome'],
            "tier" => $h['tier'],
            "tipo" => $h['tipo'],
            "preco" => (float)$h['preco'],
            "avaliacao" => (float)$h['avaliacao'],
            "img" => $h['img'],
            "desc" => $h['descricao'],
            "whatsapp" => $h['whatsapp']
        ];
    }, $data));
    exit;
}

// ==========================================
// 2. PAINEL ADMINISTRATIVO (Protegido)
// ==========================================
 $isAdmin = $_SESSION['logged_in'] ?? false;

// Login Simples
if ($route === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($_POST['user'] === 'admin' && $_POST['pass'] === 'guarana2025') {
            $_SESSION['logged_in'] = true;
            header('Location: index.php?route=admin');
            exit;
        }
        $error = "Credenciais inválidas";
    }
    include 'views/login.php';
    exit;
}

if ($route === 'logout') {
    session_destroy();
    header('Location: index.php?route=login');
    exit;
}

// Bloqueia acesso ao admin se não estiver logado
if (strpos($route, 'admin') === 0 && !$isAdmin) {
    header('Location: index.php?route=login');
    exit;
}

// Ações de Criação/Edição/Deleção
if ($route === 'admin/save-evento' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $db->prepare("INSERT INTO eventos (nome, data, mes, tipo, cor, descricao, local) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$_POST['nome'], $_POST['data'], $_POST['mes'], $_POST['tipo'], $_POST['cor'], $_POST['desc'], $_POST['local']]);
    
    // Pega os dados que acabaram de ser salvos para enviar para o Live-Hub
    $eventoSalvo = [
        'nome' => $_POST['nome'],
        'data' => $_POST['data'],
        'local' => $_POST['local'],
        'desc' => $_POST['desc']
    ];

    // ---- INÍCIO DO AVISO EM TEMPO REAL ----
    $payload = json_encode([
        'type' => 'evento',
        'data' => $eventoSalvo
    ]);

    $ch = curl_init('http://localhost:8007/webhook/cms-engine');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
    // ---- FIM DO AVISO EM TEMPO REAL ----

    header('Location: index.php?route=admin&tab=eventos');
    exit;
}

if ($route === 'admin/delete-evento') {
    $stmt = $db->prepare("DELETE FROM eventos WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    header('Location: index.php?route=admin&tab=eventos');
    exit;
}

// View padrão do Admin
if ($route === 'admin') {
    $eventos = $db->query("SELECT * FROM eventos ORDER BY data ASC")->fetchAll(PDO::FETCH_ASSOC);
    $hospedagens = $db->query("SELECT * FROM hospedagens ORDER BY preco ASC")->fetchAll(PDO::FETCH_ASSOC);
    include 'views/admin.php';
    exit;
}

// Redireciona para login se acessar a raiz
header('Location: index.php?route=login');
