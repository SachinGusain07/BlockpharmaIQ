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
  role: yup.string().when('isCreating', {
    is: true,
    then: (schema) => schema.required('Role is required'),
  }),
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

export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup.string().required('Email is required').email('Invalid email address').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
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
  profilePic: yup.mixed().test('fileRequired', 'Profile picture is required', function (value) {
    if (this.parent.skipProfilePicValidation) return true
    return value !== undefined && value !== null
  }),
})

export const userFormContextSchema = yup.object({
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup.string().required('Email is required').email('Invalid email address').trim(),
  password: yup.string().when('isCreating', {
    is: true,
    then: (schema) =>
      schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must include uppercase, lowercase, number, and special character'
        ),
  }),
  confirmPassword: yup.string().when('isCreating', {
    is: true,
    then: (schema) =>
      schema
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
  }),
  phoneNumber: yup.string().when('isCreating', {
    is: true,
    then: (schema) =>
      schema
        .matches(phoneRegex, 'Phone number must be 10 digits')
        .required('Phone number is required'),
  }),
  role: yup.string().when('isCreating', {
    is: true,
    then: (schema) =>
      schema
        .oneOf(['ADMIN', 'SUPPLIER', 'PHARMACY'], 'Please select a valid role')
        .required('Role is required'),
  }),

  street: yup.string().when('isCreating', {
    is: true,
    then: (schema) => schema.required('Street address is required').trim(),
  }),
  city: yup.string().when('isCreating', {
    is: true,
    then: (schema) => schema.required('City is required').trim(),
  }),
  state: yup.string().when('isCreating', {
    is: true,
    then: (schema) => schema.required('State is required').trim(),
  }),
  country: yup.string().when('isCreating', {
    is: true,
    then: (schema) => schema.required('Country is required').trim(),
  }),
  zipCode: yup.string().when('isCreating', {
    is: true,
    then: (schema) =>
      schema.required('Zip code is required').max(6, 'Zip code cannot exceed 6 characters').trim(),
  }),
})

export const supplierSchema = yup.object({
  businessName: yup.string().required('Business name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  isActive: yup.boolean().default(true),
})

export const pharmacySchema = yup.object({
  businessName: yup.string().required('Business name is required'),
  gstin: yup
    .string()
    .required('GSTIN is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  website: yup.string().url('Must be a valid URL').nullable(),
  pharmacyOwner: yup.string().required('Please select a pharmacy owner'),
  isActive: yup.boolean().default(true),
})

export type PharmacyFormData = yup.InferType<typeof pharmacySchema>
export type SupplierFormData = yup.InferType<typeof supplierSchema>
export type UserFormContextData = yup.InferType<typeof userFormContextSchema>
export const updateSchema = profileSchema.concat(addressSchema)
export type ProfileFormData = yup.InferType<typeof profileSchema>
export type AddressFormData = yup.InferType<typeof addressSchema>
export type LoginFormData = yup.InferType<typeof loginSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type CompleteProfileFormData = yup.InferType<typeof completeProfileSchema>
export type UpdateFormData = yup.InferType<typeof updateSchema>
