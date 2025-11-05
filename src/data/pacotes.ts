export type Saida = { dataISO: string; origem: string; vagas?: number }
export type RoteiroDia = { dia: string; titulo: string; itens: string[] }
export type Pacote = {
  slug: string
  titulo: string
  destino: string
  precoDesde?: string
  parcelamento?: string
  inclusos: string[]
  roteiro: RoteiroDia[]
}

export const pacotes: Pacote[] = [
  {
    slug: 'porto-seguro-3d2n',
    titulo: 'Porto Seguro — 3D2N',
    destino: 'Porto Seguro, BA',
    precoDesde: 'R$ 1.290',
    parcelamento: 'até 10x',
    inclusos: ['Transporte ida e volta', 'Hotel 2 noites', 'Café da manhã'],
    roteiro: [
      { dia: 'Dia 1', titulo: 'Chegada e praia', itens: ['Check-in', 'Praia Taperapuã'] },
      { dia: 'Dia 2', titulo: 'Centro histórico', itens: ['Cidade Alta', 'Passarela do Álcool'] },
      { dia: 'Dia 3', titulo: 'Retorno', itens: ['Souvenirs', 'Check-out'] },
    ],
  },
]

export const getPacoteBySlug = (slug: string) => pacotes.find((pacote) => pacote.slug === slug)
