// src/components/OfertaCard.tsx

'use client';

import { format } from 'date-fns';
import Link from 'next/link';

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
    
    <div className="border p-4 mb-4 rounded hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-2">{titulo}</h2>
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
  );
}
