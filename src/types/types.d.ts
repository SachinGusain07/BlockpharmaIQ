import * as yup from 'yup'

interface ApiResponseBody<T> {
  status: boolean
  message: string
  data: T
}

interface ApiResponse<T> {
  status: number
  body: ApiResponseBody<T>
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
  phoneNumber: string
  profilePic?: string
  Address?: IAddress
  VendorOwner?: VendorOwner
  VendorOrganization?: VendorOrganization[]
  Pharmacist?: Pharmacist
  PharmacyOutlet?: PharmacyOutlet[]
  Orders?: Orders[]
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

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
})

interface AuthState {
  accessToken: string
  isAuthenticated: boolean
  isLoading: boolean
}
