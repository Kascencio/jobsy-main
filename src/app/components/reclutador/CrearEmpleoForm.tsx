'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export default function CrearEmpleoForm() {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria_id: '',
    salario_min: '',
    salario_max: '',
    tipo_contrato: '',
    requisitos: '',
    beneficios: '',
    num_vacantes: '1',
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Obtener las categorías desde la API
    const fetchCategorias = async () => {
      const res = await fetch('/api/categorias');
      const data: Categoria[] = await res.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar los datos del empleo a la API
    const res = await fetch('/api/reclutador/empleos', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Empleo creado correctamente');
      // Reiniciar el formulario
      setForm({
        titulo: '',
        descripcion: '',
        categoria_id: '',
        salario_min: '',
        salario_max: '',
        tipo_contrato: '',
        requisitos: '',
        beneficios: '',
        num_vacantes: '1',
      });
    } else {
      alert('Error al crear el empleo');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Oferta de Empleo</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Título del Empleo" type="text" name="titulo" value={form.titulo} onChange={handleChange} required />
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          >
        <option value="">Seleccione una categoría</option>
        {categorias.map((categoria: Categoria) => (
            <option key={categoria.cat_id} value={categoria.cat_id}>
            {categoria.cat_nombre}
            </option>
        ))}
          </select>
        </div>
        {/* Otros campos como salario, tipo de contrato, etc. */}
        <Button label="Publicar Empleo" type="submit" />
      </form>
    </div>
  );
}
