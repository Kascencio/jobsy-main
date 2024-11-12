// src/app/layout.tsx

import { ReactNode } from 'react';
import Providers from './components/Providers';
import Header from './components/Header';
import Footer from './components/Footer';
import Style from './globals.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className={Style.main}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <ToastContainer />
        <Analytics/>
      </body>
    </html>
  );
}
