// src/app/ofertas/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import Style from "../../components/componets.module.css";
import Link from "next/link";

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

      <div className={Style.container_cards}>
      <Link href="/">
      <button className={Style.button_view}>
        Volver a la página principal
      </button>
      </Link>
      <div className={Style.container_card_view} style={{marginTop:30}}>
        <h1 className={Style.title_empleo}>{empleo.emp_titulo}</h1>
        <p className={Style.p_empresa}>
          <strong>Empresa:</strong> {empleo.empresa.emp_nombre}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Categoría:</strong> {empleo.categoria.cat_nombre}
        </p>
        <p className={Style.p_fecha}>
          <strong>Fecha de Publicación:</strong>{" "}
          {new Date(empleo.emp_fecha_publicacion).toLocaleDateString()}
        </p>
        <p className="mb-4">
          <strong>Descripción:</strong>
        </p>
        <p className={Style.descripcion}>{empleo.emp_descripcion}</p>
        {/* Agrega más detalles según sea necesario */}
        <Link href='/login'>
        <button className={Style.button_view}>
          Postularte
        </button>
        </Link>
        </div>
      </div>
    </div>
  );
}
