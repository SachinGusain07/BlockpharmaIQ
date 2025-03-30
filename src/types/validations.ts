import * as yup from 'yup'

export const profileSchema = yup.object({
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup.string().required('Email is required').email('Invalid email address').trim(),
  phoneNumber: yup
    .string()
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .matches(/^[0-9+-]*$/, 'Please enter a valid phone number'),
})

export const addressSchema = yup.object({
  street: yup.string().required('Street address is required').trim(),
  city: yup.string().required('City is required').trim(),
  state: yup.string().required('State is required').trim(),
  country: yup.string().required('Country is required').trim(),
  zipCode: yup.string().required('Zip code is required').trim(),
})

export const updateSchema = profileSchema.concat(addressSchema)
export type UpdateFormData = yup.InferType<typeof updateSchema>
