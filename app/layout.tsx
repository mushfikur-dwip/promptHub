import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptShare - Discover & Share Amazing AI Prompts',
  description: 'Discover, save, and share high-quality AI prompts for ChatGPT and other AI tools. Community-driven prompt library with ratings and reviews.',
  keywords: 'AI prompts, ChatGPT prompts, prompt library, AI tools, prompt sharing',
  authors: [{ name: 'PromptShare Team' }],
  openGraph: {
    title: 'PromptShare - Discover & Share Amazing AI Prompts',
    description: 'Community-driven prompt library with ratings and reviews',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}