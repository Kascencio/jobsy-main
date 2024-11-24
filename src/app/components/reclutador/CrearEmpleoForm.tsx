'use client';

import { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Style from '../componets.module.css';
import Select, { MultiValue } from 'react-select';

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


interface Empleo {
  titulo: string;
  descripcion: string;
  categoria_id: number;
  habilidades: number[];
  // Agrega otras propiedades según sea necesario
}

interface Props {
  agregarEmpleo: (empleo: Empleo) => void;
}

export default function CrearEmpleoForm({ agregarEmpleo }: Props) {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria_id: '',
    // Otros campos...
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [habilidadesOptions, setHabilidadesOptions] = useState<HabilidadOption[]>([]);
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<MultiValue<HabilidadOption>>([]);

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
    // Obtener los IDs de las habilidades seleccionadas
    const habilidadesIds = habilidadesSeleccionadas.map((option) => option.value);

    // Enviar los datos del empleo a la API
    try {
      const res = await fetch('/api/reclutador/empleos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, habilidades: habilidadesIds }),
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
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          required
        />
        <div className={Style.container_inputs}>
          <label className={Style.title}>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
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
            name="categoria_id"
            value={form.categoria_id}
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
