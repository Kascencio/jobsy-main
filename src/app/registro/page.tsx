// src/app/registro/page.tsx

'use client';

import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registro</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" type="text" name="nombre" onChange={handleChange} required />
        <Input label="Apellido" type="text" name="apellido" onChange={handleChange} />
        <Input label="Correo Electrónico" type="email" name="email" onChange={handleChange} required />
        <Input label="Contraseña" type="password" name="password" onChange={handleChange} required />
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Rol</label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="candidato">Candidato</option>
            <option value="reclutador">Reclutador</option>
          </select>
        </div>
        <Button label="Registrarse" type="submit" className="w-full" />
      </form>
    </div>
  );
}
