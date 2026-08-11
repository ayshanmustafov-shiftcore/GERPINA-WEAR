'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';

export default function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const items = [
    ['/', t.nav.home],
    ['/shop', t.nav.shop],
    ['/women', t.nav.women],
    ['/kids', t.nav.kids],
    ['/men', t.nav.men],
    ['/about', t.nav.about],
  ];

  return (
    <>
      <div className="announcement">{t.announcement}</div>
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu-button icon-button" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <MenuIcon />
          </button>

          <Link href="/" className="brand-mark" aria-label="GERPINA Wear home">
            <span className="brand-monogram">
              <Image src="/gerpina-logo.jpg" alt="" fill sizes="44px" priority />
            </span>
            <span className="brand-words">
              <b>GERPINA</b>
              <small>WEAR</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {items.map(([href, label]) => (
              <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button className="language-switch" onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')} aria-label="Switch language">
              <span className={language === 'bg' ? 'active' : ''}>BG</span>
              <i>/</i>
              <span className={language === 'en' ? 'active' : ''}>EN</span>
            </button>
            <button className="icon-button search-button" onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
              <SearchIcon />
            </button>
            <Link href="/cart" className="icon-button cart-button" aria-label={t.nav.cart}>
              <BagIcon />
              <span className="cart-count">0</span>
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="search-strip">
            <div className="search-box">
              <SearchIcon size={18} />
              <input disabled placeholder={language === 'bg' ? 'Търсенето ще бъде активно с продуктовия каталог' : 'Search activates with the product catalogue'} />
              <span>{t.common.underConstruction}</span>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-drawer-top">
              <span className="drawer-brand">GERPINA <small>WEAR</small></span>
              <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><CloseIcon /></button>
            </div>
            <nav>
              {items.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>
              ))}
              <Link href="/contact" onClick={() => setMobileOpen(false)}>{t.nav.contact}</Link>
            </nav>
            <div className="mobile-language">
              <button className={language === 'bg' ? 'active' : ''} onClick={() => setLanguage('bg')}>Български</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
