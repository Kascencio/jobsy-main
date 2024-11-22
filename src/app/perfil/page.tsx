// src/app/perfil/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ProtectedRoute from '../components/ProtectedRoute';
import Style from './perfil.module.css';
import {
  Container,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';

export default async function Perfil() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Debes iniciar sesión para ver esta página.</p>;
  }

  const user = await prisma.usuario.findUnique({
    where: { usu_email: session.user.email! },
  });

  // Función para mostrar el rol de manera amigable
  const getRolLabel = (rol: string | undefined) => {
    switch (rol) {
      case 'candidato':
        return 'Candidato';
      case 'reclutador':
        return 'Reclutador';
      case 'moderador':
        return 'Moderador';
      default:
        return 'Usuario';
    }
  };

  return (
    <ProtectedRoute>
      <div className={Style.container}>
        <div className={Style.profileContainer}>
          <Typography variant="h4" gutterBottom>
            Perfil del Usuario
          </Typography>
          <div className={Style.avatarContainer}>
            <Avatar className={Style.avatar}>
              <AccountCircleIcon sx={{ fontSize: 80 }} />
            </Avatar>
          </div>
          <div className={Style.infoContainer}>
            <TextField
              label="Nombre"
              name="nombre"
              value={`${user?.usu_nombre} ${user?.usu_apellido || ''}`}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
            <TextField
              label="Correo Electrónico"
              name="email"
              value={user?.usu_email}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
            <TextField
              label="Rol"
              name="rol"
              value={getRolLabel(user?.usu_rol)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIndIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
