'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmpresaForm from '../../components/reclutador/EmpresaForm';
import CrearEmpleoForm from '../../components/reclutador/CrearEmpleoForm';
import EmpleosList from '../../components/reclutador/EmpleosList';
import Style from './reclutador.module.css';
import { Empleo } from '@/types'; // Importa desde el nuevo archivo

export default function DashboardReclutador() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para los empleos
  const [empleos, setEmpleos] = useState<Empleo[]>([]);


  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'reclutador')) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    // Obtener los empleos al cargar el componente
    const fetchEmpleos = async () => {
      const res = await fetch('/api/reclutador/empleos');
      if (res.ok) {
        const data = await res.json();
        setEmpleos(data);
      } else {
        console.error('Error al obtener los empleos');
      }
    };

    fetchEmpleos();
  }, []);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  const agregarEmpleo = (nuevoEmpleo: Empleo) => {
    setEmpleos((prevEmpleos) => [nuevoEmpleo, ...prevEmpleos]);
  };
  

  return (
    <div className={Style.container}>
      <h1 className="text-2xl font-bold mb-6">Herramientas</h1>
      <EmpresaForm />
      <CrearEmpleoForm agregarEmpleo={agregarEmpleo} />
      <div className={Style.container_ofertas}>
        <div className={Style.card}>
          <h2 className="">Mis Ofertas de Empleo</h2>
          <EmpleosList empleos={empleos} />
        </div>
      </div>
    </div>
  );
}
