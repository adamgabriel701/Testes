### 📄 `ARCHITECTURE.md`
*(Coloque na raiz do projeto)*

```markdown
# 🏛️ Guia de Arquitetura e Estrutura de Pastas

Para manter a previsibilidade, adotamos o padrão **Feature-First** (baseado em recursos/módulos) e separação clara de responsabilidades.

---

## 💻 Estrutura Frontend (React / Next.js)

```text
src/
├── assets/          # Imagens, fontes e arquivos estáticos importáveis
├── components/      # Componentes globais de UI (Botões, Modais, Cards)
│   └── ui/          # Componentes reutilizáveis do Design System
├── config/          # Configurações globais (instância de API, constantes)
├── hooks/           # Custom React Hooks globais
├── layouts/         # Templates de layout de páginas (Header, Sidebar, Footer)
├── modules/         # Módulos da aplicação organizados por funcionalidade
│   └── auth/
│       ├── components/  # Componentes exclusivos do módulo auth
│       ├── hooks/       # Hooks exclusivos do módulo auth
│       ├── services/    # Chamadas de API exclusivas do módulo auth
│       └── types/       # Tipagens TypeScript exclusivas do módulo auth
├── pages/           # Rotas da aplicação (ou app/ para Next.js App Router)
├── services/        # Cliente HTTP centralizado (Axios/Fetch)
├── store/           # Gerenciamento de estado global (Zustand, Redux)
├── styles/          # Estilos globais e configurações de temas
├── types/           # Tipagens TypeScript globais
└── utils/           # Funções utilitárias e formatadores puras
```

---

## ⚙️ Estrutura Backend (Node.js / Express / NestJS)

```text
src/
├── config/          # Configurações do ambiente, banco e serviços terceiros
├── modules/         # Módulos de domínio da aplicação (Domain-Driven / Feature-First)
│   └── users/
│       ├── controllers/ # Camada de transporte (recebe requisição / envia resposta)
│       ├── dtos/        # Data Transfer Objects (validação de entrada de dados)
│       ├── entities/    # Modelos do banco de dados / domínio
│       ├── repositories/# Interface com o banco de dados (Prisma, TypeORM)
│       ├── useCases/    # Regras de negócio da funcionalidade
│       └── users.module.ts
├── shared/          # Recursos compartilhados entre múltiplos módulos
│   ├── errors/      # Tratamento de exceções e erros customizados
│   ├── http/        # Middlewares de autenticação, validação e taxa limite
│   ├── providers/   # Serviços genéricos (envio de e-mail, upload de arquivos)
│   └── utils/       # Funções utilitárias puras
├── database/        # Migrations, seeds e configurações do ORM
└── main.ts          # Ponto de entrada da aplicação
```
```
