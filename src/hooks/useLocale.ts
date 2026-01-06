'use client';

import { useState, useEffect } from 'react';
import { translations, Locale } from '@/lib/translations';

// Simple event bus for locale changes to sync across components
const localeEventTarget = new EventTarget();

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Initial detection
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) {
      setLocaleState('ja');
    }
  }, []);

  useEffect(() => {
     // Listen for changes
     const handler = (e: Event) => {
         const customEvent = e as CustomEvent<Locale>;
         setLocaleState(customEvent.detail);
     };
     localeEventTarget.addEventListener('locale-change', handler);
     return () => localeEventTarget.removeEventListener('locale-change', handler);
  }, []);

  const setLocale = (newLocale: Locale) => {
      setLocaleState(newLocale);
      localeEventTarget.dispatchEvent(new CustomEvent('locale-change', { detail: newLocale }));
  };

  return {
    locale,
    setLocale,
    t: translations[locale]
  };
}
