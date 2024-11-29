import Link from 'next/link';
import styles from './OfertaCard.module.css';

interface OfertaCardProps {
  id: number;
  titulo: string;
  empresa: string;
  fechaPublicacion: string;
}

export default function OfertaCard({ id, titulo, empresa, fechaPublicacion }: OfertaCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Link href={`/ofertas/${id}`}>{titulo}</Link>
      </h2>
      <p className={styles.empresa}>{empresa}</p>
      <p className={styles.fecha}>
        Publicado el {new Date(fechaPublicacion).toLocaleDateString()}
      </p>
    </div>
  );
}
