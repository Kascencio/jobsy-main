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
    include: { empresa: true },
  });

  return NextResponse.json(usuario?.empresa);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json();

  try {
    // Crear o actualizar la empresa
    const empresa = await prisma.empresa.upsert({
    where: { emp_id: Number(session.user.id) },
      update: {
        emp_nombre: data.nombre,
        emp_sector: data.sector,
      },
      create: {
        emp_nombre: data.nombre,
        emp_sector: data.sector,
        emp_id: Number(session.user.id),
      },
    });

    // Asociar la empresa al usuario
    await prisma.usuario.update({
      where: { usu_email: session.user.email! },
      data: { empresa_id: empresa.emp_id },
    });

    return NextResponse.json(empresa);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al guardar la empresa' }, { status: 500 });
  }
}
