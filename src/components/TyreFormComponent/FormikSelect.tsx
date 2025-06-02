import { useField } from 'formik';
import React from 'react';

type FormikSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: { value: string; label: string }[];
};

export const FormikSelect: React.FC<FormikSelectProps> = ({ label, options, ...props }) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  const id = props.id || props.name;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-1 font-medium">
        {label}
      </label>

      <select
        id={id}
        {...field}
        {...props}
        className={`border p-2 w-full rounded-lg ${
          hasError ? 'border-red-500' : 'border-gray-300'
          }`}
      >
        <option value="">Оберіть</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {hasError ? <div className="text-red-500 text-sm mt-1">{meta.error}</div> : null}
    </div>
  );
};
