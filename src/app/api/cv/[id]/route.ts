// src/app/api/cv/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajusta la ruta según tu estructura de proyecto

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const cv = await prisma.cV.findUnique({
      where: { id: parseInt(id, 10) },
      include: { usuario: true }, // Incluye datos del usuario si es necesario
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV no encontrado' }, { status: 404 });
    }

    return new NextResponse(cv.content, {
      status: 200,
      headers: {
        'Content-Type': cv.mimetype,
        'Content-Disposition': `inline; filename="${cv.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error al obtener el CV:', error);
    return NextResponse.json({ error: 'Error al obtener el CV' }, { status: 500 });
  }
}
