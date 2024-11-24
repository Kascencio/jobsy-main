import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'moderador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const id = Number(params.id);

  try {
    await prisma.habilidad.delete({
      where: { hab_id: id },
    });
    return NextResponse.json({ message: 'Habilidad eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la habilidad:', error);
    return NextResponse.json({ error: 'Error al eliminar la habilidad' }, { status: 500 });
  }
}
