'use client';
import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import Footer from '../components/footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="container mb-5">{children}</div>
      <Footer />
    </>
  );
}
