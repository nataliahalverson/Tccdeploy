'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Button from './Button'
import UserMenu from './UserMenu'
import MobileUserMenu from './MobileUserMenu'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const navLinks = [
    { href: '/inicio', label: 'Início' },
    { href: '/pacotes', label: 'Pacotes' },
    { href: '/roteiro', label: 'Roteiro' },
    { href: '/contato', label: 'Contato' },
  ]

  const navLinkClass =
    'focus-ring px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-500 hover:bg-slate-50 transition-all duration-200 rounded-lg'

  return (
    <>
      <a
        href="#conteudo"
        className="skip-link"
        onClick={() => {
          const target = document.getElementById('conteudo')
          if (target) {
            target.focus()
          }
        }}
      >
        Ir para o conteúdo
      </a>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F+</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">FORMA+</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Navegação principal">
            <ul className="flex gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={navLinkClass}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <UserMenu />

          {/* Mobile Menu Button */}
          <Button
            variant="icon"
            size="icon"
            className="md:hidden focus-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Alternar menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 animate-slideDown">
            <nav className="flex flex-col gap-2 pt-4" aria-label="Navegação principal móvel">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navLinkClass} mx-2`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <MobileUserMenu />
            </nav>
          </div>
        )}
      </div>
      </header>
    </>
  )
}
