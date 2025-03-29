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
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: userRoles
  active: boolean
  refreshToken: string
}

export enum userRoles {
  USER,
  ADMIN,
  SUPPLIER,
  PHARMACY,
}

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
})

interface AuthState {
  accessToken: string
  isAuthenticated: boolean
  isLoading: boolean
}
