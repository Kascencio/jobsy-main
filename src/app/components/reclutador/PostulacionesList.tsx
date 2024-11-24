'use client';

import { useState, useEffect } from 'react';
import Style from './Postulaciones.module.css';
import PerfilPostulante from './PerfilPostulante';

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
  puntaje: number;
}

interface Props {
  empId: number;
}

export default function PostulacionesList({ empId }: Props) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      const res = await fetch(`/api/reclutador/empleos/${empId}/postulaciones`);
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
    const res = await fetch(`/api/reclutador/postulaciones/${posId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevoEstado }),
    });

    if (res.ok) {
      // Actualizar el estado localmente
      setPostulaciones((prevPostulaciones) =>
        prevPostulaciones.map((p) =>
          p.pos_id === posId ? { ...p, pos_estado: nuevoEstado } : p
        )
      );
    } else {
      alert('Error al actualizar la postulación');
    }
  };

  const verPerfil = (usuarioId: number) => {
    setUsuarioSeleccionado(usuarioId);
  };

  const cerrarPerfil = () => {
    setUsuarioSeleccionado(null);
  };

  if (postulaciones.length === 0) {
    return <p className={Style.no_postulaciones}>No hay postulaciones para este empleo.</p>;
  }

  return (
    <div className={Style.container_postulaciones}>
      <h3 className={Style.title}>Postulaciones</h3>
      <ul className={Style.container_cards}>
        {postulaciones.map((postulacion) => (
          <li key={postulacion.pos_id} className={Style.container_card}>
            <p>
              {postulacion.usuario.usu_nombre} {postulacion.usuario.usu_apellido} -{' '}
              {postulacion.usuario.usu_email}
            </p>
            <p>
              Puntaje de Compatibilidad:{' '}
              {typeof postulacion.puntaje === 'number' && !isNaN(postulacion.puntaje) ? (
                <span className={Style.compatibility_score}>
                  {postulacion.puntaje.toFixed(2)}%
                </span>
              ) : (
                'N/A'
              )}
            </p>
            <p>
              Estado: <span className={Style.postulacion_estado}>{postulacion.pos_estado}</span>
            </p>
            <div className={Style.container_card_buttons}>
              <button
                className={Style.accept_button}
                onClick={() => actualizarEstado(postulacion.pos_id, 'Aceptada')}
              >
                Aceptar
              </button>
              <button
                className={Style.reject_button}
                onClick={() => actualizarEstado(postulacion.pos_id, 'Rechazada')}
              >
                Rechazar
              </button>
              <button
                className={Style.view_profile_button}
                onClick={() => verPerfil(postulacion.usuario.usu_id)}
              >
                Ver Perfil
              </button>
            </div>
          </li>
        ))}
      </ul>

      {usuarioSeleccionado && (
        <PerfilPostulante usuarioId={usuarioSeleccionado} onClose={cerrarPerfil} />
      )}
    </div>
  );
}
