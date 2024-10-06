'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PerfilForm from '../../components/candidato/PerfilForm';
import PostulacionesList from '../../components/candidato/PostulacionesList';

export default function DashboardCandidato() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'candidato')) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard del Candidato</h1>
      <PerfilForm />
      <h2 className="text-xl font-bold my-4">Mis Postulaciones</h2>
      <PostulacionesList />
    </div>
  );
}
