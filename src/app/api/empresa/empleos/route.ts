import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const empleos = await prisma.empleo.findMany({
    where: { emp_empresa_id: Number(session.user.id) },
    include: {
      empresa: true,
      categoria: true,
    },
  });

  return NextResponse.json(empleos);
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json();

  try {
    const empleo = await prisma.empleo.create({
      data: {
        emp_titulo: data.titulo,
        emp_descripcion: data.descripcion,
        emp_categoria_id: Number(data.categoria_id),
        emp_fecha_publicacion: new Date(),
        emp_salario_min: data.salario_min ? Number(data.salario_min) : null,
        emp_salario_max: data.salario_max ? Number(data.salario_max) : null,
        emp_tipo_contrato: data.tipo_contrato,
        emp_requisitos: data.requisitos,
        emp_beneficios: data.beneficios,
        emp_num_vacantes: data.num_vacantes ? Number(data.num_vacantes) : 1,
        emp_empresa_id: Number(session.user.id),
      },
    });

    return NextResponse.json(empleo);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error al crear el empleo' }, { status: 500 });
  }
}
