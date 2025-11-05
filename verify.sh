#!/bin/bash
# Script de Verificação Final do Projeto FORMA+

echo "🔍 Verificando estrutura do projeto FORMA+..."
echo ""

# Verificar arquivos principais
echo "✅ Verificando arquivos principais:"
files=(
  "package.json"
  "tsconfig.json"
  ".eslintrc.json"
  "next.config.mjs"
  "README.md"
  "DEVELOPMENT.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (FALTANDO)"
  fi
done

echo ""
echo "✅ Verificando páginas:"
pages=(
  "src/app/page.tsx"
  "src/app/inicio/page.tsx"
  "src/app/pacotes/page.tsx"
  "src/app/roteiro/page.tsx"
  "src/app/login/page.tsx"
  "src/app/registro/page.tsx"
  "src/app/contato/page.tsx"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    echo "  ✓ $page"
  else
    echo "  ✗ $page (FALTANDO)"
  fi
done

echo ""
echo "✅ Verificando componentes:"
components=(
  "src/components/Header.tsx"
  "src/components/Footer.tsx"
  "src/components/Carousel.tsx"
  "src/components/Form.tsx"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "  ✓ $component"
  else
    echo "  ✗ $component (FALTANDO)"
  fi
done

echo ""
echo "✅ Verificando estilos:"
styles=(
  "src/app/globals.css"
  "src/components/Header.module.css"
  "src/components/Carousel.module.css"
  "src/components/FormInput.module.css"
)

for style in "${styles[@]}"; do
  if [ -f "$style" ]; then
    echo "  ✓ $style"
  else
    echo "  ✗ $style (FALTANDO)"
  fi
done

echo ""
echo "✅ Verificando imagens placeholder:"
images=(
  "public/placeholder-1.jpg"
  "public/placeholder-2.jpg"
  "public/placeholder-3.jpg"
  "public/placeholder-4.jpg"
)

for image in "${images[@]}"; do
  if [ -f "$image" ]; then
    echo "  ✓ $image"
  else
    echo "  ✗ $image (FALTANDO)"
  fi
done

echo ""
echo "🎉 Verificação concluída!"
echo ""
echo "📝 Próximos passos:"
echo "  1. npm install"
echo "  2. npm run dev"
echo "  3. Abrir http://localhost:3000"
