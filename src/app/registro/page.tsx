'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import Style from './registro.module.css';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'candidato',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estado para el manejo de notificaciones
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push('/');
    } else {
      setErrorMessage('Error al registrar');
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" className={Style.container}>
      <div className={Style.formContainer}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <AssignmentIndIcon fontSize="large" /> Crear Cuenta
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
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
            type="email"
            name="email"
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            name="password"
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar Contraseña"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="candidato">Candidato</MenuItem>
              <MenuItem value="reclutador">Reclutador</MenuItem>
              <MenuItem value="moderador">Moderador</MenuItem>
            </Select>
          </FormControl>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
        </form>
        {/* Notificación de error */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
