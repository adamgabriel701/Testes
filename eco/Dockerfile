### 📄 `Dockerfile`
*(Coloque na raiz do projeto)*

```dockerfile
# ==========================================
# 1. Estágio Base
# ==========================================
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ==========================================
# 2. Estágio de Dependências
# ==========================================
FROM base AS dependencies
RUN npm ci

# ==========================================
# 3. Estágio de Desenvolvimento
# ==========================================
FROM dependencies AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ==========================================
# 4. Estágio de Build (Compilação)
# ==========================================
FROM dependencies AS build
COPY . .
RUN npm run build

# ==========================================
# 5. Estágio de Produção (Imagem Leve e Otimizada)
# ==========================================
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia apenas os arquivos necessários do estágio de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
```
