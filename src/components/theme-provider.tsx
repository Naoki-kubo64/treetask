'use client';

import * as React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { skins } from '@/lib/skins';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentSkin = useTaskStore((state) => state.skin);

  React.useEffect(() => {
    const root = window.document.documentElement;
    const skinConfig = skins[currentSkin];

    Object.entries(skinConfig.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    root.setAttribute('data-skin', currentSkin);
  }, [currentSkin]);

  return <>{children}</>;
}
