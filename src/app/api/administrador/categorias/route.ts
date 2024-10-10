// src/app/api/administrador/categorias/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/nextauth/route';

export async function GET() {
  const categorias = await prisma.categoria.findMany();
  return NextResponse.json(categorias);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'administrador') {
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
    console.log(error)
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 });
  }
}
