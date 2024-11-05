// src/app/registro/page.tsx

'use client';

import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Style from './registro.module.css'

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'candidato',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert('Error al registrar');
    }
  };

  return (
    <div className={Style.container_registro}>
      <h1 className={Style.title}>Registro</h1>
      <form onSubmit={handleSubmit}>
        <Input classname={Style.input} label="Nombre" type="text" name="nombre" onChange={handleChange} required />
        <Input classname={Style.input} label="Apellido" type="text" name="apellido" onChange={handleChange} />
        <Input classname={Style.input} label="Correo Electrónico" type="email" name="email" onChange={handleChange} required />
        <Input classname={Style.input} label="Contraseña" type="password" name="password" onChange={handleChange} required />
        <div className={Style.container_options}>
          <label className={Style.label}>Rol</label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className={Style.select}
          >
            <option value="candidato">Candidato</option>
            <option value="reclutador">Reclutador</option>
            <option value="moderador">Moderador</option>
          </select>
        </div>
        <Button label="Registrarse" type="submit" className={Style.button} />
      </form>
    </div>
  );
}
