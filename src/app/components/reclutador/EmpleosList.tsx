'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Style from '../componets.module.css'

interface Empresa {
    emp_id: number;
    emp_nombre: string;
    emp_sector: string;
    // Otros campos
  }
  
  interface Categoria {
    cat_id: number;
    cat_nombre: string;
    // Otros campos
  }
  
  interface Empleo {
    emp_id: number;
    emp_titulo: string;
    emp_descripcion?: string;
    emp_empresa_id: number;
    emp_categoria_id: number;
    emp_fecha_publicacion: string; // o Date
    // Otros campos...
    empresa?: Empresa;
    categoria?: Categoria;
  }
  

  export default function EmpleosList() {
    const [empleos, setEmpleos] = useState<Empleo[]>([]);
  
    useEffect(() => {
      // Obtener los empleos desde la API
      const fetchData = async () => {
        const res = await fetch('/api/reclutador/empleos');
        const data: Empleo[] = await res.json();
        setEmpleos(data);
      };
  
      fetchData();
    }, []);
  
    if (empleos.length === 0) {
      return <p>No has publicado ninguna oferta aún.</p>;
    }
  
    return (
      <ul className={Style.container_cards}>
        {empleos.map((empleo: Empleo) => (
          <li key={empleo.emp_id} className={Style.container_card} style={{marginTop:30}}>
            <h3 className={Style.title_empleo}>
              <Link href={`/ofertas/${empleo.emp_id}`}>{empleo.emp_titulo}</Link>
            </h3>
            <p>{empleo.emp_descripcion}</p>
            {empleo.empresa && <p>Empresa: {empleo.empresa.emp_nombre}</p>}
            {empleo.categoria && <p>Categoría: {empleo.categoria.cat_nombre}</p>}
            {/* Otros campos según necesites */}
          </li>
        ))}
      </ul>
    );
  }
