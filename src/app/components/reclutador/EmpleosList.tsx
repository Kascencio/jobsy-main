'use client';

import Link from 'next/link';
import Style from '../componets.module.css';
import PostulacionesList from './PostulacionesList';
import { useState } from 'react';
import { toast } from 'react-toastify';


export interface Empleo {
  emp_id: number;
  emp_titulo: string;
  emp_descripcion?: string;
  emp_empresa_id: number;
  emp_categoria_id: number;
  emp_fecha_publicacion: string; // o Date
  empresa?: Empresa;
  categoria?: Categoria;
  // Otros campos según tu modelo
}

export interface Empresa {
  emp_id: number;
  emp_nombre: string;
  emp_sector: string;
}

export interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

interface Props {
  empleos: Empleo[];
}

export default function EmpleosList({ empleos }: Props) {
  const [empleoSeleccionado, setEmpleoSeleccionado] = useState<number | null>(null);
  const [listaEmpleos, setListaEmpleos] = useState<Empleo[]>(empleos);

  const handleDelete = async (empId: number) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este empleo?');
    console.log(listaEmpleos);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/reclutador/empleos/${empId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setListaEmpleos((prevEmpleos) => prevEmpleos.filter((empleo) => empleo.emp_id !== empId));
        toast.success('Empleo eliminado correctamente');
      } else {
        const errorData = await res.json();
        toast.error(`Error al eliminar el empleo: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar el empleo:', error);
      toast.error('Error al eliminar el empleo');
    }
  };


  return (
    <ul className={Style.container_cards}>
      {empleos.map((empleo: Empleo) => (
        <li key={empleo.emp_id} className={Style.container_card} style={{ marginTop: 30 }}>
          <h3 className={Style.title_empleo}>
            <Link href={`/ofertas/${empleo.emp_id}`}>{empleo.emp_titulo}</Link>
          </h3>
          <p>{empleo.emp_descripcion}</p>
          {empleo.empresa && <p>Empresa: {empleo.empresa.emp_nombre}</p>}
          {empleo.categoria && <p>Categoría: {empleo.categoria.cat_nombre}</p>}
          <button onClick={() => setEmpleoSeleccionado(empleo.emp_id)}>
            {empleoSeleccionado === empleo.emp_id ? 'Ocultar Postulaciones' : 'Ver Postulaciones'}
          </button>
          <button onClick={() => handleDelete(empleo.emp_id)}>Eliminar Empleo</button>
          {empleoSeleccionado === empleo.emp_id && <PostulacionesList empId={empleo.emp_id} />}
        </li>
      ))}
    </ul>
  );
}
