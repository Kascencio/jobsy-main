'use client';

import { useState, useEffect } from 'react';
import Style from '../componets.module.css';

interface Usuario {
  usu_id: number;
  usu_nombre: string;
  usu_apellido?: string;
  usu_email: string;
}

interface Postulacion {
  pos_id: number;
  pos_usuario_id: number;
  pos_empleo_id: number;
  pos_fecha_postulacion: string;
  pos_estado: string;
  usuario: Usuario;
}

interface Props {
  empId: number;
}

export default function PostulacionesList({ empId }: Props) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      const res = await fetch(`/api/reclutador/empleos/${empId}`);
      if (res.ok) {
        const data = await res.json();
        setPostulaciones(data);
      } else {
        console.error('Error al obtener las postulaciones');
      }
    };

    fetchPostulaciones();
  }, [empId]);

  const actualizarEstado = async (posId: number, nuevoEstado: string) => {
    const res = await fetch(`/api/reclutador/empleos/postulaciones/${posId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevoEstado }),
    });

    if (res.ok) {
      // Actualizar el estado localmente
      setPostulaciones((prevPostulaciones) =>
        prevPostulaciones.map((p) => (p.pos_id === posId ? { ...p, pos_estado: nuevoEstado } : p))
      );
    } else {
      alert('Error al actualizar la postulación');
    }
  };

  if (postulaciones.length === 0) {
    return <p>No hay postulaciones para este empleo.</p>;
  }

  return (
    <div>
      <h3 className={Style.title}>Postulaciones</h3>
      <ul className={Style.container_cards}>
        {postulaciones.map((postulacion) => (
          <li key={postulacion.pos_id} className={Style.container_card}>
            <p>
              {postulacion.usuario.usu_nombre} {postulacion.usuario.usu_apellido} - {postulacion.usuario.usu_email}
            </p>
            <p>Estado: {postulacion.pos_estado}</p>
            <button onClick={() => actualizarEstado(postulacion.pos_id, 'Aceptada')}>Aceptar</button>
            <button onClick={() => actualizarEstado(postulacion.pos_id, 'Rechazada')}>Rechazar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
