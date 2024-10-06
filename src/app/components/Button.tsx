// src/components/Button.tsx
import Style from './componets.module.css'
interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }
  
  export default function Button({ label, onClick, type = 'button' }: ButtonProps) {
    return (
      <button
        className={Style.button}
        onClick={onClick}
        type={type}
      >
        {label}
      </button>
    );
  }
  