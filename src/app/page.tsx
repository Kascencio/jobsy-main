// src/app/page.tsx

import OfertaCard from './components/OfertaCard';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import img_person from 'public/images/Person.jpg';
import Style from './globals.module.css';
import Link from 'next/link';


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
        <div className={Style.img_container}>
          <Image src={img_person} sizes="100vh" alt='Person' style={{
          width: '100%',
          height: 'auto',
          borderRadius:  '.7vh',
        }}></Image>
        </div>
        <div className={Style.container_bienvenida}>
          <h1>Bienvenido a Jobsy</h1>
          <p className={Style.descripcion}>
          Conectamos talento con oportunidad. Únase a nosotros para encontrar su próximo paso profesional o descubrir al candidato perfecto para su equipo.
          </p>
        </div>
        <div className={Style.buttons}>
          <Link href={"/login"} className={Style.button_container}>
            <button type='button' className={Style.button} style={{backgroundColor:'#5379e6',}}> Publicar Empleo </button>
          </Link>
          <Link href={"/login"} className={Style.button_container}>
            <button className={Style.button} style={{backgroundColor:'black',}}>Buscar Empleos</button>
          </Link>
        </div>
      </div>
      <div className={Style.container_empleos}>
        <h1 className={Style.title} >Últimas Ofertas de Empleo</h1>
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
      </div>
    </div>
  );
}
