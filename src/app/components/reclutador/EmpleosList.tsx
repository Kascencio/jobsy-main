'use client';

import Link from 'next/link';
import Style from './EmpleosList.module.css';
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
  empleo_habilidades?: EmpleoHabilidad[];
  // Otros campos según tu modelo
}

export interface Habilidad {
  hab_id: number;
  hab_nombre: string;
}

export interface EmpleoHabilidad {
  habilidad: Habilidad;
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
    <ul className={Style.container_empleo_list}>
      {empleos.map((empleo: Empleo) => (
        <li key={empleo.emp_id} className={Style.card_empleo_list} style={{ marginTop: 30 }}>
          <h3 className={Style.title_empleo}>
            <Link href={`/ofertas/${empleo.emp_id}`}>{empleo.emp_titulo}</Link>
          </h3>
          <p className={Style.p_empleo}>{empleo.emp_descripcion}</p>
          {empleo.empresa && <p className={Style.p_empresa}>Empresa: {empleo.empresa.emp_nombre}</p>}
          {empleo.categoria && <p className={Style.p_categoria}>Categoría: {empleo.categoria.cat_nombre}</p>}
          {empleo.empleo_habilidades && empleo.empleo_habilidades.length > 0 && (
            <div>
              <p><strong>Habilidades requeridas:</strong></p>
              <ul>
                {empleo.empleo_habilidades.map((eh) => (
                  <li key={eh.habilidad.hab_id}>{eh.habilidad.hab_nombre}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={Style.container_buttons}>
          <button className={Style.button_empleo}
            onClick={() => {
              if (empleoSeleccionado === empleo.emp_id) {
                setEmpleoSeleccionado(null); // Oculta las postulaciones
              } else {
                setEmpleoSeleccionado(empleo.emp_id); // Muestra las postulaciones
              }
            }}
          >
            {empleoSeleccionado === empleo.emp_id ? 'Ocultar Postulaciones' : 'Ver Postulaciones'}
          </button>
          <a className={Style.button_empleo_delete} onClick={() => handleDelete(empleo.emp_id)}>Eliminar Empleo</a>
          {empleoSeleccionado === empleo.emp_id && <PostulacionesList empId={empleo.emp_id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
