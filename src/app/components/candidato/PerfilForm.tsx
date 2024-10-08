'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';
import Style from  '../componets.module.css';


export default function PerfilForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    resumen: '',
  });

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
      });
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar los datos actualizados a la API
    const res = await fetch('/api/candidato/perfil', {
      method: 'PUT',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Perfil actualizado correctamente');
    } else {
      alert('Error al actualizar el perfil');
      console.log(session)
    }
  };

  return (
    <div className={Style.container_PerfilList}>
      <h2 className={Style.title}>Mi Perfil</h2>
      <form onSubmit={handleSubmit}>
        <Input classname={Style.input_perfil} label="Nombre" type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Input classname={Style.input_perfil} label="Apellido" type="text" name="apellido" value={form.apellido} onChange={handleChange} />
        <Input classname={Style.input_perfil} label="Correo Electrónico" type="email" name="email" value={form.email} onChange={handleChange} required />
        <Input classname={Style.input_perfil} label="Teléfono" type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        <Input classname={Style.input_perfil} label="Dirección" type="text" name="direccion" value={form.direccion} onChange={handleChange} />
        <div className={Style.container_Resumen}>
          <label className={Style.title_resumen}>Resumen Profesional</label>
          <textarea
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            className={Style.input_perfil}
            style={{marginTop:10}} 
            rows={4}
          ></textarea>
        </div>
        <Button className={Style.button} label="Actualizar Perfil" type="submit" />
      </form>
    </div>
  );
}
