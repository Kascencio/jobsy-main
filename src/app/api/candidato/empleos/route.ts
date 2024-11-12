import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const empleos = await prisma.empleo.findMany({
      include: {
        empresa: true,
        categoria: true,
        // Puedes incluir otras relaciones si las necesitas
      },
      orderBy: {
        emp_fecha_publicacion: 'desc', // Ordenar los empleos por fecha de publicación descendente
      },
    });

    return NextResponse.json(empleos);
  } catch (error) {
    console.error('Error al obtener los empleos:', error);
    return NextResponse.json({ error: 'Error al obtener los empleos' }, { status: 500 });
  }
}
