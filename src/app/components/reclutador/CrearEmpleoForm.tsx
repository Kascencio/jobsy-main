'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Style from '../componets.module.css';
import { Empleo} from '@/types'; 

interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

interface Props {
  agregarEmpleo: (empleo: Empleo) => void;
}

export default function CrearEmpleoForm({ agregarEmpleo }: Props) {
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
    const fetchCategorias = async () => {
      const res = await fetch('/api/categorias');
      if (res.ok) {
        const data: Categoria[] = await res.json();
        setCategorias(data);
      } else {
        console.error('Error fetching categories');
      }
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const nuevoEmpleo = await res.json();
      alert('Empleo creado correctamente');
      // Agregar el nuevo empleo al estado en el componente padre
      agregarEmpleo(nuevoEmpleo);
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
    <div className={Style.container_CrearEmpleo} style={{marginTop:30}}>
      <h2 className={Style.title}>Crear Nueva Oferta de Empleo</h2>
      <form onSubmit={handleSubmit}>
        <Input classname={Style.input} label="Título del Empleo" type="text" name="titulo" value={form.titulo} onChange={handleChange} required />
        <div className={Style.container} style={{marginTop:16}}>
          <label className={Style.title}>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
            required
          ></textarea>
        </div>
        <div className={Style.container_inputs} style={{marginTop:20}}>
          <label className="block text-gray-700 font-semibold mb-1">Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className={Style.input}
            style={{marginTop:10}}
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
        <Button className={Style.button} label="Publicar Empleo" type="submit" />
      </form>
    </div>
  );
}
