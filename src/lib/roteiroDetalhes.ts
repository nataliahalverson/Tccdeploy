export type RoteiroDetalhe = {
  slug: string
  nome: string
  atracoes: string[]
  hospedagem: string
  dias: number
  saida: string
  chegada: string
  incluso: string[]
  valor: string
  pagamento: string[]
  contato: string
  locomocao?: string
  diaADia?: string[]
}

export const roteiroDetalhes: RoteiroDetalhe[] = [
  {
    slug: 'foz-do-iguacu-pr',
    nome: 'Foz do Iguaçu (PR)',
    atracoes: [
      'Cataratas (lado BR)',
      'Passarela Garganta do Diabo',
      'Parque das Aves',
      'Marco das Três Fronteiras',
      'Tour Itaipu Panorâmica',
    ],
    hospedagem: 'San Juan Eco Hotel (Av. das Cataratas) — alt.: Tarobá Hotel (Centro).',
    dias: 4,
    saida: '21/11/2025',
    chegada: '24/11/2025',
    diaADia: [
      'Dia 1 (21/11/2025): Chegada, check-in e Marco das Três Fronteiras ao entardecer.',
      'Dia 2: Cataratas do Iguaçu – lado brasileiro (trilhas e passarelas) + tempo livre no Parque das Aves (opcional).',
      'Dia 3: Itaipu Panorâmica + Templo Budista e Mesquita. Noite livre.',
      'Dia 4 (24/11/2025): Manhã livre e retorno.',
    ],
    incluso: [
      'Traslados aeroporto↔hotel',
      'City tour',
      'Ingresso Cataratas BR',
      'Coordenação 24h',
      'Seguro-viagem',
      'Kit formatura (camiseta + pulseira)',
    ],
    locomocao: 'Ônibus fretado ida/volta + traslados internos. (Opcional: aéreo, com transfer aeroporto↔hotel.)',
    valor: 'R$ 2.190,00',
    pagamento: [
      'Cartão: 12× de R$ 182,50 sem juros',
      'Pix à vista (-5%): R$ 2.080,50',
      'Boleto: 20% (R$ 438,00) + 9× de R$ 194,67',
    ],
    contato: 'Gerente Aline Souza — (45) 9 9876-4120',
  },
  {
    slug: 'gramado-canela-rs',
    nome: 'Gramado & Canela (RS)',
    atracoes: [
      'Cascata do Caracol',
      'Rua Coberta',
      'Lago Negro',
      'Alpen Park',
      'Tour de chocolates',
    ],
    hospedagem: 'Laghetto Allegro Alpenhaus (Gramado) — alt.: Hotel Sky Gramado.',
    dias: 4,
    saida: '28/11/2025',
    chegada: '01/12/2025',
    diaADia: [
      'Dia 1 (28/11/2025): Chegada à Serra, check-in e Rua Coberta.',
      'Dia 2: Canela — Parque do Caracol (mirantes e trilhas) + centro histórico.',
      'Dia 3: Lago Negro + visita a fábrica/loja de chocolates e Alpen Park (atrativo pago à parte).',
      'Dia 4 (01/12/2025): Compras e retorno.',
    ],
    incluso: [
      'Traslados',
      'City tour Gramado/Canela',
      'Ingresso Parque do Caracol',
      'Seguro-viagem',
      'Coordenação 24h',
      'Kit formatura',
    ],
    locomocao: 'Ônibus fretado ida/volta até a Serra. (Opcional: aéreo até POA + transfer POA↔Gramado.)',
    valor: 'R$ 2.490,00',
    pagamento: [
      '12× de R$ 207,50 sem juros',
      'Pix à vista (-5%): R$ 2.365,50',
      'Boleto: 20% (R$ 498,00) + 9× de R$ 221,33',
    ],
    contato: 'Gerente Rafael Monteiro — (54) 9 9712-0835',
  },
  {
    slug: 'porto-seguro-ba',
    nome: 'Porto Seguro (BA)',
    atracoes: [
      'Passarela do Descobrimento',
      'Praia de Taperapuã (Axé Moi/Tôa Tôa)',
      'Arraial d’Ajuda (Rua do Mucugê + Praia da Pitinga)',
      'Trancoso (Quadrado)',
    ],
    hospedagem: 'Portal Beach Hotel (Taperapuã) — alt.: Nauticomar All Inclusive Hotel & Beach Club.',
    dias: 5,
    saida: '04/12/2025',
    chegada: '08/12/2025',
    diaADia: [
      'Dia 1 (04/12/2025): Check-in e noite na Passarela do Descobrimento.',
      'Dia 2: Praia de Taperapuã (Axé Moi/Tôa Tôa) com day-use.',
      'Dia 3: Arraial d’Ajuda — Rua do Mucugê + Praia da Pitinga.',
      'Dia 4: Trancoso — Quadrado e Praia dos Nativos.',
      'Dia 5 (08/12/2025): Centro histórico e retorno.',
    ],
    incluso: [
      'Traslados',
      'City tour histórico',
      'Day-use em barraca de praia',
      'Seguro-viagem',
      'Coordenação 24h',
      'Kit formatura',
    ],
    locomocao: 'Ônibus fretado ida/volta + traslados diários. (Opcional: aéreo para BPS + transfers.)',
    valor: 'R$ 2.690,00',
    pagamento: [
      '12× de R$ 224,17 sem juros',
      'Pix à vista (-5%): R$ 2.555,50',
      'Boleto: 20% (R$ 538,00) + 9× de R$ 239,11',
    ],
    contato: 'Gerente Priscila Duarte — (73) 9 9625-4479',
  },
  {
    slug: 'fortaleza-beach-park-ce',
    nome: 'Fortaleza + Beach Park (CE)',
    atracoes: [
      'Praia do Futuro (barracas)',
      'Dia inteiro no Beach Park (Aqua Park)',
      'Pôr do sol na Ponte dos Ingleses',
      'Bate-volta Cumbuco',
    ],
    hospedagem: 'Acqua Beach Park Resort (Porto das Dunas) — alt.: Suítes Beach Park Resort.',
    dias: 4,
    saida: '12/12/2025',
    chegada: '15/12/2025',
    diaADia: [
      'Dia 1 (12/12/2025): Praia do Futuro (barracas) e noite na Beira-Mar.',
      'Dia 2: Beach Park (Aqua Park) — dia inteiro.',
      'Dia 3: City tour (Dragão do Mar, Ponte dos Ingleses ao pôr do sol).',
      'Dia 4 (15/12/2025): Cumbuco (dunas e lagoa) e retorno.',
    ],
    incluso: [
      'Traslados',
      'Ingresso 1 dia Beach Park',
      'City tour Fortaleza',
      'Seguro-viagem',
      'Coordenação 24h',
      'Kit formatura',
    ],
    locomocao: 'Ônibus fretado ida/volta + shuttles para Beach Park e city tour. (Opcional: aéreo para FOR + transfers.)',
    valor: 'R$ 2.990,00',
    pagamento: [
      '12× de R$ 249,17 sem juros',
      'Pix à vista (-5%): R$ 2.840,50',
      'Boleto: 20% (R$ 598,00) + 9× de R$ 265,78',
    ],
    contato: 'Gerente Carlos Nascimento — (85) 9 8830-1166',
  },
  {
    slug: 'florianopolis-sc',
    nome: 'Florianópolis (SC)',
    atracoes: [
      'Lagoa da Conceição',
      'Ilha do Campeche (barco)',
      'Jurerê',
      'Praia Mole e dunas da Joaquina',
      'Centro e Mercado Público',
    ],
    hospedagem: 'Selina Floripa (Lagoa da Conceição) — alt.: Pousada Vila Tamarindo (Campeche).',
    dias: 5,
    saida: '18/12/2025',
    chegada: '22/12/2025',
    diaADia: [
      'Dia 1 (18/12/2025): Lagoa da Conceição e mirantes.',
      'Dia 2: Ilha do Campeche (barco, clima favorável).',
      'Dia 3: Jurerê e Santo Antônio de Lisboa (fim de tarde).',
      'Dia 4: Praia Mole + dunas da Joaquina.',
      'Dia 5 (22/12/2025): Centro e Mercado Público; retorno.',
    ],
    incluso: [
      'Traslados',
      'Passeio Ilha do Campeche (tempo bom)',
      'City tour norte/lagoa',
      'Seguro-viagem',
      'Coordenação 24h',
      'Kit formatura',
    ],
    locomocao: 'Ônibus fretado ida/volta + traslados para praias/passeios. (Opcional: aéreo para FLN + transfers.)',
    valor: 'R$ 1.990,00',
    pagamento: [
      '12× de R$ 165,83 sem juros',
      'Pix à vista (-5%): R$ 1.890,50',
      'Boleto: 20% (R$ 398,00) + 9× de R$ 176,89',
    ],
    contato: 'Gerente Bruna Ferreira — (48) 9 9120-5586',
  },
  {
    slug: 'rio-de-janeiro-rj',
    nome: 'Rio de Janeiro (RJ)',
    atracoes: [
      'Cristo (trem do Corcovado)',
      'Pão de Açúcar (bondinho)',
      'Copacabana + Arpoador',
      'Boulevard Olímpico e Museu do Amanhã',
    ],
    hospedagem: 'Royal Rio Palace Hotel (Copacabana) — alt.: Arena Copacabana Hotel.',
    dias: 4,
    saida: '09/01/2026',
    chegada: '12/01/2026',
    diaADia: [
      'Dia 1 (09/01/2026): Copacabana e pôr do sol no Arpoador.',
      'Dia 2: Cristo Redentor (trem do Corcovado) + praias da Zona Sul.',
      'Dia 3: Pão de Açúcar (bondinho) + Praia Vermelha.',
      'Dia 4 (12/01/2026): Boulevard Olímpico + Museu do Amanhã; retorno.',
    ],
    incluso: [
      'Traslados',
      'Ingressos Cristo + bondinho',
      'City tour praias/centro',
      'Seguro-viagem',
      'Coordenação 24h',
      'Kit formatura',
    ],
    locomocao: 'Ônibus fretado ida/volta + traslados para Cristo/bondinho/praias. (Opcional: aéreo para GIG/SDU + transfers.)',
    valor: 'R$ 2.390,00',
    pagamento: [
      '12× de R$ 199,17 sem juros',
      'Pix à vista (-5%): R$ 2.270,50',
      'Boleto: 20% (R$ 478,00) + 9× de R$ 212,44',
    ],
    contato: 'Gerente Diego Andrade — (21) 9 9544-2301',
  },
]
