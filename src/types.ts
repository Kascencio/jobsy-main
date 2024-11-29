import { EmpleoHabilidad } from "./app/components/reclutador/EmpleosList";

// Definición de la interfaz Empresa
export interface Empresa {
    emp_id: number;
    emp_nombre: string;
    emp_sector: string;
    // Otros campos si los necesitas
  }
  
  // Definición de la interfaz Categoria
  export interface Categoria {
    cat_id: number;
    cat_nombre: string;
    // Otros campos si los necesitas
  }
  
  // Definición de la interfaz Empleo
  export interface Empleo {
    emp_id: number;
    emp_titulo: string;
    emp_descripcion: string;
    emp_categoria_id: number;
    emp_fecha_publicacion: string;
    emp_empresa_id: number;
    empleo_habilidades: EmpleoHabilidad[]; // Check this definition
  }
  
  // Puedes definir otras interfaces aquí si las necesitas
  