import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Home,
  Map,
  PhoneCall,
  LogIn,
} from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { href: '/inicio', label: 'Início', icon: Home },
  { href: '/pacotes', label: 'Pacotes', icon: Map },
    { href: '/contato', label: 'Contato', icon: PhoneCall },
    { href: '/login', label: 'Entrar', icon: LogIn },
  ]

  return (
  <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <nav className="md:hidden mb-6" aria-label="Acesso rápido">
          <ul className="grid grid-cols-4 gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center text-xs font-medium text-white/80 transition-colors duration-200 hover:bg-white/10"
                  >
                    <Icon size={20} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F+</span>
              </div>
              <h3 className="text-lg font-bold">FORMA+</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Sua melhor viagem de formatura começa aqui.</p>
            <div className="flex gap-4">
              <a href="#" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/inicio" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/pacotes" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                  Pacotes
                </Link>
              </li>
              <li>
                <Link href="/roteiro" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                  Roteiro
                </Link>
              </li>
              <li>
                <Link href="/contato" className="focus-ring text-slate-400 hover:text-primary-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="focus-ring hover:text-primary-400 transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#" className="focus-ring hover:text-primary-400 transition-colors">
                  Políticas de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="focus-ring hover:text-primary-400 transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="focus-ring hover:text-primary-400 transition-colors">
                  Cancelamentos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex gap-3 items-start">
                <Mail size={16} className="mt-1 flex-shrink-0 text-primary-400" />
                <a href="mailto:contato@formaplus.com" className="focus-ring hover:text-primary-400 transition-colors">
                  contato@formaplus.com
                </a>
              </div>
              <div className="flex gap-3 items-start">
                <Phone size={16} className="mt-1 flex-shrink-0 text-primary-400" />
                <a href="tel:+5511999999999" className="focus-ring hover:text-primary-400 transition-colors">
                  +55 (11) 9 9999-9999
                </a>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-primary-400" />
                <p>São Paulo, SP - Brasil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center sm:text-left">
              &copy; 2025 FORMA+ - Viagem de Formatura. Todos os direitos reservados.
            </p>
            <p className="text-slate-500 text-sm">Desenvolvido com ❤️ por FORMA+ Team</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
