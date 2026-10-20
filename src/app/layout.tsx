import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DictProvider } from '@/components/DictProvider';
import { getDict, getLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'KITA - Community Resource Coordination',
  description: 'Smart community resource coordination and matching platform. UTP CodeFest 2026.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const d = getDict();
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <html lang={getLocale()}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <DictProvider dict={d}>
          <Header />
          {!configured && (
            <div className="border-b border-amber-300 bg-amber-50 py-2 text-center text-sm text-amber-900">
              <strong>{d.common.setupTitle}.</strong> {d.common.setupBody}
            </div>
          )}
          <main>{children}</main>
          <Footer />
        </DictProvider>
      </body>
    </html>
  );
}
