'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PerfilForm from '../../components/candidato/PerfilForm';
import PostulacionesList from '../../components/candidato/PostulacionesList';
import Button from '../../components/Button';
import Style from './candidato.module.css'

export default function DashboardCandidato() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('perfil');

  useEffect(() => {
    if (status === 'loading') {
      console.log('Session data:', session);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user.role !== 'candidato') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilForm />;
      case 'postulaciones':
        return <PostulacionesList />;
      // Puedes agregar más casos si tienes más secciones
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={Style.container}>
        <h1 className={Style.title}>Dashboard del Candidato</h1>
        <div className={Style.container_active}>
          <Button className={Style.button} label="Mi Perfil" onClick={() => setActiveTab('perfil')} />
          <Button className={Style.button} label="Mis Postulaciones" onClick={() => setActiveTab('postulaciones')} />
          {/* Agrega más botones para otras acciones */}
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
