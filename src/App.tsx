import BasicLayout from '@/layout/BasicLayout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Signup from '@/pages/signup'
import { lazy } from 'react'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AccessDenied from './components/AccessDenied'
import { PharmacyOrderSystem } from './components/Pharmacy/Order'
import VendorProductsPage from './components/Supplier/ProductPage'
import SupplierSettings from './components/Supplier/Setting'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './layout/ProtectedRoute'

const ProfileInformation = lazy(() => import('@/pages/profile-info'))
const AccountSettings = lazy(() => import('@/pages/account-setting'))
const ChangePassword = lazy(() => import('@/pages/change-password'))
const UpdateProfile = lazy(() => import('@/pages/update-profile'))
const NotFound = lazy(() => import('@/pages/not-found'))
const InventoryPage = lazy(() => import('@/pages/inventory'))
const PharmacySetting = lazy(() => import('@/pages/pharmacy-setting'))
const SuperAdminDashboard = lazy(() => import('@/components/SuperAdmin/Dashboard'))
const Pharmacies = lazy(() => import('@/components/SuperAdmin/Pharmacy'))
const Suppliers = lazy(() => import('@/components/SuperAdmin/Supplier'))
const Users = lazy(() => import('@/components/SuperAdmin/User'))
const SupplierDashboard = lazy(() => import('@/components/Supplier/Dashboard'))
const SupplierOrdersPage = lazy(() => import('@/components/Supplier/SupplierOrders'))

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Shared Protected Routes */}
        <Route element={<ProtectedRoute roles={['ADMIN', 'SUPPLIER', 'PHARMACY']} />}>
          <Route path="/setting" element={<DashboardLayout />}>
            <Route index element={<ProfileInformation />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        {/* Supplier Routes */}
        <Route element={<ProtectedRoute roles={['SUPPLIER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
            <Route path="/pending-orders" element={<SupplierOrdersPage />} />
            <Route path="/products" element={<VendorProductsPage />} />
            <Route path="/supplier-settings" element={<SupplierSettings />} />
          </Route>
        </Route>

        {/* Pharmacy Routes */}
        <Route element={<ProtectedRoute roles={['PHARMACY']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/pharmacy-dashboard" element={<InventoryPage />} />
            <Route path="/orders" element={<PharmacyOrderSystem />} />
            <Route path="/settings" element={<PharmacySetting />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Route>
        </Route>

        {/* Catch-all Routes */}
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
