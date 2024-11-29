import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const habilidades = await prisma.habilidad.findMany({
      orderBy: { hab_nombre: 'asc' },
    });
    return NextResponse.json(habilidades);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    return NextResponse.json({ error: 'Error al obtener habilidades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const data = await request.json();
      const { hab_nombre } = data;
  
      const nuevaHabilidad = await prisma.habilidad.create({
        data: {
          hab_nombre,
        },
      });
  
      return NextResponse.json(nuevaHabilidad);
    } catch (error) {
      console.error('Error al crear habilidad:', error);
      return NextResponse.json({ error: 'Error al crear habilidad' }, { status: 500 });
    }
  }
  