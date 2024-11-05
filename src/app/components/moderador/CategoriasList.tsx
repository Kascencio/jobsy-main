'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';

interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Obtener las categorías desde la API
    const fetchData = async () => {
      const res = await fetch('/api/moderador/categorias');
      const data: Categoria[] = await res.json();
      setCategorias(data);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/moderador/categorias/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Categoría eliminada');
      setCategorias(categorias.filter((categoria) => categoria.cat_id !== id));
    } else {
      alert('Error al eliminar la categoría');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Categorías Existentes</h2>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.cat_id} className="mb-2 flex justify-between items-center">
            <span>{categoria.cat_nombre}</span>
            <Button label="Eliminar" onClick={() => handleDelete(categoria.cat_id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
