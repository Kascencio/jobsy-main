'use client';

import { useState, useEffect } from 'react';
import Style from '../componets.module.css';

interface Empresa {
  emp_id: number;
  emp_nombre: string;
}

interface Empleo {
  emp_id: number;
  emp_titulo: string;
  emp_descripcion?: string;
  empresa: Empresa;
}

export default function BuscarEmpleos() {
  const [empleos, setEmpleos] = useState<Empleo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/candidato/empleos');
      const data: Empleo[] = await res.json();
      setEmpleos(data);
    };

    fetchData();
  }, []);

  const postularEmpleo = async (empId: number) => {
    const res = await fetch(`/api/candidato/postular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empId }),
    });

    if (res.ok) {
      alert('Te has postulado correctamente');
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  if (empleos.length === 0) {
    return <p>No hay ofertas de empleo disponibles en este momento.</p>;
  }

  return (
    <ul className={Style.empleoList}>
      {empleos.map((empleo) => (
        <li key={empleo.emp_id} className={Style.empleoItem}>
          <h3 className={Style.empleoTitle}>{empleo.emp_titulo}</h3>
          <p>{empleo.empresa.emp_nombre}</p>
          <p>{empleo.emp_descripcion}</p>
          <button onClick={() => postularEmpleo(empleo.emp_id)}>Postularme</button>
        </li>
      ))}
    </ul>
  );
}
