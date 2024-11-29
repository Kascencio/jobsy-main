'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './PostulacionesList.module.css';

interface Empresa {
  emp_id: number;
  emp_nombre: string;
}

interface Empleo {
  emp_id: number;
  emp_titulo: string;
  empresa: Empresa;
}

interface Postulacion {
  pos_id: number;
  pos_empleo_id: number;
  pos_estado: string;
  empleo: Empleo;
}

export default function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/candidato/postulaciones');
      const data: Postulacion[] = await res.json();
      setPostulaciones(data);
    };

    fetchData();
  }, []);

  if (postulaciones.length === 0) {
    return <p className={styles.noPostulaciones}>No has postulado a ninguna oferta aún.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Postulaciones</h2>
      <ul className={styles.list}>
        {postulaciones.map((postulacion) => (
          <li key={postulacion.pos_id} className={styles.listItem}>
            <h3 className={styles.empleoTitulo}>
              <Link href={`/ofertas/${postulacion.empleo.emp_id}`}>
                {postulacion.empleo.emp_titulo}
              </Link>
            </h3>
            <p className={styles.empleoEmpresa}>{postulacion.empleo.empresa.emp_nombre}</p>
            <p className={styles.postulacionEstado}>
              Estado: <span>{postulacion.pos_estado}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
