import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import client from '@/lib/googleClient';
import { google } from '@google-cloud/language/build/protos/protos';

export async function GET(request: Request, { params }: { params: { empId: string } }) {
  const empId = parseInt(params.empId, 10);
  if (isNaN(empId)) {
    return NextResponse.json({ error: 'ID de empleo inválido' }, { status: 400 });
  }

  try {
    const empleo = await prisma.empleo.findUnique({
      where: { emp_id: empId },
      include: {
        empleo_habilidades: {
          include: {
            habilidad: true,
          },
        },
      },
    });

    if (!empleo) {
      return NextResponse.json({ error: 'Empleo no encontrado' }, { status: 404 });
    }

    const habilidadesRequeridas = empleo.empleo_habilidades.map(
      (eh) => eh.habilidad.hab_nombre
    );

    const postulaciones = await prisma.postulacion.findMany({
      where: { pos_empleo_id: empId },
      include: {
        usuario: {
          include: {
            usuario_habilidades: {
              include: {
                habilidad: true,
              },
            },
          },
        },
      },
    });

    const postulacionesConPuntaje = await Promise.all(
      postulaciones.map(async (postulacion) => {
        const habilidadesCandidato = postulacion.usuario.usuario_habilidades.map(
          (uh) => uh.habilidad.hab_nombre
        );

        const puntaje = await analizarCompatibilidad(
          habilidadesRequeridas,
          habilidadesCandidato
        );

        return {
          ...postulacion,
          puntaje,
        };
      })
    );

    // Ordenar por puntaje
    postulacionesConPuntaje.sort((a, b) => b.puntaje - a.puntaje);

    return NextResponse.json(postulacionesConPuntaje);
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener postulaciones' },
      { status: 500 }
    );
  }
}

async function analizarCompatibilidad(
  habilidadesRequeridas: string[],
  habilidadesCandidato: string[]
): Promise<number> {
  try {
    const textoRequeridas = habilidadesRequeridas.join(', ');
    const textoCandidato = habilidadesCandidato.join(', ');

    const documentoRequeridas: google.cloud.language.v1.IDocument = {
      content: textoRequeridas,
      type: google.cloud.language.v1.Document.Type.PLAIN_TEXT,
    };

    const documentoCandidato: google.cloud.language.v1.IDocument = {
      content: textoCandidato,
      type: google.cloud.language.v1.Document.Type.PLAIN_TEXT,
    };

    // Analizar entidades de las habilidades requeridas
    const [resultRequeridas] = await client.analyzeEntities({ document: documentoRequeridas });
    const entidadesRequeridas = resultRequeridas.entities?.map((ent: google.cloud.language.v1.IEntity) => ent.name) ?? [];

    // Analizar entidades de las habilidades del candidato
    const [resultCandidato] = await client.analyzeEntities({ document: documentoCandidato });
    const entidadesCandidato = resultCandidato.entities?.map((ent: google.cloud.language.v1.IEntity) => ent.name) ?? [];

    // Calcular la intersección de las entidades
    const setRequeridas = new Set(entidadesRequeridas);
    const setCandidato = new Set(entidadesCandidato);

    const entidadesComunes = [...setRequeridas].filter((ent) => setCandidato.has(ent));

    // Calcular el puntaje de compatibilidad
    const puntaje = (entidadesComunes.length / setRequeridas.size) * 100;

    return puntaje;
  } catch (error) {
    console.error('Error al analizar compatibilidad:', error);
    return 0; // En caso de error, devolver un puntaje de 0
  }
}