'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import styles from './CategoriasList.module.css';

interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
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
    <div className={styles.container}>
      <h2 className={styles.title}>Categorías Existentes</h2>
      <ul className={styles.list}>
        {categorias.map((categoria) => (
          <li key={categoria.cat_id} className={styles.listItem}>
            <span className={styles.categoryName}>{categoria.cat_nombre}</span>
            <Button
              label="Eliminar"
              onClick={() => handleDelete(categoria.cat_id)}
              className={styles.deleteButton}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
