// app/api/reclutador/empleos/[empId]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: Request,
  { params }: { params: { empId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'reclutador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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

    // Eliminar el empleo
    await prisma.empleo.delete({
      where: { emp_id: empId },
    });

    return NextResponse.json({ message: 'Empleo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el empleo:', error);
    return NextResponse.json({ error: 'Error al eliminar el empleo' }, { status: 500 });
  }
}
