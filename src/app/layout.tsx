import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import FocusOnRouteChange from '@/components/FocusOnRouteChange'
import { AuthProvider } from '@/contexts/AuthContext'
import SlowScrollProvider from '@/components/SlowScrollProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'FORMA+ — Viagem de Formatura',
  description: 'Escolha o melhor destino para sua viagem de formatura. Pacotes incríveis para Porto Seguro e Florianópolis.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-256.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-1024.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FORMA+',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <SlowScrollProvider />
          <FocusOnRouteChange />
          <main id="conteudo" tabIndex={-1} className="scroll-mt-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
