// src/app/dashboard/administrador/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session data:', session);
    if (status === 'loading') {
      // Do nothing while loading
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user.role === 'candidato') {
      router.replace('/dashboard/candidato');
    } else if (session?.user.role === 'reclutador') {
      router.replace('/dashboard/reclutador');
    } else if (session?.user.role === 'administrador') {
      router.replace('/dashboard/administrador');
    } else {
      router.replace('/');
    }
  }, [status, session, router]);

  return <p>Cargando...</p>;
}
