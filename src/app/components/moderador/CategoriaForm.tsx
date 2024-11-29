'use client';

import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import  styles  from './CategoriaForm.module.css';

export default function CategoriaForm() {
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/moderador/categorias', { // Ruta actualizada
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });

    if (res.ok) {
      alert('Categoría creada correctamente');
      setNombre('');
      
    } else {
      alert('Error al crear la categoría');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crear Nueva Categoría</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Nombre de la Categoría"
          type="text"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          holder='Nombre de Categoria'
        />
        <Button label="Crear Categoría" type="submit" className={styles.button} />
      </form>
    </div>
  );
}