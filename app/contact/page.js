'use client';

import { useLanguage } from '@/components/LanguageProvider';
import ConstructionBlock from '@/components/ConstructionBlock';

export default function ContactPage() {
  const { language } = useLanguage();
  return (
    <main>
      <ConstructionBlock
        eyebrow="GERPINA WEAR / CONTACT"
        title={language === 'bg' ? 'Контактите се добавят.' : 'Contact details are being added.'}
        description={language === 'bg' ? 'Телефон, имейл, WhatsApp и социални профили ще бъдат добавени тук преди публикуването.' : 'Phone, email, WhatsApp and social profiles will be added here before launch.'}
      >
        <div className="contact-placeholder-grid">
          <div><small>Email</small><strong>—</strong></div>
          <div><small>WhatsApp</small><strong>—</strong></div>
          <div><small>{language === 'bg' ? 'Телефон' : 'Phone'}</small><strong>—</strong></div>
        </div>
      </ConstructionBlock>
    </main>
  );
}
