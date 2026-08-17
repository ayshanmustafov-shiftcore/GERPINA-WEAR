import './globals.css';
import { LanguageProvider } from '@/components/LanguageProvider';
import { StoreProvider } from '@/components/StoreProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'GERPINA Wear',
  description: 'GERPINA Wear — curated fashion and outlet finds in Bulgaria.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <LanguageProvider>
          <StoreProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
