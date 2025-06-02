import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

interface PasswordInputProps {
  name: string;
  label: string;
  labelVisibility?: boolean;
  placeholder: string;
}

export const PasswordInput = ({ name, label, labelVisibility = false, placeholder }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full mb-2">
      <label htmlFor={name} className={!labelVisibility ? 'sr-only' : ''}>
        {label}
      </label>

      <Field
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        className="w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
      />

      <button
        type="button"
        aria-label={show ? 'Приховати пароль' : 'Показати пароль'}
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-2 top-1 w-10 h-10 flex items-center justify-center text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-xl">{show ? '🙈' : '👁️'}</span>
      </button>

      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mb-4" />
    </div>
  );
};
