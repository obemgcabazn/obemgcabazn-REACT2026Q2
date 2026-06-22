import '../styles/global.scss';
import type { ReactNode } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../context/ThemeContext';
import Providers from './providers';
import ClientLayout from './client-layout';
import { Faculty_Glyphic, Lexend } from 'next/font/google';

export const metadata = {
  title: 'RSSchool React + TS',
};

const facultyGlyphic = Faculty_Glyphic({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-faculty-glyphic',
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-lexend',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${facultyGlyphic.variable} ${lexend.variable}`}>
      <body>
        <Providers>
          <ErrorBoundary>
            <ThemeProvider>
              <ClientLayout>{children}</ClientLayout>
            </ThemeProvider>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
