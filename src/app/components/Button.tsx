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
        className={` ${className}`}
        onClick={onClick}
        type={type}
      >
        {label}
      </button>
    );
  }
  