// src/components/Header.tsx

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Style from "./componets.module.css";
import Image from 'next/image';
import Logo from 'public/images/Logo-jobsy-.png';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className={Style.header}>
      <div className={Style.img_container}>
        <Link href="/">
      <Image src={Logo} sizes="60vh" alt='Logo' style={{
          width: '90%',
          height: 'auto',
          borderRadius:  '.7vh',
        }}></Image></Link>
        <h1>Jobsy</h1>
      </div>
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
