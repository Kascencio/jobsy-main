// src/components/candidato/PostulacionesList.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Container,
} from '@mui/material';
import { WorkOutline as WorkOutlineIcon } from '@mui/icons-material';
import Style from './postulacionesList.module.css';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Obtener las postulaciones desde la API
    const fetchData = async () => {
      try {
        const res = await fetch('/api/candidato/postulaciones');
        const data: Postulacion[] = await res.json();
        setPostulaciones(data);
      } catch (error) {
        console.error('Error al obtener las postulaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className={Style.container}>
        <CircularProgress />
      </Container>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <Container className={Style.container}>
        <Typography variant="h6" align="center">
          No has postulado a ninguna oferta aún.
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={Style.container}>
      <Typography variant="h5" gutterBottom>
        Mis Postulaciones
      </Typography>
      <List>
        {postulaciones.map((postulacion) => (
          <div key={postulacion.pos_id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  <WorkOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link href={`/ofertas/${postulacion.empleo.emp_id}`} passHref>
                    <Typography variant="h6" color="primary" className={Style.link}>
                      {postulacion.empleo.emp_titulo}
                    </Typography>
                  </Link>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {postulacion.empleo.empresa.emp_nombre}
                    </Typography>
                    {' — '}
                    Estado: <Chip label={postulacion.pos_estado} color="primary" size="small" />
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </Container>
  );
}
