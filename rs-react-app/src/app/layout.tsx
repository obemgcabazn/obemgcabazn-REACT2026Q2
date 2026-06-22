import '../styles/global.scss';
import type { ReactNode } from 'react';
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
    <html className={`${facultyGlyphic.variable} ${lexend.variable}`}>
      <body>{children}</body>
    </html>
  );
}
