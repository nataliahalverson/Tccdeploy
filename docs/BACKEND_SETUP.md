# 🚀 Setup Backend — Express + Prisma

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ .env com DATABASE_URL (AlwaysData)
- ✅ MySQL client instalado (para aplicar migração)
- ✅ Migração SQL já aplicada no banco

---

## 1️⃣ Instalar Dependências

```bash
# Dependências de produção
npm install express cors cookie-parser jsonwebtoken bcryptjs

# Dependências de desenvolvimento (tipos TypeScript)
npm install -D @types/express @types/cookie-parser @types/jsonwebtoken @types/bcryptjs

# Prisma já deve estar instalado, mas verificar
npm install @prisma/client prisma
```

---

## 2️⃣ Configurar Banco de Dados

### Opção A: Aplicar migração (se ainda não fez)

**Via PowerShell (Windows)**:
```powershell
.\apply-migration.ps1
```

**Via Bash/Linux/macOS**:
```bash
chmod +x apply-migration.sh
./apply-migration.sh
```

**Via comando direto**:
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
```

### Opção B: Sincronizar Prisma

```bash
npx prisma migrate deploy
npx prisma generate
```

### Verificar tabelas

```bash
npx prisma db push

# Ou via MySQL:
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form
mysql> SHOW TABLES;
mysql> DESC User;
mysql> DESC Post;
mysql> DESC PointEvent;
```

---

## 3️⃣ Configurar .env

Verificar que `.env` contém:

```env
DATABASE_URL="mysql://facerec:iqmi8j55PDpHQ@mysql-facerec.alwaysdata.net:3306/facerec_form"
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
WEB_ORIGIN="http://localhost:3000"
JWT_SECRET="seu-secret-aleatorio-aqui"
COOKIE_NAME="access_token"
NODE_ENV="development"
PORT=4000
```

**Gerar JWT_SECRET aleatório**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4️⃣ Rodar Servidor

### Opção A: Direto com ts-node (desenvolvimento)

```bash
npx ts-node src/server/index.ts
```

### Opção B: Compilar para JS (produção)

```bash
# Compilar TypeScript
npx tsc

# Rodar
node dist/src/server/index.js
```

### Opção C: Usando nodemon (auto-reload)

```bash
npm install -D nodemon ts-node

# Criar nodemon.json:
cat > nodemon.json << 'EOF'
{
  "watch": ["src/server"],
  "ext": "ts",
  "exec": "ts-node src/server/index.ts"
}
EOF

# Rodar
npx nodemon
```

---

## ✅ Verificar Servidor Rodando

```bash
# Health check
curl http://localhost:4000/health

# Esperado:
# {"ok":true,"timestamp":"2025-10-22T..."}
```

---

## 🧪 Smoke Tests (curl)

### 1. Health

```bash
curl -i http://localhost:4000/health
```

**Esperado**: `200 OK { "ok": true }`

---

### 2. Registrar usuário

```bash
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@exemplo.com","password":"demodemodemo","name":"Demo User"}' \
  http://localhost:4000/auth/register
```

**Esperado**: `201 Created`  
**Cookie salvo**: `cookies.txt`

---

### 3. Criar post (usa cookie)

```bash
curl -i -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"title":"Ouro Preto","content":"Notas de campo e roteiro pedagógico"}' \
  http://localhost:4000/posts
```

**Esperado**: `201 Created`

---

### 4. Listar posts

```bash
curl -i -b cookies.txt \
  http://localhost:4000/posts
```

**Esperado**: `200 OK { "posts": [...] }`

---

### 5. Ver pontos

```bash
curl -i -b cookies.txt \
  http://localhost:4000/users/me/points
```

**Esperado**: 
```json
{
  "balance": 10,
  "activities": [
    {
      "type": "POST_CREATED",
      "points": 10,
      "createdAt": "...",
      "meta": { "postId": "..." }
    }
  ]
}
```

---

## 🔍 Verificar Banco

```bash
# Conectar ao banco
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form

# Verificar usuário criado
SELECT * FROM User;

# Verificar post criado
SELECT * FROM Post;

# Verificar evento de pontos
SELECT * FROM PointEvent;

# Verificar que metaHash é UNIQUE (evita duplicata)
DESC PointEvent;
```

---

## 📊 Endpoints da API

| Method | Path | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | ❌ | Criar usuário |
| POST | `/auth/login` | ❌ | Fazer login |
| POST | `/auth/logout` | ✅ | Fazer logout |
| GET | `/auth/me` | ✅ | Obter usuário |
| POST | `/posts` | ✅ | Criar post |
| GET | `/posts` | ✅ | Listar posts |
| GET | `/posts/:id` | ✅ | Obter post |
| DELETE | `/posts/:id` | ✅ | Deletar post |
| GET | `/users/me` | ✅ | Perfil do usuário |
| GET | `/users/me/points` | ✅ | Saldo + atividades |
| PUT | `/users/me` | ✅ | Atualizar perfil |
| GET | `/health` | ❌ | Status servidor |

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"

```bash
npm install express @types/express
```

### "DATABASE_URL not set"

Verificar `.env`:
```bash
cat .env | grep DATABASE_URL
```

### "Connection refused" (banco não responde)

```bash
# Testar conexão
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form -e "SELECT 1;"
```

### "Table doesn't exist"

Aplicar migração:
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
```

### Erro de JWT

Regenerar `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Próximos Passos

1. ✅ Instalar dependências
2. ✅ Aplicar migração SQL
3. ✅ Rodar servidor (`npx ts-node src/server/index.ts`)
4. ⏳ Rodar smoke tests (curl)
5. ⏳ Rodar E2E tests (Playwright): `npx playwright test`
6. ⏳ Deploy em Vercel

---

**Data**: 22 de outubro de 2025  
**Status**: Backend pronto para desenvolvimento
