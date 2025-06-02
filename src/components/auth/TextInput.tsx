import { Field, ErrorMessage } from 'formik';

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  labelVisibility?: boolean;
  disabled?: boolean;
}

export const TextInput = ({
  label,
  name,
  placeholder,
  type = 'text',
  autoFocus = false,
  labelVisibility = false,
  disabled = false,
}: TextInputProps) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className={!labelVisibility ? 'sr-only' : 'block text-sm font-medium text-gray-700 mb-1'}>
      {label}
    </label>

    <Field name={name}>
      {({ field }: any) => (
        <input
          {...field}
          id={name}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ease-in-out shadow-sm ${
            disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
      )}
    </Field>

    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);
