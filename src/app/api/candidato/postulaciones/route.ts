import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const postulaciones = await prisma.postulacion.findMany({
    where: { pos_usuario_id: Number(session.user.id) },
    include: {
      empleo: {
        include: {
          empresa: true,
        },
      },
    },
  });

  return NextResponse.json(postulaciones);
}
