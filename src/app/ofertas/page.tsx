// src/app/ofertas/page.tsx

import OfertaCard from '../components/OfertaCard';
import { prisma } from '@/lib/prisma';
import Style from '../components/componets.module.css'

export default async function Ofertas() {
  const empleos = await prisma.empleo.findMany({
    include: {
      empresa: true,
    },
    orderBy: {
      emp_fecha_publicacion: 'desc',
    },
  });

  return (
    <div className={Style.container_cards}>
    {empleos.map((empleo) => (
      <OfertaCard
        key={empleo.emp_id}
        id={empleo.emp_id}
        titulo={empleo.emp_titulo}
        empresa={empleo.empresa.emp_nombre}
        fechaPublicacion={empleo.emp_fecha_publicacion.toISOString()}
      />
    ))}
  </div>
  );
}
