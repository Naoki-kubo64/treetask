'use client';

import { useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/translations';

export function useLocale() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) {
      setLocale('ja');
    } else {
      setLocale('en');
    }
  }, []);

  return {
    locale,
    t: translations[locale]
  };
}
