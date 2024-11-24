'use client';

import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './HabilidadForm.module.css';

export default function HabilidadForm() {
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/moderador/habilidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });

    if (res.ok) {
      alert('Habilidad creada correctamente');
      setNombre('');
    } else {
      alert('Error al crear la habilidad');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crear Nueva Habilidad</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Nombre de la Habilidad"
          type="text"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          holder="Nombre de la Habilidad"
        />
        <Button label="Crear Habilidad" type="submit" className={styles.button} />
      </form>
    </div>
  );
}
