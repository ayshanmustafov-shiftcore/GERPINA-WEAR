'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '@/lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('bg');

  useEffect(() => {
    const saved = localStorage.getItem('gerpina-language');
    if (saved === 'en' || saved === 'bg') setLanguage(saved);
  }, []);

  const set = (value) => {
    setLanguage(value);
    localStorage.setItem('gerpina-language', value);
  };

  const value = useMemo(() => ({ language, setLanguage: set, t: translations[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
