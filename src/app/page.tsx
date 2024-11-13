// src/app/page.tsx

import OfertaCard from "./components/OfertaCard";
import { prisma } from '@/lib/prisma';
import Image from "next/image";
import img_person from "public/images/Landing_Person.png";
import img_card from "public/images/Card_.png";
import Style from "./globals.module.css";
import Link from "next/link";

export default async function Home() {
  const empleos = await prisma.empleo.findMany({
    include: {
      empresa: true,
    },
    orderBy: {
      emp_fecha_publicacion: "desc",
    },
    take: 10,
  });

  return (
    <div>
      {/*FIRST*/}
      <div className="landing">
        <div className={Style.container_}>
          <section className={Style.title}>
            <h1>Bienvenido a Jobsy</h1>
            <p>
              <span>Conectamos talento y oportunidades:</span> <br />
              Una plataforma para reclutadores y candidatos en busca de su
              próximo gran paso.
            </p>
            <Link href={"/login"} >
            <button className={Style.button_landing}>Buscar Empleo</button>
            </Link>
          </section>
          <div className={Style.img_container}>
            <Image
              src={img_person}
              id={Style.person}
              sizes="100vh"
              alt="Person"
              style={{
                width: "90%",
                height: "auto",
                borderRadius: ".7vh",
              }}
            ></Image>
            <svg
              id={Style.circle}
              xmlns="http://www.w3.org/2000/svg"
              width="247"
              height="247"
            >
              <path
                d="M 123.5 0 C 191.707 0 247 55.293 247 123.5 C 247 191.707 191.707 247 123.5 247 C 55.293 247 0 191.707 0 123.5 C 0 55.293 55.293 0 123.5 0 Z"
                fill="rgb(255, 200, 62)"
              ></path>
            </svg>
            <Image
              src={img_card}
              id={Style.card}
              sizes="100vh"
              alt="Person"
              style={{
                width: "206px",
                height: "173px",
                borderRadius: ".7vh",
              }}
            ></Image>
          </div>
        </div>
      </div>
      {/*EMPLEOS*/}
      <div className={Style.container_empleos}>
        <h1>Ultimas ofertas de empleo</h1>
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
