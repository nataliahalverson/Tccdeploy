'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Form } from '@/components/Form'
import Main from '@/components/Main'
import { Mail, Phone, Clock3, MapPin, MessageCircle } from 'lucide-react'
import styles from './page.module.css'

export default function ContatoPageClient() {
  const handleContact = async (data: Record<string, string>) => {
    console.log('Contact data:', data)
  }

  return (
    <>
      <Header />
      <Main>
        <section className={styles.container}>
          <h1>Entre em Contato</h1>
          <p className={styles.subtitle}>Preencha o formulário e retornaremos o mais breve possível</p>

          <div className={styles.content}>
            <div className={styles.formSection}>
              <h2>Envie uma mensagem</h2>
              <Form
                fields={[
                  {
                    id: 'nome',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Seu nome completo',
                    required: true,
                  },
                  {
                    id: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'seu@email.com',
                    required: true,
                  },
                  {
                    id: 'assunto',
                    label: 'Assunto',
                    type: 'text',
                    placeholder: 'Assunto da mensagem',
                    required: true,
                  },
                  {
                    id: 'mensagem',
                    label: 'Mensagem',
                    type: 'textarea',
                    placeholder: 'Sua mensagem aqui...',
                    required: true,
                    rows: 6,
                  },
                ]}
                onSubmit={handleContact}
                submitLabel="Enviar Mensagem"
              />
            </div>

            <div className={styles.infoSection}>
              <h2>Informações de Contato</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden>
                    <Mail size={18} />
                  </span>
                  <div>
                    <h3>Email</h3>
                    <a className={styles.infoLink} href="mailto:suporte@viagemdeformatura.com.br">
                      suporte@viagemdeformatura.com.br
                    </a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden>
                    <Phone size={18} />
                  </span>
                  <div>
                    <h3>Telefone</h3>
                    <a className={styles.infoLink} href="tel:+551112345678">(11) 1234-5678</a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden>
                    <MessageCircle size={18} />
                  </span>
                  <div>
                    <h3>WhatsApp</h3>
                    <a className={styles.infoLink} href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">
                      (11) 99999-9999
                    </a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon} aria-hidden>
                    <MapPin size={18} />
                  </span>
                  <div>
                    <h3>Endereço</h3>
                    <p>Av. das Formaturas, 123 — São Paulo/SP</p>
                  </div>
                </div>
              </div>

              <div className={styles.scheduleCard}>
                <Clock3 size={20} aria-hidden />
                <div>
                  <strong>Horário de atendimento</strong>
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 10h às 14h</p>
                </div>
              </div>

              <div className={styles.quickActions}>
                <a className={styles.quickAction} href="mailto:suporte@viagemdeformatura.com.br">
                  <Mail size={18} /> Enviar email agora
                </a>
                <a className={styles.quickAction} href="tel:+551112345678">
                  <Phone size={18} /> Ligar para a equipe
                </a>
              </div>
            </div>
          </div>
        </section>
      </Main>
      <Footer />
    </>
  )
}
