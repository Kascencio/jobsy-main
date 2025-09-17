import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const usuarioId = parseInt(params.id, 10);

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

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
