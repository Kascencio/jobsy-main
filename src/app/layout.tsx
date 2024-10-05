// src/app/layout.tsx

import { ReactNode } from 'react';
import Providers from './components/Providers';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.module.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className='main'>
        <Providers>
          <Header />
          <main className="container mx-auto p-4 min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
