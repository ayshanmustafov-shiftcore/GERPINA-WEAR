import './globals.css';
import { LanguageProvider } from '@/components/LanguageProvider';
import { StoreProvider } from '@/components/StoreProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
  metadataBase: new URL('https://www.gerpina-wear.com'),
  title: { default: 'GERPINA Wear', template: '%s | GERPINA Wear' },
  description: 'GERPINA Wear — подбрана мода за жени, мъже и деца в България.',
  alternates: { canonical: '/' },
  openGraph: { title: 'GERPINA Wear', description: 'Подбрана мода. По-добра цена.', url: 'https://www.gerpina-wear.com', siteName: 'GERPINA Wear', locale: 'bg_BG', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <LanguageProvider><StoreProvider><SiteHeader />{children}<SiteFooter /><CookieConsent /></StoreProvider></LanguageProvider>
      </body>
    </html>
  );
}
