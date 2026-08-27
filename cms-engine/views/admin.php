<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>CMS Guaraná - Dashboard</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        nav { background: #333; color: white; padding: 10px 20px; display: flex; justify-content: space-between; margin: -20px -20px 20px -20px; }
        nav a { color: white; text-decoration: none; margin-right: 15px; }
        .container { display: flex; gap: 20px; }
        .form-box, .list-box { background: white; padding: 20px; border-radius: 8px; flex: 1; box-shadow: 0 0 5px rgba(0,0,0,0.1); }
        input, select, textarea { width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; border-bottom: 1px solid #ddd; padding: 8px; }
        .btn-delete { color: red; text-decoration: none; }
    </style>
</head>
<body>
    <nav>
        <div>
            <a href="index.php?route=admin&tab=eventos">Eventos</a>
            <a href="index.php?route=admin&tab=hospedagens">Hospedagens</a>
        </div>
        <a href="index.php?route=logout">Sair</a>
    </nav>

    <div class="container">
        <!-- Formulário de Cadastro -->
        <div class="form-box">
            <h3>Adicionar Novo Evento</h3>
            <form action="index.php?route=admin/save-evento" method="POST">
                <input type="text" name="nome" placeholder="Nome do Evento" required>
                <input type="date" name="data" required>
                <input type="text" name="mes" placeholder="Mês (ex: Novembro)" required>
                <select name="tipo">
                    <option value="Cultural">Cultural</option>
                    <option value="Gastronomia">Gastronomia</option>
                    <option value="Show">Show</option>
                    <option value="Esportivo">Esportivo</option>
                </select>
                <select name="cor">
                    <option value="guarana">Guaraná</option>
                    <option value="sol">Sol</option>
                    <option value="amazon">Amazon</option>
                </select>
                <textarea name="desc" placeholder="Descrição" rows="4"></textarea>
                <input type="text" name="local" placeholder="Local" required>
                <button type="submit">Salvar Evento</button>
            </form>
        </div>

        <!-- Lista de Eventos Atuais -->
        <div class="list-box">
            <h3>Eventos Cadastrados</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Ação</th>
                </tr>
                <?php foreach($eventos as $ev): ?>
                <tr>
                    <td><?= $ev['id'] ?></td>
                    <td><?= htmlspecialchars($ev['nome']) ?></td>
                    <td><?= date('d/m/Y', strtotime($ev['data'])) ?></td>
                    <td><a class="btn-delete" href="index.php?route=admin/delete-evento&id=<?= $ev['id'] ?>" onclick="return confirm('Deletar?')">Excluir</a></td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
</body>
</html>
