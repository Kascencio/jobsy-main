'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Datos de la empresa actualizados');
    } else {
      alert('Error al actualizar los datos de la empresa');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Datos de la Empresa</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre de la Empresa" type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Input label="Sector" type="text" name="sector" value={form.sector} onChange={handleChange} required />
        <Button label="Guardar Empresa" type="submit" />
      </form>
    </div>
  );
}
