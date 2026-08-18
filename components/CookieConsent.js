'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

const KEY = 'gerpina-cookie-consent-v1';

export default function CookieConsent() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setOpen(true); } catch {}
  }, []);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener('gerpina:cookie-settings', reopen);
    return () => window.removeEventListener('gerpina:cookie-settings', reopen);
  }, []);

  const save = (value) => {
    try { localStorage.setItem(KEY, value); } catch {}
    setOpen(false);
  };

  if (!open) return null;
  const bg = language === 'bg';
  return (
    <div className="cookie-banner" role="dialog" aria-label={bg ? 'Настройки за бисквитки' : 'Cookie settings'}>
      <div>
        <b>{bg ? 'Вашата поверителност' : 'Your privacy'}</b>
        <p>{bg ? 'В момента използваме само необходими/функционални технологии за количка, език и предпочитания. Незадължителни аналитични и рекламни технологии няма да се активират без съгласие.' : 'We currently use only necessary/functional storage for the cart, language and preferences. Optional analytics/advertising technologies will not be enabled without consent.'} <Link href="/cookies">{bg ? 'Научи повече' : 'Learn more'}</Link>.</p>
      </div>
      <div className="cookie-actions"><button onClick={() => save('necessary')}>{bg ? 'Само необходими' : 'Necessary only'}</button><button className="primary" onClick={() => save('all')}>{bg ? 'Приемам' : 'Accept'}</button></div>
    </div>
  );
}
