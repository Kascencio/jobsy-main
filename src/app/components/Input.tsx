// src/components/Input.tsx
import Style from './componets.module.css'
interface InputProps {
    label: string;
    type: string;
    name: string;
    holder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
  
  export default function Input({ label, type, name, value, onChange, required = false, holder}: InputProps) {
    return (
      <div className={Style.container_inputs}>
        <input
          className={Style.inputs}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={holder}
        />
        <label className={Style.label}>{label}</label>
      </div>
    );
  }
  