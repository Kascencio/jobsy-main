// src/app/login/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Style  from './login.module.css';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { data: session } = useSession();
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
      router.push('/dashboard');
    } else {
      alert('Error al iniciar sesión');
    }
  };
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);


  return (
    <>
      <div className={Style.container_login}>
      <h1 className={Style.title}>Bienvenido/a de vuelta</h1>
      <form style={{display: 'flex' , justifyContent:'center' , alignItems:'center', flexDirection:'column'}} onSubmit={handleSubmit}>
        <Input  label="Correo Electrónico" type="email" name="email" holder="Name" onChange={handleChange} required />
        <Input  label="Contraseña" type="password" name="password" holder="Passowrd" onChange={handleChange} required />
        <Button label="Iniciar Sesión" type="submit" className={Style.Button} />
      </form>
      </div>
      <div className={Style.container_register}>
      <p>¿No tienes una cuenta?</p>
        <Link href='/registro'>
        <p>Crear cuenta</p>
        </Link>
      </div>
    </>
  );
}
