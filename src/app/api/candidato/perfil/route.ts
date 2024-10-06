import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { usu_email: session.user.email! },
  });

  return NextResponse.json(usuario);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json();

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { usu_email: session.user.email! },
      data: {
        usu_nombre: data.nombre,
        usu_apellido: data.apellido,
        usu_telefono: data.telefono,
        usu_direccion: data.direccion,
        usu_resumen: data.resumen,
      },
    });
    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 });
  }
}
