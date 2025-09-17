import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    console.log(request)
  const habilidades = await prisma.habilidad.findMany();
  return NextResponse.json(habilidades);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'moderador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { nombre } = await request.json();

  try {
    const nuevaHabilidad = await prisma.habilidad.create({
      data: {
        hab_nombre: nombre,
      },
    });
    return NextResponse.json(nuevaHabilidad);
  } catch (error) {
    console.error('Error al crear la habilidad:', error);
    return NextResponse.json({ error: 'Error al crear la habilidad' }, { status: 500 });
  }
}
