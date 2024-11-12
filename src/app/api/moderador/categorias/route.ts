import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // Importación corregida
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server'; // Opcional

export async function GET(request: NextRequest) {
  console.log(request);
  const categorias = await prisma.categoria.findMany();
  return NextResponse.json(categorias);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions); // Llamada corregida

  if (!session || session.user.role !== 'moderador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { nombre } = await request.json();

  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        cat_nombre: nombre,
      },
    });
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 });
  }
}
