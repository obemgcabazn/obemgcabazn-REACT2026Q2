import './styles/global.scss';
import type { ReactNode } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../context/ThemeContext';
import Providers from './providers';

export const metadata = {
  title: 'RSSchool React + TS',
  icons: {
    icon: '/vite.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="/src/styles/global.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Lexend:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <ErrorBoundary>
            <ThemeProvider>{children}</ThemeProvider>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
