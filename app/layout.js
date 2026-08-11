import './globals.css';
import { LanguageProvider } from '@/components/LanguageProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'GERPINA Wear | Choose Your Style',
  description: 'GERPINA Wear — selected fashion finds and real discounts with delivery in Bulgaria.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <LanguageProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
