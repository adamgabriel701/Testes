### 📄 `.github/PULL_REQUEST_TEMPLATE.md`
*(Coloque dentro da pasta `.github`)*

```markdown
## 📌 Tipo de Alteração

Marque com um **X** as opções que se aplicam a este Pull Request:

- [ ] 🐛 **Fix:** Correção de um erro/bug.
- [ ] ✨ **Feat:** Nova funcionalidade.
- [ ] ♻️ **Refactor:** Refatoração de código sem alterar regra de negócio.
- [ ] 🎨 **Style:** Alterações de formatação, CSS ou estilo visual (sem alteração lógica).
- [ ] ⚡ **Perf:** Melhoria de desempenho.
- [ ] 🧪 **Test:** Adição ou correção de testes.
- [ ] 📝 **Docs:** Alteração na documentação.
- [ ] 🔧 **Chore:** Configurações, dependências ou automações de build/CI.

---

## 📝 Descrição Detalhada

Descreva de forma clara e objetiva o que este PR faz. Explique o motivo da alteração, o contexto e o problema que ele resolve.

> *Exemplo:* Este PR implementa a validação do campo CPF no formulário de cadastro e adiciona mensagens de erro estilizadas quando os dados inseridos forem inválidos.

---

## 🔗 Card / Issue Relacionada

- Resolve: # (Insira o número da Issue, ex: `#42`)
- Link no Trello/Jira: [CARD-123](https://seu-jira-ou-trello.com)

---

## 🧪 Como Isso Foi Testado?

Descreva os passos necessários para testar as alterações efetuadas:

1. Acesse a tela de cadastro `/register`.
2. Tente submeter o formulário com um CPF inválido (`123.456.789-00`).
3. Verifique se a mensagem de erro "CPF inválido" é exibida abaixo do campo.
4. Insira um CPF válido e confirme se a submissão ocorre com sucesso.

- [ ] Testes unitários executados e aprovados (`npm run test`).
- [ ] Testes manuais realizados no ambiente local.

---

## 📸 Screenshots / GIFs (Se aplicável)

Se este PR inclui alterações visuais na interface (UI/UX), adicione capturas de tela ou gravações antes e depois da alteração.

| Antes | Depois |
| :---: | :---: |
| *Imagem/GIF do Estado Anterior* | *Imagem/GIF do Estado Atual* |

---

## ⚠️ Checklist do Autor

Antes de solicitar a revisão deste PR, garanta que você atendeu aos seguintes requisitos:

- [ ] O título do PR segue a convenção de [Conventional Commits](https://www.conventionalcommits.org/) (ex: `feat(auth): adiciona fluxo de login`).
- [ ] O código foi testado localmente e passa sem erros de linter (`npm run lint`).
- [ ] Não adicionei credenciais, chaves de API ou segredos no código.
- [ ] Atualizei a documentação e os arquivos de configuração (se necessário).
- [ ] Escrevi testes para cobrir as novas alterações de código.

---

## 💬 Notas Adicionais para o Revisor

Insira observações específicas, dúvidas sobre a implementação ou pontos de atenção para quem for revisar o código.
```
