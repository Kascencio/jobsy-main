// src/app/page.tsx

import OfertaCard from './components/OfertaCard';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import img_person from 'public/images/Person.jpg';
import './globals.module.css'

export default async function Home() {
  const empleos = await prisma.empleo.findMany({
    include: {
      empresa: true,
    },
    orderBy: {
      emp_fecha_publicacion: 'desc',
    },
    take: 10,
  });

  return (
    <div>
      <div className="landing">
        <div className="img_container">
          <Image src={img_person} sizes="100vh" alt='Person' style={{
          width: '100%',
          height: 'auto',
        }}></Image>
        </div>
        <div className="title">
          <h1>Bienvenido a Jobsy</h1>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Últimas Ofertas de Empleo</h1>
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
