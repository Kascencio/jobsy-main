'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import styles from './HabilidadList.module.css';

interface Habilidad {
  hab_id: number;
  hab_nombre: string;
}

export default function HabilidadList() {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);

  useEffect(() => {
    const fetchHabilidades = async () => {
      const res = await fetch('/api/moderador/habilidades');
      if (res.ok) {
        const data = await res.json();
        setHabilidades(data);
      } else {
        alert('Error al obtener las habilidades');
      }
    };

    fetchHabilidades();
  }, []);

  const eliminarHabilidad = async (id: number) => {
    const res = await fetch(`/api/moderador/habilidades/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Habilidad eliminada correctamente');
      setHabilidades(habilidades.filter((hab) => hab.hab_id !== id));
    } else {
      alert('Error al eliminar la habilidad');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Habilidades</h2>
      <ul className={styles.list}>
        {habilidades.map((habilidad) => (
          <li key={habilidad.hab_id} className={styles.listItem}>
            <span className={styles.habilidadName}>{habilidad.hab_nombre}</span>
            <Button
              label="Eliminar"
              onClick={() => eliminarHabilidad(habilidad.hab_id)}
              className={styles.deleteButton}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
