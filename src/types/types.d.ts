import * as yup from 'yup'

interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
}

interface registerInput {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface INavLink {
  name: string
  path: string
}

interface IUser {
  id: string
  name: string
  email: string
  username: string
  password: string
  confirmPassword: string
  role: userRoles
  active: boolean
  refreshToken: string
}

export enum userRoles {
  ADMIN,
  USER,
}

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Name should only contain letters')
    .required('Name is required'),
  username: yup
    .string()
    .matches(/^[A-Za-z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
})

interface AuthState {
  accessToken: string
  isAuthenticate: boolean
  isLoading: boolean
}
