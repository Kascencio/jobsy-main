// src/components/candidato/PostulacionesList.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Empresa {
  emp_id: number;
  emp_nombre: string;
  // Otros campos si los necesitas
}

interface Empleo {
  emp_id: number;
  emp_titulo: string;
  emp_descripcion?: string;
  empresa: Empresa;
  // Otros campos según tu modelo
}

interface Usuario {
  usu_id: number;
  usu_nombre: string;
  usu_apellido?: string;
  usu_email: string;
  // Otros campos si los necesitas
}

interface Postulacion {
  pos_id: number;
  pos_usuario_id: number;
  pos_empleo_id: number;
  pos_fecha_postulacion: string; // O Date
  pos_estado: string;
  empleo: Empleo;
  usuario?: Usuario;
}

export default function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);

  useEffect(() => {
    // Obtener las postulaciones desde la API
    const fetchData = async () => {
      const res = await fetch('/api/candidato/postulaciones');
      const data: Postulacion[] = await res.json();
      setPostulaciones(data);
    };

    fetchData();
  }, []);

  if (postulaciones.length === 0) {
    return <p>No has postulado a ninguna oferta aún.</p>;
  }

  return (
    <ul>
      {postulaciones.map((postulacion) => (
        <li key={postulacion.pos_id} className="mb-4 border p-4 rounded">
          <h3 className="text-lg font-bold">
            <Link href={`/ofertas/${postulacion.empleo.emp_id}`}>
              {postulacion.empleo.emp_titulo}
            </Link>
          </h3>
          <p>{postulacion.empleo.empresa.emp_nombre}</p>
          <p>Estado: {postulacion.pos_estado}</p>
        </li>
      ))}
    </ul>
  );
}

