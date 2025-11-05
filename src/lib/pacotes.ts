export type Pacote = {
  id: number
  nome: string
  slug: string
  dias: number
  valor: string
  destaque: boolean
  roteiro: string[]
  imagem: string
  imagemUrl?: string
}

export const pacotes: Pacote[] = [
  {
    id: 1,
    nome: 'Porto Seguro (BA)',
    slug: 'porto-seguro-ba',
    dias: 5,
    valor: 'R$ 2.200–2.900',
  destaque: false,
    roteiro: [
      'Passarela do Descobrimento (noite)',
      'Praia de Taperapuã (Axé Moi/Tôa Tôa)',
      'Arraial d’Ajuda (Rua do Mucugê + Praia da Pitinga)',
      'Trancoso (Quadrado + Praia dos Nativos)',
      'Centro Histórico + Memorial da Epopeia',
    ],
    imagem: '🏝️',
    imagemUrl: 'https://unsplash.com/photos/zGF0mKZRsFo/download?force=true&w=1600',
  },
  {
    id: 2,
    nome: 'Fortaleza + Beach Park (CE)',
    slug: 'fortaleza-beach-park-ce',
    dias: 4,
    valor: 'R$ 2.400–3.400',
    destaque: false,
    roteiro: [
      'Praia do Futuro (barracas)',
      'Dia inteiro no Beach Park (Aqua Park)',
      'Dragão do Mar + pôr do sol na Ponte dos Ingleses',
      'Bate-volta Cumbuco ou Morro Branco',
    ],
    imagem: '🎢',
    imagemUrl: 'https://unsplash.com/photos/M0qZcUpgqco/download?force=true&w=1600',
  },
  {
    id: 3,
    nome: 'Florianópolis (SC)',
    slug: 'florianopolis-sc',
    dias: 5,
    valor: 'R$ 1.700–2.500',
  destaque: false,
    roteiro: [
      'Lagoa da Conceição + mirantes',
      'Ilha do Campeche (barco)',
      'Jurerê + Santo Antônio de Lisboa',
      'Praia Mole + Joaquina (dunas)',
      'Centro + Mercado Público',
    ],
    imagem: '🏄',
    imagemUrl: 'https://unsplash.com/photos/kAJI8GxYmDk/download?force=true&w=1600',
  },
  {
    id: 4,
    nome: 'Foz do Iguaçu (PR)',
    slug: 'foz-do-iguacu-pr',
    dias: 4,
    valor: 'R$ 1.800–2.600',
  destaque: true,
    roteiro: [
      'Parque Nacional do Iguaçu (Trilha das Cataratas + passarela Garganta)',
      'Parque das Aves (opcional)',
      'Itaipu Panorâmica + Marco das Três Fronteiras',
      'Templo Budista + Mesquita Omar Ibn Al-Khattab',
    ],
    imagem: '🌊',
    imagemUrl: 'https://unsplash.com/photos/LhlBb9uRgRY/download?force=true&w=1600',
  },
  {
    id: 5,
    nome: 'Rio de Janeiro (RJ)',
    slug: 'rio-de-janeiro-rj',
    dias: 4,
    valor: 'R$ 1.900–2.800',
  destaque: false,
    roteiro: [
      'Copacabana + Arpoador (pôr do sol)',
      'Cristo Redentor pelo Trem do Corcovado',
      'Pão de Açúcar (Bondinho) + Praia Vermelha',
      'Boulevard Olímpico + Museu do Amanhã + Lapa/Selarón',
    ],
    imagem: '🏖️',
    imagemUrl: 'https://unsplash.com/photos/GTLJklnjn-E/download?force=true&w=1600',
  },
  {
    id: 6,
    nome: 'Gramado & Canela (RS)',
    slug: 'gramado-canela-rs',
    dias: 4,
    valor: 'R$ 2.200–3.000',
    destaque: true,
    roteiro: [
      'Rua Coberta + Lago Negro',
      'Snowland (meio dia a dia inteiro)',
      'Canela (Cascata do Caracol + Alpen Park)',
      'Mini Mundo + tour de chocolates',
    ],
    imagem: '🌲',
    imagemUrl: 'https://unsplash.com/photos/1LAySzqfm3E/download?force=true&w=1600',
  },
]
