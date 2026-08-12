'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

export default function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, favorites } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const search = (event) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop');
  };

  const audience = [
    ['/women', t.nav.women],
    ['/men', t.nav.men],
    ['/kids', t.nav.kids],
  ];

  const secondary = [
    ['/shop', t.nav.new],
    ['/shop', t.nav.clothing],
    ['/shop?category=dresses', t.nav.dresses],
    ['/shop?category=tops', t.nav.tops],
    ['/shop?category=trousers', t.nav.trousers],
    ['/shop?category=jackets', t.nav.jackets],
    ['/shop?category=sportswear', t.nav.sport],
    ['/shop', t.nav.sale],
  ];

  return (
    <>
      <div className="announcement-bar">{t.announcement}</div>
      <header className="store-header">
        <div className="audience-row page-width">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Menu"><MenuIcon /></button>
          <nav className="audience-tabs" aria-label="Audience navigation">
            {audience.map(([href, label]) => <Link className={pathname === href ? 'active' : ''} href={href} key={href}>{label}</Link>)}
          </nav>
          <Link href="/" className="wordmark" aria-label="GERPINA Wear home"><b>GERPINA</b><span>WEAR</span></Link>
          <div className="header-utility">
            <button className="language-toggle" onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')}><b>{language.toUpperCase()}</b><span>{language === 'bg' ? 'EN' : 'BG'}</span></button>
            <Link className="utility-icon" href="/favorites" aria-label="Favorites"><HeartIcon /><em>{favorites.length || ''}</em></Link>
            <Link className="utility-icon" href="/cart" aria-label="Cart"><BagIcon /><em>{cartCount || ''}</em></Link>
          </div>
        </div>

        <div className="search-row page-width">
          <Link href="/" className="desktop-wordmark"><b>GERPINA</b><span>WEAR</span></Link>
          <form className="site-search" onSubmit={search}>
            <SearchIcon size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.common.search} />
          </form>
          <div className="search-spacer" />
        </div>

        <nav className="category-nav page-width" aria-label="Shop categories">
          {secondary.map(([href, label], index) => <Link key={`${href}-${index}`} className={label === t.nav.sale ? 'sale-link' : ''} href={href}>{label}</Link>)}
        </nav>
      </header>

      {mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><span className="drawer-wordmark">GERPINA <i>WEAR</i></span><button onClick={() => setMobileOpen(false)}><CloseIcon /></button></div>
            <form className="drawer-search" onSubmit={(event) => { search(event); setMobileOpen(false); }}><SearchIcon size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.common.search}/></form>
            <div className="drawer-section-title">{language === 'bg' ? 'Пазарувай' : 'Shop'}</div>
            <nav className="drawer-nav">
              {[...audience, ['/shop', t.nav.shop]].map(([href, label]) => <Link onClick={() => setMobileOpen(false)} key={href} href={href}>{label}<span>›</span></Link>)}
            </nav>
            <div className="drawer-section-title">{language === 'bg' ? 'Категории' : 'Categories'}</div>
            <nav className="drawer-nav compact">
              {secondary.slice(2).map(([href, label], index) => <Link onClick={() => setMobileOpen(false)} key={`${href}-${index}`} href={href}>{label}<span>›</span></Link>)}
            </nav>
            <div className="drawer-language"><button className={language === 'bg' ? 'active' : ''} onClick={() => setLanguage('bg')}>BG</button><button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div>
          </aside>
        </div>
      )}
    </>
  );
}
