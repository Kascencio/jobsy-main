'use client';

import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
      // Opcional: Actualizar la lista de categorías
    } else {
      alert('Error al crear la categoría');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Categoría</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre de la Categoría"
          type="text"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <Button label="Crear Categoría" type="submit" />
      </form>
    </div>
  );
}
