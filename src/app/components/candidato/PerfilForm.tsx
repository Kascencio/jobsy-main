'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';

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
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Input label="Apellido" type="text" name="apellido" value={form.apellido} onChange={handleChange} />
        <Input label="Correo Electrónico" type="email" name="email" value={form.email} onChange={handleChange} required />
        <Input label="Teléfono" type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        <Input label="Dirección" type="text" name="direccion" value={form.direccion} onChange={handleChange} />
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Resumen Profesional</label>
          <textarea
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
          ></textarea>
        </div>
        <Button label="Actualizar Perfil" type="submit" />
      </form>
    </div>
  );
}
