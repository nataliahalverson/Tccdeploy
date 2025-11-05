# PowerShell script para aplicar migração SQL no AlwaysData

Write-Host "🗄️  Aplicando migração SQL no AlwaysData..." -ForegroundColor Green
Write-Host ""

# Credenciais
$host_name = "mysql-facerec.alwaysdata.net"
$user = "facerec"
$password = "iqmi8j55PDpHQ"
$database = "facerec_form"
$sql_file = "prisma/migrations/20251022_add_user_post_points.sql"

# Verificar se arquivo SQL existe
if (-Not (Test-Path $sql_file)) {
    Write-Host "❌ Arquivo SQL não encontrado: $sql_file" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Aplicando SQL..." -ForegroundColor Yellow

# Construir comando MySQL
$mysql_cmd = @"
mysql -h $host_name -u $user -p$password -D $database < $sql_file
"@

# Executar (requer MySQL client instalado)
# Alternativa: usar PowerShell para ler e executar via API (mais complexo)

Write-Host ""
Write-Host "⚠️  OPÇÕES DE APLICAÇÃO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opção 1 (Recomendado): Via MySQL Client"
Write-Host "  Pré-requisito: mysql instalado (choco install mysql)"
Write-Host "  Comando:"
Write-Host "  mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql"
Write-Host "  (Digite a senha: iqmi8j55PDpHQ)"
Write-Host ""
Write-Host "Opção 2: Via phpMyAdmin (Web UI)"
Write-Host "  1. Acesse https://admin.alwaysdata.com"
Write-Host "  2. Faça login"
Write-Host "  3. Vá para phpmyadmin"
Write-Host "  4. Selecione database 'facerec_form'"
Write-Host "  5. Clique em 'Importação'"
Write-Host "  6. Selecione arquivo: $sql_file"
Write-Host "  7. Clique 'Enviar'"
Write-Host ""
Write-Host "Opção 3: Via MySQL Workbench"
Write-Host "  1. Abra MySQL Workbench"
Write-Host "  2. Crie conexão a mysql-facerec.alwaysdata.net"
Write-Host "  3. Abra arquivo $sql_file"
Write-Host "  4. Execute (Ctrl+Shift+Enter)"
Write-Host ""

# Se MySQL client está disponível, tentar executar
try {
    $mysql_check = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysql_check) {
        Write-Host "✅ MySQL client encontrado, executando..." -ForegroundColor Green
        # Executar o comando (nota: -p sem espaço, senha imediatamente após)
        mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form < $sql_file
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SQL aplicado com sucesso!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🔍 Verificando tabelas..." -ForegroundColor Yellow
            mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form -e "SHOW TABLES;"
            Write-Host ""
            Write-Host "🔄 Sincronizando Prisma..." -ForegroundColor Yellow
            npm exec -- prisma migrate deploy
            npm exec -- prisma generate
            Write-Host ""
            Write-Host "✅ Tudo pronto para desenvolvimento!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro ao aplicar SQL" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "ℹ️  MySQL client não encontrado." -ForegroundColor Yellow
        Write-Host "Instale com: choco install mysql" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Use uma das opções acima para aplicar o SQL" -ForegroundColor Yellow
}
