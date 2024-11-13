'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Style from '../componets.module.css'

export default function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: '',
    sector: '',
  });

  useEffect(() => {
    // Obtener los datos de la empresa desde la API
    const fetchData = async () => {
      const res = await fetch('/api/reclutador/empresa');
      const data = await res.json();
      if (data) {
        setForm({
          nombre: data.emp_nombre || '',
          sector: data.emp_sector || '',
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar los datos de la empresa a la API
    const res = await fetch('/api/reclutador/empresa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Datos de la empresa actualizados');
    } else {
      alert('Error al actualizar los datos de la empresa');
    }
  };

  return (
    <div className={Style.container}>
      <h2 className={Style.title}>Datos de la Empresa</h2>
      <form onSubmit={handleSubmit}>
        <Input holder='Nombre de la Empresa' label="Nombre de la Empresa" type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Input holder='Sector' label="Sector" type="text" name="sector" value={form.sector} onChange={handleChange} required />
        <Button className={Style.button} label="Guardar Empresa" type="submit" />
      </form>
    </div>
  );
}
