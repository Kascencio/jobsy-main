import { SessionProvider } from 'next-auth/react';
import '@/app/globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
