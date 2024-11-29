'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Style from '../componets.module.css';
import Select, { MultiValue } from 'react-select';
import { Empleo } from '@/types'; // Importa desde el archivo de tipos

interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

interface Habilidad {
  hab_id: number;
  hab_nombre: string;
}

interface HabilidadOption {
  value: number;
  label: string;
}

interface Props {
  agregarEmpleo: (empleo: Empleo) => void;
}

export default function CrearEmpleoForm({ agregarEmpleo }: Props) {
  const [form, setForm] = useState({
    emp_titulo: '',
    emp_descripcion: '',
    emp_categoria_id: '',
    // Otros campos...
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [habilidadesOptions, setHabilidadesOptions] = useState<HabilidadOption[]>([]);
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<
    MultiValue<HabilidadOption>
  >([]);

  useEffect(() => {
    const fetchCategoriasYHabilidades = async () => {
      try {
        const resCategorias = await fetch('/api/categorias');
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);

        const resHabilidades = await fetch('/api/habilidades');
        const habilidadesData: Habilidad[] = await resHabilidades.json();
        const habilidadesOptions = habilidadesData.map((habilidad) => ({
          value: habilidad.hab_id,
          label: habilidad.hab_nombre,
        }));
        setHabilidadesOptions(habilidadesOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategoriasYHabilidades();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHabilidadChange = (selectedOptions: MultiValue<HabilidadOption>) => {
    setHabilidadesSeleccionadas(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const habilidadesIds = habilidadesSeleccionadas.map((option) => option.value);

    try {
      const res = await fetch('/api/reclutador/empleos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, habilidades: habilidadesIds }),
      });

      if (res.ok) {
        const data = await res.json();
        const nuevoEmpleo: Empleo = {
          emp_id: data.emp_id,
          emp_titulo: data.emp_titulo,
          emp_descripcion: data.emp_descripcion,
          emp_categoria_id: data.emp_categoria_id,
          emp_fecha_publicacion: data.emp_fecha_publicacion,
          emp_empresa_id: data.emp_empresa_id,
          empleo_habilidades: data.empleo_habilidades,
          // Agrega otras propiedades si es necesario
        };

        alert('Empleo creado correctamente');
        agregarEmpleo(nuevoEmpleo);

        setForm({
          emp_titulo: '',
          emp_descripcion: '',
          emp_categoria_id: '',
          // Otros campos...
        });
        setHabilidadesSeleccionadas([]);
      } else {
        const data = await res.json();
        alert(`Error al crear el empleo: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al crear el empleo:', error);
      alert('Error al crear el empleo');
    }
  };

  return (
    <div className={Style.container_CrearEmpleo} style={{ marginTop: 30 }}>
      <h2 className={Style.title}>Crear Nueva Oferta de Empleo</h2>
      <form onSubmit={handleSubmit}>
        <Input
          holder="Título del Empleo"
          label="Título del Empleo"
          type="text"
          name="emp_titulo"
          value={form.emp_titulo}
          onChange={handleChange}
          required
        />
        <div className={Style.container_inputs}>
          <label className={Style.title}>Descripción</label>
          <textarea
            name="emp_descripcion"
            value={form.emp_descripcion}
            onChange={handleChange}
            className={Style.input}
            style={{ marginTop: 10 }}
            rows={4}
            required
          ></textarea>
        </div>
        <div className={Style.container_inputs} style={{ marginTop: 20 }}>
          <label className={Style.title}>Categoría</label>
          <select
            name="emp_categoria_id"
            value={form.emp_categoria_id}
            onChange={handleChange}
            className={Style.input}
            style={{ marginTop: 10 }}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.cat_id} value={categoria.cat_id}>
                {categoria.cat_nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de habilidades utilizando react-select */}
        <div className={Style.container_inputs} style={{ marginTop: 20 }}>
          <label className={Style.title}>Habilidades Requeridas</label>
          <Select
            isMulti
            name="habilidades"
            options={habilidadesOptions}
            value={habilidadesSeleccionadas}
            onChange={handleHabilidadChange}
            className={Style.input}
            placeholder="Selecciona las habilidades requeridas"
          />
        </div>

        {/* Otros campos como salario, tipo de contrato, etc. */}
        <Button className={Style.button} label="Publicar Empleo" type="submit" />
      </form>
    </div>
  );
}
