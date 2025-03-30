/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInput } from '@/components/ui/FormInput'
import { UseFormRegister, FieldErrors, UseFormTrigger } from 'react-hook-form'

type PersonalInfoProps = {
  register: UseFormRegister<any>
  errors: FieldErrors<{
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }>
  trigger: UseFormTrigger<any>
}

export const PersonalInfoSection = ({ register, errors, trigger }: PersonalInfoProps) => (
  <>
    <FormInput
      id="firstName"
      label="First Name"
      placeholder="First Name"
      register={register}
      error={errors.firstName}
      onBlur={() => trigger('firstName')}
    />
    <FormInput
      id="lastName"
      label="Last Name"
      placeholder="Last Name"
      register={register}
      error={errors.lastName}
      onBlur={() => trigger('lastName')}
    />
    <FormInput
      id="email"
      label="Email"
      type="email"
      placeholder="Email Address"
      register={register}
      error={errors.email}
      onBlur={() => trigger('email')}
    />
    <FormInput
      id="phoneNumber"
      label="Phone Number"
      type="tel"
      placeholder="Phone Number (optional)"
      register={register}
      error={errors.phoneNumber}
    />
  </>
)
