import {
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  CubeIcon,
  HomeIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

export const adminNavItems = [
  {
    name: 'Dashboard',
    path: '/admin-dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Users',
    path: '/users',
    icon: UsersIcon,
  },
  {
    name: 'Pharmacies',
    path: '/pharmacies',
    icon: BuildingStorefrontIcon,
  },
  {
    name: 'Suppliers',
    path: '/suppliers',
    icon: TruckIcon,
  },
]

export const supplierNavItems = [
  {
    name: 'Dashboard',
    path: '/supplier-dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Products',
    path: '/products',
    icon: TruckIcon,
  },
  {
    name: 'Pending Orders',
    path: '/pending-orders',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Order History',
    path: '/order-history',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Setting',
    path: '/supplier-settings',
    icon: ShoppingBagIcon,
  },
]

export const pharmacyNavItems = [
  {
    name: 'Inventory',
    path: '/pharmacy-dashboard',
    icon: CubeIcon,
  },
  // {
  //   name: 'Analytics',
  //   path: '/analytics',
  //   icon: ChartBarIcon,
  // },
  {
    name: 'Orders',
    path: '/orders',
    icon: ShoppingBagIcon,
  },
  // {
  //   name: 'Predictions',
  //   path: '/predict',
  //   icon: ShoppingBagIcon,
  // },
  // {
  //   name: 'Blockchain',
  //   path: '/blockchain',
  //   icon: CircleStackIcon,
  // },
  {
    name: 'Settings',
    path: '/settings',
    icon: CogIcon,
  },
]

export const profileNavItems = [
  {
    name: 'Profile',
    path: '/setting',
    icon: UserCircleIcon,
  },
  {
    name: 'Account',
    path: '/setting/account',
    icon: UserCircleIcon,
  },
  {
    name: 'Password',
    path: '/setting/password',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Update Profile',
    path: '/setting/update',
    icon: UserCircleIcon,
  },
]
