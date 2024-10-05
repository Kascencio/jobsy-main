"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/">
        <span className="text-xl font-bold">Jobsy</span>
      </Link>
      <nav>
        {session ? (
          <>
            <Link href="/perfil">
              <span className="mr-4">Perfil</span>
            </Link>
            <button onClick={() => signOut()}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link href="/login">
              <span className="mr-4">Iniciar Sesión</span>
            </Link>
            <Link href="/registro">
              <span>Registrarse</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
