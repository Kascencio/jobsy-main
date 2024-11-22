// src/components/candidato/PerfilForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Description as DescriptionIcon,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';
import Style from './perfilForm.module.css';

export default function PerfilForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    resumen: '',
    rol: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Obtener los datos del usuario desde la API
    const fetchData = async () => {
      const res = await fetch('/api/candidato/perfil');
      const data = await res.json();
      setForm({
        nombre: data.usu_nombre || '',
        apellido: data.usu_apellido || '',
        email: data.usu_email || '',
        telefono: data.usu_telefono || '',
        direccion: data.usu_direccion || '',
        resumen: data.usu_resumen || '',
        rol: data.usu_rol || '',
      });
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Excluir el campo 'rol' al enviar los datos
    const { rol, ...formData } = form;
    // Enviar los datos actualizados a la API
    const res = await fetch('/api/candidato/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Perfil actualizado correctamente');
      setSnackbarSeverity('success');
    } else {
      setMessage('Error al actualizar el perfil');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
    setLoading(false);
  };

  // Función para mostrar el rol de manera amigable
  const getRolLabel = (rol: string) => {
    switch (rol) {
      case 'candidato':
        return 'Candidato';
      case 'reclutador':
        return 'Reclutador';
      case 'moderador':
        return 'Moderador';
      default:
        return 'Usuario';
    }
  };

  return (
    <Container maxWidth="sm" className={Style.container}>
      <Typography variant="h5" gutterBottom>
        Mi Perfil
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Correo Electrónico"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          type="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Rol"
          name="rol"
          value={getRolLabel(form.rol)}
          fullWidth
          margin="normal"
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIndIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Resumen Profesional"
          name="resumen"
          value={form.resumen}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: '#87CEEB', // Azul cielo
            '&:hover': {
              backgroundColor: '#00B2EE',
            },
            marginTop: 2,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Perfil'}
        </Button>
      </form>
      {/* Notificación de éxito o error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
