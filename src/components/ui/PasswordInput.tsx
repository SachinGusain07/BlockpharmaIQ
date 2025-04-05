import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { useState } from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface PasswordInputProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  error?: FieldError
  placeholder?: string
  showToggle?: boolean
  className?: string
}

export const PasswordInput = ({
  name,
  register,
  error,
  placeholder,
  showToggle,
  className,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className={
          cn(
            `w-full border-b p-2 text-sm font-medium text-neutral-900 outline-none placeholder:font-medium ${
              error ? 'border-red-500' : 'border-[#C8C8C8]'
            }`
          ) + className
        }
        {...register(name)}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-2 -translate-y-1/2 transform"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <IoEyeOffOutline size={18} className="text-gray-500" />
          ) : (
            <IoEyeOutline size={18} className="text-gray-500" />
          )}
        </button>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
