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
  walletAddress: yup.string().required('Wallet address is required'),
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

export const supplierSchema = yup.object().shape({
  businessName: yup
    .string()
    .required('Business name is required')
    .min(3, 'Business name must be at least 3 characters')
    .max(100, 'Business name must not exceed 100 characters'),
  gstin: yup
    .string()
    .required('GSTIN is required')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Please enter a valid GSTIN'
    ),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid phone number'),
  street: yup
    .string()
    .required('Street address is required')
    .min(3, 'Street address must be at least 3 characters'),
  city: yup.string().required('City is required').min(2, 'City must be at least 2 characters'),
  state: yup.string().required('State is required').min(2, 'State must be at least 2 characters'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode'),
  website: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .url('Please enter a valid URL')
    .optional(),
  ownerId: yup.string().required('Vendor owner is required'),
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
  website: yup.string().url('Must be a valid URL').required('Website is required'),
  pharmacyOwnerId: yup.string().required('Please select a pharmacy owner'),
  isActive: yup.boolean().default(true),
})

export const inventoryItemSchema = yup.object({
  productId: yup.string().required('Product is required'),
  pharmacyOutletId: yup.string().required('Pharmacy outlet is required'),
  stock: yup
    .number()
    .required('Stock quantity is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .typeError('Stock must be a number'),
  threshold: yup
    .number()
    .required('Threshold is required')
    .integer('Threshold must be a whole number')
    .min(1, 'Threshold must be at least 1')
    .typeError('Threshold must be a number'),
  expiry: yup
    .date()
    .required('Expiry date is required')
    .min(new Date(), 'Expiry date cannot be in the past')
    .typeError('Invalid date format'),
  batchNumber: yup.string(),
})

export const productSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  brand: yup.string().required('Brand is required'),
  category: yup.string().required('Category is required'),
  image: yup.string().url('Invalid URL'),
  unit: yup.string().required('Unit is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  vendorOrgId: yup.string().required('Vendor organization is required'),
})

export const bulkProductSchema = yup.object().shape({
  products: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        brand: yup.string().required('Brand is required'),
        category: yup.string().required('Category is required'),
        unit: yup.string().required('Unit is required'),
        price: yup.number().required('Price is required').min(0, 'Price must be at least 0'),
        vendorOrgId: yup.string().required('Vendor Organization ID is required'),
        description: yup.string(),
        image: yup.string().url('Image must be a valid URL'),
      })
    )
    .required('Products are required')
    .min(1, 'At least one product is required'),
})

export const medicineSchema = yup.object({
  name: yup
    .string()
    .required('Medicine name is required')
    .min(2, 'Medicine name must be at least 2 characters')
    .max(100, 'Medicine name must not exceed 100 characters'),
  brand: yup
    .string()
    .required('Brand is required')
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand must not exceed 50 characters'),
  category: yup.string().required('Category is required'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least $0.01')
    .max(9999.99, 'Price must not exceed $9999.99'),
  threshold: yup
    .number()
    .required('Reorder threshold is required')
    .positive('Threshold must be positive')
    .integer('Threshold must be a whole number')
    .min(1, 'Threshold must be at least 1'),
  expiry: yup
    .date()
    .required('Expiry date is required')
    .min(new Date(), 'Expiry date must be in the future'),
  manufacturerId: yup.string().optional(),
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
export type SingleProductFormData = yup.InferType<typeof productSchema>
export type BulkProductFormData = yup.InferType<typeof bulkProductSchema>
