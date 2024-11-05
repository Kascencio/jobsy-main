'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CategoriasList from '../../components/moderador/CategoriasList';
import CategoriaForm from '../../components/moderador/CategoriaForm';

export default function DashboardAdministrador() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user.role !== 'moderador') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard del Administrador</h1>
      <CategoriaForm />
      <CategoriasList />
    </div>
  );
}
