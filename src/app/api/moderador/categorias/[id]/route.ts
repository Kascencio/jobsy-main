// src/app/api/administrador/categorias/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'administrador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await prisma.categoria.delete({
      where: { cat_id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la categoría' }, { status: 500 });
  }
}
