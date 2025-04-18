/* eslint-disable @typescript-eslint/no-explicit-any */

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
  isProfileCompleted: boolean
  role: ROLES | string
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
  id: string
  userId: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  createdAt: string
  updatedAt: string
}

enum ROLES {
  USER,
  ADMIN,
  SUPPLIER,
  PHARMACY,
}

interface AuthState {
  accessToken: string
  isAuthenticated: boolean
  isLoading: boolean
}

interface InventoryItem {
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

interface ILoginInput {
  email: string
  password: string
}

interface IResponseUser {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    isProfileCompleted: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    role: userRoles
    active: boolean
    phoneNumber: string
    profilePic?: string
  }
  token: string
}

interface Order {
  id: string
  pharmacyName: string
  date: string
  quantity: number
  status: 'completed' | 'transit' | 'failed'
  transactionHash: string
  amount: number
  medication: string
}

interface IPharmacy {
  pharmacyOutletId: number
  businessName: string
  gstin: string
  email: string
  phoneNumber: string
  street: string
  city: string
  state: string
  pincode: string
  website: string
  pharmacyOwner: string
  isActive: boolean
}

export interface ISupplier {
  orgId?: number
  businessName: string
  email: string
  phoneNumber: string
  city: string
  state: string
  isActive: boolean
}
