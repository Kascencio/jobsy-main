// src/components/candidato/BuscarEmpleos.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { WorkOutline as WorkOutlineIcon } from '@mui/icons-material';
import Style from './buscarEmpleos.module.css';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/candidato/empleos');
        const data: Empleo[] = await res.json();
        setEmpleos(data);
      } catch (error) {
        console.error('Error al obtener los empleos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const postularEmpleo = async (empId: number) => {
    try {
      const res = await fetch(`/api/candidato/postular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empId }),
      });

      if (res.ok) {
        setSnackbarMessage('Te has postulado correctamente');
        setSnackbarSeverity('success');
      } else {
        const errorData = await res.json();
        setSnackbarMessage(`Error: ${errorData.error}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error al postular al empleo:', error);
      setSnackbarMessage('Error al postular al empleo');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Container className={Style.container}>
        <CircularProgress />
      </Container>
    );
  }

  if (empleos.length === 0) {
    return (
      <Container className={Style.container}>
        <Typography variant="h6" align="center">
          No hay ofertas de empleo disponibles en este momento.
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={Style.container}>
      <Typography variant="h5" gutterBottom>
        Buscar Empleos
      </Typography>
      <Grid container spacing={3}>
        {empleos.map((empleo) => (
          <Grid item xs={12} sm={6} md={4} key={empleo.emp_id}>
            <Card className={Style.card}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {empleo.emp_titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {empleo.empresa.emp_nombre}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {empleo.emp_descripcion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => postularEmpleo(empleo.emp_id)}
                  sx={{
                    backgroundColor: '#87CEEB', // Azul cielo
                    '&:hover': {
                      backgroundColor: '#00B2EE',
                    },
                  }}
                >
                  Postularme
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Notificación de éxito o error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
