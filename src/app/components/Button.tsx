// src/components/Button.tsx

interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }

  export default function Button({ label, onClick, type = 'button', className  }: ButtonProps) {
    return (
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${className}`}
        onClick={onClick}
        type={type}
      >
        {label}
      </button>
    );
  }
  