# Guia de Git Workflow

Este documento descreve o workflow recomendado para trabalhar com este projeto.

## Branches

- **master**: Branch de produção
- **develop**: Branch de desenvolvimento

## Workflow

1. Crie uma branch a partir de `develop`
2. Faça suas mudanças
3. Faça commit das mudanças
4. Faça push para origin
5. Abra um Pull Request
6. Após aprovação, faça merge para develop
7. Após testes, faça merge para master

## Comandos Úteis

```bash
# Criar branch
git checkout -b feature/nome-feature develop

# Fazer commit
git commit -m "type: description"

# Push
git push origin feature/nome-feature

# Rebase antes de merge
git rebase develop

# Merge
git merge feature/nome-feature
```
