# 🏠 Guia de Navegação do FORMA+

## Páginas Visíveis no Menu

```
┌─────────────────────────────────────────────────────┐
│  🏠 FORMA+          Home | Início | Pacotes | ...    │  Login | Registrar
└─────────────────────────────────────────────────────┘

HOME (/)
├─ Landing page
├─ Carrossel de imagens
└─ CTA: "Explorar Agora"
   ↓

INÍCIO (/inicio) ← Login redireciona aqui
├─ Bem-vindo ao usuário (se autenticado)
├─ Carrossel de destinos
└─ CTA: "Ver Pacotes"
   ↓

PACOTES (/pacotes)
├─ Listagem de pacotes
├─ Cards com preços
└─ CTA: "Escolher Pacote"
   ↓

ROTEIRO (/roteiro)
├─ Itinerário detalhado
├─ Confirmação de valores
└─ CTA: "Confirmar Reserva"

CONTATO (/contato)
├─ Formulário de contato
├─ FAQ
└─ Suporte
```

---

## Autenticação

```
LOGIN (/login)
├─ Email
├─ Senha
└─ Button "Entrar"
   ↓
   ✅ OK → Redireciona para /inicio
   ❌ Erro → Mostra mensagem

REGISTRO (/registro)
├─ Nome
├─ Email
├─ Senha (mín 8 chars)
├─ Confirmar Senha
└─ Button "Criar Conta"
   ↓
   ✅ OK → Redireciona para /pacotes
   ❌ Erro → Mostra mensagem
```

---

## Status das Páginas

| Página | Rota | Status | Descrição |
|--------|------|--------|-----------|
| Home | `/` | 🟢 Existe | Landing principal |
| Início | `/inicio` | 🟢 Existe | Dashboard pós-login |
| Pacotes | `/pacotes` | 🟢 Existe | Listagem de opções |
| Roteiro | `/roteiro` | 🟢 Existe | Confirmação |
| Contato | `/contato` | 🟢 Existe | Suporte |
| Login | `/login` | 🟢 Funciona | Email + Senha |
| Registro | `/registro` | 🟢 Funciona | 4 campos + validação |
| Sobre | `/sobre` | 🟡 Existe mas oculto | Não está no menu |

---

## Fluxo Recomendado

### 👤 Usuário Novo

```
Home → Explorar → Início → Pacotes → Roteiro → Contato/Suporte
```

### 🔐 Usuário Retornando

```
Login (/login) → Início (/inicio) → Pacotes → Roteiro
```

### 📝 Primeiro Acesso

```
Registro (/registro) → Criar Conta → Redireciona para Pacotes
                       ↓
                     Login → Início
```

---

**Tudo pronto para testar! 🚀**
