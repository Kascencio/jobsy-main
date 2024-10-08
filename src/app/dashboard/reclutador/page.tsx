'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EmpresaForm from '../../components/reclutador/EmpresaForm';
import CrearEmpleoForm from '../../components/reclutador/CrearEmpleoForm';
import EmpleosList from '../../components/reclutador/EmpleosList';
import Style from './reclutador.module.css'

export default function DashboardReclutador() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'reclutador')) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  return (
    <div className={Style.container}>
      <h1 className="text-2xl font-bold mb-6">Dashboard del Reclutador</h1>
      <EmpresaForm />
      <CrearEmpleoForm />
      <div className={Style.container_ofertas}>
        <div className={Style.card}>
        <h2 className="text-xl font-bold my-4">Mis Ofertas de Empleo</h2>
        <EmpleosList />
      </div>
      </div>
    </div>
  );
}
