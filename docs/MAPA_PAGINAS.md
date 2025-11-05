# 📋 Estrutura de Páginas do FORMA+

**Data**: 23 de outubro de 2025  
**Status**: 🟢 **Mapeamento Completo**

---

## 🗺️ **Páginas Visíveis (Menu de Navegação)**

### Navegação Principal (Header)

| Página | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| **Home** | `/` | Landing page inicial | ❌ Pública |
| **Início** | `/inicio` | Página com carrossel e destaques | ❌ Pública |
| **Pacotes** | `/pacotes` | Listagem de pacotes de viagem | ❌ Pública |
| **Roteiro** | `/roteiro` | Roteiro detalhado da viagem | ❌ Pública |
| **Contato** | `/contato` | Formulário de contato | ❌ Pública |

---

## 🔐 **Páginas de Autenticação** (Sem Menu)

| Página | Rota | Descrição |
|--------|------|-----------|
| **Login** | `/login` | Fazer login com email + senha |
| **Registro** | `/registro` | Criar nova conta (multi-step) |

---

## ❓ **Problema: Fluxo de Login**

**Situação Atual:**
```
1. Usuário faz LOGIN (/login)
2. Backend autentica ✅
3. Frontend redireciona para /pacotes ❌
   (deveria ser /inicio ou /?)
```

**Código Responsável** (src/app/login/page.client.tsx):
```typescript
// ❌ Redireciona para /pacotes
router.push('/pacotes')

// ✅ Deveria redirecionar para:
router.push('/inicio')    // Ou /
```

---

## 🎯 **Lógica Recomendada**

### **Fluxo Sem Autenticação:**
```
Home (/) 
  ↓
Início (/inicio) - Carrossel
  ↓
Pacotes (/pacotes) - Escolher pacote
  ↓
Roteiro (/roteiro) - Confirmar roteiro
  ↓
Contato (/contato) - Dúvidas
```

### **Fluxo Com Autenticação:**
```
Login (/login)
  ↓
Início (/inicio) - Dashboard pós-login [RECOMENDADO]
  OU
Pacotes (/pacotes) - Ir direto aos pacotes
```

---

## 🔧 **O Que Corrigir?**

### **Opção 1: Redirecionar para Início** (RECOMENDADO)

**Arquivo**: `src/app/login/page.client.tsx`  
**Linha**: ~48

```typescript
// ❌ Atual
router.push('/pacotes')

// ✅ Novo
router.push('/inicio')
```

### **Opção 2: Redirecionar para Home**

```typescript
router.push('/')
```

### **Opção 3: Redirecionar para Pacotes** (Manter)

```typescript
router.push('/pacotes')  // Já é assim
```

---

## 📄 **Estrutura de Diretórios**

```
src/app/
├── page.tsx                  # Home (/)
├── page.client.tsx           # HomePageClient
├── page.module.css
├── globals.css
│
├── inicio/
│   ├── page.tsx              # /inicio
│   ├── page.client.tsx       # InícioPageClient
│   └── page.module.css
│
├── pacotes/
│   ├── page.tsx              # /pacotes
│   ├── page.client.tsx       # PacotesPageClient
│   └── page.module.css
│
├── roteiro/
│   ├── page.tsx              # /roteiro
│   ├── page.client.tsx       # RoteiroPageClient
│   └── page.module.css
│
├── contato/
│   ├── page.tsx              # /contato
│   ├── page.client.tsx       # ContatoPageClient
│   └── page.module.css
│
├── sobre/                    # ⚠️ Não aparece no menu (?)
│
├── login/
│   ├── page.tsx              # /login
│   ├── page.client.tsx       # LoginPageClient ← FIX HERE
│   └── page.module.css
│
└── registro/
    ├── page.tsx              # /registro
    ├── page.client.tsx       # RegistroPageClient
    └── page.module.css
```

---

## 🚨 **Achado: Página "Sobre"**

Existe diretório `/sobre` mas **NÃO aparece no menu Header**.

**Opções:**
1. ✅ Adicionar ao menu do Header
2. ✅ Remover diretório (se não usar)
3. ✅ Manter oculto (apenas via link direto)

---

## ✅ **Resumo**

| Item | Status | Ação |
|------|--------|------|
| **Páginas criadas** | 6 + auth | ✅ OK |
| **Menu Header** | 5 páginas | ✅ OK |
| **Fluxo Login** | → /pacotes | ❌ Revisar |
| **Página "Sobre"** | Existe mas oculta | ⚠️ Clarificar |

---

## 📝 **Recomendação**

**Para MVP**, manter simples:

1. ✅ **Home** → Landing com CTA "Explorar"
2. ✅ **Início** → Dashboard pós-login ou galeria
3. ✅ **Pacotes** → Listagem de opções
4. ✅ **Roteiro** → Confirmação e agendamento
5. ✅ **Contato** → Suporte

**Login deve redirecionar para** `/inicio` (mais lógico que `/pacotes`)

---

**Quer que eu corrija o redirecionamento do login? 🔧**
