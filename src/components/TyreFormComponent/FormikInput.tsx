import { useField } from 'formik';
import React from 'react';

type FormikInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const FormikInput: React.FC<FormikInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-4">
      <label htmlFor={props.id || props.name} className="block mb-1 font-medium">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`border p-2 w-full rounded-lg ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {hasError ? <div className="text-red-500 text-sm mt-1">{meta.error}</div> : null}
    </div>
  );
};
