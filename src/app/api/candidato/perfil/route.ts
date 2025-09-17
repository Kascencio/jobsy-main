import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  console.log(request)
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'candidato') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
  const usuarioId = parseInt(session.user.id, 10);

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { usu_id: usuarioId },
      include: {
        usuario_habilidades: {
          include: {
            habilidad: true,
          },
        },
        cvs: true,
      },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return NextResponse.json({ error: 'Error al obtener el perfil' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'candidato') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const usuarioId = parseInt(session.user.id, 10);
  const data = await request.json();

  try {
    // Actualizar la información del usuario
    const updatedUser = await prisma.usuario.update({
      where: { usu_id: usuarioId },
      data: {
        usu_nombre: data.nombre,
        usu_apellido: data.apellido,
        usu_email: data.email,
        usu_telefono: data.telefono,
        usu_direccion: data.direccion,
        usu_resumen: data.resumen,
        // Actualizar las habilidades
        usuario_habilidades: {
          deleteMany: {}, // Eliminar las habilidades actuales
          create: data.habilidades.map((habilidadId: number) => ({
            habilidad: {
              connect: { hab_id: habilidadId },
            },
          })),
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 });
  }
}
