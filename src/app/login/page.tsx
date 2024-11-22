'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import Style from './login.module.css';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estado para el manejo de notificaciones
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setErrorMessage('Error al iniciar sesión');
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <Container maxWidth="sm" className={Style.container}>
      <div className={Style.formContainer}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <LoginIcon fontSize="large" /> Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>
        <div className={Style.registerLink}>
          <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className={Style.link}>
              Crear cuenta
            </Link>
          </Typography>
        </div>
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
