'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <div className="footer-logo">GERPINA <span>WEAR</span></div>
          <p>{t.footer.line}</p>
        </div>
        <div>
          <h4>{t.footer.shop}</h4>
          <Link href="/women">{t.nav.women}</Link>
          <Link href="/kids">{t.nav.kids}</Link>
          <Link href="/men">{t.nav.men}</Link>
          <Link href="/shop">{t.nav.shop}</Link>
        </div>
        <div>
          <h4>{t.footer.info}</h4>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/delivery-returns">{t.footer.delivery}</Link>
          <Link href="/terms">{t.footer.terms}</Link>
          <Link href="/privacy">{t.footer.privacy}</Link>
        </div>
        <div>
          <h4>{t.footer.support}</h4>
          <Link href="/contact">{t.nav.contact}</Link>
          <span className="footer-muted">Instagram — soon</span>
          <span className="footer-muted">Facebook — soon</span>
          <span className="footer-muted">WhatsApp — soon</span>
        </div>
      </div>
      <div className="footer-bottom shell">
        <span>© {new Date().getFullYear()} GERPINA Wear. {t.footer.rights}</span>
        <span>choose your style</span>
      </div>
    </footer>
  );
}
