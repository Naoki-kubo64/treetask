'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-md bg-background"
        onClick={toggleLanguage}
        title={locale === 'en' ? "Switch to Japanese" : "英語に切り替え"}
    >
      <Languages className="h-5 w-5" />
    </Button>
  );
}
