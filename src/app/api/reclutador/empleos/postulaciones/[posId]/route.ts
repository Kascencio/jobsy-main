import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: { posId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'reclutador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const posId = Number(params.posId);
  const { nuevoEstado } = await req.json();

  try {
    // Verificar que la postulación pertenece a un empleo del reclutador
    const postulacion = await prisma.postulacion.findFirst({
      where: {
        pos_id: posId,
        empleo: {
          emp_empresa_id: Number(session.user.id),
        },
      },
    });

    if (!postulacion) {
      return NextResponse.json({ error: 'Postulación no encontrada o no autorizada' }, { status: 404 });
    }

    // Actualizar el estado de la postulación
    const updatedPostulacion = await prisma.postulacion.update({
      where: { pos_id: posId },
      data: { pos_estado: nuevoEstado },
    });

    return NextResponse.json(updatedPostulacion);
  } catch (error) {
    console.error('Error al actualizar la postulación:', error);
    return NextResponse.json({ error: 'Error al actualizar la postulación' }, { status: 500 });
  }
}
