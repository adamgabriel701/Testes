### 📄 `API_STANDARDS.md`
*(Coloque na raiz do projeto)*

```markdown
# 🌐 Padrão de Design e Resposta de APIs REST

Todas as APIs da nossa organização seguem o formato de payload padronizado abaixo.

---

## 📥 Respostas de Sucesso (`200 OK`, `201 Created`)

Todas as respostas devem retornar os dados dentro de uma chave envelope `data`.

### **1. Objeto Único ou Ação Sem Retorno**
```json
{
  "success": true,
  "data": {
    "id": "usr_123456",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "createdAt": "2026-09-03T09:10:00Z"
  }
}
```

### **2. Listas Paginadas**

Utilize query params padrão: `?page=1&limit=10`.

```json
{
  "success": true,
  "data": [
    { "id": "usr_123456", "name": "Maria Silva" },
    { "id": "usr_789012", "name": "João Souza" }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5
  }
}
```

---

## 🚨 Respostas de Erro (`4xx`, `5xx`)

Respostas de erro **nunca** devem retornar formatos aleatórios. Devem incluir código do erro e detalhes legíveis.

### **1. Erro de Validação de Formulário (`400 Bad Request`)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Um ou mais campos inseridos são inválidos.",
    "details": [
      {
        "field": "email",
        "message": "O campo deve ser um endereço de e-mail válido."
      },
      {
        "field": "password",
        "message": "A senha deve conter no mínimo 8 caracteres."
      }
    ]
  }
}
```

### **2. Erro de Recurso Não Encontrado ou Regra de Negócio (`404 / 422`)**

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Não foi encontrado nenhum usuário com o ID fornecido."
  }
}
```

---

## 🔑 Regras de Nomenclatura nas APIs

* **Rotas:** Sempre no plural, em minúsculas e separadas por hífen (`kebab-case`).
  * `GET /api/v1/user-profiles`
  * `POST /api/v1/orders`
* **Payloads (JSON):** Chaves no padrão `camelCase`.
* **Datas:** Sempre no formato **ISO 8601** UTC (`YYYY-MM-DDTHH:mm:ssZ`).
```
