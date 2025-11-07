export const PACOTE_SLUG = 'porto-seguro-3d2n'
export const rotaPacote = (slug: string = PACOTE_SLUG) => `/pacotes/${slug}`
export const rotaPacotes = '/pacotes'
export const reservaHref = (slug: string = PACOTE_SLUG) => `${rotaPacote(slug)}#reserva`
export const rotaReserva = (slug: string = PACOTE_SLUG) => `${rotaPacote(slug)}#reserva`
export const rotaReservaCompleta = (slug?: string) => (slug ? `/reserva?roteiro=${slug}` : '/reserva')
export const rotaRoteiro = (slug?: string) => (slug ? `/roteiro#roteiro-${slug}` : '/roteiro')
export const rotaContato = '/contato'
export const rotaSuporte = '/suporte'
export const rotaSuporteFaq = `${rotaSuporte}#faq`
export const rotaSuportePolitica = `${rotaSuporte}#privacidade`
export const rotaSuporteTermos = `${rotaSuporte}#termos`
export const rotaSuporteCancelamentos = `${rotaSuporte}#cancelamentos`
// Rotas de autenticação
export const rotaLogin = '/login'
export const rotaRegister = '/registro'
export const rotaPerfil = '/perfil'
export const rotaNovoPosts = '/novo-post'
export const rotaPosts = '/posts'
export const rotaSobre = '/sobre'

// Rotas de navegação principal
export const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Roteiros', href: '/inicio' },
  { label: 'Pacotes', href: '/pacotes' },
  { label: 'Contato', href: '/contato' },
] as const;

// Rotas autenticadas
export const authNavLinks = [
  { label: 'Meus Posts', href: rotaPosts },
  { label: 'Novo Post', href: rotaNovoPosts },
  { label: 'Perfil', href: rotaPerfil },
] as const;
