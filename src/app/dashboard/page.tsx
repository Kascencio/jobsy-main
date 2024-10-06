// src/app/dashboard/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      // No hacemos nada mientras la sesión está cargando
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user.role === 'candidato') {
      router.replace('/dashboard/candidato');
    } else if (session?.user.role === 'empresa') {
      router.replace('/dashboard/empresa');
    } else {
      router.replace('/');
    }
  }, [status, session, router]);

  return <p>Cargando...</p>;
}
