/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormInput } from '@/components/ui/FormInput'
import { UseFormRegister, FieldErrors, UseFormTrigger } from 'react-hook-form'

type AddressSectionProps = {
  register: UseFormRegister<any>
  errors: FieldErrors<{
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }>
  trigger: UseFormTrigger<any>
}

export const AddressSection = ({ register, errors, trigger }: AddressSectionProps) => (
  <>
    <FormInput
      id="street"
      label="Street Address"
      placeholder="Street Address"
      register={register}
      error={errors.street}
      onBlur={() => trigger('street')}
    />
    <FormInput
      id="city"
      label="City"
      placeholder="City"
      register={register}
      error={errors.city}
      onBlur={() => trigger('city')}
    />
    <FormInput
      id="state"
      label="State"
      placeholder="State"
      register={register}
      error={errors.state}
      onBlur={() => trigger('state')}
    />
    <FormInput
      id="country"
      label="Country"
      placeholder="Country"
      register={register}
      error={errors.country}
      onBlur={() => trigger('country')}
    />
    <FormInput
      id="zipCode"
      label="Zip Code"
      placeholder="Zip Code"
      register={register}
      error={errors.zipCode}
      onBlur={() => trigger('zipCode')}
    />
  </>
)
