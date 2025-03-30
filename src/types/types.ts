/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup'

export interface ApiResponseBody<T> {
  status: boolean
  message: string
  data: T
}

export interface ApiResponse<T> {
  status: number
  body: ApiResponseBody<T>
}

export interface registerInput {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface INavLink {
  name: string
  path: string
}

export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: userRoles
  active: boolean
  phoneNumber: string
  profilePic?: string
  Address?: IAddress
  VendorOwner?: any
  VendorOrganization?: any
  Pharmacist?: any
  PharmacyOutlet?: any
  Orders?: any
  createdAt: string
}

interface IAddress {
  id: number
  userId: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  createdAt: string
  updatedAt: string
}

export enum userRoles {
  USER,
  ADMIN,
  SUPPLIER,
  PHARMACY,
}

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export interface AuthState {
  accessToken: string
  isAuthenticated: boolean
  isLoading: boolean
}

export interface InventoryItem {
  id: number
  name: string
  brand: string
  category: string
  image: string
  stock: number
  threshold: number
  unit: string
  price: number
  expiry: string
}
