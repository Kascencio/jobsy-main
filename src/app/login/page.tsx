// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Correo Electrónico" type="email" name="email" onChange={handleChange} required />
        <Input label="Contraseña" type="password" name="password" onChange={handleChange} required />
        <Button label="Iniciar Sesión" type="submit" className="w-full" />
      </form>
    </div>
  );
}
