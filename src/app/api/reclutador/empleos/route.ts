// Importaciones necesarias
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// Función GET para obtener empleos
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const empleos = await prisma.empleo.findMany({
      where: { emp_empresa_id: Number(token.sub) },
      include: {
        empresa: true,
        categoria: true,
        empleo_habilidades: {
          include: {
            habilidad: true,
          },
        },
      },
    });

    return NextResponse.json(empleos);
  } catch (error) {
    console.error('Error al obtener los empleos:', error);
    return NextResponse.json({ error: 'Error al obtener los empleos' }, { status: 500 });
  }
}

// Función POST para crear un nuevo empleo
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const habilidades = data.habilidades as number[]; // Array de IDs de habilidades

    const nuevoEmpleo = await prisma.empleo.create({
      data: {
        emp_titulo: data.emp_titulo, // Cambiado de data.titulo a data.emp_titulo
        emp_descripcion: data.emp_descripcion, // Cambiado de data.descripcion a data.emp_descripcion
        emp_categoria_id: Number(data.emp_categoria_id), // Cambiado de data.categoria_id a data.emp_categoria_id
        emp_fecha_publicacion: new Date(),
        emp_salario_min: data.emp_salario_min ? Number(data.emp_salario_min) : null,
        emp_salario_max: data.emp_salario_max ? Number(data.emp_salario_max) : null,
        emp_tipo_contrato: data.emp_tipo_contrato,
        emp_requisitos: data.emp_requisitos,
        emp_beneficios: data.emp_beneficios,
        emp_num_vacantes: data.emp_num_vacantes ? Number(data.emp_num_vacantes) : 1,
        emp_empresa_id: Number(token.sub),
        empleo_habilidades: {
          create: habilidades.map((habId) => ({
            habilidad: { connect: { hab_id: habId } },
          })),
        },
      },
      include: {
        empleo_habilidades: {
          include: {
            habilidad: true,
          },
        },
      },
    });

    return NextResponse.json(nuevoEmpleo);
  } catch (error) {
    console.error('Error al crear el empleo:', error);
    return NextResponse.json({ error: 'Error al crear el empleo' }, { status: 500 });
  }
}
