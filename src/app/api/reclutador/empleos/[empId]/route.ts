import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, { params }: { params: { empId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'reclutador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const empId = Number(params.empId);

  try {
    // Verificar que el empleo pertenece al reclutador
    const empleo = await prisma.empleo.findFirst({
      where: {
        emp_id: empId,
        emp_empresa_id: Number(session.user.id),
      },
    });

    if (!empleo) {
      return NextResponse.json({ error: 'Empleo no encontrado o no autorizado' }, { status: 404 });
    }

    // Obtener las postulaciones
    const postulaciones = await prisma.postulacion.findMany({
      where: { pos_empleo_id: empId },
      include: {
        usuario: true,
      },
    });

    return NextResponse.json(postulaciones);
  } catch (error) {
    console.error('Error al obtener las postulaciones:', error);
    return NextResponse.json({ error: 'Error al obtener las postulaciones' }, { status: 500 });
  }
}
