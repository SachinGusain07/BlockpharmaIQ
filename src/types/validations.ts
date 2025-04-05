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

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const phoneRegex = /^[0-9]{10}$/

export const completeProfileSchema = yup.object({
  phoneNumber: yup
    .string()
    .matches(phoneRegex, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  street: yup.string().required('Street is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  zipCode: yup
    .string()
    .min(1, 'Zip code is required')
    .max(6, 'Zip code cannot exceed 6 characters')
    .required('Zip code is required'),
  role: yup
    .string()
    .oneOf(['ADMIN', 'SUPPLIER', 'PHARMACY'], 'Please select a valid role')
    .required('Role is required'),
  profilePic: yup.mixed().required('Profile picture is required'),
})

export type CompleteProfileFormData = yup.InferType<typeof completeProfileSchema>
export const updateSchema = profileSchema.concat(addressSchema)
export type UpdateFormData = yup.InferType<typeof updateSchema>
