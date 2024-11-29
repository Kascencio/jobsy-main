'use client';

import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';
import Style from '../componets.module.css';
import Select, { MultiValue } from 'react-select';

interface HabilidadOption {
  value: number;
  label: string;
}

interface Habilidad {
  hab_id: number;
  hab_nombre: string;
}

interface UsuarioHabilidad {
  habilidad: Habilidad; // Assuming Habilidad is already defined
}


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

  const [habilidadesOptions, setHabilidadesOptions] = useState<HabilidadOption[]>([]);
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<MultiValue<HabilidadOption>>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // Función para manejar el cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Puedes agregar validaciones aquí (tamaño, tipo de archivo, etc.)
      uploadCV(file);
    }
  };

  // Función para subir el CV
  const uploadCV = async (file: File) => {
    if (!session?.user?.id) {
      alert('Debes estar autenticado para subir un CV.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('usuarioId', session.user.id.toString());

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Maneja la respuesta exitosa
        alert('CV subido exitosamente');
        if (data.cvId) {
          setCvUrl(`/api/cv/${data.cvId}`);
        }
        // Actualizar los datos del perfil para obtener los CVs más recientes
        fetchUserData();
      } else {
        // Maneja errores
        alert(`Error al subir el CV: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al subir el CV:', error);
      alert('Error al subir el CV');
    }
  };

  const fetchUserData = async () => {
    try {
      // Obtener habilidades disponibles
      const resHabilidades = await fetch('/api/habilidades');
      const habilidadesData: Habilidad[] = await resHabilidades.json();
      const habilidadesOptions = habilidadesData.map((habilidad) => ({
        value: habilidad.hab_id,
        label: habilidad.hab_nombre,
      }));
      setHabilidadesOptions(habilidadesOptions);

      // Obtener datos del usuario
      const resUsuario = await fetch('/api/candidato/perfil');
      const data = await resUsuario.json();
      setForm({
        nombre: data.usu_nombre || '',
        apellido: data.usu_apellido || '',
        email: data.usu_email || '',
        telefono: data.usu_telefono || '',
        direccion: data.usu_direccion || '',
        resumen: data.usu_resumen || '',
      });

      // Establecer habilidades seleccionadas
      if (data.usuario_habilidades) {
        const habilidadesSeleccionadas = data.usuario_habilidades.map((uh: UsuarioHabilidad) => ({
          value: uh.habilidad.hab_id,
          label: uh.habilidad.hab_nombre,
        }));
        setHabilidadesSeleccionadas(habilidadesSeleccionadas);
      }

      // Si hay un CV, establecer la URL
      if (data.cvs && data.cvs.length > 0) {
        const latestCV = data.cvs[data.cvs.length - 1];
        setCvUrl(`/api/cv/${latestCV.id}`);
      } else {
        setCvUrl(null);
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    // Enviar los datos actualizados a la API
    try {
      const res = await fetch('/api/candidato/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, habilidades: habilidadesIds }),
      });

      if (res.ok) {
        alert('Perfil actualizado correctamente');
      } else {
        const data = await res.json();
        alert(`Error al actualizar el perfil: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className={Style.container_PerfilList}>
      <h2 className={Style.title}>Mi Perfil</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          type="text"
          holder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellido"
          type="text"
          holder="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <Input
          label="Correo Electrónico"
          holder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Teléfono"
          type="text"
          holder="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
        <Input
          label="Dirección"
          type="text"
          holder="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
        />
        <div className={Style.container_inputs} style={{ marginTop: 20 }}>
          <label className={Style.title}>Habilidades</label>
          <Select
            isMulti
            name="habilidades"
            options={habilidadesOptions}
            value={habilidadesSeleccionadas}
            onChange={handleHabilidadChange}
            className={Style.input}
            placeholder="Selecciona tus habilidades"
          />
        </div>
        <div>
          <h3>Ingresa tu CV</h3>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        {cvUrl && (
          <div className={Style.cvViewer}>
            <h3>Tu CV:</h3>
            <iframe src={cvUrl} width="100%" height="600px" title="CV"></iframe>
          </div>
        )}
        <div className={Style.container_Resumen}>
          <label className={Style.title_resumen}>Resumen Profesional</label>
          <textarea
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            className={Style.input_perfil}
            style={{ marginTop: 10 }}
            rows={4}
          ></textarea>
        </div>
        <Button
          className={Style.button}
          label="Actualizar Perfil"
          type="submit"
        />
      </form>
    </div>
  );
}
