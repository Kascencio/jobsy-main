// src/components/Input.tsx
import Style from './componets.module.css'
interface InputProps {
    label: string;
    type: string;
    name: string;
    value?: string;
    classname?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
  
  export default function Input({ label, type, name, value, onChange, required = false, classname }: InputProps) {
    return (
      <div className={Style.container_inputs}>
        <label className={Style.label}>{label}</label>
        <input
          className={classname}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    );
  }
  