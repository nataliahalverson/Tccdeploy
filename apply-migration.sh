#!/bin/bash
# Script para aplicar migração SQL no AlwaysData

echo "🗄️  Aplicando migração SQL no AlwaysData..."
echo ""

# Carregar .env
export $(cat .env | grep DATABASE_URL | xargs)

# Opção 1: Usar MySQL client (recomendado)
echo "📝 Aplicando SQL..."
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql

if [ $? -eq 0 ]; then
    echo "✅ SQL aplicado com sucesso!"
    echo ""
    echo "🔍 Verificando tabelas..."
    mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form -e "SHOW TABLES;"
    echo ""
    echo "📊 Contando registros..."
    mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form -e "SELECT COUNT(*) as 'User' FROM User; SELECT COUNT(*) as 'Post' FROM Post; SELECT COUNT(*) as 'PointEvent' FROM PointEvent;"
    echo ""
    echo "🔄 Sincronizando Prisma..."
    npx prisma migrate deploy
    npx prisma generate
    echo ""
    echo "✅ Tudo pronto!"
else
    echo "❌ Erro ao aplicar SQL"
    exit 1
fi
