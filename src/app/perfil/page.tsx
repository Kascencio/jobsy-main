// src/app/perfil/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import ProtectedRoute from '../components/ProtectedRoute';

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
      <div>
        <h1 className="text-2xl font-bold mb-6">Perfil</h1>
        <p>
          <strong>Nombre:</strong> {user?.usu_nombre} {user?.usu_apellido}
        </p>
        <p>
          <strong>Correo:</strong> {user?.usu_email}
        </p>
        <p>
          <strong>Rol:</strong> {user?.usu_rol}
        </p>
        {/* Agrega más detalles del perfil según sea necesario */}
      </div>
    </ProtectedRoute>
  );
}
