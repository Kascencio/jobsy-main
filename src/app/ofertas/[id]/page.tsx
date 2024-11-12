// src/app/ofertas/[id]/page.tsx

import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

export default async function DetalleOferta({ params }: Params) {
  const empleo = await prisma.empleo.findUnique({
    where: { emp_id: Number(params.id) },
    include: {
      empresa: true,
      categoria: true,
    },
  });

  if (!empleo) {
    return <p>Oferta no encontrada.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{empleo.emp_titulo}</h1>
      <p className="text-gray-700 mb-2">
        <strong>Empresa:</strong> {empleo.empresa.emp_nombre}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Categoría:</strong> {empleo.categoria.cat_nombre}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Fecha de Publicación:</strong> {new Date(empleo.emp_fecha_publicacion).toLocaleDateString()}
      </p>
      <p className="mb-4">
        <strong>Descripción:</strong>
      </p>
      <p className="text-gray-800 mb-6">{empleo.emp_descripcion}</p>
      {/* Agrega más detalles según sea necesario */}
    </div>
  );
}
