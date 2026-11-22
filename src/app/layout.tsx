import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

/**
 * DESIGN.md §3 — one family for the whole product.
 * Inter carries display through micro copy; JetBrains Mono is reserved for
 * storefront numerics (`font-mono-numbers`).
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Dukaan OS — The operating system for Indian merchants',
    template: '%s — Dukaan OS',
  },
  description:
    'Dukaan OS gives Indian local merchants a storefront, a visual website editor, and an order desk in one place. Built for WhatsApp-first selling.',
  openGraph: {
    title: 'Dukaan OS — The operating system for Indian merchants',
    description:
      'Storefront, visual editor, and order desk for Indian local merchants.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#0C0B09',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink selection:bg-accent/30 selection:text-cream">
        <LanguageProvider scope="merchant">
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
