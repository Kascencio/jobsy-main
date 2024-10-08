// src/components/OfertaCard.tsx

'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import Style from './componets.module.css'

interface OfertaCardProps {
  id: number;
  titulo: string;
  empresa: string;
  ubicacion?: string;
  fechaPublicacion: string;
}

export default function OfertaCard({
  id,
  titulo,
  empresa,
  ubicacion,
  fechaPublicacion,
}: OfertaCardProps) {
  return (
    <div className={Style.container} >
      <div className={Style.container_card} style={{marginTop:30}}>
      <h2 className={Style.title_empleo}>{titulo}</h2>
      <p className="text-gray-700">{empresa}</p>
      {ubicacion && <p className="text-gray-600">{ubicacion}</p>}
      <p className="text-sm text-gray-500">
       {format(new Date(fechaPublicacion), 'dd/MM/yyyy')}
      </p>
      <Link href={`/ofertas/${id}`}>
        <span className="text-blue-600 hover:underline mt-2 inline-block">
          Ver más
        </span>
      </Link>
      </div>
    </div>
  );
}
