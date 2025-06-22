interface ApiResponseBody<T> {
  status: boolean
  message: string
  data: T
}

interface ApiResponse<T> {
  status: number
  body: ApiResponseBody<T>
}

interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface INavLink {
  name: string
  path: string
}

// enum Role {
//   USER = 'USER',
//   ADMIN = 'ADMIN',
//   SUPPLIER = 'SUPPLIER',
//   PHARMACY = 'PHARMACY',
// }

type Role = 'USER' | 'ADMIN' | 'SUPPLIER' | 'PHARMACY'
type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED'
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED'
type PaymentMethod = 'CASH_ON_DELIVERY' | 'UPI' | 'CARD' | 'NET_BANKING' | 'CRYPTO'

interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  isProfileCompleted: boolean
  role: string
  isDeleted: boolean
  phoneNumber: string
  walletAddress: string
  profilePic?: string
  address?: IAddress
  vendorOwner?: IVendorOwner
  vendorOrganizations?: IVendorOrganization[]
  pharmacyOutlets?: IPharmacyOutlet[]
  orders?: IOrder[]
  createdAt: string
  updatedAt: string
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

interface IVendorOwner {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  vendorOrganizations?: IVendorOrganization[]
}

interface IVendorOrganization {
  id: string
  vendorOwnerId: string
  businessName: string
  gstin: string
  email: string
  street: string
  city: string
  state: string
  pincode: string
  isActive: boolean
  phoneNumber: string
  website?: string
  createdAt: string
  updatedAt: string
  orders?: IOrder[]
}

interface IPharmacyOutlet {
  id: string
  ownerId: string
  businessName: string
  street: string
  city: string
  state: string
  pincode: string
  phoneNumber: string
  gstin: string
  email: string
  website?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  orders?: IOrder[]
}

interface IOrder {
  id: string
  userId: string
  pharmacyOutletId: string
  vendorOrgId: string
  orderDate: string
  name: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  amount: number
  createdAt: string
  updatedAt: string
  orderItems?: IOrderItem[]
  pharmacy?: IPharmacyOutlet
  vendorOrg?: IVendorOrganization
  pharmacyOutlet?: IPharmacyOutlet
  blockchainTxHash?: string
}

interface IOrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
}

interface IOrderFormData {
  userId: string
  pharmacyOutletId: string
  vendorOrgId: string
  orderDate: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  amount: number
  orderItems: IOrderItemFormData[]
  paymentMethod: PaymentMethod
}

interface IOrderItemFormData {
  name: string
  quantity: number
}

// enum OrderStatus {
//   PENDING = 'PENDING',
//   IN_PROGRESS = 'IN_PROGRESS',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
// }

// enum PaymentStatus {
//   PENDING = 'PENDING',
//   COMPLETED = 'COMPLETED',
//   FAILED = 'FAILED',
// }

// enum PaymentMethod {
//   CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
//   UPI = 'UPI',
//   CARD = 'CARD',
//   NET_BANKING = 'NET_BANKING',
//   CRYPTO = 'CRYPTO',
// }

interface AuthState {
  accessToken: string
  isAuthenticated: boolean
  isLoading: boolean
}

interface InventoryItem {
  id: string
  medicineName: string
  medicineBrand: string
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
    walletAddress: string
    createdAt: string
    updatedAt: string
    role: string
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
  id: string
  businessName: string
  gstin: string
  email: string
  phoneNumber: string
  street: string
  city: string
  state: string
  pincode: string
  website?: string
  ownerId: string
  isActive: boolean
}

export interface ISupplier {
  id: string
  businessName: string
  gstin: string
  email: string
  phoneNumber: string
  street: string
  city: string
  state: string
  pincode: string
  website?: string
  ownerId: string
  isActive: boolean
}

interface ICountsResponse {
  data: {
    usersCount: number
    suppliersCount: number
    pharmaciesCount: number
    ordersCount: number
  }
}

interface IUserFormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
  role: string
  phoneNumber: string
  isDeleted?: boolean
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  brand: string
  category: string
  image?: string
  unit: string
  price: number
  vendorOrgId: string
  createdAt: string
  updatedAt: string
  vendorOrg?: {
    businessName: string
    gstin: string
  }
}

export interface ProductFormValues {
  name: string
  description?: string
  brand: string
  category: string
  image?: string
  unit: string
  vendorOrgId: string
}

export interface BulkProductItem {
  name: string
  brand: string
  category: string
  unit: string
  image: string
  vendorOrgId: string
}

export type BulkProductInput = BulkProductItem[]

interface OrderItem {
  image: string
  expiry: string
  unit: string
  category: string
  brand: string
  id: string
  productId: string
  quantity: number
  name: string
  price: number
  createdAt: string
  updatedAt: string
}

interface Pharmacy {
  id: string
  businessName: string
  street: string
  city: string
  state: string
  pincode: string
}

interface Vendor {
  id: string
  businessName: string
  street: string
  city: string
  state: string
  pincode: string
}

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  orderStatus: OrderStatus
  paymentStatus: string
  paymentMethod: string
  amount: number
  blockchainOrderId: string
  blockchainTxHash: string
  pharmacyOutlet: Pharmacy
  vendorOrg: Vendor
  orderItems: OrderItem[]
}

export interface InventoryItem {
  id: string
  pharmacyOutletId: string
  productId: string
  orderId?: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
  Product?: Product // populated via include in Prisma
}

export interface InventoryItemFormData {
  pharmacyOutletId: string
  productId: string
  quantity: number
  price: number
  orderId?: string
}

export interface ProductFormValues {
  name: string
  description?: string
  brand: string
  category: string
  image?: string
  unit: string
  vendorOrgId: string
}

export interface BulkProductFormValues {
  products: ProductFormValues[]
}
