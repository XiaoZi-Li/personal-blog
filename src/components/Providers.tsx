'use client';

import { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import PageViewTracker from '@/components/PageViewTracker';
import { ThemeProvider } from '@/components/ThemeProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <UserProvider>
          <PageViewTracker />
          {children}
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
