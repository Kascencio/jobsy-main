import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'candidato') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { empId } = await req.json();

  try {
    // Verificar si el candidato ya se ha postulado a este empleo
    const existePostulacion = await prisma.postulacion.findFirst({
      where: {
        pos_usuario_id: Number(session.user.id),
        pos_empleo_id: empId,
      },
    });

    if (existePostulacion) {
      return NextResponse.json({ error: 'Ya te has postulado a este empleo' }, { status: 400 });
    }

    // Crear la nueva postulación
    const postulacion = await prisma.postulacion.create({
      data: {
        pos_usuario_id: Number(session.user.id),
        pos_empleo_id: empId,
        pos_fecha_postulacion: new Date(),
        pos_estado: 'Enviada',
      },
    });

    return NextResponse.json(postulacion);
  } catch (error) {
    console.error('Error al crear la postulación:', error);
    return NextResponse.json({ error: 'Error al postularse al empleo' }, { status: 500 });
  }
}
