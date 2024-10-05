// src/components/Input.tsx

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
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    );
  }
  