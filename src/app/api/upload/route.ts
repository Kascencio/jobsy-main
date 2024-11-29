// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajusta la ruta según tu estructura de proyecto

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('cv') as File;
    const usuarioId = formData.get('usuarioId') as string;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No se ha proporcionado un archivo válido' }, { status: 400 });
    }

    if (!usuarioId) {
      return NextResponse.json({ error: 'No se ha proporcionado un ID de usuario' }, { status: 400 });
    }

    // Leer el contenido del archivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Crear el registro en la base de datos
    const cv = await prisma.cV.create({
      data: {
        filename: file.name,
        mimetype: file.type,
        content: buffer,
        usuarioId: parseInt(usuarioId, 10),
      },
    });

    return NextResponse.json({ message: 'CV subido exitosamente', cvId: cv.id }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ error: 'Error al guardar el CV en la base de datos' }, { status: 500 });
  }
}
