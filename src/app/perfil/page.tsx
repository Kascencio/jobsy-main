// src/app/perfil/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/nextauth/route';
import prisma from '@/lib/prisma';
import ProtectedRoute from '../components/ProtectedRoute';
import Style from './perfil.module.css'

export default async function Perfil() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Debes iniciar sesión para ver esta página.</p>;
  }

  const user = await prisma.usuario.findUnique({
    where: { usu_email: session.user.email! },
  });

  return (
    <ProtectedRoute>
      <div className={Style.container}>
        <div className={Style.card}>
        <h1 className={Style.title}>Perfil</h1>
        <p>
          <strong>Nombre:</strong> <br /><hr/>{user?.usu_nombre} {user?.usu_apellido}<hr/>
        </p>
        <p>
          <strong>Correo:</strong> <br /><hr/>{user?.usu_email}<hr/>
        </p>
        <p>
          <strong>Rol:</strong><br /> <hr/>{user?.usu_rol}<hr/>
        </p>
        </div>
        {/* Agrega más detalles del perfil según sea necesario */}
      </div>
    </ProtectedRoute>
  );
}
