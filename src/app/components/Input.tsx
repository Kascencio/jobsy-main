// src/components/Input.tsx
import Style from './componets.module.css'
interface InputProps {
    label: string;
    type: string;
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
  
  export default function Input({ label, type, name, value, onChange, required = false }: InputProps) {
    return (
      <div className={Style.container_inputs}>
        <label className={Style.label}>{label}</label>
        <input
          className={Style.input}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    );
  }
  