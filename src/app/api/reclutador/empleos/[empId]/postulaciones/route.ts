import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, { params }: { params: { empId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'reclutador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const empId = Number(params.empId);

  try {
    const postulaciones = await prisma.postulacion.findMany({
      where: {
        pos_empleo_id: empId,
        empleo: {
          emp_empresa_id: Number(session.user.id),
        },
      },
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
