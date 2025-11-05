# 🗄️ Guia de Migração — AlwaysData

## Status
✅ **Schema definido** (`prisma/schema.prisma`)  
✅ **SQL gerado** (`prisma/migrations/20251022_add_user_post_points.sql`)  
⏳ **Próximo**: Aplicar no banco

---

## 📋 Pré-requisitos

1. **Credenciais do AlwaysData**:
   - Host: `mysql-facerec.alwaysdata.net`
   - Usuário: `facerec`
   - Senha: `iqmi8j55PDpHQ`
   - Database: `facerec_form`

2. **Cliente MySQL instalado** (localmente):
   ```bash
   # Windows (via Chocolatey)
   choco install mysql

   # macOS (via Homebrew)
   brew install mysql-client

   # Linux (Debian/Ubuntu)
   sudo apt-get install mysql-client-core
   ```

3. **Arquivo SQL pronto**:
   - Localização: `prisma/migrations/20251022_add_user_post_points.sql`

---

## 🚀 Passo 1: Aplicar Migração (Local)

### Opção A: Via linha de comando (Linux/macOS/Windows CMD)

```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
```

Quando pedir senha:
```
Enter password: iqmi8j55PDpHQ
```

---

### Opção B: Via phpMyAdmin (AlwaysData web)

1. Acesse **https://admin.alwaysdata.com**
2. Faça login
3. Vá para **Banco de dados** → **phpmyadmin**
4. Selecione database `facerec_form`
5. Clique na aba **"Importação"**
6. Selecione o arquivo `prisma/migrations/20251022_add_user_post_points.sql`
7. Clique **"Enviar"**

---

### Opção C: Via cliente MySQL (GUI)

1. Abra seu cliente MySQL (ex: MySQL Workbench)
2. Crie conexão:
   - Host: `mysql-facerec.alwaysdata.net`
   - Porta: `3306`
   - Usuário: `facerec`
   - Senha: `iqmi8j55PDpHQ`
3. Selecione database: `facerec_form`
4. Abra arquivo: `prisma/migrations/20251022_add_user_post_points.sql`
5. Execute (Ctrl+Shift+Enter ou botão "Execute")

---

## ✅ Passo 2: Verificar Criação

Conecte-se ao banco e execute:

```sql
-- Listar todas as tabelas
SHOW TABLES;

-- Verificar tabela User
DESC User;

-- Verificar tabela Post
DESC Post;

-- Verificar tabela PointEvent
DESC PointEvent;

-- Contar registros (deve retornar 0 para todas)
SELECT COUNT(*) FROM User;
SELECT COUNT(*) FROM Post;
SELECT COUNT(*) FROM PointEvent;
```

---

## 🔄 Passo 3: Sincronizar Prisma Localmente

Após aplicar a migração no AlwaysData, sincronize o estado local:

```bash
# Atualizar estado do Prisma
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

---

## 📊 Estrutura das Tabelas

### User
```
id         VARCHAR(191) PRIMARY KEY
email      VARCHAR(191) UNIQUE NOT NULL
name       VARCHAR(191) NOT NULL
password   VARCHAR(191) NOT NULL (bcrypt hashed)
createdAt  DATETIME(3) DEFAULT CURRENT_TIMESTAMP
updatedAt  DATETIME(3)
```

### Post
```
id        VARCHAR(191) PRIMARY KEY
title     VARCHAR(191) NOT NULL
content   LONGTEXT NOT NULL
userId    VARCHAR(191) NOT NULL (FK → User)
createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP
updatedAt DATETIME(3)
```

### PointEvent (Gamificação)
```
id        VARCHAR(191) PRIMARY KEY
userId    VARCHAR(191) NOT NULL (FK → User)
type      VARCHAR(191) NOT NULL ('POST_CREATED'|'PROFILE_COMPLETED'|'DAILY_CHECKIN')
points    INT NOT NULL
meta      JSON NULL ({ postId, ... })
metaHash  VARCHAR(191) NOT NULL (SHA256 para idempotência)
createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP

UNIQUE(userId, type, metaHash) — previne duplicatas
```

---

## 🔒 Idempotência (Anti-duplicata)

**Problema**: Enviar POST `/api/posts` duas vezes cria dois eventos.

**Solução**: `PointEvent` tem UNIQUE constraint em `(userId, type, metaHash)`:

```sql
UNIQUE KEY `PointEvent_userId_type_metaHash_key` (`userId`, `type`, `metaHash`)
```

**Como funciona**:
1. Ao criar um evento, calcula `metaHash = SHA256(userId + postId + type)`
2. Insere `(userId, 'POST_CREATED', 'abc123def456')`
3. Se re-enviar a mesma requisição, tenta inserir novamente
4. MySQL retorna erro `1062 Duplicate entry` (ou ignorar com `INSERT IGNORE`)
5. Backend retorna `409 Conflict` ou silenciosamente ignora

---

## 🐛 Troubleshooting

### Erro: "Host 'X' is not allowed to connect to this MySQL server"

**Causa**: IP não autorizado no AlwaysData  
**Solução**:
1. Vá para AlwaysData → Configurações → MySQL
2. Whitelist seu IP (ou use `%` para permitir qualquer IP)

---

### Erro: "Access denied for user 'facerec'@'X'"

**Causa**: Senha incorreta  
**Solução**:
1. Copie a senha exata: `iqmi8j55PDpHQ`
2. Verifique se tem caracteres especiais
3. Teste no phpMyAdmin primeiro

---

### Erro: "Unknown database 'facerec_form'"

**Causa**: Database não existe  
**Solução**:
1. Crie via AlwaysData → Banco de dados
2. Nome: `facerec_form`
3. Aguarde sincronização (< 1 min)

---

### Tabelas já existem (erro ao reimportarMigração)

**Causa**: Migração foi executada antes  
**Solução**:
```sql
DROP TABLE PointEvent;
DROP TABLE Post;
DROP TABLE User;
-- Depois reimporte o SQL
```

---

## 📝 Próximos Passos

1. ✅ **Aplicar migração** (`20251022_add_user_post_points.sql`)
2. ✅ **Verificar tabelas** (SHOW TABLES; DESC User; etc)
3. ⏳ **Sincronizar Prisma** (`npx prisma migrate deploy`)
4. ⏳ **Implementar endpoints** (`POST /api/auth/login`, `POST /api/posts`, etc)
5. ⏳ **Testar E2E** (happy-path.spec.ts)

---

## 📞 Suporte

- **AlwaysData Docs**: https://doc.alwaysdata.com/mysql/index.html
- **Prisma Docs**: https://www.prisma.io/docs/orm/prisma-migrate
- **MySQL Ref**: https://dev.mysql.com/doc/refman/8.0/en/

---

**Status**: Pronto para aplicar  
**Data**: 22 de outubro de 2025
