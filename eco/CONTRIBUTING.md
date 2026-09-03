### 📄 `CONTRIBUTING.md`
*(Coloque na raiz do projeto)*

```markdown
# 🛠️ Guia de Contribuição e Padrões de Desenvolvimento

Para manter a consistência e a qualidade do código em todos os projetos, siga as diretrizes abaixo.

---

## 📌 Padrão de Commits (Conventional Commits)

Todos os commits devem seguir a estrutura do [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em letras minúsculas>
```

### **Tipos de Commit Permitidos:**

* **`feat`**: Adição de uma nova funcionalidade.
  * *Exemplo:* `feat(auth): adiciona autenticação por email e senha`
* **`fix`**: Correção de um bug.
  * *Exemplo:* `fix(checkout): corrige erro no cálculo de frete`
* **`refactor`**: Alteração de código sem mudar a regra de negócio ou adicionar funcionalidades.
  * *Exemplo:* `refactor(api): otimiza consulta de usuários no banco`
* **`style`**: Alterações de formatação (espaços, ponto e vírgula, CSS) sem mudar lógica.
  * *Exemplo:* `style(button): ajusta espaçamento interno do componente`
* **`perf`**: Mudança no código focada em melhorar o desempenho.
  * *Exemplo:* `perf(images): adiciona lazy loading nas imagens da home`
* **`test`**: Adição ou correção de testes automatizados.
  * *Exemplo:* `test(user): adiciona testes unitários para criação de perfil`
* **`docs`**: Alterações na documentação (ex: README, comentários).
  * *Exemplo:* `docs(readme): atualiza instruções de instalação local`
* **`chore`**: Atualização de tarefas de build, configurações ou dependências.
  * *Exemplo:* `chore(deps): atualiza versão do React para 18.2.0`

---

## 🌿 Estratégia de Branches (Git Workflow)

Utilizamos uma variação simplificada do **GitHub Flow**:

1. **`main`**: Branch de produção. O código aqui deve estar sempre estável e testado.
2. **Branches de Funcionalidade / Correção**:
   * Para novas funcionalidades: `feat/nome-da-funcionalidade`
   * Para correção de bugs: `fix/nome-do-bug`
   * Para refatorações: `refactor/descricao-da-mudanca`
   * Para tarefas gerais: `chore/descricao-da-tarefa`

---

## 🔄 Fluxo de Trabalho (Passo a Passo)

1. Atualize a branch principal localmente:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Crie uma nova branch a partir da `main`:
   ```bash
   git checkout -b feat/login-google
   ```

3. Faça alterações no código e execute o linter/testes localmente:
   ```bash
   npm run lint
   npm run test
   ```

4. Faça o commit seguindo o padrão:
   ```bash
   git commit -m "feat(auth): adiciona suporte a login com Google"
   ```

5. Envie a branch para o repositório remoto:
   ```bash
   git push origin feat/login-google
   ```

6. Abra um **Pull Request** para a branch `main` utilizando o modelo padrão do repositório.
```
