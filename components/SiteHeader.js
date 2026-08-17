'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

export default function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, favorites, activeAudience, setActiveAudience } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const scopedShopHref = (params = {}) => {
    const search = new URLSearchParams({ audience: activeAudience });
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    return `/shop?${search.toString()}`;
  };

  const search = (event) => {
    event.preventDefault();
    const value = query.trim();
    router.push(scopedShopHref(value ? { q: value } : {}));
  };

  const focusSearch = () => {
    const input = document.getElementById('gerpina-header-search');
    if (input) {
      input.focus();
      input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  const audience = [
    ['women', '/women', t.nav.women],
    ['men', '/men', t.nav.men],
    ['kids', '/kids', t.nav.kids],
  ];

  const secondary = [
    [scopedShopHref(), t.nav.new],
    [scopedShopHref(), t.nav.clothing],
    [scopedShopHref({ category: 'dresses' }), t.nav.dresses],
    [scopedShopHref({ category: 'tops' }), t.nav.tops],
    [scopedShopHref({ category: 'trousers' }), t.nav.trousers],
    [scopedShopHref({ category: 'jackets' }), t.nav.jackets],
    [scopedShopHref({ category: 'sportswear' }), t.nav.sport],
    [scopedShopHref({ sale: '1' }), t.nav.sale],
  ];

  return (
    <>
      <header className="store-header">
        <div className="top-utility-bar">
          <div className="top-utility-inner page-width">
            <nav className="top-utility-links" aria-label="Quick links">
              <Link href={scopedShopHref({ sale: '1' })} className="outlet-link">
                <span className="outlet-badge">%</span>
                <span>Outlet</span>
              </Link>
              <Link href="/contact" className="help-link">
                <span className="help-badge">?</span>
                <span>{language === 'bg' ? 'Контакт & Помощ' : 'Contact & Help'}</span>
              </Link>
            </nav>
            <button
              className="top-language-toggle"
              onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')}
              aria-label={language === 'bg' ? 'Switch to English' : 'Превключи на български'}
            >
              <span className="language-flag" aria-hidden="true">{language === 'bg' ? '🇧🇬' : '🇬🇧'}</span>
              <b>{language.toUpperCase()}</b>
            </button>
          </div>
        </div>

        <div className="main-header-row page-width">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Menu"><MenuIcon /></button>

          <nav className="audience-tabs" aria-label="Audience navigation">
            {audience.map(([key, href, label]) => (
              <Link
                className={activeAudience === key ? 'active' : ''}
                href={href}
                key={key}
                onClick={() => setActiveAudience(key)}
              >{label}</Link>
            ))}
          </nav>

          <Link href="/" className="center-wordmark" aria-label="GERPINA Wear home">
            <Image src="/gerpina-wordmark.jpg" alt="GERPINA Wear" width={205} height={64} priority />
          </Link>

          <div className="header-utility">
            <button className="utility-icon utility-search-button" type="button" onClick={focusSearch} aria-label={t.common.search}>
              <SearchIcon size={23} />
            </button>
            <Link className="utility-icon" href="/favorites" aria-label="Favorites">
              <HeartIcon size={24} />
              {favorites.length > 0 && <em>{favorites.length}</em>}
            </Link>
            <Link className="utility-icon" href="/cart" aria-label="Cart">
              <BagIcon size={24} />
              {cartCount > 0 && <em>{cartCount}</em>}
            </Link>
          </div>
        </div>

        <div className="category-search-row">
          <div className="category-search-inner page-width">
            <nav className="category-nav" aria-label="Shop categories">
              {secondary.map(([href, label], index) => (
                <Link key={`${href}-${index}`} className={label === t.nav.sale ? 'sale-link' : ''} href={href}>{label}</Link>
              ))}
            </nav>

            <form className="header-search" onSubmit={search}>
              <SearchIcon size={18} />
              <input
                id="gerpina-header-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={language === 'bg' ? 'Търси продукти, марки и още...' : 'Search products, brands and more...'}
              />
            </form>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <span className="drawer-wordmark">GERPINA <i>WEAR</i></span>
              <button onClick={() => setMobileOpen(false)}><CloseIcon /></button>
            </div>
            <form className="drawer-search" onSubmit={(event) => { search(event); setMobileOpen(false); }}>
              <SearchIcon size={18}/>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.common.search}/>
            </form>
            <div className="drawer-section-title">{language === 'bg' ? 'Пазарувай' : 'Shop'}</div>
            <nav className="drawer-nav">
              {audience.map(([key, href, label]) => (
                <Link onClick={() => { setActiveAudience(key); setMobileOpen(false); }} key={key} href={href}>{label}<span>›</span></Link>
              ))}
              <Link onClick={() => setMobileOpen(false)} href={scopedShopHref()}>{t.nav.shop}<span>›</span></Link>
            </nav>
            <div className="drawer-section-title">{language === 'bg' ? 'Категории' : 'Categories'}</div>
            <nav className="drawer-nav compact">
              {secondary.slice(2).map(([href, label], index) => (
                <Link onClick={() => setMobileOpen(false)} key={`${href}-${index}`} href={href}>{label}<span>›</span></Link>
              ))}
            </nav>
            <div className="drawer-section-title">{language === 'bg' ? 'Помощ' : 'Help'}</div>
            <nav className="drawer-nav compact">
              <Link onClick={() => setMobileOpen(false)} href="/contact">{language === 'bg' ? 'Контакт & Помощ' : 'Contact & Help'}<span>›</span></Link>
            </nav>
            <div className="drawer-language">
              <button className={language === 'bg' ? 'active' : ''} onClick={() => setLanguage('bg')}>🇧🇬 BG</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>🇬🇧 EN</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
