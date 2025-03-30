/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormRegister, FieldError } from 'react-hook-form'

type FormInputProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  register: UseFormRegister<any>
  error?: FieldError
  onBlur?: () => void
  className?: string
}

export const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  onBlur,
  className = '',
}: FormInputProps) => (
  <div className={`space-y-2 ${className}`}>
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none ${
        error ? 'border-red-500' : ''
      }`}
      {...register(id)}
      onBlur={onBlur}
    />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
)
