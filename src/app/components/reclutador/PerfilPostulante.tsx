'use client';

import { useState, useEffect } from 'react';
import Style from './PerfilPostulante.module.css';

interface Usuario {
  usu_id: number;
  usu_nombre: string;
  usu_apellido?: string;
  usu_email: string;
  usu_telefono?: string;
  usu_direccion?: string;
  usu_resumen?: string;
  usuario_habilidades?: {
    habilidad: {
      hab_nombre: string;
    };
  }[];
  cvs?: {
    id: number;
  }[];
}

interface Props {
  usuarioId: number;
  onClose: () => void;
}

export default function PerfilPostulante({ usuarioId, onClose }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const res = await fetch(`/api/usuarios/${usuarioId}`);
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      } else {
        console.error('Error al obtener el perfil del usuario');
      }
    };

    fetchUsuario();
  }, [usuarioId]);

  if (!usuario) {
    return <p>Cargando...</p>;
  }

  const cvUrl =
    usuario.cvs && usuario.cvs.length > 0
      ? `/api/cv/${usuario.cvs[usuario.cvs.length - 1].id}`
      : null;

  return (
    <div className={Style.modal}>
      <div className={Style.modalContent}>
        <button onClick={onClose}>Cerrar</button>
        <h2>
          {usuario.usu_nombre} {usuario.usu_apellido}
        </h2>
        <p>Email: {usuario.usu_email}</p>
        <p>Teléfono: {usuario.usu_telefono}</p>
        <p>Dirección: {usuario.usu_direccion}</p>
        <p>Resumen: {usuario.usu_resumen}</p>
        <p>
          Habilidades:{' '}
          {usuario.usuario_habilidades
            ?.map((uh) => uh.habilidad.hab_nombre)
            .join(', ')}
        </p>
        {cvUrl && (
          <iframe src={cvUrl} width="100%" height="600px" title="CV"></iframe>
        )}
      </div>
    </div>
  );
}
