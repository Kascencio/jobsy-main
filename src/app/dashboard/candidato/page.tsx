// src/app/dashboard/candidato/page.tsx

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PerfilForm from '../../components/candidato/PerfilForm';
import PostulacionesList from '../../components/candidato/PostulacionesList';
import BuscarEmpleos from '../../components/candidato/BuscarEmpleo';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  WorkOutline,
  Search,
  Logout,
} from '@mui/icons-material';
import Style from './candidato.module.css';

export default function DashboardCandidato() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (status === 'loading') {
      // Puedes mostrar un spinner aquí si lo deseas
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user.role !== 'candidato') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <PerfilForm />;
      case 1:
        return <PostulacionesList />;
      case 2:
        return <BuscarEmpleos />;
      default:
        return null;
    }
  };

  return (
    <div className={Style.container}>
      <AppBar position="static" className={Style.appBar}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bolsa de Trabajo
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab icon={<AccountCircle />} label="Mi Perfil" />
          <Tab icon={<WorkOutline />} label="Mis Postulaciones" />
          <Tab icon={<Search />} label="Buscar Empleos" />
        </Tabs>
      </AppBar>
      <Box className={Style.content}>{renderContent()}</Box>
    </div>
  );
}
